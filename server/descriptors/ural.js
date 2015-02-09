var _ = require('lodash');

module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.uralaz.ru/models/samosvaly/',
            contains: ["descriptor:ural_list"],
            disabled: false
        }
    ]
    , descriptors: {
        ural_list: {
            selector: ".content"
            , contains: ["descriptor:ural_list_entry"]
            , passValuesToParent: true
        }
        , ural_list_entry: {
            selector: ".catalog-category-section"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".title a"
                , name: 'link_to_full_ural'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:ural_model'
            }
        }
        , ural_model: {
            selector: "#main"
            , valueNameSelector: '.right-nav li:first-child a'
            , contains: [
                {
                    name: "Характеристики"

                    /*
                    in future this may
                     */
                    , selector: ".article table"
                    , namedList: true
                    , contains: {
                        selector : "tr:first-child td:nth-child(n+2)"
                        , childrenPageContext: function(){
                            //set context = whole table
                            return this.parent.page.context;
                        }
                        , namedList: false
                        , contains : {
                            selector: function(){
                                //this = parent
                                return "td:nth-child(" + (this._itemNum + 2) + ")"
                            }
/*
                            , templateValues: function(){
                                var context = this.page.context
                                    , $ = this.page.$;

                                var tdCount = $("tr:first-child td", context).length
                                    , childrenTds = _.range(2, tdCount + 1);

                                return childrenTds;
                            }
*/
                            , valueNameSelector: function () {
                                var $ = this.page.$;
                                return $("td:first-child", this.page.context.parent).text();
                            }
                            , name: "ural_model_techspec_item"
                        }

                }
                }
            ]
        }
    }
}