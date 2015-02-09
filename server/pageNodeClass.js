/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

var util = require("util")
    , _ = require('lodash')
    , url = require('url')
    , cheerio = require('cheerio')
    , events = require("events")
    , Promise = require('es6-promise').Promise

    , crawlerClass = require('./crawlerClass')
    ;

function pageNodeClass(parent, page, descriptorName, options) {
    var me = this;
    events.EventEmitter.call(this);

    me.parent = parent;

    //to avoid circular links
    me.linksIndex = parent && parent.linksIndex || [];

    me.page = page || {
        context : null
        , $: null
        , url: null};

    me.descriptors = parent && parent.descriptors || options.descriptors;
    me.descriptor = me.getDescriptorByName(descriptorName);
    me.descriptorName = me.descriptor.name;

    options = options || {};
    me._itemNum = options._itemNum;
    me._selector = options._selector;

    me.childrenPage = null;

    me.type = me.descriptor.type || 'defaultType';

    me.children = [];
    me.childrenPromises = [];
    me.childTree = {};

    me.addListenersBatch(me.descriptor.listeners);
}

util.inherits(pageNodeClass, events.EventEmitter);

var prototype = pageNodeClass.prototype;

prototype.runPromise = function () {
    var me = this;

    var message = "starting element " + me.descriptor.name;
    //console.log(message)

    return (new Promise(me.getPage.bind(me))).
        then(function (page) {
            message = "name = " + me.getName();
            //console.log(message);

            if (page) {
                me.childrenPage = page;
                return me.processContent();
            }
            else{
                me.childTree = null;
            }
        }).
/*
        then(function (message) {
            //console.log(message);
            //todo check for memory leaks
            me.$ = null;
            me.context = null;
        }).
*/
        then(function () {
            return me;
        });
}

prototype.getPage = function (resolve, reject) {
    var me = this;
    var parent = me.parent;

    //todo remove and verify
    me.$ = parent && parent.$;

    if (me.type == 'link') {
        var crawler = new crawlerClass();

        var newUrl = me._getSimpleValue();

        var pageUrl = parent.page.url
            , parentHref = pageUrl && pageUrl.href;


        if (parentHref) {
            newUrl = url.resolve(parentHref, newUrl);
        }

        if (me.linksIndex.indexOf(newUrl) < 0) {
            me.linksIndex.push(newUrl);

            crawler.getUrl(newUrl, {
                charset: me.descriptor.charset
            }, function (pageHTML) {

                var page = {
                    $        : cheerio.load(pageHTML)
                    , context: null
                    , url    : url.parse(newUrl)
                };

                resolve(page);
            });
        } else {
            //page is already processed
            resolve(null);
        }
    }
    else {

        var childrenPage = _.clone(me.page);

        var childrenPageContextFn = me.descriptor.childrenPageContext;
        if (childrenPageContextFn && _.isFunction(childrenPageContextFn)) {
            var childContext = childrenPageContextFn.apply(this);
            if (childContext){
                childrenPage.context = childContext;
            }
        }

        resolve(childrenPage);
    }
};

prototype.processContent = function () {
    var me = this;

    if (me.isSimpleValue()) {
        //primitive
        var name = me.getName();
        var value = me.getValue();
        return name + " = " + value;
    }
    else {
        //complex object with child nodes
        return me.processChildren().then(function () {
            me.emit("processed");
            return "finished object: " + me.getName();
        }).catch(function (error) {
            me;
            console.error("Error processing children");
            console.error(error);
        });
    }
};

prototype.isSimpleValue = function () {
    var me = this;
    return !me.descriptor.contains;
};

prototype.getName = function () {
    var me = this;
    var selector = me.descriptor.valueNameSelector
        , attr = me.descriptor.valueNameAttr || ""
        , name = null;

    if (_.isFunction(selector)){
        return selector.apply(this);
    }
    else if (selector || attr || this.isSimpleValue()) {
        name = me.getElementAttribute(selector, attr);
    }

    name = name || this.descriptorName;

    return name;
};

prototype.getElementAttribute = function (selector, attribute) {
    var me = this;
    var result = null
        , $ = me.page.$;

    if ($) {

        var context = me.page.context;
        var element = selector ? $(selector, context) : $(context);

        //todo replace link hacks
        if (me.type == 'link' && !attribute) {
            attribute = 'href';
        }


        if (attribute) {
            result = element.attr(attribute);

            if (me.type == 'link' && result && me.page.url) {
                result = url.resolve(me.page.url.href, result);
            }

        } else {
            result = element.text();
        }
    }

    return result;
};

prototype.getValue = function () {
    var me = this;
    var val;

    if (me.isSimpleValue()) {
        val = me._getSimpleValue();
    } else {
        val = me._getChildTree();
    }
    return val;
};

prototype._getSimpleValue = function () {
    var me = this;

    var selector = me.descriptor.valueSelector || "";
    var val = me.getElementAttribute(selector, me.descriptor.valueAttr) || me.descriptor.defaultValue;

    return val;
};

prototype._getChildTree = function () {
    var me = this;
    return me.childTree;
};

prototype.processChildren = function () {
    var me = this;

    var contains = me.descriptor.contains;
    if (!util.isArray(contains)){
        contains = [contains];
    }

    contains.forEach(function (item) {
        me.createChild(item);
    });

    return Promise.all(me.childrenPromises);
};

