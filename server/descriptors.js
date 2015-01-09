var descriptors = {
    kamaz_list : {
        selector: ".table-technical-characteristics"
        , header: {selector: "tr:first-child th"}
        , contains: ["kamaz_list_entry"]
    }
    ,kamaz_list_entry : {
        selector: "tr:nth-child(n+3)"
        , header: "parent.header"
        , contains:
        {
            selector: "td:nth-child(2)"
            , type: 'link'
            , contains: 'kamaz_model'
        }
    }
/*
    ,kamaz_model : {
        saveTo: "kamaz_samosval_src"
    }
*/
};

var pages = [
    {
        type: 'link'
        , value : 'http://www.kamaz.ru/production/serial/samosvaly/'
        , contains: [
            "kamaz_list"
        ]
    }
];

module.exports = {
    pages : pages
    , descriptors: descriptors
};