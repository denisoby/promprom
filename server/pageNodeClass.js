/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

/*
 kamaz
 Page http://www.kamaz.ru/production/serial/samosvaly/kamaz-65201-73(2)/
 duplicate entry Весовые параметры и нагрузки -> нагрузка на первую и вторую оси, кг (old value = '15000' new value = '7480'
 */

var util = require("util")
    , url = require('url')
    , cheerio = require('cheerio')
    , events = require("events")
    , Promise = require('es6-promise').Promise

    , crawlerClass = require('./crawlerClass')
    ;

function pageNodeClass(parent, context, descriptorName, descriptors) {
    var me = this;
    events.EventEmitter.call(this);

    me.parent = parent;
    me.context = context;

    me.descriptors = parent && parent.descriptors || descriptors;
    me.url = parent && parent.url;
    me.descriptor = me.getDescriptorByName(descriptorName);
    me.descriptorName = me.descriptor.name;

    me.type = me.descriptor.type || 'defaultType';

    me.children = [];
    me.childrenPromises = [];
    me.childTree = {};
}

util.inherits(pageNodeClass, events.EventEmitter);

var prototype = pageNodeClass.prototype;

prototype.runPromise = function () {
    var me = this;

    var message = "starting element " + me.descriptor.name;
    //console.log(message)

    return (new Promise(me.getPage.bind(me))).
        catch(function (error) {
            var component = "getPage";
            //console.log(component + " error: " + error)
        }).
        then(function () {
            message = "name = " + me.getName();
            //console.log(message);
        }).
        then(me.processContent.bind(me)).
        catch(function (error) {
            var component = "processContent";
            //console.log(component + " error: " + error)
        }).
        then(function () {
            //todo check for memory leaks
//            me.$ = null;
//            me.context = null;
        }).
        then(function (message) {
            //console.log(message);
            return me;
        });
}

prototype.getPage = function (resolve, reject) {
    var me = this;
    var parent = me.parent;

    me.$ = parent && parent.$;

    if (me.type == 'link') {
        var crawler = new crawlerClass();
        var newUrl = me._getSimpleValue();

        if (parent && parent.url) {
            newUrl = url.resolve(parent.url.href, newUrl);
        }

        crawler.getUrl(newUrl, {
            charset: me.descriptor.charset
        }, function (page) {
            me.$ = cheerio.load(page);
            me.url = url.parse(newUrl);

            me.context = null;
            resolve();
        });
    }
    else {
        resolve();
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
    else{
        //complex object with child nodes
        return me.processChildren().then(function () {
            return  "finished object: " + me.getName();
        }).catch(function (error) {
            console.error("Error processing children");
            console.error(error);
        });
    }
}

prototype.isSimpleValue = function () {
    var me = this;
    return !me.descriptor.contains;
};

prototype.getName = function () {
    var me = this;
    var selector = me.descriptor.valueNameSelector
        , attr = me.descriptor.valueNameAttr || ""
        , name = null;

    if (selector || attr) {
        name = me.getElementAttribute(selector, attr);
    }


    name = name || this.descriptorName;

    return name;
};

prototype.getElementAttribute = function (selector, attribute) {
    var me = this;
    var result = null;

    if (me.$) {

        var element = selector ? me.$(selector, me.context) : me.$(me.context);
        if (attribute) {
            result = element.attr(attribute);
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

    /*
     todo remove kostyl
     link is loaded and context is dropped - that's why value is not available
     */
    if (!val && me.context == null && me.type == 'link'){
        val = me.url.href;
    }


    return val;
};

prototype._getChildTree = function () {
    var me = this;
    return me.childTree;
}

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

    if (descriptorName === undefined) {
        debugger;
    }

    if (typeof descriptorName == 'string') {
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
        , $ = me.$
        , newChild
        , newChildPromise
        , found
        , selector
        , item
        , descriptor
        , context = me.context;

    descriptor = me.getDescriptorByName(descriptorName);

    if (!descriptor || descriptor.disabled === true) {
        return;
    }

    function createChildInstance(item){
        newChild = new pageNodeClass(me, item, descriptorName);
        me.children.push(newChild);

        newChildPromise = newChild.runPromise().then(function (childComplete) {
            me.addChildToTree(childComplete);
        });

        me.childrenPromises.push(newChildPromise);
    }

    selector = descriptor.selector;
    if (me.$ && selector) {
        found = $(selector, context);

        var length = found.length;

        if (length) {
            for (var i = 0; i < length; i++) {
                item = found[i];
                createChildInstance(item);
            }
        }
        else {
            console.log("0 found for: " + descriptor.name + " : " + selector);
        }
    } else if (descriptor.defaultValue){
        createChildInstance(null);
    }
    else{
        console.error("No selector and no default value for " + descriptor.name);
    }
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

        if (child.isNamedList() || child.isSimpleValue()) {
            var oldValue = me.childTree[childName];

            if (typeof  oldValue == "undefined") {
                me.childTree[childName] = childValue;
            }
            else {
                var message = "Page " + child.url.href + "\n" +
                "duplicate entry " + me.getName() + " -> " + child.getName() +
                (skippedParent ? " from skipped " + skippedParent.getName() : "") +
                " (old value = '" + oldValue + "' new value = '" + childValue + "'";
                if (!child.descriptor.valueNameSelector) {
                    message += " Maybe not set valueNameSelector?";
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

prototype.onReady = function(listener) {
    var me = this;
    me.on('ready', listener);
};

module.exports = pageNodeClass;