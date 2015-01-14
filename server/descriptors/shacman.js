module.exports = {
    pages: [
        /*
         SHACMAN
         needs paging functionality
         */
        {
            type: 'link',
            defaultValue: 'http://www.shacmanmotor.com/products_1_18.html',
            contains: ["descriptor:shacman_list"],
            disabled: false
        }
    ]
    , descriptors: {
        shacman_list: {
            selector: ".tup"
            , contains: ["descriptor:shacman_list_entry"]
            , passValuesToParent: true
        }
        , shacman_list_entry: {
            selector: "li"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: "p a"
                , name: 'link_to_full_shacman'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:shacman_model'
            }
        }
        , shacman_model: {
            selector: "table[width='680']"
            , valueNameSelector: 'h3'
            , contains: [
                {
                    name: "Технические характеристики"
                    , selector: "tr:nth-child(2) table"
                    , namedList: true
                    , contains: {
                        selector: "tr"
                        , valueNameSelector: "td:first-child"
                        , valueSelector: "td:nth-child(2)"
                        , name: "shacman_model_techspec_item"
                    }
                }
            ]
        }
    }
}