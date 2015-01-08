/**
 * Created by denisobydennykh on 08.01.15.
 */

var util = require("util")
    , events = require("events");

function pageNodeClass() {
    events.EventEmitter.call(this);
}

util.inherits(pageNodeClass, events.EventEmitter);