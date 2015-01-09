/**
 * Created by denisobydennykh on 08.01.15.
 */
'use strict';

var util = require("util")
    , events = require("events");

function pageNodeClass($, parent, context, descriptor, descriptors) {
    var me = this;
    events.EventEmitter.call(this);

    var descriptorType = typeof descriptor;
    if(descriptorType == 'string') {
        descriptor = descriptors[descriptor];
    }

    me.parent = parent;
    me.context = context;

    me.descriptor = descriptor;
    me.descriptors = descriptors;

    me.children = [];
    me.childTree = {};
}

var prototype = pageNodeClass.prototype;

prototype.run = function ($) {
    var me = this
        , $ = me.$
        , descriptorObject
        , descriptor;

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
        , type
        , property = 'text' //default property for to get value for primitives
        , multiple = false
        , descriptor
        , context = me.context;

    if (typeof item == 'string'){
        descriptor = me.descriptors[descriptorName];
        if (!descriptor){
            /**
             * the most primitive descriptor - string xpath selector,
             * and we are making descriptor object now
             */
            descriptor = {
                selector : descriptorName
                , type : 'text'
            }
        }
    }
    else{
        /*
        we got descriptor object
         */
        descriptor = descriptorName;
        descriptorName = descriptor.name || descriptor.selector;
    }

    descriptor.multiple = descriptor.multiple || false;

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


        });
    }
    else{

    }
};

util.inherits(pageNodeClass, events.EventEmitter);