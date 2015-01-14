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
            disabled: true
        }
    ]
    , descriptors: {
        shacman_list: {
            selector: ".content"
            , contains: ["descriptor:shacman_list_entry"]
            , passValuesToParent: true
        }
        , shacman_list_entry: {
            selector: ".catalog-category-section"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".title a"
                , name: 'link_to_full_shacman'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:shacman_model'
            }
        }
        , shacman_model: {
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
                        , name: "shacman_model_techspec_item"
                    }
                }
            ]
        }
    }
}