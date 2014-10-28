l.js
----

受[l.js](https://github.com/malko/l.js)启发。

特性
====

- 压缩后不足1k
- 只支持现代浏览器
- 并发加载
- 异步加载js和css
- 按依赖顺序加载

示例
====

HTML结构：

```
<html>
<head>
    <script src="path/to/l.js" data-asset-list="path/to/asset/list"></script>
</head>
<body>
</body>
</html>
```

l.js会读取当前script标签的dataset属性，并提取assetList属性值作为相对路径，
加载依赖的js和css。

asset-list.json结构：

```
[
    ['a.js', 'b.js', 'c.css'],  // 子数组内资源并发加载
    'd.js',                     // 非数组资源按先后顺序加载
    'e.css',
    'app.js'
]
```

上例中，l.js会并发加载a.js、b.js和c.css，然后依次加载d.js、e.css和app.js。

约定
====
为方便开发，l.js对js文件的总入口做了如下预定：

    入口js需要定义全局变量App，并定义其init方法，无参数。