prototype.getDescriptorByName = function (descriptorName) {
    var me = this
        , descriptor;

    if (_.isString(descriptorName)) {
        var prefix = 'descriptor:';
        if (descriptorName.indexOf(prefix) === 0) {
            descriptor = me.descriptors[descriptorName.replace(prefix,'')];
            if (!descriptor) {
                console.error(descriptorName + ' not found');
                return null;
            }
        } else {
            /**
             * the most primitive descriptor - string xpath selector,
             * and we are making descriptor object now
             */
            descriptor = {
                selector: descriptorName
                , type  : 'text'
            }
        }
    }
    else {
        /*
         we got descriptor object
         */
        descriptor = descriptorName;
        descriptorName = descriptor.name || descriptor.selector || descriptor.defaultValue;
    }

    if (descriptor.debug) {
        debugger;
    }

    descriptor.name = descriptor.name || descriptorName;
    descriptor.multiple = descriptor.multiple || false;

    return descriptor;
};

/**
 *
 * @param descriptorName - name of descriptor,
 * or array - dom selector for simple values and property to return
 */
prototype.createChild = function (descriptorName) {
    var me = this
        , newChild
        , newChildPromise

       , selector
        , item
        , descriptor
        , url = me.childrenPage.url
        , context = me.childrenPage.context;

    /**
     * @type {Cheerio}
     */
    var found
        , $ = me.childrenPage.$
        ;

    descriptor = me.getDescriptorByName(descriptorName);

    if (!descriptor || descriptor.disabled === true) {
        return;
    }

    function createChildInstance(foundItem, options){
        var page = {$: $, context: foundItem, url: url};
        newChild = new pageNodeClass(me, page, descriptorName, options);
        me.children.push(newChild);

        newChildPromise = newChild.runPromise().then(function (childComplete) {
            me.addChildToTree(childComplete);
        });

        me.childrenPromises.push(newChildPromise);
    }

    selector = descriptor.selector;

    var options = {
        _selector: selector
    };

    if ($ && selector) {
        found = me.find(descriptor, context);

        var length = found.length;

        if (length) {
            for (var i = 0; i < length; i++) {
                options._itemNum = i;
                item = found[i];
                createChildInstance(item, options);
            }
        }
        else {
            console.log("0 found for: " + descriptor.name + " : " + selector);
        }
    } else if (descriptor.defaultValue){
        createChildInstance(null, options);
    }
    else{
        console.error("No selector and no default value for " + descriptor.name);
    }
};

prototype.find = function (descriptor, context) {
    var me = this;

    /**
     * @type {Cheerio}
     */
    var $ = me.childrenPage.$
        , result
        , found;

    var
        selector = descriptor.selector;

    if (_.isFunction(selector)){
        selector = selector.apply(this);
    }

    /*
            , selectorRaw = descriptor.selector
            , selectorTemplate = _.template(selectorRaw)
            , templateValues = descriptor.templateValues
        if (_.isFunction(templateValues)){
            templateValues = templateValues.apply(this);
        }

        templateValues = templateValues || [null];

        templateValues.forEach(function (templateData) {
            templateData = _.isObject(templateData) ? templateData : {template: templateData};
            selector = selectorTemplate(templateData);
            found = $(selector, context);
            result = result && result.add(found) || found;
        });
    */

    result = $(selector, context);

    return result;
};

prototype.isNamedList = function () {
    var me = this;
    return me.descriptor.namedList !== false;
};

prototype.isMultiple = function () {
    var me = this;
    return me.descriptor.multiple !== false;
};

prototype.isPassValuesToParent = function () {
    var me = this;
    return me.descriptor.passValuesToParent;
};

prototype.addChildToTree = function (child, skippedParent) {
    var me = this;

    if (child.isPassValuesToParent()) {
        for (var i = 0; i < child.children.length; i++) {
            me.addChildToTree(child.children[i], child);
        }
    }
    else {
        var childName = child.getName()
            , childValue = child.getValue();

        if (!child.isSimpleValue() && !child.childTree){
            //child tree will be null for skipped links that were already processed
            return;
        }


        if (child.isNamedList() || child.isSimpleValue()) {
            var oldValue = me.childTree[childName];

            if (_.isUndefined(oldValue)) {
                me.childTree[childName] = childValue;
            }
            else {
                var message = "Page " + child.page.url.href + "\n" +
                "duplicate entry " + me.getName() + " -> " + child.getName() +
                (skippedParent ? " from skipped " + skippedParent.getName() : "")
//                + " (old value = '" + oldValue + "' new value = '" + childValue + "'";
                if (!child.descriptor.valueNameSelector) {
                    message += " Maybe not set valueNameSelector?";
                    child.getValue();

                }
                console.error(message);
            }
        }
        else {
            me.childTree[childName] = me.childTree[childName] || [];
            me.childTree[childName].push(childValue);
        }
    }
};

prototype.addListenersBatch = function (listeners) {
    var me = this;
    /*
    todo make disposable
     */

    _.forEach(listeners, function (listener, name) {
        me.addListener(name, listener);
    });
};

module.exports = pageNodeClass;