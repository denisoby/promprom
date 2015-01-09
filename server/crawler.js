/**
 * Created by denisobydennykh on 08.01.15.
 */

/*global require: false */

var descriptors = require('./descriptors.js')
    , pageNodeClass = require('./pageNodeClass');

var rootNode = new pageNodeClass(null, null, descriptors.pages[0], descriptors.descriptors);
rootNode.onReady(function () {
    rootNode.run();
});
