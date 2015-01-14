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
                //images

                , {
                    name: "Технические характеристики"
                    , selector: ".article table"
                    , namedList: true
                    , contains: {
                        selector: "tr"
                        , valueNameSelector: "td:first-child"
                        , valueSelector: "td:nth-child(2)"
                        , name: "ural_model_techspec_item"
                    }
                }
            ]
        }
    }
}