/*
+ PDF for details
 */
module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.autokraz.com.ua/index.php/ru/fabrication/automobile/civil/samosvaly',
            contains: ["descriptor:kraz_list"],
            disabled: false
        }
    ]
    , descriptors: {
        kraz_list: {
            selector: "#itemListLeading"
            //todo remove debug
            , contains: ["descriptor:kraz_list_entry"]
            , passValuesToParent: true
            , namedList: true
            , valueNameSelector: "h1"
        }
        , kraz_list_entry: {
            selector: ".itemContainer"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".catItemTitle a"
                , name: 'link_to_full_kraz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:kraz_model'
            }
        }
        , kraz_model: {
            selector: ".itemView"
            , valueNameSelector: 'h1.itemTitle'
            , contains: [
                {
                    name: "Технические характеристики"
                    , selector: ".itemFullText table"
                    , namedList: true
                    , contains: {
                    selector: "tr"
                    , valueNameSelector: "td:first-child"
                    , valueSelector: "td:nth-child(2)"
                    , name: "kraz_model_techspec_item"
                }
                }
                , {
                    name: "Приложения"
                    , selector: ".itemAttachmentsBlock ul a"
                    , valueAttr: "href"
                }
            ]
        }
    }
};