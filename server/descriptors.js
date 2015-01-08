var descriptors = {
    kamaz_list : {
        context: ".table-technical-characteristics"
        , header: {context: "tr:first-child th"}
        , contains: ["kamaz_list_entry"]
    }
    ,kamaz_list_entry : {
        context: "tr:nth-child(n+3)"
        , header: "parent.header"
        , contains:
        {
            context: "td:nth-child(2)"
            , type: 'link'
            , contains: 'kamaz_model'
        }
    }
    ,kamaz_model : {
        saveTo: "kamaz_samosval_src"
    }
};

var pages = [
    {
        urls       : [
            'http://www.kamaz.ru/production/serial/samosvaly/'
        ],
        contains: [
            "kamaz_list"
        ]
    }
];

module.exports = {
    pages : pages
    , descriptors: descriptors
};