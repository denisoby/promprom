module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.belaz.by/catalog/products/dumpcrosscountry/',
            contains: ["descriptor:belaz_list"],
            disabled: true
        }
    ]
    , descriptors: {
        belaz_list: {
            selector: ".catalog"
            , contains: ["descriptor:belaz_list_entry"]
            //, passValuesToParent: true
        }
        , belaz_list_entry: {
            selector: ".catalog-item"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".catalog-item-name a"
                , name: 'link_to_full_belaz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                //, passValuesToParent: true
                , contains: 'descriptor:belaz_model'
            }
        }
        , belaz_model: {
            selector: ".content"
            , valueNameSelector: '.catalog-series h1 span'
            , contains: {
                name: "link_to_belaz_modification"
                , selector: ".catalog-series-all-a"
                , type: 'link'
                , namedList: false
                , contains: "descriptor:belaz_modification"
            }
        }
        , belaz_modification: {
            name: "Технические характеристики"
            , selector: ".catalog-series-tab"
            , valueNameSelector: ".catalog-series>h1:first-child"
            , debug: true
            , namedList: false
            , contains: {
                name: "belaz_model_techspec_group"
                , selector: "table"
                , namedList: false
                , contains: {
                    selector: "tr"
                    , valueNameSelector: "td:first-child"
                    , valueSelector: "td:nth-child(2)"
                    , name: "belaz_model_techspec_item"
                }
            }
        }
    }
};