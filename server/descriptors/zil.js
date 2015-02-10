var _ = require('lodash');

module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.amo-zil.ru/catalog/?id=134',
            contains: ["descriptor:zil_list"],
            disabled: false
        }
    ]
    , descriptors: {
        zil_list: {
            selector: ".content"
            , contains: ["descriptor:zil_list_entry"]
            , passValuesToParent: true
        }
        , zil_list_entry: {
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
                , contains: 'descriptor:zil_model'
            }
        }
        , zil_model: {
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
                    selector: "tr:first-child td:nth-child(n+2)"
                    , childrenPageContext: function () {
                        //set context = whole table
                        return this.parent.page.context;
                    }
                    , valueNameSelector: function () {
                        var $ = this.page.$
                            , firstRowName = $("td:first-child", this.page.context.parent).text()
                            , name;
                        if (firstRowName == 'Шасси') {
                            name = $(this.page.context).text();
                        }
                        else {
                            name = this.parent.parent.getName();
                        }

                        return name;
                    }
                    , namedList: true
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
                        /*
                         , templateValues: function(){
                         var context = this.page.context
                         , $ = this.page.$;

                         var tdCount = $("tr:first-child td", context).length
                         , childrenTds = _.range(2, tdCount + 1);

                         return childrenTds;
                         }
                         */
                    }
                }
                    , listeners: {
                    processed: function () {
                        /*
                         fix for colspan'ed cell's
                         todo add nth-col pseudo to cssselect
                         */
                        /*
                         var me = this;
                         for (var childNum = 1; childNum < me.children.length; childNum++) {
                         _.defaults(me.children[childNum].childTree, me.children[0].childTree);
                         }
                         */
                    }
                }
                }
            ]
        }
    }
};