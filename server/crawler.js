/**
 * Created by denisobydennykh on 08.01.15.
 */

/*global require: false */

var descriptors = require('./descriptors/descriptors.js')
    , pageNodeClass = require('./pageNodeClass');

/*
хово
зил
краз http://www.autokraz.com.ua/index.php/uk/produktsiya/automobile/civil/samoskidi
*/


var rootNode = new pageNodeClass(null, null, descriptors.pages, descriptors.descriptors);
rootNode.runPromise().
    then(function () {
        console.log("Done!");
        var value = rootNode.getValue();
        console.log(JSON.stringify(value, null, "\t"));
    }).
    catch(function (error) {
        console.error(error);
    });
