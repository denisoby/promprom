/**
 * Created by denisobydennykh on 08.01.15.
 */

/*global require: false */

var descriptors = require('./descriptors.js')
    , crawlerClass = require('./crawlerClass.js');

debugger;
var crawler = new crawlerClass(descriptors);
crawler.run();

