function HtmlC(htm) {
    this.children = [];
    if (htm instanceof Text) {
        this.elem = "html-text";
        this.value = htm.data;
    } else if (htm instanceof Comment) {
        this.elem = "html-note";
        this.value = htm.data;
    } else if (htm instanceof HTMLElement) {
        //-> 属性
        this.elem = "html-elem";
        this.value = htm.tagName.toLocaleLowerCase();
        this.attr = [];
        var arr = htm.attributes;
        for (var i = 0, t; t = arr[i]; i++) {
            //-> 也可以 直接 存入 t 但不推荐
            this.attr.push({ key: t.name, value: t.value });
        }
        if (["input", "meta", "link", "br", "img"].indexOf(this.value) != -1) {
            this.elem = "html-elem-one";
            return;
        }

        //-> 循环 遍历
        var ch = htm.childNodes;
        for (var i = 0, t; t = ch[i]; i++) {
            this.children.push(new HtmlC(t));
        }
    }
}

Frost.rain.add("f-code-html", {
    binding: false,
    initTarget: function (snowflake, elem) {
        var div = document.createElement("div");
        div.classList.add("code-style")
        div.innerHTML ='<code><span f-for="{key:code-html}"><span f-elem="${elem}"></span></span></code>';
        elem.appendChild(div);
    },
    execute: function (snowflake, value) {
        if (futil.is.ava(value)) {
            snowflake.code.splice(0, snowflake.code.length);
            return;
        }
        //-> 对数据进行处理
        var html, thv;
        if (value instanceof HTMLElement) {
            html = [value];
        } else if (typeof (value) == "string") {
            //-> 是否能从模板中取道数据
            if (value.length < 46) {
                thv = Frost.temp["Temp-" + value];
                if (thv) {
                    thv = thv.cloneNode(true);
                }
            }
            if (!thv) {
                thv = document.createElement("div");
                thv.innerHTML = value;
            }
            html = [];
            for (var i = 0, t; t = thv.childNodes[i]; i++) {
                html.push(t);
            }
        }
        var xrhtml = [];
        for (var i = 0, t; t = html[i]; i++) {
            xrhtml.push(new HtmlC(t));
        }
        //-> 数据双向绑定 
        var codetml = {
            "code-html": xrhtml
        }
        var htmlss = new Ssangyong("html");
        snowflake.code = xrhtml;
        Twining(codetml["code-html"], "html", Ssangyong.getSsangyong("code-html", htmlss), "html", codetml, false, snowflake.$frost);
        var recu = snowflake.$frost.$recursive;
        recu.recursiveParamElem([codetml], [htmlss], snowflake.target);
        recu.recursiveNext = false;
    }
});

Frost.rain.add("f-code-javascript", {
    //-> 不需要映射
    binding: false,
    initTarget: function (snowflake, elem) {
        if (snowflake.value.value == "text") {
            snowflake.codeValue = elem.innerText;
            elem.innerText = "";
            snowflake.name = "";
        }
        var div = document.createElement("div");
        div.classList.add("code-style")
        div.innerHTML ='<code><span f-for="{key:javascript_code}" ><span f-elem="${type}"></span></span></code>';
        elem.appendChild(div);
    },
    initAttr: function (snowflake) {
        var is = futil.is,
            v, c;
        v = snowflake.value;
        c = snowflake.COdeParam = {
            tokens: true,
            comment: true,
            loc: true
        };
        if (!is.ava(v.comment)) {
            c.comment = v.comment;
        }
    },
    execute: function (snowflake, value) {
        if (snowflake.codeValue) {
            value = snowflake.codeValue
        }
        if (snowflake.value.value == "exit") {
            return;
        }
        if (futil.is.ava(value)) {
            snowflake.code.splice(0, snowflake.code.length);
            return;
        }
        //-> 判值 是否等于 string 不等于则采用 toString 方式获取
        var v;
        if (typeof (value) != "string") {
            if (futil.is.func(value)) {
                v = value.toString();
            } else {
                console.warn("无法解析脚本");
                return;
            }
        } else {
            v = value;
        }
        //-> 执行
        var arr = esprima.tokenize(v, snowflake.COdeParam);
        var codeBr = [];
        var up = arr[0];
        codeBr.push(up);
        for (var i = 1, t; t = arr[i]; i++) {
            if (up.loc.start.line != t.loc.start.line) {
                codeBr.push({
                    type: "code-br",
                });
                if (t.type == "LineComment") {
                    t.empty = new Array(t.loc.start.column).join(" ");
                } else {
                    t.value = new Array(t.loc.start.column).join(" ") + t.value;
                }

            }
            up = t;
            codeBr.push(t);
        }
        // codeBr 
        var js = {
            "javascript_code": codeBr
        }
        snowflake.code = codeBr;
        var jsss = new Ssangyong("js");
        Twining(js.javascript_code, "js", Ssangyong.getSsangyong("javascript_code", jsss), "js", js, false, snowflake.$frost);
        var recu = snowflake.$frost.$recursive;
        recu.recursiveParamElem([js], [jsss], snowflake.target);
        recu.recursiveNext = false;
    }
});
window.addEventListener('hashchange', function () {
    var sh = window.location.hash;
    if (sh == "#frost" || sh == "#attr") {
        ft.view.type = sh.substr(1);
    } else if (sh) {
        
    }
}, false);
function getAjax() {
    return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
}
var ajax = getAjax();
var ft;
ajax.addEventListener("loadend", function (eve) {
    var response = JSON.parse(ajax.responseText);
    console.time("vime")
    ft = new Frost(document.body, {
        data: response,
        name: "$junjie"
    });
    //-> 给定
    var v = window.location.hash;
    window.location.hash="";
    window.location.hash= v;
    console.timeEnd("vime");
});
ajax.open("GET", "../data/data.json");
Frost.linkTemp(["../data/code.temp", "../data/attr.temp"], function () {
    ajax.send(null);
});