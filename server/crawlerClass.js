/**
 * Created by denisobydennykh on 08.01.15.
 */
var http = require('http')
    , crypto = require('crypto')
    , fs = require('fs')


    cacheDir = './cache';

function crawlerClass(config) {
    var me = this;
    me.config = config;
    me.pages = config.pages || [];
}

crawlerClass.prototype.run = function () {
    var me = this;
    me.pages.forEach(me.processPageType.bind(me));
};

crawlerClass.prototype.processPageType = function (pageType) {
    var me = this;
    pageType.urls.forEach(function (url) {
        me.processUrl(url, pageType.descriptors);
    });
};

crawlerClass.prototype.getUrl = function (url, disableCache, callback) {
    var me = this;
    if (disableCache) {
        me.getUrlByNet(url, disableCache, callback);
    } else {
        me.isUrlCached(url, function (exists) {
            if (exists) {
                me.getUrlByCache(url, callback);
            }
            else {
                me.getUrlByNet(url, disableCache, callback);
            }
        });
    }
};

crawlerClass.prototype.getUrlByNet = function (url, disableCache, callback) {
    var me = this;
    var content = '';
    http.get(url, function (response) {
        response.on('data', function( data ) {
            content += data;
        });

        response.on('end', function () {

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

crawlerClass.prototype.processPageInstance = function (page, descriptors, url) {
    debugger;
};

crawlerClass.prototype.processUrl = function (url, descriptors) {
    var me = this;
    /*
    todo remove debug - true
     */
    me.getUrl(url, false, function (page) {
        me.processPageInstance(page, descriptors, url);
    });
};

module.exports = crawlerClass;
