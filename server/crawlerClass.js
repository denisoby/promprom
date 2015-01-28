/**
 * Created by denisobydennykh on 08.01.15.
 */
var http = require('http')
    , crypto = require('crypto')
    , fs = require('fs')
    , iconv_lite = require('iconv-lite')

//    , pageParserClass = require('./pageParserClass')


    cacheDir = './cache';

function crawlerClass(config) {
    var me = this;
    me.config = config || {};
}

/*
crawlerClass.prototype.run = function () {
    var me = this;
    me.pages.forEach(function(pageType) {
        me.processPageType(pageType, me.config.descriptors);
    });
};

crawlerClass.prototype.processPageType = function (pageType, descriptors) {
    var me = this;
    pageType.urls.forEach(function (url) {
        me.processUrl(url, pageType.contains, descriptors);
    });
};

 crawlerClass.prototype.processPageInstance = function (page, contains, descriptors, url) {
 var pageParser = new pageParserClass(page, contains, descriptors, url);
 pageParser.run();
 };

 crawlerClass.prototype.processUrl = function (url, contains, descriptors) {
 var me = this;
 //todo remove debug - true
 me.getUrl(url, false, function (page) {
    me.processPageInstance(page, contains, descriptors, url);
});
};
*/

crawlerClass.prototype.getUrl = function (url, options, callback) {
    var me = this;
    options = options || {};
    var charset = options.charset;
    var disableCache = options.disableCache || false;

    var netOptions = {
        charset       : charset
        , disableCache: disableCache
    };

    if (disableCache) {
        me.getUrlByNet(url, netOptions, callback);
    } else {
        me.isUrlCached(url, function (exists) {
            if (exists) {
                me.getUrlByCache(url, callback);
            }
            else {
                me.getUrlByNet(url, netOptions, callback);
            }
        });
    }
};

crawlerClass.prototype.getUrlByNet = function (url, options, callback) {
    var me = this;

    options = options || {};
    var charset = options.charset;
    var disableCache = options.disableCache || false;

    var content = "";

    if (charset) {
        if (!iconv_lite.encodingExists(charset)){
            throw new Error("Charset not found: " + charset);
        }
    }

    console.log('Starting page download: ' + url);
    http.get(url, function (response) {
        if (charset) {
            response.setEncoding('binary');
        }

        response.on('data', function( data ) {
            content += data;
        });

        response.on('end', function () {
            console.log('Got page: ' + url);
            if (charset) {
                content = new Buffer(content, 'binary');
                content = iconv_lite.decode(content, charset)
            }

            if (!disableCache) {
                me.cacheUrl(url, content, callback);
            }

            callback(content);
        });
    });
};

crawlerClass.prototype.getUrlByCache = function (url, callback) {
    var me = this;
    fs.readFile(me.getUrlCachePath(url),{ encoding: 'utf8'} , function (err, data) {
        if(err) {
            console.log("Cache reading failed");
            console.log(err);
        } else {
            callback(data);
        }
    });
};

crawlerClass.prototype.getUrlHash = function (url) {
    var hashClass = crypto.createHash('md5');
    hashClass.update(url);

    return hashClass.digest('hex');
};


crawlerClass.prototype.getUrlCachePath = function (url) {
    var me = this;
    return cacheDir + '/' + me.getUrlHash(url) + '.htm';
};

crawlerClass.prototype.cacheUrl = function (url, page, callback) {
    var me = this;

    var urlHash = me.getUrlCachePath(url);

    fs.writeFile(urlHash, page, function(err) {
        if(err) {
            console.log("Caching failed");
            console.log(err);
        } else {
            callback(page);
        }
    });
};

crawlerClass.prototype.isUrlCached = function (url, callback) {
    var me = this;

    var cacheFile = me.getUrlCachePath(url);
    fs.exists(cacheFile, callback);
};

module.exports = crawlerClass;
