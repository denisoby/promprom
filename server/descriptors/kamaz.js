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
            , passValuesToParent: true
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
                , passValuesToParent: true
                , contains: 'descriptor:kamaz_model'
            }
        }
        , kamaz_model: {
            selector: ".r-col"
            , valueNameSelector: '.title-b-page h1'
            , contains: [
                //images

                , {
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
                        }
                    }
                }
            ]
        }
    }
};