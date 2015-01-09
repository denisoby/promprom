/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

var util = require("util")
    , cheerio = require('cheerio')
    , events = require("events")

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
    me.childTree = {};

    /*
    todo support get value from context
     */
    me.value = me.descriptor.value;

    if (me.type == 'link') {
        var crawler = new crawlerClass();
        crawler.getUrl(me.value, null, function (page) {
            me.$ = cheerio.load(page);
            me.context = null;
            me.emit('ready');
        });
    }
    else{
        me.$ = parent.$;
        me.emit('ready');
    }
}

util.inherits(pageNodeClass, events.EventEmitter);

var prototype = pageNodeClass.prototype;

prototype.run = function ($) {
    var me = this;

    /*
     var $ = cheerio.load(me.page);
     */

    var contains = me.descriptor.contains;
    if (contains) {
        if (!util.isArray(contains)){
            contains = [contains];
        }

        contains.forEach(function (item) {
            me.createChild(item);
        });
    }
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
        descriptorName = descriptor.name || descriptor.selector;
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

            /*
             todo
             1. events
             2. values
             */

            newChild.onReady(function () {
                newChild.run();
            });
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