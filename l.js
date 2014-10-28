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
    var loader = function (urls, cb) {
        var finshedCallback = cb;

        var checkLoaded = function (url) {
            loaded[url] = true;

            for (var i = urls.length - 1; i>=0 && loaded[urls[i]]; i--);
            if (i < 0 && finshedCallback) { finshedCallback(); }
        };
        for (var i = urls.length - 1; i>= 0; i--) {
            var url = urls[i];
            url.match(/\.css\b/) && !loaded[url] && loadCss(url, checkLoaded);
            url.match(/\.js\b/) && !loaded[url] && loadJs(url, checkLoaded);
        }
    };

    var isA = function (obj, type) { return obj instanceof (type || Array); };
    var l = function () {
        var self = this;

        var argv = arguments, argc = argv.length;

        if (argc == 1 && isA(argv[0], Function)) {
            argv[0]();
            return;
        }

        var arg = argv[0];
        if (!isA(arg)) { arg = [ arg ]; }

        loader.call(this, arg, arguments.length <= 1 ? undefined : function () {
            l.apply(self, [].slice.call(argv, 1));
        });
    };

    win.l = l;

    var currentScript = document.querySelector('script[data-asset-list]');
    var assetListUrl = currentScript.dataset.assetList;
    if (assetListUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', assetListUrl + '?_=' + (new Date).getTime());
        xhr.onload = function () {
            var urls = JSON.parse(xhr.responseText);
            var init = function () {
                if (win.App) {
                    App.init();
                } else {
                    console.log('no App.init() defined');
                }
            }
            urls.push(init);
            l.apply(this, urls);
        };
        xhr.send();
    }
})(window);
