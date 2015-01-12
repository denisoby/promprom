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

};

var pages =     {
        name: "all"
        , contains: [
            {type           : 'link',
                defaultValue: 'http://www.samosvalsaz.ru/production/samosvals.php',
                contains    : ["descriptor:gaz_saz_list"],
                charset     : 'windows-1251',
                disabled : true
            }
            , {type         : 'link',
                defaultValue: 'http://www.kamaz.ru/production/serial/samosvaly/',
                contains    : ["descriptor:kamaz_list"]
            }
        ]
    }
    ;

module.exports = {
    pages : pages
    , descriptors: descriptors
};