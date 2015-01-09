/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

var util = require("util")
    , events = require("events");

function pageNodeClass($, parent, context, descriptorName, descriptors) {
    var me = this;
    events.EventEmitter.call(this);

    me.parent = parent;
    me.context = context;

    me.descriptorName = descriptorName;
    me.descriptor = me.getDescriptorByName(descriptorName);
    me.descriptors = descriptors;

    me.children = [];
    me.childTree = {};
}

var prototype = pageNodeClass.prototype;

prototype.run = function ($) {
    var me = this;

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
        , descriptor
        , context = me.context;

    descriptor = me.getDescriptorByName(descriptorName);

    selector = descriptor.selector;
    found = $(selector, context);

    if(found.length){
        console.log('Found elements with selector "' + selector + '"');
        found.forEach(function (item) {
            newChild = new pageNodeClass(me.$, me, item, descriptorName, me.descriptors);
            me.children.push(newChild);
            if (descriptor.multiple) {
                me.childTree[descriptorName] = me.childTree[descriptorName] || [];
                me.childTree[descriptorName].push(newChild);
            }
            else{
                me.childTree[descriptorName] = newChild;
            }

            newChild.run();
        });
    }
    else{

    }
};

util.inherits(pageNodeClass, events.EventEmitter);