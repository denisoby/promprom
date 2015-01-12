var descriptors = {
    /* ***********************************

     KAMAZ

     *************************************/
    kamaz_list : {
        selector: ".table-technical-characteristics"
        , contains: ["descriptor:kamaz_list_entry"]
        , passValuesToParent : true
    }
    ,kamaz_list_entry : {
        selector: "tr:nth-child(n+3)"
        , namedList : false
        , passValuesToParent : true
        , contains:
        {
            selector: "td:nth-child(2) a"
            , name: 'link_to_full_kamaz'
            , namedList : false
            , type: 'link'
            , valueAttr: 'href'
            , passValuesToParent : true
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
    ,
    /* ***********************************

     GAZ SAZ

     *************************************/
    gaz_saz_list : {
        selector: ".products"
        //todo remove debug
        , contains: ["descriptor:gaz_saz_list_entry"]
        , passValuesToParent : true
        , namedList : true
        , valueNameSelector: "h1"
    }
    ,gaz_saz_list_entry : {
        selector: "tr"
        , namedList : false
        , passValuesToParent : true
        , contains:
        {
            selector: "td a"
            , name: 'link_to_full_gaz_saz'
            , namedList : false
            , type: 'link'
            , valueAttr: 'href'
            , charset: 'windows-1251'
            , passValuesToParent : true
            , contains: 'descriptor:gaz_saz_model'
        }
    }
    ,gaz_saz_model : {
        selector: "#catalog_element"
        , valueNameSelector : 'h1'
        , contains: [
            {
                name: "Технические характеристики"
                , selector : ".data_table"
                , namedList: true
                , contains: {
                    selector: "tr"
                    , valueNameSelector: "th"
                    , valueSelector: "td"
                    , name: "gaz_saz_model_techspec_item"
                }
            }
             ,{
             name: "Описание"
             , selector: ".description"
             }
        ]
    }
    ,
    /* ***********************************

     maz

     *************************************/
    maz_list : {
        selector: ".b-catalog"
        , contains: ["descriptor:maz_list_entry"]
        , passValuesToParent : true
    }
    ,maz_list_entry : {
        selector: ".b-catalog__item"
        , namedList : false
        , passValuesToParent : true
        , contains:
        {
            selector: ".b-cit__item a"
            , name: 'link_to_full_maz'
            , namedList : false
            , type: 'link'
            , valueAttr: 'href'
            , passValuesToParent : true
            , contains: 'descriptor:maz_model'
        }
    }
    ,maz_model : {
        selector: ".b-ic__right"
        , valueNameSelector : 'h1'
        , contains: [
            //images

            , {
                name: "Технические характеристики"
                , selector : ".b-c__info"
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
};

var pages =     {
        name: "all"
        , contains: [
            {type           : 'link',
                defaultValue: 'http://www.samosvalsaz.ru/production/samosvals.php',
                contains    : ["descriptor:gaz_saz_list"],
                charset     : 'windows-1251',
                disabled : false
            }
            , {type         : 'link',
                defaultValue: 'http://www.kamaz.ru/production/serial/samosvaly/',
                contains    : ["descriptor:kamaz_list"],
                disabled : false
            }
            , {type         : 'link',
                defaultValue: 'http://maz.by/ru/products/cargo_vehicle/dump_vehicles/',
                contains    : ["descriptor:maz_list"],
                disabled : false
            }
        ]
    }
    ;

module.exports = {
    pages : pages
    , descriptors: descriptors
};