var _ = require('lodash');


var descriptors = {};
var pages = {
    name: "all"
    , contains: [
        /*
         HOWO
         */
        , {
            type: 'link',
            defaultValue: 'http://www.sinotruk-howo.com/index.php?m=Product&a=index&id=66',
            contains: ["descriptor:howo_list"],
            disabled: true
        }

    ]
};

var marks = ['kamaz', 'ural', 'maz', 'gaz_saz', 'shacman']
    , markInfo;

marks.forEach(function (mark) {
    markInfo = require('./' + mark);
    _.merge(descriptors, markInfo.descriptors);
    pages.contains = pages.contains.concat(markInfo.pages);
});

module.exports = {
    pages: pages
    , descriptors: descriptors
};