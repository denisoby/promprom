var descriptors = {
    kamaz_list : {
        query: ".table-technical-characteristics"
        , header: {query: "tr:first-child th"}
        , contains: ["kamaz_list_entry"]
    }
    ,kamaz_list_entry : {
        query: "tr:nth-child(n+3)"
        , header: "parent.header"
        , contains:
        {
            query: "td:nth-child(2)"
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
        descriptors: [
            descriptors.kamaz_list
        ]
    }
];

module.exports = {
    pages : pages
    , descriptors: descriptors
};