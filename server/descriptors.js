var descriptors = {
    kamaz_list : {
        selector: ".table-technical-characteristics"
        , header: {selector: "tr:first-child th"}
        , contains: ["descriptor:kamaz_list_entry"]
    }
    ,kamaz_list_entry : {
        selector: "tr:nth-child(n+3)"
        , header: "parent.header"
        , namedList : false
//        , multiple: true
        , contains:
        {
            selector: "td:nth-child(2) a"
            , name: 'link_to_full'
            , namedList : false
            , type: 'link'
            , valueAttr: 'href'
            , contains: 'descriptor:kamaz_model'
        }
    }
    ,kamaz_model : {
        selector: ".r-col"
        , valueNameSelector : '.title-b-page h1'
        , contains: [
            //images

            , {
                name: "Технические характеристики"
                , selector : ".accordion-b ul"
                , namedList: true
//                , multiple: false
                , contains: {
                    name: "kamaz_model_techspec_group"
                    , selector: "li"
                    , valueNameSelector: "a.main-link"
                    , namedList: true
//                    , multiple: true
                    , contains: {
                        selector: "tr"
                        , valueNameSelector: "td:first-child"
                        , valueSelector: "td:nth-child(2)"
//                        , multiple: true
                        , name: "kamaz_model_techspec_item"
                    }
                }
            }
        ]
    }
};

var pages = [
    {
        type: 'link'
        , defaultValue : 'http://www.kamaz.ru/production/serial/samosvaly/'
        , contains: [
            "descriptor:kamaz_list"
        ]
    }
];

module.exports = {
    pages : pages
    , descriptors: descriptors
};