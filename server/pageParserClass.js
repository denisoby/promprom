/**
 * Created by denisobydennykh on 08.01.15.
 */

var cheerio = require('cheerio')
    , pageNodeClass = require('./pageNodeClass');

function pageParserClass(page, contains, descriptors, url){
    var me = this;

    me.page = page;
    me.contains = contains;
    me.descriptors = descriptors;
    me.url = url;
}

pageParserClass.prototype.run = function () {
    debugger;
    var me = this;

    var $ = cheerio.load(me.page);

    var rootNode = new pageNodeClass($, null, null, {contains: me.contains}, me.descriptors);
    rootNode.run();
};

/*
pageParserClass.prototype.processNode = function ($, nodeDescriptor, parent) {
    nodeDescriptor.contains.forEach(function (descriptorName) {

    });
};
*/

module.exports = pageParserClass;