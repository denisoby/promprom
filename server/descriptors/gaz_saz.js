module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.samosvalsaz.ru/production/samosvals.php',
            contains: ["descriptor:gaz_saz_list"],
            charset: 'windows-1251',
            disabled: false
        }
    ]
    , descriptors: {
        gaz_saz_list: {
            selector: ".products"
            //todo remove debug
            , contains: ["descriptor:gaz_saz_list_entry"]
            , passValuesToParent: true
            , namedList: true
            , valueNameSelector: "h1"
        }
        , gaz_saz_list_entry: {
            selector: "tr"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: "td a"
                , name: 'link_to_full_gaz_saz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , charset: 'windows-1251'
                , passValuesToParent: true
                , contains: 'descriptor:gaz_saz_model'
            }
        }
        , gaz_saz_model: {
            selector: "#catalog_element"
            , valueNameSelector: 'h1'
            , contains: [
                {
                    name: "Технические характеристики"
                    , selector: ".data_table"
                    , namedList: true
                    , contains: {
                    selector: "tr"
                    , valueNameSelector: "th"
                    , valueSelector: "td"
                    , name: "gaz_saz_model_techspec_item"
                }
                }
                , {
                    name: "Описание"
                    , selector: ".description"
                }
            ]
        }
    }
};