(function (win, undefined) {
    'use strict';

    if (win.l) return;

    var head = document.querySelector('head') || document.documentElement;
    var script = document.createElement('script');
    var link = document.createElement('link'); link.rel = 'stylesheet';

    var loadJs =  function (url, cb) {
        var s = script.cloneNode();
        if (cb) {
            s.onload = function () { cb(url); };
        }
        s.src = url;
        head.appendChild(s);
    };
    var loadCss = function (url, cb) {
        var l = link.cloneNode();
        if (cb) {
            l.onload = function () { cb(url); };
        }
        l.href = url;
        head.appendChild(l);
    };

    var loaded = {};
    win.l = function (urls, cb) {
        var finshedCallback = cb;

        var checkLoaded = function (url) {
            loaded[url] = true;

            for (var i = urls.length - 1; i>=0 && loaded[urls[i]]; i--);
            i < 0 && finshedCallback();
        };
        for (var i = urls.length - 1; i>= 0; i--) {
            var url = urls[i];
            url.match(/\.css\b/) && !loaded[url] && loadCss(url, checkLoaded);
            url.match(/\.js\b/) && !loaded[url] && loadJs(url, checkLoaded);
        }
    };
    var currentScript = document.querySelector('script[data-asset-list]');
    var assetListUrl = currentScript.dataset.assetList;
    if (assetListUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', assetListUrl);
        xhr.onload = function () {
            var urls = JSON.parse(xhr.responseText);
            win.l(urls, function () {
                if (win.App) {
                    App.init();
                } else {
                    console.log('no App.init() defined');
                }
            });
        };
        xhr.send();
    }
})(window);
