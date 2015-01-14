var linkDescriptor = {
    type: 'link'
    , selector: 'a'
    , defaultValue: 'http://www.shacmanmotor.com/products_1_18.html'
    , contains: ["descriptor:shacman_page"]
    , disabled: false
}


module.exports = {
    pages: [
        linkDescriptor
    ]
    , descriptors: {
        shacman_page: {
            selector: "table[width='674']"
            , valueNameSelector: ".bt"
            , contains: [
                //"descriptor:shacman_list" ,
                "descriptor:shacman_pagination"
            ]
        }
        , shacman_list: {
            selector: ".tup"
            , contains: ["descriptor:shacman_list_entry"]
            , namedList: false
            //, passValuesToParent: true
        }
        , shacman_pagination: {
            selector: "div:nth-child(2) table"
            , contains: linkDescriptor
        }
        , shacman_list_entry: {
            selector: "li"
            , namedList: false
            , valueNameSelector: "p a"
            //, passValuesToParent: true
            , contains: {
                selector: "p a"
                , name: 'link_to_full_shacman'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:shacman_model'

                //todo remove debug
                , disabled: true
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