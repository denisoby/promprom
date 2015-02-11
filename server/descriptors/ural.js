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
            , namedList: true
            , passValuesToParent: false
            , valueNameSelector: '.section-title'
            , contains: [
                {
                    selector: 'img'
                    , name: 'images'
                    , valueAttr: 'src'
                    , namedList: false
                    , type: 'link'
                    , defaultNameForEmpty: true
                }
                , {
                    selector: ".title a"
                    , name: 'link_to_full_ural'
                    , namedList: false
                    , type: 'link'
                    , valueAttr: 'href'
                    , passValuesToParent: true
                    , contains: 'descriptor:ural_model'
                }
            ]
        }
        , ural_model: {
            selector: "#main"
            , passValuesToParent: true
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
                        , valueNameSelector: function(){
                            var $ = this.page.$
                                , firstRowName = $("td:first-child", this.page.context.parent).text()
                                , name;
                            if (firstRowName == 'Шасси'){
                                name = $(this.page.context).text();
                            }
                            else{
                                name = this.parent.parent.getName();
                            }

                            return name;
                        }
                        , namedList: true
                        , contains : {
                            selector: function(){
                                //this = parent
                                return "td:nth-child(" + (this._itemNum + 2) + ")"
                            }
                        , valueNameSelector: function () {
                            var $ = this.page.$;
                            return $("td:first-child", this.page.context.parent).text();
                        }
                        , name: "ural_model_techspec_item"
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
                        processed: function(){
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
                , {
                    name: "Модифицикации"
                    , selector: 'table.modifications-table'
                    , contains: {
                        name: 'modification-row'
                        , selector: 'tr:nth-child(n+2)'
                        , valueNameSelector: 'td:first-child'
                        , contains: {
                            selector: 'td:nth-child(2)'
                        }
                    }
                }
            ]
        }
    }
}