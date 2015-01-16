module.exports = {
    pages: [
        {
            type: 'link',
            defaultValue: 'http://www.belaz.by/catalog/products/dumpcrosscountry/',
            contains: ["descriptor:belaz_list"],
            disabled: false
        }
    ]
    , descriptors: {
        belaz_list: {
            selector: ".catalog"
            , contains: ["descriptor:belaz_list_entry"]
            //, passValuesToParent: true
        }
        , belaz_list_entry: {
            selector: ".catalog-item"
            , namedList: false
            , passValuesToParent: true
            , contains: {
                selector: ".catalog-item-name a"
                , name: 'link_to_full_belaz'
                , namedList: false
                , type: 'link'
                , valueAttr: 'href'
                //, passValuesToParent: true
                , contains: 'descriptor:belaz_model'
            }
        }
        , belaz_model: {
            selector: ".content"
            , valueNameSelector: '.catalog-series h1 span'
            , contains: {
                name: "link_to_belaz_modification"
                , selector: ".catalog-series-all-a"
                , type: 'link'
                , namedList: false
                , contains: "descriptor:belaz_modification"
            }
        }
        , belaz_modification: {
            name: "Технические характеристики"
            , selector: ".catalog-series-tab"
            , valueNameSelector: ".catalog-series>h1:first-child"
            , debug: false
            , namedList: false
            , contains: {
                name: "belaz_model_techspec_group"
                , selector: "div.catalog-series-67 table"
                , namedList: true
                , valueNameSelector: function(){
                    var context, header, text;

                    var checkContexts = [this.page.context, this.page.context.prev, this.page.context.prev.prev, this.page.context.prev.prev.prev, this.page.context.parent.prev];

                    for(var i=0; i<checkContexts.length; i++) {
                        context = checkContexts[i];
                        header = this.page.$(".catalog-series-point", context);
                        if (header.length) {
                            text = header.text().trim();
                            if (text){
                                break;
                            }
                        }
                    }

                    if (!text) {
                        debugger;
                    }

                    return text;
                }
                , contains: {
                    selector: "tr"
                    , valueNameSelector: "td:first-child"
                    , valueSelector: "td:nth-child(2)"
                    , name: "belaz_model_techspec_item"
                }
            }
        }
    }
};