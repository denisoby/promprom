/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

var util = require("util")
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
    me.descriptorName = descriptorName;
    me.descriptor = me.getDescriptorByName(descriptorName);

    me.type = me.descriptor.type || 'defaultType';

    me.children = [];
    me.childrenPromises = [];
    me.childTree = {};

    /*
    todo support get value from context
     */
    me.value = me.descriptor.value;
}

util.inherits(pageNodeClass, events.EventEmitter);

var prototype = pageNodeClass.prototype;

prototype.runPromise = function () {
    var me = this;

    console.log("starting element " + me.descriptor.name)

    return (new Promise(me.getPage.bind(me))).
        then(me.processContent.bind(me)).
        then(console.log);
}

prototype.getPage = function (resolve, reject) {
    var me = this;

    if (me.type == 'link') {
        var crawler = new crawlerClass();
        crawler.getUrl(me.value, null, function (page) {
            me.$ = cheerio.load(page);
            me.context = null;
            resolve();
        });
    }
    else {
        me.$ = me.parent.$;
        resolve();
    }
};

prototype.processContent = function () {
    var me = this;

    //complex object with child nodes
    if (me.descriptor.contains) {
        return me.processChildren().then(function () {
            console.log("finished object: " + me.descriptor.name);
        });
    }
    //primitive
    else{
        return me.descriptor.name + " = " +  me.getValue();
    }
}

prototype.getValue = function () {
    return 'test';
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

    if (typeof descriptorName == 'string') {
        descriptor = me.descriptors[descriptorName];
        if (!descriptor) {
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
        descriptorName = descriptor.name || descriptor.selector || descriptor.value;
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

    selector = descriptor.selector;
    found = $(selector, context);

    if(found.length){
        console.log('Found elements with selector "' + selector + '"');

        for(var i=0; i < found.length; i++) {
            item = found[i];

            newChild = new pageNodeClass(me, item, descriptorName);
            me.children.push(newChild);
            if (descriptor.multiple) {
                me.childTree[descriptorName] = me.childTree[descriptorName] || [];
                me.childTree[descriptorName].push(newChild);
            }
            else{
                me.childTree[descriptorName] = newChild;
            }

            newChildPromise = newChild.runPromise();
            me.childrenPromises.push(newChildPromise);
        }
    }
    else{

    }
};

prototype.onReady = function(listener) {
    var me = this;
    me.on('ready', listener);
};

module.exports = pageNodeClass;