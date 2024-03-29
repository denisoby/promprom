/*
 kamaz
 Page http://www.kamaz.ru/production/serial/samosvaly/kamaz-65201-73(2)/
 duplicate entry Весовые параметры и нагрузки -> нагрузка на первую и вторую оси, кг (old value = '15000' new value = '7480'
 */

module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.kamaz.ru/production/serial/samosvaly/',
            contains: ["descriptor:kamaz_list"],
            disabled: false
        }
    ]
    , descriptors: {
        kamaz_list: {
            selector: ".table-technical-characteristics"
            , contains: ["descriptor:kamaz_list_entry"]
            //, passValuesToParent: true
        }
        , kamaz_list_entry: {
            selector: "tr:nth-child(n+3)"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: "td:nth-child(2) a"
                , name: 'link_to_full_kamaz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                //, passValuesToParent: true
                , contains: 'descriptor:kamaz_model'
            }
        }
        , kamaz_model: {
            selector: ".r-col"
            , valueNameSelector: '.title-b-page h1'
            , contains: [
                // uncomment to get bug
                //,
                {
                    name: "Технические характеристики"
                    , selector: ".accordion-b ul"
                    , namedList: true
                    , contains: {
                        name: "kamaz_model_techspec_group"
                        , selector: "li"
                        , valueNameSelector: "a.main-link"
                        , namedList: true
                        , contains: {
                            selector: "tr"
                            , valueNameSelector: "td:first-child"
                            , valueSelector: "td:nth-child(2)"
                            , name: "kamaz_model_techspec_item"
                            , listeners : {
                                getName: function (name) {
                                    var me = this;

                                    if (name && me.parent.childTree[name]){
                                        name = name + '__' + me._itemNum;
                                    }

                                    return name;
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
};