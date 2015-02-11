var _ = require('lodash');

module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.amo-zil.ru/catalog/?id=134',
            contains: ["descriptor:zil_list"],
            disabled: true
        }
    ]
    , descriptors: {
        zil_list: {
            selector: ".l-content"
            , contains: ["descriptor:zil_list_entry"]
            , passValuesToParent: true
        }
        , zil_list_entry: {
            selector: ".b-catalog-item"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: "a.link"
                , name: 'link_to_full_zil'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:zil_model'
            }
        }
        , zil_model: {
            selector: ".l-content"
            , valueNameSelector: '.b-pagetitle h1'
            , contains: [
                {
                    name: "linked_images"
                    , selector: '.b-pmodel a.fancybox'
                    , valueAttr: 'href'
                    , namedList: false
                    , type: 'link'
                    , defaultNameForEmpty: true
                }
                ,{
                    name: "description"
                    , selector: ".b-catalogdetail p:first-child"
                },
                {
                    name: "Info"
                    , selector: ".b-catalogdetail div.b-carinfo table"
                    , namedList: false
                    , contains: {
                        selector: "tr:first-child td:nth-child(n+2)"
                        , childrenPageContext: function () {
                            //set context = whole table
                            return this.parent.page.context;
                        }
                         , valueNameSelector: function () {
                            var $ = this.page.$;

                            /*
                            todo - search prev tag
                             */

                            //h2
                             return $(this.parent.page.context.parent.prev.prev).text();
                         }
                        , namedList: false
                        , contains: {
                            selector: function () {
                                //this = parent
                                return "td:nth-child(" + (this._itemNum + 2) + ")"
                            }
                            , valueNameSelector: function () {
                                var $ = this.page.$;
                                return $("td:first-child", this.page.context.parent).text();
                            }
                            , name: "zil_model_techspec_item"
                        }
                    }
                }
            ]
        }
    }
};