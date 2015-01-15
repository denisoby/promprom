module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://maz.by/ru/products/cargo_vehicle/dump_vehicles/',
            contains: ["descriptor:maz_list"],
            disabled: false
        }
    ]
    , descriptors: {
        maz_list: {
            selector: ".b-catalog"
            , contains: ["descriptor:maz_list_entry"]
            , passValuesToParent: true
        }
        , maz_list_entry: {
            selector: ".b-catalog__item"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".b-cit__item a"
                , name: 'link_to_full_maz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                , passValuesToParent: true
                , contains: 'descriptor:maz_model'
            }
        }
        , maz_model: {
            selector: ".b-ic__right"
            , valueNameSelector: 'h1'
            , contains: [
                {
                    name: "Технические характеристики"
                    , selector: ".b-c__info"
                    , namedList: true
                    , contains: {
                        name: "maz_model_techspec_group"
                        , selector: "table"
                        , valueNameSelector: "tr th"
                        , namedList: true
                        , contains: {
                            selector: "tr"
                            , valueNameSelector: "td:first-child"
                            , valueSelector: "td:nth-child(2)"
                            , name: "maz_model_techspec_item"
                        }
                    }
                }
            ]
        }
    }
};