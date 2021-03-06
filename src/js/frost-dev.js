/**
 * 霜降-->>>
 * 初始版本 v: 1.0.2
 * 模块开发 表单完善,ajax 完善
 */
(function (wind, document) {
    "use strict";
    //-> 事件委托
    var cssEn = "*[eve-click],*[eve-dblclick],*[eve-focus] {cursor: pointer;}";
    /**
     * 属性调度中心
     */
    function Rain(param) {
        //-> 属性key
        this.snowflakeKeyValue = {};
        if (param) {
            for (var key in param) {
                this.add(key, param[key]);
            }
        }
    }
    Rain.prototype = {
        /**
         * 属性添加 
         * @param {*} key 
         * @param {*} dealWith {
         *  
         * }
         */
        add: function (key, dealWith, repeat) {
            if (!key || typeof (key) != "string" || key.length > 64) {
                throw "键值长度超出范围";
            }
            var isAdd = this.snowflakeKeyValue[key];
            //-> 意味着重复
            if (isAdd && repeat !== true) {
                throw "该属性已经添加过了,请勿重复添";
            }
            this.snowflakeKeyValue[key] = dealWith;
        },
        get: function (key) {
            return this.snowflakeKeyValue[key];
        },
        /**
         * 属性处理调度中心
         */
        attributeProcessing: function ($frost, attrs, elem, params, ssangyongs) {
            //-> document-fragment 没有这玩意
            if (!attrs) {
                return;
            }
            var dealWith;
            for (var i = 0, t; t = attrs[i]; i++) {
                dealWith = this.get(t.name);
                if (!dealWith) {
                    continue;
                }
                //-> 处理
                var snowflake = new Snowflake(dealWith, elem, params, ssangyongs, $frost);
                //-> 初始化基本数据
                snowflake.init(t);
                //-> 处理目标元素
                snowflake.initTarget(elem);
                //-> true 意味着不处理属性
                if (snowflake.initAttr(t, params) !== true) {
                    //-> 将当前属性移除掉
                    attrs.removeNamedItem(t.name);
                    //-> 移除后 下标不变
                    i--;
                }
                //-> 处理完毕时 给定值
                snowflake.execute(data.getValue(snowflake.name, params), snowflake.key, undefined);
                //-> 绑定 映射
                if (snowflake.dealWith.binding !== false) {
                    //-> 需要进行数据映射
                    var dad = data.getSsangyong(snowflake.name, snowflake.ssangyongs);
                    if (dad) {
                        dad.$appendSnowflaks(snowflake);
                    } else {
                        //-> 新增 
                        if (dad instanceof Array) {
                            throw "数组未找到 __sd__ 环境";
                        } else {
                            //-> 添加这个 key 暂时
                            var vp = data.getValuePosition(snowflake.name, snowflake.params);
                            if (vp) {
                                Object.defineProperty(vp, snowflake.key, new GetSet(null, snowflake.key, vp, snowflake.name, sgNew, $frost));
                                //-> 获取父级
                                var sgdata = data.getSsangyongPosition(snowflake.name, snowflake.ssangyongs);
                                if (sgdata) {
                                    var sgNew = new Ssangyong(snowflake.key);
                                    Object.defineProperty(sgdata, snowflake.key, sgNew);
                                    sgNew.$appendSnowflaks(snowflake);
                                } else {
                                    console.warn("找不到 [" + snowflake.name + "] ", snowflake);
                                }
                            } else {
                                //   console.warn("找不到 [" + snowflake.name + "] ", snowflake.target);
                            }
                        }
                    }
                }
                snowflake = null;
            }
        }
    }
    /**
     * 模板渲染
     */
    function Template() { }

    Template.prototype = {
        /**
         * 初始化模板信息
         */
        init: function () {
            if (temp.loaded) {
                return;
            }
            temp.loaded = true;
            temp.initTemplate();
        },
        //-> 不要直接调用
        set: function (key) {
            var df = document.createDocumentFragment();
            for (var i = 1, t; t = arguments[i]; i++) {
                if (t instanceof HTMLCollection) {
                    for (var z = 0, v; v = t[z]; z++) {
                        df.appendChild(v);
                    }
                } else if (t instanceof Element) {
                    df.appendChild(t);
                }
            }
            this["Temp-".concat(key)] = df;
        },
        //-> 获取模板   返回的是 模板的副本
        get: function (key) {
            var te = this["Temp-".concat(key)];
            if (is.ava(te)) {
                throw new Error("没有找到这样的模板[" + key + "]");
            }
            return te.cloneNode(true);
        },
        /**
         * 添加模板信息
         * @param {*} key 模板名称
         * @param {*} elem 模板值
         */
        add: function (key, elem) {
            if (elem instanceof HTMLTemplateElement) {
                this.addTemplate(key, elem);
            } else if (elem instanceof Element) {
                this.set(key, elem);
            } else if (typeof (elem) == "string") {
                var z = document.createElement("template");
                z.innerHTML = elem;
                this.add(key, z);
            }
        },
        /**
         * 添加一个模板 
         * @param {*} key 
         * @param {*} temp 
         */
        addTemplate: function (key, temp) {
            this["Temp-".concat(key)] = temp.content || temp;
        },
        //-> 加载所有的 template
        initTemplate: function (elem) {
            var ts = (elem || document).querySelectorAll("template[f-temp]"),
                key;
            for (var i = 0, t; t = ts[i]; i++) {
                key = t.getAttribute("f-temp");
                if (key) {
                    t.removeAttribute("f-temp");
                    this.addTemplate(key, t);
                    util.elem.remove(t);
                }
            }
        }
    }
    /**
     * 属性中心
     */
    function ElemAttributes() { }
    ElemAttributes.prototype = {
        add: function (key, value) {
            if (!key || !value) {
                throw "属性键值对不可用";
            }
            if (value instanceof Array) {
                this[key] = clone.array(value);
            } else {
                this[key] = clone.object(value);
            }
        },
        get: function (key) {
            var value = this[key];
            if (!value) {
                throw "没有这样的属性信息 [" + key + "]";
            }
            return value;
        }
    }

    /**
     * 值改变处理中心
     * @param {*} paramEvent 
     */
    function ChangeValue(paramEvent) {
        //-> 添加事件
        this.funcEvent = new GetObject();
        //-> 执行之后
        this.after = new GetObject();
        if (paramEvent) {
            for (var key in paramEvent) {
                this.addEvent(key, paramEvent[key]);
            }
        }
    }
    ChangeValue.prototype = {
        //-> 处理冒泡
        bubble: function (key) {
            var vs = this.funcEvent.getArray(key);
            if (!vs || vs.length === 0) {
                return;
            }
            
            if(this.after.get(key)){
                var ar = arguments;
                setTimeout(function(){
                    for (var i = 0, t; t = vs[i]; i++) {
                        if (t.apply(t, ar)) {
                            //-> 不改变
                            return true;
                        };
                    }
                },1);
            }else{
                for (var i = 0, t; t = vs[i]; i++) {
                    if (t.apply(t, arguments)) {
                        //-> 不改变
                        return true;
                    };
                }
            }
        },
        //-> 添加冒泡事件
        addEvent: function (key, func,ba) {
            if (is.func(func)) {
                //-> 添加事件
                this.funcEvent.append(key, func);
                if(ba === true){
                    this.after.set(key,true);
                }
            }
        },
        //-> 移除事件
        removeEvent: function () {
            this.funcEvent.remove.apply(this.funcEvent, arguments);
        }
    }
    //-> 
    var __binding__ = {
        get: function () {
            return true;
        },
        set: NullFunc,
    }

    function GetSetChildren() { }
    GetSetChildren.prototype = {
        $appendGetSetChildren: function (key, getset) {
            return this[key] = getset;
        },
    }


    /**
     * 捆绑
     * @param {*} value 
     * @param {*} name 
     * @param {*} ssangyong 
     * @param {*} path 
     * @param {*} parent 
     * @param {*} isParentArray 
     */
    function Twining(value, name, ssangyong, path, parent, isParentArray, $frost) {
        var isArr = value instanceof Array;
        var sg, tempValue;
        var getsets = null;
        Object.defineProperty(value, "__binding__", __binding__);
        if (isParentArray) {
            path = path.concat("[]");
            if (isArr) {
                //-> 我是数组 并且 我父级也是
                value.__proto__ = new SnowCoverArray(value, name, path, parent, ssangyong, $frost);
                //-> 都是数组
                for (var i = 0, t; t = value[i]; i++) {
                    sg = Ssangyong.getSsangyong(i, ssangyong);
                    if (!is.basic(t)) {
                        if (!is.basic(t)) {
                            Twining(t, i, sg, path, value, true, $frost);
                        }
                    }
                }
            } else {
                getsets = new GetSetChildren();
                //-> 自己不是数组 但是父级是 
                for (var key in value) {
                    if (!value.hasOwnProperty(key)) {
                        continue;
                    }
                    //-> 只有是对象才处理
                    tempValue = value[key];
                    sg = Ssangyong.getSsangyong(key, ssangyong);
                    Object.defineProperty(value, key, getsets.$appendGetSetChildren(key, new GetSet(tempValue, key, value, path.concat(".", key), sg, $frost)));
                    if (!is.basic(tempValue)) {
                        Twining(tempValue, key, sg, path.concat(".", key), value, false, $frost);
                    }
                }
            }
        } else {
            //-> 父级是对象
            if (isArr) {
                //->我是数组 但是父级不是
                value.__proto__ = new SnowCoverArray(value, name, path, parent, ssangyong, $frost);
                for (var i = 0, t; t = value[i]; i++) {
                    sg = Ssangyong.getSsangyong(i, ssangyong);
                    if (!is.basic(t)) {
                        Twining(t, i, sg, path, value, true, $frost);
                    }
                }
            } else {
                // path = path.concat(name);
                getsets = new GetSetChildren();
                //-> 我是对象
                for (var key in value) {
                    if (!value.hasOwnProperty(key)) {
                        continue;
                    }
                    tempValue = value[key];
                    sg = Ssangyong.getSsangyong(key, ssangyong);
                    Object.defineProperty(value, key, getsets.$appendGetSetChildren(key, new GetSet(tempValue, key, value, path.concat(".", key), sg, $frost)));
                    if (!is.basic(tempValue)) {
                        Twining(tempValue, key, sg, path.concat(".", key), value, isArr, $frost);
                    }
                }
            }
        }
        if (getsets) {

            Object.defineProperty(value, "__getset__", new $__getset__(getsets));
        }
    }

    function $__getset__(value) {
        this.get = function () {
            return value;
        }
        this.set = NullFunc;
    }

    /**
     * 移除对象
     * @param {*} ssyong 
     * @param {*} value 之前的值 需要移除
     */
    function Drift(ssyong, value) {
        if (value instanceof Array) {
            //-> 如果相等则 释放自己已经绑定的对 然后自己新增
            if (ssyong == value.ssangyong) {
                value.remove();
                value.ssangyong = null;
            } else {
                //-> 当前对象移除后 由于是数组 我们需要 挨个判断 目标元素是否
                //-> 需要移除没用的元素
                arr.remove(value.ssangyong.__proto__.snowflaks, ssyong.__proto__.snowflaks);
            }
            return;
        }
        var getset, sg, val;
        for (var key in ssyong) {
            if (ssyong.hasOwnProperty(key)) {
                getset = value.__getset__[key];
                if (getset instanceof GetSet) {
                    arr.remove(getset.ssangyongs, sg = ssyong[key]);
                    if (!is.basic((val = value[key]))) {
                        Drift(sg, val);
                    }
                }
            }
        }
    }
    /**
     * 绑定对象
     * @param {*} ssyong 
     * @param {*} newValue 
     */
    function RelationSsangyong(ssyong, newValue) {
        if (newValue instanceof Array) {
            if (newValue.ssangyong == null) {
                newValue.ssangyong = ssyong;
            }
            //-> 新的对象等于数组 那么新数组对象 的 ssangyong 需要重新定义 
            arr.concat(newValue.ssangyong.__proto__.snowflaks, ssyong.__proto__.snowflaks);
            newValue.updateValue();
            return;
        }
        var getset, sg, val;
        for (var key in ssyong) {
            if (ssyong.hasOwnProperty(key)) {
                getset = newValue.__getset__[key];
                if (getset instanceof GetSet) {
                    getset.ssangyongs.push(sg = ssyong[key]);
                    if (!is.basic((val = newValue[key]))) {
                        RelationSsangyong(sg, val);
                    }
                }
            }
        }
    }

    /**
     * 双龙
     * @param {*} name 
     */
    function Ssangyong(name) {
        this.__proto__ = new SsangyongData(this, name);
    }

    Ssangyong.getSsangyong = function (name, parentSs) {
        var sg = parentSs[name];
        if (!(sg instanceof SsangyongData)) {
            sg = new Ssangyong(name);
            Object.defineProperty(parentSs, name, sg);
        }
        return sg;
    }

    function SsangyongData(value, name) {
        this.value = value;
        this.snowflaks = [];
        this.name = name;
    }

    SsangyongData.prototype = {
        updateView: function (value, beforeValue) {
            for (var i = 0, t; t = this.snowflaks[i]; i++) {
                t.execute(value, this.name, beforeValue);
            }
            if (value instanceof Array || !beforeValue) {
                //-> 数组在这里处理
                return;
            }
            //-> 避免用户调用  失败
            if (typeof (value) == "object") {
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        this[key].updateView(value[key], beforeValue[key]);
                    }
                }
            }
        },
        $appendSnowflaks: function (snowflak) {
            this.snowflaks.push(snowflak);
        },
        enumerable: true,
    }


    function GetSet(value, name, parent, path, ssyong, $frost) {
        this.ssangyongs = [ssyong];
        var _this = this;
        this.get = function () {
            return value;
        }
        this.set = function (newValue) {
            if ($frost.$changeValue.bubble(path.substr(5), newValue, parent, value, name) === true) {
                //-> 不改变
                return;
            };
            //-> 避免上次关闭后出现 无法刷新的尴尬
            var before = value;
            if (!is.basic(value)) {
                //-> 改变 主要是 孩子改变 自己到没什么 
                /**
                 * 对象 
                 * value
                 * {
                 *  data:..
                 * }
                 * value == {} 而不是 value = data:...
                 * 所以我们只管处理二级对象
                 * 我们需要判断 给的对象是否绑定过 没有则做没有的处理
                 */
                if (newValue.__binding__) {
                    //-> 已绑定
                    RelationSsangyong(ssyong, newValue);
                    //-> 给newValue 的 get set 添加数据 
                } else {
                    //-> 没有绑定 没有绑定 嘿嘿
                    Twining(newValue, name, ssyong, path, parent, parent instanceof Array, $frost);
                }
                Drift(ssyong, value);
            }
            value = newValue;
            _this.view(newValue, before);
            $frost.$recursive.recursiveNext = true;
        }.bind(this);
    }
    GetSet.prototype = {
        view: function (value, beforeValue) {
            for (var i = 0, t; t = this.ssangyongs[i]; i++) {
                t.updateView(value, beforeValue);
            }
        }
    }
    /**
     * 雪花 , 处理每一个属性
     * @param {String} name 属性名称
     * @param {Object} dealWith 处理{
     *  initAttr:function //-> 初始化之前
     *  initTarget:function //-> 处理目标元素
     *  execute:function //-> 执行时
     *  binding: true 默认绑定 映射,
     * }
     *  //-> 该对象是单一的 
     */
    function Snowflake(dealWith, elem, params, ssangyongs, $frost) {
        //-> 操作目标对象
        this.target;
        //-> 用户自定义的操作对象信息
        this.dealWith = dealWith;
        //-> 属性值
        this.value;
        //-> 目标路径
        this.name;
        //-> 最后的目标值
        this.key;
        this.ssangyongs = ssangyongs;
        //-> 参数信息
        this.params = params;
        this.$frost = $frost;
    }
    Snowflake.prototype = {
        /**
         * 初始化属性 值,吧值解析为 JavaScript 对象3
         * @param {*} attr 
         */
        init: function (attr) {
            var v = attr.value[0];
            if (v == "{" || v == "[") {
                //-> 解析
                this.value = data.valueAnalysis(attr.value);
                if (this.value.attr) {
                    this.value = attrKV.get(this.value.attr);
                }
                this.name = this.value.key;
            } else {
                this.name = this.value = attr.value;
            }
            //-> 获取最后的目标值
            if (this.name) {
                v = this.name[0];
                if (v != "{" && v != "[") {
                    this.key = data.lastKey(this.name);
                }
            }
        },
        /**
         * 初始化 target
         */
        initTarget: function (elem) {
            //-> 调用 自定义的处理事件
            if (is.func(this.dealWith.initTarget)) {
                this.dealWith.initTarget(this, elem);
            }
            //-> 如果没有目标对象 则默认等于 当前元素
            if (!this.target) {
                this.target = elem;
            }
        },
        /**
         * 初始化属性信息 
         */
        initAttr: function (attr, params) {
            if (is.func(this.dealWith.initAttr)) {
                return this.dealWith.initAttr(this, this.value, params, attr);
            }
        },
        /**
         * 初始化执行信息  当值改变时 触发
         * value : 更改后的值
         */
        execute: function (value, name, beforeValue) {
            //-> 值改变时
            this.dealWith.execute(this, value, name, beforeValue);
        }
    }
    /**
     * 递归处理
     */
    function RecursiveElem($frost, params, ssangyongs) {
        //-> 是否停止
        this.recursiveNext = true;
        this.recursive = function (node) {
            //-> 处理属性  
            rain.attributeProcessing($frost, node.attributes, node, params, ssangyongs);
            //-> 子元素处理
            if (this.recursiveNext) {
                var len = node.children.length;
                for (var i = 0, t; t = node.children[i];) {
                    this.recursive(t);
                    if (len == node.children.length) {
                        i++;
                    } else {
                        len = node.children.length;
                    }
                }
            }
            this.recursiveNext = true;
        }
        this.recursiveParamElem = function (params, ssangyongs, node) {
            //-> 处理属性
            rain.attributeProcessing($frost, node.attributes, node, params, ssangyongs);
            //-> 子元素处理
            if (this.recursiveNext) {
                var len = node.children.length;
                for (var i = 0, t; t = node.children[i];) {
                    this.recursiveParamElem(params, ssangyongs, t);
                    if (len == node.children.length) {
                        i++;
                    } else {
                        len = node.children.length;
                    }
                }
            }
            this.recursiveNext = true;
        }
    }

    function addDefineProperty(obj, name, param) {
        return Object.defineProperty(obj, name, param);
    }
    /**
     * 霜降
     */
    function Frost(elem, param) {
        //-> 初始化模板信息
        temp.init();
        //-> 获取目标html
        elem = util.elem.query(elem);
        if (is.ava(elem)) {
            throw "目标对象不可用[" + elem + "]";
        }
        //-> 给定值改变事件
        addDefineProperty(this, "$changeValue", { value: new ChangeValue(param.change) });
        //-> 是否有冒泡事件处理
        addDefineProperty(this, "$entrust", { value: new Entrust(elem, param.entrust || {}) });
        //-> 双龙
        addDefineProperty(this, "$ssangyong", { value: new Ssangyong("data") });
        //-> 参数处理
        Twining(param.data, "data", this.$ssangyong, "data", param, false, this);
        addDefineProperty(this, "$recursive", { value: new RecursiveElem(this, [param.data], [this.$ssangyong]) });
        //->设置 name 
        addDefineProperty(this, "$name", { value: param.name });
        //-> 开始处理 渲染对象
        this.$recursive.recursive(elem);
        this.__proto__ = param.data;
    }

    /**
     * 
     * @param {*} arr 数据对象
     * @param {*} name 自己的名称
     * @param {*} path 访问路径
     * @param {*} parent 父级
     * @param {*} ssangyong  自己的双龙
     * @param {*} $frost  霜对象
     */
    function SnowCoverArray(arr, name, path, parent, ssangyong, $frost) {
        //-> 这里需要处理 如果数组使用了 f-for ,那么需要标记每一个 elem 对应的下标数据
        //-> 如果删除了数据  其他的 elem 也会受影响 需要把他们的下标更新 
        //-> 使用下标 而不是对象 因为使用对象 对象可能是同一个对象 多次添加 而下标是唯一的
        //-> 避免当前的 this 和 孩子相等
        var _this = this;
        //-> 是否更新
        var updateElem = true;
        Object.defineProperty(this, "path", {
            value: path
        });
        Object.defineProperty(this, "ssangyong", {
            value: ssangyong,
            writable: true,
        });
        //-> 设置数组length
        Ssangyong.getSsangyong("length", ssangyong);
        ssangyong.length.updateView(arr.length, undefined);
        //-> 更新映射的值
        Object.defineProperty(this, "updateValue", {
            value: function () {
                var vals;
                // for (var key in ssangyong) {
                //     if (ssangyong.hasOwnProperty(key)) {
                //         vals = ssangyong[key];
                //         if (!is.num(key)) {
                //             vals.updateView(this[Number(key)], undefined);
                //         }
                //     }
                // }
                ssangyong.length.updateView(this.length, undefined);
            }
        });
        /**
         * 删除并返回数组的最后一个元素
         */
        Object.defineProperty(this, "pop", {
            value: function () {
                var e, d;
                for (var i = 0, t; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    if ((e = t.childrens.pop().elem) && (e.parentElement || e.parentNode)) {
                        util.elem.remove(e);
                    }
                    if (updateElem) {
                        d = t.dealWith;
                        d.addHtml(t, d.filter(t, t.childrens));
                    }
                }
                var v = _this.__proto__.pop.apply(this, arguments);
                this.updateValue();
                return v;
            }
        });
        /**
         * 删除并返回数组的第一个元素
         */
        Object.defineProperty(this, "shift", {
            value: function () {
                var e, d;
                for (var i = 0, t; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    if ((e = t.childrens.shift().elem) && (e.parentElement || e.parentNode)) {
                        util.elem.remove(e);
                    }
                    if (updateElem) {
                        d = t.dealWith;
                        d.addHtml(t, d.filter(t, t.childrens));
                    }
                }
                var v = _this.__proto__.shift.apply(this, arguments);
                this.updateValue();
                return v;
            }
        });
        /**
         * 排序
         */
        Object.defineProperty(this, "sort", {
            value: function () {
                //-> 先进行 目标排序 排序后我们在进行映射排序
                var sign = [];
                var len = this.length;
                for (var i = 0; i < len; i++) {
                    //-> 标记
                    sign.push({
                        index: i,
                        value: this[i]
                    })
                }
                _this.__proto__.sort.apply(this, arguments);
                for (var i = 0, t; t = this[i]; i++) {
                    //-> 循环标记 然后更新标记的位置
                    for (var j = 0, v; v = sign[j]; j++) {
                        if (v.value == t) {
                            //-> 如果已经有 只能说明对象重复的
                            if (!(v.newIndex !== undefined)) {
                                v.newIndex = i;
                                break;
                            }
                        }
                    }
                }
                var newPost, arfunc;
                for (var i = 0, t; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    newPost = new Array(sign.length);
                    for (var j = 0, v; v = sign[j]; j++) {
                        //-> 目标对象 
                        newPost[valueAnalysis.newIndex] = v.childrens[v.index];
                    }
                    //-> 刷新位置
                    t.childrens = newPost;
                    arfunc = t.dealWith;
                    arfunc.addHtml(t, arfunc.filter(t, newPost));
                }
                this.updateValue();
                return this;
            }
        });
        /**
         * 向数组的末尾添加一个或更多元素，并返回新的长度。
         */
        Object.defineProperty(this, "push", {
            value: function () {
                //-> 获取添加之前的长度
                var len = this.length;
                //-> 添加之后的长度
                var l = _this.__proto__.push.apply(this, arguments);
                var t, target, recu, current, childrens, dealWith;
                for (var i = 0; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    childrens = t.childrens;
                    dealWith = t.dealWith;
                    recu = t.$frost.$recursive;
                    //-> 这里会牵涉到从新渲染,好在是追加
                    for (var j = 0, v; v = arguments[j]; j++) {
                        target = t.target.cloneNode(true);
                        current = dealWith.attrForin(t, target, len + j, v, this, recu);
                        childrens.push({
                            "elem": target,
                            "current": current
                        });
                    }
                    dealWith.addHtml(t, dealWith.filter(t, childrens));
                }
                //-> 循环 然后添加
                this.updateValue();
                return l;
            }
        });
        /**
         * 向数组的开头添加一个或更多元素，并返回新的长度。
         * 由于向前添加 会导致之前的数据 需要更新  尤其是下标  和 过滤条件
         */
        Object.defineProperty(this, "unshift", {
            value: function () {
                //-> 添加之后的长度
                var l = _this.__proto__.unshift.apply(this, arguments);
                var t, target, recu, current, childrens, dealWith;
                for (var i = 0; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    childrens = t.childrens;
                    dealWith = t.dealWith;
                    recu = t.$frost.$recursive;
                    //-> 这里会牵涉到从新渲染,是向前插入
                    for (var j = 0, v; v = arguments[j]; j++) {
                        target = t.target.cloneNode(true);
                        current = dealWith.attrForin(t, target, j, v, this, recu);
                        childrens.unshift({
                            "elem": target,
                            "current": current
                        });
                    }
                    dealWith.addHtml(t, dealWith.filter(t, childrens));
                }
                //-> 循环 然后添加
                this.updateValue();
                return l;
            }
        });
        /**
         * 颠倒数组中元素的顺序。
         */
        Object.defineProperty(this, "reverse", {
            value: function () {
                var arfunc;
                for (var i = 0, t; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    t.childrens.reverse();
                    arfunc = t.dealWith;
                    arfunc.addHtml(t, arfunc.filter(t, t.childrens));
                }
                //-> 颠倒  
                _this.__proto__.reverse.apply(this, arguments);
                this.updateValue();
                return this;
            }
        });
        /**
         * 设置值 跳双向绑定
         */
        Object.defineProperty(this, "setValue", {
            value: function (value, index) {
                arr[Number(index)] = value;
            }
        });

        Object.defineProperty(this, "item", {
            value: function (index) {
                if (arguments.length == 1) {
                    return this[Number(index)];
                } else if (arguments.length = 2) {
                    if ($frost.$changeValue.bubble(path, arguments[1], parent, value, name) === true) {
                        //-> 不改变
                        return this[Number(index)];
                    }
                    var value = this[index];
                    var newValue = arguments[1];
                    if (is.basic(value)) {
                        ssangyong[index].updateView(newValue, undefined);
                    } else {
                        // if (!is.basic(newValue)) {
                        //     $frost.getSnowDrift(newValue, "", "", true);
                        // }
                        this.splice(index, 1, newValue);
                    }
                    return this[Number(index)];
                }
            }
        });
        /**
         * 移除所有,会吧所有的数据清空  是从内存中清空
         */
        Object.defineProperty(this, "remove", {
            value: function () {
                for (var i = 0, j, t, z, d, v; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    //-> 移除所有
                    z = t.childrens;
                    for (j = 0; v = z[j]; j++) {
                        d = (v.elem.parentElement || v.elem.parentNode);
                        if (d) {
                            d.removeChild(v.elem);
                        }
                    }
                    t.childrens = []
                }
                this.splice(0,this.length);
                //this.length = 0;
                //   ssangyong.length.updateView(arr.length, undefined);
            }
        });
        /**
         * 剪接 
         */
        Object.defineProperty(this, "splice", {
            value: function (index, num) {
                //-> 获取删除的数据
                var det = _this.__proto__.splice.apply(this, arguments);
                //-> 获取添加的数据
                var t, target, recu, current, childrens, dealWith, addElemData, delElem, j, v;
                for (var i = 0; t = ssangyong.__proto__.snowflaks[i]; i++) {
                    addElemData = [];
                    childrens = t.childrens;
                    dealWith = t.dealWith;
                    recu = t.$frost.$recursive;
                    addElemData.push(index);
                    addElemData.push(num);
                    //-> 这里会牵涉到从新渲染,好在是追加
                    for (j = 2, v; v = arguments[j]; j++) {
                        target = t.target.cloneNode(true);
                        current = dealWith.attrForin(t, target, (index + j - 2), v, this, recu);
                        addElemData.push({
                            "elem": target,
                            "current": current
                        });
                    }
                    delElem = childrens.splice.apply(childrens, addElemData);
                    var elem, pa;
                    for (var keyDel in delElem) {
                        elem = delElem[keyDel].elem;
                        pa = elem.parentElement || elem.parentNode;
                        if (pa) {
                            pa.removeChild(elem);
                        }
                    }
                    dealWith.addHtml(t, dealWith.filter(t, childrens));
                }
                this.updateValue();
                return det;
            }
        });
    }
    SnowCoverArray.prototype = Array.prototype;
    window.SnowCoverArray = SnowCoverArray;
    window.Ssangyong = Ssangyong;
    window.Twining = Twining;
    window.GetSetChildren=GetSetChildren;

    window.GetSet = GetSet;


    /**
     * 获取一个错误的提示
     * @param {String} mes 
     * @param {Number} code 
     */
    var er = function (mes, code) {
        return {
            "message": mes,
            "code": code
        };
    }

    var arr = {
        //-> 只会查询 一个
        seek: function (arr, key, val) {
            if (arguments.length == 2 && is.func(key)) {
                for (var i = 0, t; t = arr[i]; i++) {
                    if (key(t, i, arr)) {
                        return t;
                    };
                }
            } else if (util.is.arg(arguments, 3)) {
                for (var i = 0, t; t = arr[i]; i++) {
                    if (t[key] == val) {
                        return t;
                    }
                }
            }
        },
        //-> 赋值
        set: function (array, key, obj) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i][key] == obj[key]) {
                    if (array.item) {
                        array.item(i, obj);
                    } else {
                        array[i] = obj;
                    }
                }
            }
        },
        remove: function (array) {
            if (arguments.length == 2) {
                if (arguments[1] instanceof Array) {
                    var a = [array];
                    a.push.apply(a, arguments[1]);
                    return arr.remove.apply(arr, a);
                }
            }
            var remarr = [];
            var index;
            for (var i = 1, t; t = arguments[i]; i++) {
                if ((index = array.indexOf(t)) != -1) {
                    remarr.push(array.splice(index, 1)[0]);
                }
            }
            return remarr;
        },
        concat: function (source) {
            for (var i = 1, t; t = arguments[i]; i++) {
                if (t instanceof Array) {
                    return source.push.apply(source, t);
                }
            }
        },
        del: function (arr, key, val) {
            if (arguments.length == 2) {
                //-> 如果数字 则是下标删除
                if (typeof (key) == "number") {
                    arr.splice(key, 1);
                } else if (is.func(key)) {
                    var dels = [];
                    for (var i = 0, t; t = arr[i]; i++) {
                        if (key(t, i, arr)) {
                            dels.push.apply(dels, arr.splice(i, 1));
                            i--;
                        }
                    }
                    return dels;
                } else {
                    throw er("无法处理:参数[".concat(key, "]不是预期类型"), 403);
                }
            } else if (is.arg(arguments, 3)) {
                return util.arr.del(arr, function (t) {
                    return t[key] == val;
                });
            }
        },
        newlys: function (arr, key, val) {
            if (arguments.length == 2) {
                for (var i = 0, t; t = arr[i]; i++) {
                    key(t, i, arr);
                }
            } else if (util.is.arg(arguments, 3)) {
                for (var i = 0, t; t = arr[i]; i++) {
                    obj.newly(t, key, val);
                }
            }
            return arr;
        },
        assig: function (arr, kvs) {
            for (var i = 0, t; t = arr[i]; i++) {
                for (var k in kvs) {
                    t[k] = t[kvs[k]];
                }
            }
        },
        /**
         * array : 分组对象
         * ofId  : 分组主键
         * ofpid : 分组Id
         * chiName: 存放名称
         */
        level: function (array, ofId, ofpid, chiName) {
            var vs, jv, add, i = 0;
            var datas = [];
            while (i < array.length) {
                vs = array[i];
                i++;
                add = true;
                //-> 找父级或者 孩子
                for (var j in array) {
                    jv = array[j];
                    //-> 找父亲
                    if (vs[ofpid] == jv[ofId]) {
                        //-> 父级
                        if (jv[chiName] instanceof Array) {
                            jv[chiName].push(vs);
                        } else {
                            jv[chiName] = [vs];
                        }
                        //-> 孩子
                        add = false;
                        break;
                    }
                }
                if (add) {
                    datas.push(vs);
                }
            }
            return datas;
        },
        /* 同级下级 , 是用于 上下级数据融合在一起的 */
        subset:function(array, group, keys) {
            //-> 数据都在同级 需要分组
            var obj = GetObject();;
            for (var index = 0; index < array.length; index++) {
                obj.append(array[index][group], array[index]);
            }
            var arrK = obj.keys();
            var vs;
            var os;
            var values = [];
            for (var i = 0, t; t = arrK[i]; i++) {
                os = {};
                vs = obj.getArray(t);
                if (vs.length) {
                    os[group] = vs[0][group];
                    if (keys) {
                        if (keys instanceof Array) {
                            for (var j = 0, v; v = keys[j]; j++) {
                                os[v] = vs[0][v];
                            }
                        } else {
                            if (arguments.length >= 3) {
                                for (var j = 2, v; v = arguments[j]; j++) {
                                    os[v] = vs[0][v];
                                }
                            }
                        }
                    }
                    os.option = vs;
                }
                values.push(os);
            }
            return values;
        }
    };
    var is = {
        arg: function (ar, len, thr) {
            if (ar.length !== len) {
                if (thr !== false) {
                    throw {
                        message: "参数长度错误:期望".concat(len, "个参数,而给定了", ar.length, "个"),
                        code: 400
                    };
                }
            }
            return true;
        },
        //-> 是否可执行
        func: function (func) {
            return (func instanceof Function) || (typeof (func) == "function");
        },
        //-> obj 是否有孩子
        widow: function (obj) {
            return Object.keys(obj).length == 0;
        },
        /**
         * 是否是个数字, 注意 "" 和 null 不会被视为数字,
         * 实际判断 isNaN
         * @param {object} val 
         */
        num: function (val) {
            if (val === "") {
                return true;
            }
            if (val === null) {
                return true;
            }
            return isNaN(val);
        },
        str: function (str) {
            return typeof (str) === "string" || str instanceof String;
        },
        /**
         * 是否可用 主要判断 他是否为 未定义 和 null
         * @param {object} val 
         */
        ava: function (val) {
            return val === null || val === undefined;
        },
        //-> 给定值 是否可以循环
        basic: function (val) {
            var t = typeof (val);
            if (t !== null && t === "object") {
                //-> 判断是否为引用类型
                if (val instanceof Number || val instanceof String || val instanceof Date) {
                    return true;
                }
                //-> 未知 那么就是可循环的
                return val === null ? true : false;
            }
            //-> 不能循环的
            return true;
        },
    };
    var obj = {
        /**
         * 
         * @param {Object} obj 
         * @param {String} key 
         * @param {Object | Function} val 
         */
        newly: function (obj, key, val) {
            if (is.arg(arguments, 3)) {
                if (is.func(val)) {
                    obj[key] = val(obj);
                } else {
                    obj[key] = val;
                }
            }
            return obj;
        },
        newlyObj: function (obj1) {
            var vs;
            for (var index = 1; index < arguments.length; index++) {
                for (var key in (vs = arguments[index])) {
                    if (vs.hasOwnProperty(key)) {
                        obj1[key] = vs[key];
                    }
                }
            }
        },
        setValue: function (o, as, set) {
            for (var i = 0; i < as.length; i++) {
                o[as[i]] = set(as, o[as[i]], i);
            }
            return o;
        }
    };
    var val = {
        //-> 如果是 boolean 则转为 boolean 允许处理字符串 "true" | "false" 
        Bool: function (val) {
            if (val instanceof Boolean) {
                return val.valueOf();
            }
            if (typeof (val) == "boolean") {
                return val;
            }
            if (typeof (val) == "string") {
                if (val.length == 4 && val.toLocaleLowerCase() === "true") {
                    return true;
                } else if (val.length == 5 && val.toLocaleLowerCase() === "false") {
                    return false;
                }
            }
            return null;
        },
        //-> 如果是 数字 则返回 基本类型
        Num: function (val) {
            if (typeof (val) == "number") {
                return val;
            }
            if (val instanceof Number) {
                return val.valueOf();
            }
            return null;
        },
        //-> 如果值 可以转换为原生对象则 转换为原生对象  整数
        Int: function (val) {
            var v = util.val.Num(val);
            if (v === null) {
                if (typeof (val) == "string") {
                    var n = parseInt(val);
                    if (String(n) == val) {
                        return n;
                    }
                }
            } else {
                return v;
            }
            return null;
        },
        //-> 如果值 可以转换为原生对象则 转换为原生对象 浮点小数
        Flo: function (val) {
            var v = util.val.Num(val);
            if (v === null) {
                if (typeof (val) == "string") {
                    var n = parseFloat(val);
                    if (String(n) == val) {
                        return n;
                    }
                }
            } else {
                return v;
            }
            return null;
        },
        /**
         * 将对象转换为基本类型 , 只会处理 数字布尔值
         * @param {object} val 
         */
        of: function (val) {
            if (util.is.ava(val)) {
                return val;
            }
            var time;
            if ((time = util.val.Int(val)) === null) {
                if ((time = util.val.Flo(val)) === null) {
                    if ((time = util.val.Bool(val)) === null) {
                        return val;
                    }
                }
            }
            return time;
        },
        ofs: function (obj) {
            if (typeof (obj) !== "object") {
                return val.of(obj);
            }
            var vs;
            for (var key in obj) {
                vs = obj[key];
                if (vs instanceof Array) {
                    for (var i = 0, t; t = vs[i]; i++) {
                        vs[i] = val.ofs(t);
                    }
                } else {
                    vs = val.ofs(vs);
                }
                obj[key] = vs;
            }
            return obj;
        },
        between: function (val, min, max) {
            if (min > max) {
                var t = max;
                max = min;
                min = t;
            }
            val = Number(val);
            if (isNaN(val)) {
                //-> 
                return isNaN(min) || isNaN(max);
            }
            //-> 比较
            return val >= min && val <= max;
        }
    };

    var RegExp_dain = new RegExp("\\[", "g");
    var RegExp_kge = new RegExp("\\]", "g");

    var data = {
        /**
         * 值分析处理器 : 
         * ::}-> { key:value }  ==> { "key":"value" }  
         * @param {String} str 
         */
        valueAnalysis: function (str) {
            var att = new String(str);
            var crux = ",{}[]:/";
            var index = 1
            var strBuff = new Array();
            var end = att.length - 1;
            var qm = '"';
            strBuff.push(att[0]);
            if (crux.indexOf(att[1]) == -1) {
                strBuff.push(qm);
            }
            while (index < end) {
                if (att[index] == "/") {
                    index++;
                    strBuff.push(att[index++]);
                    if (",:]}".indexOf(att[index]) != -1) {
                        strBuff.push(qm);
                    }
                    continue;
                } else if (att[index] == '\`') {
                    //-> 跳过
                    index++;
                    var c;
                    while ((c = att[index++]) != '\`') {
                        strBuff.push(c);
                    }
                    continue;
                }

                if (crux.indexOf(att[index]) != -1) {
                    if (crux.indexOf(att[index - 1]) == -1) {
                        if (att[index - 1] != ' ') {
                            strBuff.push(qm);
                        }
                    }
                    strBuff.push(att[index]);
                    if (crux.indexOf(att[index + 1]) == -1) {
                        strBuff.push(qm);
                    }
                } else {
                    strBuff.push(att[index]);
                }
                index++;
            }
            if (crux.indexOf(att[index - 1]) == -1) {
                strBuff.push(qm);
            }
            strBuff.push(att[index]);
            return JSON.parse(strBuff.join(""));
        },
        lastKey: function (lastKey) {
            //-> 获取目标对象
            if (lastKey[lastKey.length - 1] == "]") {
                lastKey = lastKey.substring(lastKey.lastIndexOf("[") + 1, lastKey.length - 1);
            } else {
                //-> 最后开始裁减
                var zs = lastKey.lastIndexOf(".");
                if (zs != -1) {
                    lastKey = lastKey.substr(zs + 1);
                }
            }
            return lastKey;
        },
        getSsangyong: function (key, arrParam) {
            var dz = [];
            if (key.indexOf('.') == -1 && key.indexOf("[") == -1) {
                //-> 单级
                dz.push(key);
            } else {
                key = key.replace(RegExp_dain, ".");
                key = key.replace(RegExp_kge, "");
                //-> 多级
                dz.push.apply(dz, key.split("."));
            }
            //-> 寻址
            var index, len = dz.length;
            for (var i = 0, t; t = arrParam[i]; i++) {
                index = 0;
                while (t = t[dz[index++]]) {
                    if (index === len) {
                        if (t instanceof SsangyongData) {
                            return t;
                        } else {
                            break;
                        }
                    }
                }
            }
            return undefined;
        },
        getSsangyongPosition: function (key, arrParam) {
            var dz = [];
            if (key.indexOf('.') == -1 && key.indexOf("[") == -1) {
                //-> 单级
                dz.push(key);
            } else {
                key = key.replace(RegExp_dain, ".");
                key = key.replace(RegExp_kge, "");
                //-> 多级
                dz.push.apply(dz, key.split("."));
            }
            //-> 寻址
            var index, len = dz.length - 1;
            for (var i = 0, t; t = arrParam[i]; i++) {
                index = 0;
                if (len == 0) {
                    //-> 只有一个长度 
                    while (dz[index] in t) {
                        return t;
                    }
                } else {
                    while (t = t[dz[index++]]) {
                        if (index === len) {
                            if (t instanceof SsangyongData) {
                                return t;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            return undefined;
        },
        getValuePosition: function (key, arrParam) {
            var dz = [];
            if (key.indexOf('.') == -1 && key.indexOf("[") == -1) {
                //-> 单级
                dz.push(key);
            } else {
                key = key.replace(RegExp_dain, ".");
                key = key.replace(RegExp_kge, "");
                //-> 多级
                dz.push.apply(dz, key.split("."));
            }
            var index, len = dz.length - 1;
            //-> 寻址
            for (var i = 0, t; t = arrParam[i]; i++) {
                index = 0;
                //-> 长度 
                if (len == 0) {
                    //-> 只有一个长度 
                    while (dz[index] in t) {
                        return t;
                    }
                } else {
                    var parent = t;
                    for (var z = 0; z < len; z++) {
                        if (parent === undefined) {
                            return parent[dz[z - 1]];
                        }
                        parent = parent[dz[z]];
                    }
                    return parent;
                }

            }
            return undefined;
        },
        /**
         * 获取参数值
         */
        getValue: function getValue(key, arrParam) {
            var dz = [];
            if (key.indexOf('.') == -1 && key.indexOf("[") == -1) {
                //-> 单级
                dz.push(key);
            } else {
                key = key.replace(RegExp_dain, ".");
                key = key.replace(RegExp_kge, "");
                //-> 多级
                dz.push.apply(dz, key.split("."));
            }
            var index;
            //-> 寻址
            for (var i = 0, t; t = arrParam[i]; i++) {
                index = 0;
                while ((t = t[dz[index++]]) !== undefined) {
                    if (index >= dz.length) {
                        //-> 将找到的对象返回去
                        return t;
                    }
                }
            }
            return undefined;
        },
        filling: function (data, value) {
            for (var k in data) {
                if (is.ava(data[k])) {
                    data[k] = value;
                }
            }
            return data;
        }
    }
    //-> 时间处理
    var time = {
        //-> 给定时间 给定格式
        of: function (dateTime, format) {
            var t;
            var value = {
                "yyyy": t = dateTime.getFullYear(), //-> 年
                "yy": t - (parseInt(t / 100) * 100), //-> 后两位年
                "MM": (t = dateTime.getMonth() + 1) < 10 ? "0".concat(t) : t, //-> 月
                "M": t, //-> 一位月
                "dd": (t = dateTime.getDate()) < 10 ? "0".concat(t) : t, //-> 日
                "d": t, //-> 一位日
                "HH": (t = dateTime.getHours()) < 10 ? "0".concat(t) : t, //-> 时
                "H": t, //-> 时
                "hh": (t = (t > 12 ? t - 12 : t)) < 10 ? "0".concat(t) : t, //-> 12小时制 没有24小时这个概念哦~
                "h": t,
                "mm": (t = dateTime.getMinutes()) < 10 ? "0".concat(t) : t, //-> 分
                "ss": (t = dateTime.getSeconds()) < 10 ? "0".concat(t) : t, //-> 秒
                "SS": dateTime.getMilliseconds(), //-> 毫秒
                "W": dateTime.getDay() || 7 //-> 周
            };
            for (var key in value) {
                format = format.replace(key, value[key]);
            }
            //-> 返回时间
            return format;
        },
        to: function (date, format) {
            date = time.getDate(date);
            if (date == null || isNaN(date.valueOf())) {
                console.warn("无法解析时间", arguments);
                return "";
            }
            //-> 处理
            return time.of(date, format || "yyyy-MM-dd HH:mm:ss");
        },
        toTime: function (date, format) {
            return time.to(date, format || "HH:mm:ss");
        },
        toDate: function (date, format) {
            return time.to(date, format || "yyyy-MM-dd");
        },
        getDate: function (date) {
            if (date instanceof Date) {
                return date;
            }
            if (!is.num(date)) {
                return new Date(date);
            }
            if (typeof (date) == "string" || date instanceof String) {
                return new Date(date);
            }
            return null;
        },
        /**
         * 和当前时间相比
         * @param {*} date 
         * @param {*} format 
         */
        now: function (date, format) {

        }
    }

    var clone = {
        object: function (obj) {
            if (is.ava(obj)) {
                return obj;
            }
            if (typeof (obj) !== "object") {
                return obj;
            }
            var vs;
            var newObj = {};
            for (var key in obj) {
                vs = obj[key];
                if (vs instanceof Array) {
                    vs = clone.array(vs);
                } else {
                    vs = clone.object(vs);
                }
                newObj[key] = vs;
            }
            return newObj;
        },
        array: function (array) {
            var newArr = new Array(array.length);
            for (var i = 0, t; t = array[i]; i++) {
                newArr[i] = clone.object(t);
            }
            return newArr;
        }
    }
    /**
     * 验证库  有一些事单项验证 有一些事多项验证
     * 单项: qq,number,tel,mailbox
     * 多项: length,max,min,maxlength,minlength,
     */
    var verify = {
        qq: function () {

        },
        number: function () {

        },
        required: function () {
            console.log(arguments)
        }

    }
    /**
     * 数字处理
     */
    var num = {
        chinese: {
            //-> 零到九  数字
            number: ("零一二三四五六七八九".split("")),
            //-> 转换时 指定第一位 而非初始化
            unit: ("十百千万".split("")),
            //-> 数字单位制
            digital: ("个万亿兆京垓杼穰沟涧正载极".split("")),
            //-> 金钱
            monetary: ("零壹贰叁肆伍陆柒捌玖".split("")),
            //-> 金钱 单位
            munit: ("拾佰仟万".split("")),
            //-> 小数单位
            mdecimal: ("角分毫厘".split("")),
        },
        //-> 转换为 汉数 (整数 不会处理小数)
        chineseNumber: function (n, vs) {
            var str = [];
            if (String(n).length > 22) {
                var v = String(n);
                if (v.length > 52) {
                    console.warn("数据过长,最多只能展示52位,即 [极]单位之前的,之后的需要自己扩展")
                }
                for (var i = 0; i < v.length; i++) {
                    str.push(vs[v[i]]);
                }
            } else {
                //-> 整数
                var intv = Number.parseInt(n);
                if (isNaN(intv)) {
                    return [];
                }
                while (intv != -1) {
                    str.unshift(vs[intv % 10]);
                    intv = parseInt(intv /= 10);
                    if (intv == 0) {
                        intv = -1;
                    }
                }
            }
            return str;
        },
        //-> 处理小数的 
        chineseFloat: function (n, vs) {
            var intv = num.chineseNumber(n, vs);
            //-> 小数
            if (parseFloat(n) == parseInt(n)) {
                return intv;
            } else {
                var nx = num.chineseNumber(String(n).split(".")[1], vs);
                intv.push(".");
                intv.push.apply(intv, nx);
            }
            return intv;
        },
        //-> 核心调用
        chineseFormat: function (val, vs, unit) {
            var nc = num.chinese;
            var str = num.chineseNumber(val, vs);
            //-> 单位插入
            var len = str.length;
            var newStr = [];
            var one = len != 1;
            if (!val) {
                return ["零"] + unit[0];
            }
            var c = 0;
            for (var i = len - 1; i >= 0; i--, c++) {
                var d = str[i];
                if (d == "零") {
                    if (!one) {
                        one = true;
                        newStr.unshift(d);
                    }
                    if (c % 4 == 0 && c > 0) {
                        if (one) {
                            //-> 如果有多个0 则置空
                            if (((c % i == 0 && c > i) || i == 3) && (i <= 3)) {
                                newStr.unshift(nc.digital[c / 4]);
                            }
                        } else {
                            newStr.unshift(nc.digital[c / 4]);
                        }
                    }
                    if (one && c == 0) {
                        newStr.unshift(unit[c % 4]);
                    }
                    continue;
                }
                one = false;
                if (c % 4 == 0 && c > 0) {
                    newStr.unshift(nc.digital[c / 4]);
                } else {
                    //-> 插入单位
                    newStr.unshift(unit[c % 4]);
                }
                newStr.unshift(d);
            }
            return newStr.join("");
        },
        //-> 
        chineseDecimal: function (val) {
            var zs = num.chineseFormat(val, num.chinese.number, [""].concat(num.chinese.unit));
            //-> 是否有小数
            if (parseFloat(val) == parseInt(val)) {
                return zs;
            } else {
                var xs = String(val).split(".")[1];
                return zs + "." + num.chineseFormat(xs, num.chinese.number, [""].concat(num.chinese.unit))
            }
        },
        //-> 数字转换
        pole: function (val, single) {
            return num.chineseFormat(val, num.chinese.number, [single].concat(num.chinese.unit));
        },
        RMB: function (val, single) {
            var zs = num.chineseFormat(val, num.chinese.monetary, [single].concat(num.chinese.munit));
            if (is.num(val)) {
                return zs.concat("整");
            }
            //-> 是否有小数
            if (parseFloat(val) == parseInt(val)) {
                return zs.concat("整");
            } else {
                var xs = String(val).split(".")[1];
                return zs + num.chineseFormat(xs, num.chinese.monetary, [num.chinese.mdecimal[xs.length - 1]].concat(num.chinese.mdecimal))
            }
        }
    }

    /**
     * 工具
     */
    var util = {
        //-> 数组操作 
        "arr": arr,
        //-> 数字
        "num": num,
        //->对象
        "obj": obj,
        //-> 对象克隆
        "clone": clone,
        //-> 对象判断
        "is": is,
        //-> 值处理
        "val": val,
        //-> 数据
        "data": data,
        //-> 时间
        "time": time,
        "elem": {
            append: function () {
                var dad, chil, childrens, len;
                var i = 0;
                if (arguments.length == 0) {
                    dad = this[i++];
                    chil = this[i++];
                    childrens = this[i++];
                    len = this[i++];
                } else {
                    dad = arguments[i++];
                    chil = arguments[i++];
                    childrens = arguments[i++];
                    len = arguments[i++];
                }
                if (childrens.length > 0) {
                    var arr = childrens.splice(0, len);
                    //-> 添加进去
                    var time = document.createDocumentFragment();
                    for (var i = 0, t; t = arr[i]; i++) {
                        time.appendChild(t);
                    }
                    //-> 并不一定是最后添加 是指定的位置添加
                    dad.insertBefore(time, chil);
                    setTimeout(util.elem.append.bind([dad, chil, childrens, len]), 5);
                }
            },
            /**
             * 指定指定对象 
             */
            remove: function (remElem) {
                if (remElem instanceof Array) {
                    for (var i = 0, t; t = remElem[i]; i++) {
                        (t.parentElement || t.parentNode).removeChild(t);
                    }
                } else {
                    for (var i = 0, t; t = arguments[i]; i++) {
                        (t.parentElement || t.parentNode).removeChild(t);
                    }
                }
            },
            /**
             * 查找
             * @param {*} query 
             * @param {*} def 
             */
            query: function (query, def) {
                var elem;
                if (typeof (query) == "string") {
                    if ((elem = document.querySelector(query)) == null) {
                        return def;
                    }
                } else if (query instanceof Element) {
                    elem = query;
                }
                return elem;
            }
        },
    }

    /**
     * 数据包
     * ajax 接受数据, 单指是 json 
     */
    function getDataPack() {
        return new DataPack();
    }

    function DataPack() {
        var data;
        var state;
        var message;
        var row;
        var page;
        this.setPack = function (pack) {
            data = pack.data;
            state = pack.state;
            message = pack.message;
            row = pack.row;
            if (row instanceof Array && data instanceof Array) {
                var timedata = [],
                    obj;
                for (var i = 0, t; t = data[i]; i++) {
                    obj = {};
                    if (v instanceof Array) {
                        for (var z = 0, v; v = t[z]; z++) {
                            obj[row[z]] = v;
                        }
                        timedata.push(obj);
                    } else {
                        timedata.push(t);
                    }
                }
                data = timedata;
            }
            page = pack.page;
            this.state = state;
            this.message = message;
            this.page = page;
        }
        this.runStateCode = function (code) {
            if (typeof (code.codeName) == "string") {
                this.state = state = data[code.codeName];
            }
            if (!state || !is.func(code[state])) {
                //-> 执行默认
                if (is.func(code.def)) {
                    code.def.call(data, this);
                } else if (is.func(code.success)) {
                    code.success.call(data, this);
                }
            } else {
                code[state].call(data, this);
            }
        }
    }

    function sendDateToString(data, dad, obj) {
        if (data instanceof Array) {
            //-> 如果都是一级对象 那么则 全部添加 如果包含的有二级对象 则需要再次循环
            var i = 0,
                t;
            for (; t = data[i]; i++) {
                if (!is.basic(t)) {
                    break;
                }
            }
            if (i != data.length) {
                //-> 二级对象
                for (i = 0; t = data[i]; i++) {
                    if (is.basic(t)) {
                        if (t instanceof Date) {
                            t = time.to(t);
                        }
                        obj.append(dad.concat("[]"), t);
                    } else {
                        sendDateToString(data[i], dad.concat("[]."), obj);
                    }
                }
            } else {
                //-> 一级对象
                var v = [dad.substring(0, dad.length - 1)];
                v.push.apply(v, data);
                for (var i = 1, t; t = v[i]; i++) {
                    if (t instanceof Date) {
                        v[i] = time.to(t);
                    }
                }
                obj.append.apply(obj, v);
            }
        } else {
            var v;
            for (var key in data) {
                if (is.basic(v = data[key])) {
                    if (v instanceof Date) {
                        v = time.to(v);
                    }
                    obj.append(dad.concat(key), v);
                } else {
                    sendDateToString(v, dad.concat(key, "."), obj);
                }
            }
        }
    }


    var AjaxEventName = ["onreadystatechange", "abort", "error", "load", "loadend", "loadstart", "progress", "timeout"];
    /**
     * ajax 异步请求  不会吧同步开启的
     * @param {*} param {
     *  action: 请求地址
     *  method: 请求类型  GET | HEAD | OST | PUT | DELETE | CONNECT | OPTIONS | TRACE | PATCH 
     *  data: 请求数据 FormData | getObject | <-Object
     *  enctype: 请求的数据媒体类型
     *  codeName: 回调函数取值 默认 "state"
     *  200 ~ 540 : 回调函数
     *  def:function 回调函数 当没有找到时
     *  error:function 错误
     *  always:function 只要是构造ajax 就会触发
     *  caching : Boolean 缓存 默认是未开启的 开启后 请求的url 都是唯一的
     *  auto:Boolean 自动完成
     *  user: string
     *  password : string
     * } 
     */
    function Ajax(param, form) {
        if (!(this instanceof Ajax)) {
            return new Ajax(param);
        } {
            //-> init
            if (!param) {
                //-> 参数不可用
                throw "Parameter not available";
            }
            param.method = param.method || "GET";
            param.action = param.action || location.origin + location.pathname;
        }
        //-> 初始化函数
        var pack = new getDataPack();
        /**
         * 当 ajax 每次更改readyState属性时 触发
         */
        this.readystatechange = function () {

        }
        /**
         * 当 ajax 终止请求时触发  这个不是手动终止 ajax
         */
        this.abort = function abort() { }
        /**
         * 当请求出错时
         */
        this.error = function () { }
        /**
         * 当请求 加载时
         */
        this.load = function () { }
        /**
         * 当 ajax 请求完成时  不管失败  还是成功 还是 取消
         */
        this.loadend = function () {
            if (ajax.readyState != (XMLHttpRequest.DONE || 4)) {
                //-> 意外调用
                throw "意外调用";
            }
            //-> 如果是表单保护对象
            if (form instanceof Form) {
                form.stopPrivate();
            }
            //-> 执行完成 解析ajax 数据
            if (ajax.status == 200 && param.auto === true) {
                //-> 成功 解析数据
                var type = ajax.getResponseHeader("Content-Type").split("/")[1];
                //-> 判断数据类型
                type = type.split(";")[0];
                if (type == "json") {
                    //-> 初始化
                    pack.setPack(JSON.parse(ajax.response));
                    pack.runStateCode(param);
                }
            } else {
                //-》 。。。。。
            }
        }
        /**
         * 当 ajax 请求开始加载数据时，将触发该事件。
         */
        this.loadstart = function () { }
        /**
         * ajax 进度事件
         */
        this.progress = function () { }
        /**
         * ajax 请求超时事件 
         */
        this.timeout = function () { }
        //-> 是否为 get 请求
        var isGet = "GET" === param.method.toLocaleUpperCase();
        //-> 初始化参数
        var data = [];
        if (!(param.data instanceof FormData)) {
            //-> 
            var go = new GetObject();
            sendDateToString(param.data, "", go);
            //-> 
            var vsd = go.__data__;
            var v;
            for (var key in vsd) {
                if ((v = vsd[key]).length) {
                    //-> 有数据
                    data.push(key.concat("=", v.join("&".concat(key, "="))));
                }
            }
        }
        if (isGet) {
            var str = data.join("&");
            if (str.length + param.action.length > 2048) {
                //-> 错误 参数过长
                return "error : 参数过长 size[".concat(str.length + param.action.length), "],无法使用 GET 请求发送这些数据"
            }
            var t;
            if (param.action.lastIndexOf("?") == -1) {
                t = "?";
            } else {
                //-> 有问号 则需要在后面追加参数 注意&
                t = param.action[param.action.length];
                if (t == "?" || t == "&") {
                    t = "";
                } else {
                    t = "&";
                }
            }
            param.action = param.action.concat(t, str);
        }
        //-> 创建 ajax
        var ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        //-> 绑定事件
        for (var i = 0, t; t = AjaxEventName[i]; i++) {
            if (is.func(param[t])) {
                //-> 用戶的
                ajax.addEventListener(t, param[t]);
            }
            //-> 自己的
            ajax.addEventListener(t, this[t]);
        }
        //-> 初始化请求
        ajax.open(param.method, param.action, true, param.user || null, param.password || null);
        //-> 发送
        if (param.data instanceof FormData) {
            ajax.setRequestHeader('Content-type', "multipart/form-data");
            ajax.send(param.data);
        } else {
            ajax.setRequestHeader('Content-type', (param.enctype || 'application/x-www-form-urlencoded'));
            ajax.send(isGet ? null : data.join("&"));
        }
        this.ajax = ajax;
    }


    /**
        * elem: 触发元素
        * param:{
        *  close: true 自动关闭 | false 需要用手动关闭,
        *  time: 200,显示时长 | 0 按照信息长度而决定
        *  message: 提示信息
        *  posi: 提示位置
        * }
        **/
    function Tips(elem, param) {
        if (!(this instanceof Tips)) {
            return new Tips(elem, param);
        }
        if (param.close === undefined) {
            param.close = true;
        }
        // -> 目标添加对象
        this.position;
        //-> 是否在 父级显示 
        param.posi = (param.posi) || elem.getAttribute("tips-posi");
        if (param.posi) {
            //-> 指定位置显示 
            if (!(this.position = document.querySelector(param.posi))) {
                this.position = elem;
            }
        } else {
            this.position = elem;
        }
        //-> 生成数据信息  
        var div = document.createElement("div");
        div.innerHTML = 
        '<div style="position: absolute;z-index: 10;height: auto;text-align: center;background-color: snow;border-radius: 5px;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);">'+
        '<div style="position: relative;padding: 10px;">'+
        '<div style="position: absolute;    right: -15px;top: -15px;">'+
        '<button style="border: 0;background-color: snow;padding: 5px;border-radius: 100%;z-index: 1;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);" class="close-message" type="button">'+
        '<img style="width: 20px;height: 20px;" src="/image/svg/close.svg" alt="关闭"></button>'+
        '</div>'+
        '<figure>'+
        '<figcaption>'+param.message+'</figcaption>'+
        '</figure>'+
        '</div>'+
        '</div>';
        this.content = div.children[0];
        if (this.position.offsetWidth) {
            this.content.style.width = this.position.offsetWidth + "px";
        } else {
            this.content.style.width = "100%";
        }
        //-> 显示时长
        if (!param.time) {
            //-> 根据提示的 字符长度而定
            var t = param.message.length * 900;
            if (t > 12 * 1000) {
                t = 12000;
            } else if (t < 3 * 1000) {
                t = 3000;
            }
            param.time = t;
        }
        // -> 定位到我
        this.locateMe = function () {
            this.content.style.display = "";
            this.content.setAttribute("tabindex", 1);
            this.content.focus();
        }
        var isHide = false;
        // -> 隐藏 并移除
        this.hide = function () {
            if (isHide) {
                return;
            }
            isHide = true;
            this.content.style.display = "none";
            //-> 移除
            (this.position.parentElement || this.position.parentNode).removeChild(this.content);
        }
        var bt = this.content.querySelector("button.close-message");
        bt.addEventListener("click", this.hide.bind(this), false);
        // -> 展示
        this.show = function () {
            //-> 父级
            var parent = this.position.parentElement || this.position.parentNode;
            //-> 添加
            parent.insertBefore(this.content, this.position.nextSibling);
            //-> 自动关闭
            if (param.close) {
                setTimeout(this.hide.bind(this), param.time);
            }
            this.locateMe();
        }
    }

    /**
     * 表单保护
     * @param {*} query 
     * @param {*} parma {
     *  formData: Boolean //-> 是否使用 formData 主要用于图片上传
     *  ajax:{ Ajax() },
     *  |
     *  submit:function(),
     *  before:function(),提交之前
     *  after:function(),验证之后
     *  fail:function(), 统一的失败处理
     *  controls:{
     *      name:{
     *           change:function() //-> 值改变时
     *           input:function() //-> 值输入时
     *           verify:function() //-> 数据校正
     *           tips:{ //-> 提示信息
     *             key:string
     *           },
     *           library: "name" | ["name"], //-> 验证库
     *           fail:function() //-> 当验证失败时 允许自定义处理
     *      }
     *  }
     * }
     */
    function Form(query, parma) {
        var form = util.elem.query(query, null);
        if (form == null) {
            console.error("找不到表单,无法进行委托", query);
            return;
        }
        //-> 控件对象
        var controls = parma.controls;
        //-> 有则拦截表单的验证
        if (controls) {
            form.setAttribute("novalidate", "true")
            form.noValidate = true;
        }

        //-> 表单
        this.$form = form;
        //-> 表单数据
        this.formData = (parma.formData ? new FormData(form) : new GetObject());
        //-> 保护 只有ajax 提交时才会出现保护 
        this.private = false;
        //-> 开启保护
        this.startPriavate = function () {
            _this.private = true;
            form.setAttribute("form-submit", "login");
            //-> 禁用所有 type=submit 的节点
            _this.switchSubmitButton();
            form.style.cursor = "progress";
            form.title = "表单提交中";
        }
        this.switchSubmitButton = function () {
            var submitButton = form.querySelectorAll('[type="submit"]');
            for (var i = 0, t; t = submitButton[i]; i++) {
                t.disabled = _this.private;
            }
        }
        //-> 关闭保护
        this.stopPrivate = function () {
            _this.private = false;
            form.removeAttribute("form-submit");
            //-> 启用所有的 提交按钮
            _this.switchSubmitButton();
            form.style.cursor = "";
            form.title = "";
        }
        //-> 获取表单数据
        this.getFormData = function () {
            if (parma.data) {
                //-> 有没有默认提交的数据
                var defData;
                if (is.func(parma.data)) {
                    defData = parma.data(form, this);
                } else {
                    //-> 克隆 
                    defData = clone.object(parma.data)
                }
                for (var key in defData) {
                    _this.formData.append(key, defData[key]);
                }
            }
            if (_this.formData instanceof FormData) {
                return _this.formData;
            }
            //-> 从表单中获取所需的数据
            var elems = form.elements;
            for (var i = 0, t; t = elems[i]; i++) {
                if (t.name) {
                    var value = getInputValue(t);
                    if (!is.ava(value)) {
                        _this.formData.append(t.name, value);
                    }
                }
            }
            return _this.formData.valueOf(true);
        }

        //-> 函数 主要是表单验证
        var _this = this;

        //-> 表单提交事件
        this.submit = function (e) {
            e = getEvent(e);
            if (e) {
                e.returnValue = false;
                e.preventDefault();
            }
            if (_this === true) {
                _this.triggerPrivate();
                return;
            }
            if (_this.formData instanceof GetObject) {
                _this.formData.empty();
            }
            //-> 提及时先执行  表单提及之前准备
            // this.before //
            // this.reportValidity //
            // this.afert // 这里一般是同步执行  用于上传表单图片
            //-> 提交数据  要么自动提交 要么 用户自定义提交
            // form.submitFormData-> auto || param.submit //
            if (is.func(parma.before)) {
                if (parma.before(form, _this, _this.executionSubmit) === false) {
                    return;
                }
            }
            //-> 执行表单提交
            _this.executionSubmit();
        }

        //-> 上次提交时请求的数据
        var beforeSubmit = {};

        /**
         * 上次提交的数据是否 和本次提交的数据一致
         */
        this.isChange = function(data){
            if(data == beforeSubmit){
                return false; 
            }
            //-> 类型比对
            if( ( typeof(beforeSubmit) != typeof(data) ) ){
                return true; 
            }
            //-> 获取键
            var dk = Object.keys(data);
            var bk = Object.keys(beforeSubmit);
            if(dk.length != bk.length){
                return true; 
            }
            dk.sort();
            bk.sort();
            var kv;
            for(var i=0;i<dk.length;i++){
                kv = dk[i];
                if(kv != bk[i]){
                    return true; 
                }
                if(data[kv] != beforeSubmit[kv]){
                    return true; 
                }
            }
            return false;
        }

        //-> 执行提交 
        this.executionSubmit = function () {
            //-> 验证
            var sum = _this.reportValidity();
            if (sum !== 0) {
                return;
            }
            //-> 开启保护然后提交
            _this.startPriavate();
            //-> 提交数据
            if (parma.ajax) {
                _this.ajaxSubmit(parma.ajax);
            } else {
                //-> 自定义提交
                var data = _this.getFormData();
                _this.retrieveData(data);
                var cl = clone.object(data);
                var bool = parma.submit.call(data, form, data, _this, _this.stopPrivate);
                beforeSubmit = cl;
                //-> 返回值是 true 则自动关闭表单保护
                if (bool === true) {
                    _this.stopPrivate();
                }
            }
        }
        /**
         * 获取表单数据后 需要做什么
         */
        this.retrieveData = function (data) {
            if (parma.retrieveData) {
                parma.retrieveData(data);
            }
        }
        this.ajaxSubmit = function (ajaxParam) {
            ajaxParam.action = parma.url || form.action;
            ajaxParam.method = parma.method || form.method;
            ajaxParam.data = _this.getFormData();
            ajaxParam.auto = true;
            var cl = clone.object(data);
            var submitAjax = new Ajax(ajaxParam, _this);
            _this.ajax = submitAjax;
            beforeSubmit =  cl ;
            return submitAjax;
        }
        //-> 添加表单提交事件
        form.addEventListener("submit", this.submit, {}, false);
        //-> 触发保护
        this.triggerPrivate = function () {
            if (is.func(parma.private)) {
                parma.private();
            }
        }
        //-> 触发验证未通过
        this.tipsFail = function (t, message, cont) {
            //-> 是否已经自定义了
            if (is.func(parma.fail)) {
                //->调用全局的
                parma.fail(t, message, cont, _this);
            } else {
                //-> 手动
                new Tips(t, {
                    "close": cont.close,
                    "time": cont.time,
                    "message": message,
                    "posi": cont.posi
                }).show();
            }
        }
        //-> 有效性  报告
        this.reportValidity = function () {

            //-> 提供form 自定义验证 可能有值并不是 input
            if (parma.verify) {
                var vs = parma.verify(form, this, parma);
                if (vs && parma.tips) {
                    this.tipsFail(form, (parma.tips[vs] || vs), parma);
                }
            }

            //-> 获取表单的所有 控件 controls
            var elems = form.elements;
            var cont, tipsmessage, key, func, errorSum = 0;
            //-> 不可用则不循环
            if (controls) {
                for (var i = 0, t; t = elems[i]; i++) {
                    tipsmessage = null;
                    if (t.name && (cont = controls[t.name])) {
                        if (is.func(cont.verify)) {
                            key = cont.verify.call(t, t, form, cont, _this);
                            if (typeof (key) === "string") {
                                tipsmessage = (cont.tips && cont.tips[key]) || (parma.tips && (parma.tips[key] || parma.tips.def)) || t.title || key;
                                errorSum++;
                            }
                        }
                        //-> 验证 lib 库
                        if (!tipsmessage && cont.library && cont.library.length) {
                            //-> 验证
                            for (var j = 0, l; l = cont.library[j]; j++) {
                                if (is.func(func = verify[t])) {
                                    if ((tipsmessage = func(l, t.value))) {
                                        errorSum++;
                                        break;
                                    };
                                }
                            }
                        }
                        if (tipsmessage) {
                            //-> 触发错误
                            if (is.func(cont.fail)) {
                                cont.fail(t, tipsmessage, _this);
                            } else {
                                //-> 如果有全局的  则给调用全局的 没有则 手动提示
                                this.tipsFail(t, tipsmessage, cont);
                            };
                        }
                    }
                }
            }
            return errorSum;
        }
        //-> 提交数据 
        this.submitFormData = function () {

        }
        /**
         * 设置表单值
         */
        this.setFormValue = function (data) {
            var event;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (form[key]) {
                        //-> 构造事件
                        event = document.createEvent('Event');
                        event.initEvent('change', true, true);
                        form[key].dispatchEvent(event);
                        //-> 设置值
                        setInputValue(data[key], form[key], {});
                    }
                }
            }
        }

    }

    function add_GetObject(go, name) {
        if (name in go) {
            return;
        }

        function get() {
            return go.get(name);
        }

        function set(value) {
            og.set(name, value);
        }
        Object.defineProperty(go, name, {
            configurable: true,
            enumerable: true,
            get: get,
            set: set,
        })
    }
    /**
     * 获取一个 obj 对象
     * @param {*} parma 
     */
    function GetObject(parma) {
        if (!(this instanceof GetObject)) {
            return new GetObject(parma);
        }
        //-> 保护数据
        var data = {};
        Object.defineProperty(this, "__data__", {
            value: data,
            writable: false,
            enumerable: false,
            configurable: true
        });
        if (parma && !is.basic(parma)) {
            for (var key in parma) {
                this.set(key, param[key]);
            }
        }
    }


    GetObject.prototype = {
        /**
         * 是否需要处理 没有值得数据
         * {*} bool 
         */
        valueOf: function (bool) {
            var newDate = {},
                v, data = this.__data__;
            for (var key in data) {
                v = data[key];
                //-> 处理数据
                if (v == null || v.length === 0) {
                    if (bool === true) {
                        newDate[key] = null;
                    }
                } else {
                    //-> 如果只有一个救赎数据 两个就数组
                    if (v.length == 1) {
                        newDate[key] = v[0];
                    } else {
                        //-> 多个就是 数组
                        var ar = newDate[key] = [];
                        ar.push.apply(ar, v);
                    }
                }
            }
            return newDate;
        },
        //-> 置空
        empty: function () {
            var data = this.__data__;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    delete data[key];
                    delete this[key];
                }
            }
        },
        //-> 移除指定数据
        remove: function (key) {
            //-> 移除指定目标
            var data = this.__data__
            if (arguments.length == 1) {
                data[key].splice(0, data[key].length);
            } else {
                var arr = data[key],
                    index;
                //-> 移除指定数据
                for (var i = 1, t; t = arguments[i]; i++) {
                    if ((index = arr.indexOf(t)) != -1) {
                        arr.splice(i, 1);
                    }
                }
            }
        },
        /**
         * 删除指定的key
         */
        deleted: function () {
            var data = this.__data__
            for (var i = 0, t; t = arguments[i]; i++) {
                delete data[t];
                delete this[t];
            }
        },
        //-> 追加数据
        append: function (key) {
            var data = this.__data__
            var as = [];
            for (var i = 1, len = arguments.length; i < len; i++) {
                as.push(arguments[i]);
            }
            var v = data[key];
            if (!v) {
                data[key] = as;
                add_GetObject(this, key);
            } else {
                v.push.apply(v, as);
            }
        },
        //-> 设置数据
        set: function (key, value) {
            var data = this.__data__
            data[key] = [value];
            add_GetObject(this, key);
        },
        //-> 获取值
        get: function (key) {
            var data = this.__data__
            if (arguments.length == 1) {
                if(!data[key]){
                    return undefined;
                }
                return data[key].length == 1 ? data[key][0] : data[key];
            } else {
                return data[key][arguments[1]];
            }
        },
        //-> 获取数组
        getArray: function (key) {
            var data = this.__data__;
            return data[key];
        },
        keys: function () {
            return Object.keys(this.__data__);
        }
    }

    function getEvent(e) {
        return e ? e : window.event;
    }
    /**
     * 事件委托
     * 一级属性 如果是object 则 委托进去 负责 不会委托,
     */
    function Entrust(query, param) {
        if (Entrust.init === false) {
            //-> 初始化 css 
            var css = document.createElement("style");
            css.innerText = cssEn;
            document.head.appendChild(css);
        }
        //-> 委托目标
        var elem = util.elem.query(query, null);
        if (elem == null) {
            console.error("无法委托:找不到这个对象[" + query + "]");
            return;
        }

        //-> 获取绑定者
        function binding(event, name) {
            var t = event.target;
            var ename = "eve-".concat(name);
            var sour;
            if (((sour = t.getAttribute(ename)))) {
                return {
                    "attr": sour,
                    "target": t
                };
            } else {
                //-> 父级对象
                var temp;
                while (true) {
                    temp = t;
                    if ((t = t.parentElement || t.parentNode) == elem) {
                        if ((sour = t.getAttribute(ename))) {
                            return {
                                "attr": sour,
                                "target": t
                            };
                        }
                        break;
                    } else {
                        if (temp.getAttribute && (sour = temp.getAttribute(ename))) {
                            return {
                                "attr": sour,
                                "target": temp
                            };
                        } else if (!t) {
                            return false;
                        }
                    }
                }
            }
        }
        //-> 执行事件
        function executionEvent(event, target, funcName, eve) {
            //-> 获取事件
            var func = eve[funcName];
            if (util.is.func(func)) {
                //-> 可执行
                try {
                    //-> 是否有 data 属性
                    var _this = target;
                    //-> 执行环境参数
                    var data = {};
                    if (!util.is.widow(target.dataset)) {
                        data = util.val.ofs(util.clone.object(target.dataset));
                        if (data.json) {
                            //-> json
                            data.json = JSON.parse(data.json);
                        }
                        _this = data;
                    }
                    //-> 处理 entrustDate 
                    if (target.entrustData) {
                        //-> 有属性
                        for (var key in target.entrustData) {
                            data[key] = target.entrustData[key];
                        }
                        _this = data;
                    }
                    //-> 执行 如果有 data 属性 那么则是 data , 没有就是本事
                    return !func.call(_this, event, target, eve, event.target);
                } catch (error) {
                    console.error("在执行事件时失败:" + funcName, target, error);
                }
            }

        }

        //-> 处理点击事件
        function trigger(event, eveName, eve) {
            //-> 处理点击源
            var bindin = binding(event, eveName);
            if (!bindin) {
                return;
            }
            //-> 执行事件
            if (executionEvent(event, bindin.target, bindin.attr, eve)) {
               
                //-> 默认 阻止 
                var action = eve.action;
                if (action) {
                    var n = action[bindin.attr];
                    if (n == "bu") {
                        event.stopPropagation();
                        event.cancelBubble = true;
                    } else {
                        event.returnValue = false;
                        event.preventDefault();
                    }
                } else {
                    //-> 所有
                    // event.preventDefault();
                    event.stopPropagation();
                    //   event.returnValue = false;
                    event.cancelBubble = true;
                }
            }
        }
        //-> 循环 参数 
        var eve;
        for (var eventName in param) {
            eve = param[eventName];
            if (typeof (eve) != "object") {
                continue;
            }
            //-> 开启绑定
            elem.addEventListener(eventName, (function (name, eve) {
                return function (e) {
                    //-> 执行
                    trigger(getEvent(e), name, eve);
                }
            })(eventName, eve), {
                capture: true
            }, true);
        }
        /**
         * 
         */
        this.addEvent=function(event,name,func){
            //-> 是否添加过了
            if(param[event]){
                param[event][name] = func;
            }else{
                param[event] = {};
                param[event][name] = func;
                //-> 开启绑定
                elem.addEventListener(event, (function (name, eve) {
                    return function (e) {
                        //-> 执行
                        trigger(getEvent(e), name, eve);
                    }
                })(event,  param[event]), {
                    capture: true
                }, true);
            }
        }

        //-> 释放对象
        eve = null;


    }



    Entrust.init = false;
    //-> 外暴露工具类
    wind.futil = (function () {
        return clone.object(util);
    })();
    //-> 外暴露接口
    wind.Entrust = function (a, b) {
        return new Entrust(a, b);
    };


    //-> 设置输入框的值
    function setInputValue(val, elem, snowflak) {
        switch (elem.type) {
            case "number":
                //-> 判断是否保留
                elem.value = val;
                break;
            case "date":
                if (val) {
                    elem.value = time.toDate(val);
                } else {
                    elem.value = val;
                }
                break;
            case "radio":
            case "checkbox":
                //-> 这里要判断 元素是否有值 没有才是复制 
                var ev = elem.getAttribute("value");
                if (snowflak.oneValue === undefined) {
                    snowflak.oneValue = (ev === null);
                }
                //-> 没有值则赋值
                if (snowflak.oneValue === true) {
                    elem.value = val;
                } else {
                    if (typeof (val) == "boolean") {
                        val = String(val);
                    }
                    //-> 根据当前值来做比对判断
                    elem.checked = (elem.value == val);
                }
                break;
            default:
                elem.value = val;
                break;
        }
    }

    function getInputValue(elem) {
        switch (elem.type) {
            case "datetime-local":
                elem.value.replace("T", " ");
                break;
            case "checkbox":
            case "radio":
                if (elem.checked) {
                    return elem.value;
                }
                return undefined;
            case "file":
                return elem.files;
            case "reset":
            case "submit":
            case "image":
            case "button":
                return undefined;
            default:
                return elem.value;
        }
    }


    wind.getForm = function (a, b) {
        return new Form(a, b);
    }

    wind.GetObject = GetObject;
    wind.Ajax = Ajax;
    wind.Frost = Frost;
    var rain = new Rain();
    var temp = new Template();

    /**
    * 加载链接模板
    * @param {Function} func 当所有的模板都加载完毕时
    */
    Frost.linkTemp = function (links, callback) {
        var index = 0;
        var responses = {};
        var len = links.length;
        var next = function (ajax, url) {
            var res = ajax.responseText
            responses[url] = res;
            var div = document.createElement("div");
            div.innerHTML = res;
            temp.initTemplate(div);
            if (index == len) {
                //-> 执行回调
                if (is.func(callback)) {
                    callback();
                }
            }
        }
        for (var i = 0, t; t = links[i]; i++) {
            var ajax = Ajax({
                action: t,
                method: "GET",
                loadend: (function (t) {
                    return function (event) {
                        index++;
                        next(event.target, t);
                    }
                })(t)
            });
        }
    }

    var attrKV = new ElemAttributes();
    Frost.rain = rain;
    Frost.temp = temp;
    Frost.util = util;
    Frost.attr = attrKV;
    Frost.Ssangyong = Ssangyong;

    rain.add("f-text", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
            if (snowflak.value.eval) {
                if (!is.func(snowflak.value.eval)) {
                    snowflak.value.eval = Function("value", "snowflak", "return " + snowflak.value.eval).bind(snowflak.$frost);
                }
            }
        }, //-> 处理目标元素
        execute: function (snowflak, value) {
            if (snowflak.value.eval) {
                value = snowflak.value.eval(value, snowflak);
            }
            snowflak.target.data = is.ava(value) ? "" : value;
        } //-> 执行时
    });

    rain.add("f-json", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
            if (snowflak.value.eval) {
                if (!is.func(snowflak.value.eval)) {
                    snowflak.value.eval = Function("value", "return " + snowflak.value.eval);
                }
            }
        }, //-> 处理目标元素
        execute: function (snowflak, value) {
            value = value ? JSON.stringify(value) : String(value);
            if (snowflak.value.eval) {
                value = snowflak.value.eval(value);
            }
            snowflak.target.data = is.ava(value) ? "" : value;
        } //-> 执行时
    });

    /**
     * {
     *  key:目标,
     *  range:范围 0为无限制,  单位是秒
     *  format:{
     *      value:"yyyy-MM-dd" , (去年6月) 
     *      now:"刚刚",
     *      before:"前" , (前一秒),
     *      after:"后", (一秒后) 
     *      mm:分钟,
     *      ss:秒
     *      hh:小时,
     *      dd:天,
     *      MM:月,
     *      YY:年,
     *      W:周,
     *  }
     * }
     * @param {*} ice 
     * @param {*} elem 
     * @param {*} params 
     * f-datetimenow
     */

    /**
     * 数字 和text 类似 不过提供了数字处理;
     * {
     *  key: 目标,
     *  bin: 进制,
     *  round: 四舍五入 当然  这只是例子 ,  四舍五入 给定值为 4,
     *  retain:保留几位,  如果为负数 则小数点则王前移,
     *  format: { 
     *      repair:true, 是否补位
     *      int:整数位  只有补位 开启时
     *      decimal:小数位 只有补位 开启时
     *      len:4, //-> 分割 8000-0000.0000-5000 , 0020-4001
     *      str:"-" //->分割符
     *  }
     * }
     * @param {*} ice 
     * @param {*} elem 
     * @param {*} params 
     */
    rain.add("f-number", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            if (snowflak.value.eval) {
                if (!is.func(snowflak.value.eval)) {
                    snowflak.value.eval = Function("value", "return " + snowflak.value.eval);
                }
            }
            elem.appendChild(snowflak.target);
        },
        execute: function (snowflak, val) {
            if (snowflak.value.eval) {
                val = snowflak.value.eval(val);
                val = is.ava(val) ? 0 : val;
            }
            var analysis = snowflak.value;
            //-> 是不是个数字
            if (is.num(val)) {
                val = 0;
            }
            //-> 计算保留 小数位
            if (!is.ava(analysis.retain)) {
                //->有  大于0 还是小于0 如等于0 则是保留整数
                if (analysis.retain == 0) {
                    val = parseInt(val);
                } else if (analysis.retain > 0) {
                    //-> 保留指定位小数
                    var w = Math.pow(10, analysis.retain);
                    val = parseInt(val * w);
                    val /= w;
                } else {
                    //-> 向前移位 负负得正 , 不会移除多余小数 对整数是个很好的支持 小数就不太友好了
                    val = parseInt(val) / Math.pow(10, -analysis.retain);
                }
            }
            //-> 四舍五入
            if (!is.num(analysis.round)) {
                //-> 最后一位小数做判断 
                //-> 判断是否有小数 从而获取进位值
                //-> 使用字符串截取 全保精度
                var v = String(val).split(".");
                if (v.length == 1) {
                    var c = val % 10;
                    if (Math.abs(c) > analysis.round) {
                        if (val > 0) {
                            val += (10 - c);
                        } else {
                            val -= (10 + c);
                        }
                    } else {
                        val -= c;
                    }
                } else {
                    //-> 获取长度
                    var len = v[1].length;
                    val *= Math.pow(10, len);
                    //-> 获取最后一位的值
                    var c = val % 10;
                    if (Math.abs(c) > analysis.round) {
                        if (val > 0) {
                            val += (10 - c);
                        } else {
                            val -= (10 + c);
                        }
                    } else {
                        val -= c;
                    }
                    //-> 倒回去
                    val /= Math.pow(10, len);
                }
            }
            //-> 补位
            if (analysis.format) {
                //-> 获取整数  获取小数
                var id = String(val).split(".");
                //->补位
                var f = analysis.format;
                if (util.val.Bool(f.repair)) {
                    //-> 整数位 
                    if (f["int"]) {
                        var bu = f["int"] - id[0].length;
                        //-> 获取需要补位的
                        if (bu < 0) {
                            //-> 移除高位
                            id[0] = id[0].substr(-bu);
                        } else {
                            id[0] = String(Math.pow(10, bu + 1)).substr(1) + id[0];
                        }
                    }
                    //-> 小数位
                    if (f.decimal) {
                        //-> 加一表示有小数点
                        var bu = f.decimal;
                        if (id[1]) {
                            bu -= id[1].length;
                        } else {
                            id.push("");
                        }
                        //-> 多出移除
                        if (bu < 0) {
                            id[1] = id[1].substring(0, id[1].length + bu)
                        } else {
                            var v = [];
                            for (var index = 0; index < bu; index++) {
                                v.push("0");
                            }
                            //-> 获取长度
                            id[1] = id[1].concat(v.join(""));
                        }
                    }
                }
                //-> 拆分
                if (f.len && f.str) {
                    if (f.len == 1) {
                        id[0] = id[0].split("").join(f.str)
                        if (id.length == 2) {
                            id[1] = id[1].split("").join(f.str)
                        }
                    } else {
                        //-> 整数
                        var ints = id[0].split("")
                        //-> 从后面
                        var len = ints.length;
                        if (len > f.len) {
                            //-> 第一次的位置
                            var la = (len % f.len);
                            ints.splice(la, 0, f.str);
                            //-> 后续位置
                            len -= la;
                            var i = 1;
                            do {
                                ints.splice(f.len * i + la + i, 0, f.str);
                                i++;
                            } while (f.len * i < len);
                            id[0] = ints.join("");
                        }
                        //-> 小数
                        if (id[1]) {
                            var decimal = id[1].split("");
                            //-> 从后面
                            var len = decimal.length;
                            if (len > f.len) {
                                var i = 1;
                                var z = 0;
                                while (f.len * i < len) {
                                    decimal.splice(f.len * i + z, 0, f.str);
                                    ++i;
                                    z++;
                                };
                                id[1] = decimal.join("")
                            }
                        }
                    }
                }
                val = id.join(".");
            }
            snowflak.target.data = val;
        }
    });

    function setDateTimeAttr(target){
        var time = (target.parentElement || target.parentNode);
        if((time.nodeName || time.tagName) == "TIME"){
            time.setAttribute("datetime",target.data);
        }
    }

    rain.add("f-date", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
        },
        execute: function (snowflak, value) {
            if (!value && snowflak.value.def) {
                snowflak.target.data = snowflak.value.def;
            } else {
                snowflak.target.data = (time.toDate(value, snowflak.value.format)) || value;
            }
            setDateTimeAttr(snowflak.target);
        }
    });
    rain.add("f-time", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
        },
        execute: function (snowflak, value) {
            if (!value && snowflak.value.def) {
                snowflak.target.data = snowflak.value.def;
            } else {
                snowflak.target.data = (time.toTime(value, snowflak.value.format)) || value;
            }
            setDateTimeAttr(snowflak.target);
        }
    });
    rain.add("f-datetime", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
        }, //-> 处理目标元素
        execute: function (snowflak, value) {
            if (!value && snowflak.value.def) {
                snowflak.target.data = snowflak.value.def;
            } else {
                snowflak.target.data = (time.to(value, snowflak.value.format)) || value;
            }
            setDateTimeAttr(snowflak.target);
        }
    });
    rain.add("f-html", {
        initTarget: function (snowflak) {
            snowflak.frequency = 0;
        },
        execute: function (snowflak, value) {
            snowflak.target.innerHTML = is.ava(value) ? "" : value;
            if (snowflak.frequency++ !== 0) {
                //-> 渲染孩子 第一次 会自己渲染 ,第二次 就要手动了
                snowflak.$frost.$recursive.recursiveParamElem(snowflak.params, snowflak.ssangyongs, snowflak.target);
            }
        }
    });
    var hrefSrc = {
        binding: false, //-> 不绑定当前对象 
        initAttr: function (snowflak) {
            snowflak.attrName = arguments[3].name;
            var url = snowflak.name;
            //-> 解析 {} 里面的数据
            var param = snowflak.paramValue = [];
            var i = url.indexOf("{", 0);
            var next, v, t;
            while (i != -1) {
                next = url.indexOf("}", i++);
                v = url.substring(i, next);
                if (param.indexOf(v) == -1) {
                    param.push(v);
                }
                i = url.indexOf("{", i);
            }
            //-> 处理 param 的所有参数
            for (i = 0, t; t = param[i]; i++) {
                var sd = data.getSsangyong(t, snowflak.ssangyongs);
                if (sd) {
                    sd.snowflaks.push(snowflak);
                }
            }
        },
        execute: function (snowflak) {
            var param = snowflak.paramValue;
            //-> 重点在参数
            var url = snowflak.name;
            if (url[0] == "$") {
                url = url.substring(1);
            }
            //-> 处理
            var v;
            for (var i = 0, t; t = param[i]; i++) {
                v = data.getValue(t, snowflak.params);
                url = url.replace(new RegExp("{".concat(t, "}"), "g"), v ? v : "");
            }
            //-> 
            snowflak.target.setAttribute(snowflak.attrName.substr(2), url);
        }
    }
    rain.add("f-href", hrefSrc);
    /**
     * src也是用于地址
     */
    rain.add("f-src", hrefSrc);

    rain.add("f-value", {
        changeValue: function (e) {
            var event = getEvent(e);
            var value = getInputValue(event.target);
            var key, dad;
            if (this.model) {
                //-> 判断给定的模型对象是否可用
                dad = data.getValuePosition(this.model, this.params);
            }
            if (is.ava(dad)) {
                key = this.key;
                dad = data.getValuePosition(this.name, this.params);
            } else {
                key = data.lastKey(this.model);
            }
            dad[key] = value;
        },
        //-> 设置属性信息
        initAttr: function (snowflak) {
            var value = snowflak.value;
            //-> 判断 是否要设置name 值
            if (value.name) {
                snowflak.target.setAttribute("name", value.name);
            }
            //-> 双向绑定
            if (value.model) {
                snowflak.target.addEventListener("input", this.changeValue.bind(snowflak), false);
                snowflak.target.addEventListener("change", this.changeValue.bind(snowflak), false);
            }
        },
        execute: function (snowflak, val) {
            val = is.ava(val) ? "" : val;
            //-> 处理
            switch (snowflak.target.nodeName) {
                //-> 输入框
                case "INPUT":
                    //-> 处理一下下
                    setInputValue(val, snowflak.target, snowflak);
                    break;
                default:
                    //->其余 不用管
                    snowflak.target.value = val;
                    break;
            }
        }
    });
    var fAttrName = {
        execute: function (snowflak, val) {
            if (val === undefined) {
                snowflak.target.removeAttribute(snowflak.value.name);
            } else {
                snowflak.target.setAttribute(snowflak.value.name, val);
            }
        },
        initAttr: function (snowflak) {
            return !snowflak.target.getAttribute("f-attr-name");
        }
    };
    rain.add("f-attr-name", fAttrName);
    rain.add("f-attr", {
        binding: false,
        execute: NullFunc,
        initAttr: function (snowflak, keys, param) {
            var keys = snowflak.value;
            if (typeof (keys) == "string") {
                keys = [keys];
            }
            var isArr = (keys instanceof Array);
            if (isArr) {
                var obj = {};
                for (var i = 0, t; t = keys[i]; i++) {
                    //-> 如果有小数点 则处理
                    obj[data.lastKey(t)] = t;
                }
                keys = obj;
            }
            var attrsNameValue = []
            for (var k in keys) {
                attrsNameValue.push({
                    name: "f-attr-name",
                    value: ("{".concat("key:", keys[k], ",name:", k, "}")),
                });
            }
            rain.attributeProcessing(snowflak.$frost, attrsNameValue, snowflak.target, param, snowflak.ssangyongs);
            snowflak.name = "";
        }
    });

    rain.add("f-switch", {
        initAttr: function (snowflak) {
            //-> 处理所有的 子集
            var chis = snowflak.target.children;
            if (chis) {
                //-> 
                var caseChildren = snowflak.caseChildren = [];
                //-> 默认值
                var defaultValue = snowflak.defaultValue = [];
                for (var i = 0, t; t = chis[i]; i++) {
                    var cs = t.getAttribute("f-case");
                    var ds = t.getAttribute("f-default");
                    if (!is.ava(cs)) {
                        t.removeAttribute("f-case");
                        t.caseValue = cs;
                        caseChildren.push({
                            value: cs,
                            elem: t,
                        });
                        t.setAttribute("hidden", "");
                    }
                    if (!is.ava(ds)) {
                        t.removeAttribute("f-default");
                        defaultValue.push(t);
                        t.setAttribute("hidden", "");
                    }
                }
            }
        },
        execute: function (snowflak, value) {
            //-> "case"
            //-> "default"
            //-> 获取 elem 的所有孩子  有 f-case 和 f-default 的才会做处理
            var show = [];
            var hide = [];
            //-> 循环处理 
            for (var i = 0, t, tv; t = snowflak.caseChildren[i]; i++) {
                tv = t.value;
                if (tv[0] == "$" && tv[tv.length - 1] == "}") {
                    //-> 目标值
                    var vs = data.getValue(tv.substring(1, tv.length - 1), snowflak.params);
                    //->  展示 处理
                    if (value === vs) {
                        show.push(t.elem);
                    } else {
                        hide.push(t.elem);
                    }
                } else if (tv == value) {
                    show.push(t.elem);
                } else {
                    hide.push(t.elem);
                }
            }
            //-> 没有则需要全部显示
            if (show.length === 0) {
                show.push.apply(show, snowflak.defaultValue);
            } else {
                //-> 所有需要 隐藏
                hide.push.apply(hide, snowflak.defaultValue);
            }
            //-> 先隐藏
            for (var i = 0, t; t = hide[i]; i++) {
                t.setAttribute("hidden", "");
            }
            //-> 在显示
            for (var i = 0, t; t = show[i]; i++) {
                t.removeAttribute("hidden");
            }
        }
    });

    rain.add("f-show", {
        execute: function (snowflak, value) {
            var isShow;
            if (snowflak.value.eval) {
                isShow = Function("value", "return " + snowflak.value.eval)(value);
            } else {
                isShow = !!value;
            }
            if (isShow) {
                //-> 显示
                snowflak.target.style.display = "";
            } else {
                //-> 隐藏
                snowflak.target.style.display = "none";
            }
        }
    });

    rain.add("f-data", {
        binding: false,
        initAttr: function (snowflak) {
            var ana = snowflak.value;
            if (snowflak.value.eval) {
                if (!is.func(snowflak.value.eval)) {
                    snowflak.value.eval = Function("value", "snowflak", "return " + snowflak.value.eval).bind(snowflak.$frost);
                }
            }
            //-> 处理
            var t;
            var datas = [];
            for (var key in ana) {
                t = ana[key];
                if(key == "eval"){
                    continue;
                }
                datas.push(key);
                var sg = data.getSsangyong(t, snowflak.ssangyongs);
                if (sg) {
                    sg.$appendSnowflaks(snowflak);
                }
            }
            snowflak.value.datas = datas; 
            snowflak.name = "";
        },
        execute: function (snowflak, value, key) {
            var dataset = snowflak.target.dataset;
            if (value === undefined && key === undefined) {
                //-> 所有目标
                var ana = snowflak.value.datas;
                if (snowflak.value.eval) {
                    for(var i=0,t;t=ana[i];i++){
                        dataset[t] =snowflak.value.eval(data.getValue(snowflak.value[t], snowflak.params), snowflak) ;
                    }
                }else{
                    for(var i=0,t;t=ana[i];i++){
                        dataset[t] = data.getValue(snowflak.value[t], snowflak.params);
                    }
                }
            } else {
                //-> 指定目标
                if (snowflak.value.eval) {
                    value =  snowflak.value.eval(value,snowflak);
                }
                dataset[key] = value;
            }
        }
    });
    /**
     * 目标处理: {
     *  click:name,
     *  input:name
     * }
     */
    rain.add("f-func", {
        binding: false,
        initAttr: function (snowflak) {
            snowflak.name = "";
        },
        execute: function (snowflak) {
            var eve = snowflak.value;
            var attrs = snowflak.target.attributes;
            var a;
            for (var name in eve) {
                a = document.createAttribute("eve-".concat(name))
                a.value = eve[name];
                attrs.setNamedItem(a);
            }
        }
    });

    rain.add("f-func-data", {
        binding: false,
        initAttr: function (snowflak) {
            snowflak.name = "";
        },
        execute: function (snowflak) {
            var ana = snowflak.value;
            var d = {};
            for (var key in ana) {
                d[key] = data.getValue(ana[key], snowflak.params);
            }
            snowflak.target.entrustData = d;
        }
    });

    rain.add("f-frost", {
        binding: false,
        initAttr: function () {
            //-> 不移除该属性
            return true;
        },
        execute: function (snowflak) {
            var name = snowflak.name;
            //-> 执行时跳过所有
            var fr = snowflak.$frost;
            if (fr.$name !== name) {
                fr.$recursive.recursiveNext = false;
            }
        }
    });
    /**
     * 循环,
     * {
     *  key: 循环目标, 允许 数字 , kv{}, 数组 , 字符串  实际调用 for(var k in key)
     *  loop:退出条件, 允许是 比较运算 , 允许是 funct , 只能在 frost声明
     *  index:name, //-> 下标值
     *  name: 当前循环值 可选的 如果没有则使用就近原则,
     *  elem: 模板目标对象 如果没有 则是自己 自己则是父级,当然 在第一次绑定时就确认的,
     *  append: 自定义添加函数
     * },
     * 循环没有给定键值 意味着是按照就近原则
     */
    rain.add("f-for", {
        addHtml: function (snowflak, htmls) {
            //-> 渲染完毕  然后挨个添加孩子  是否有动画 有动画则给开发者自己渲染
            if (is.func(snowflak.append)) {
                snowflak.append(snowflak.dad, htmls, "push");
            } else {
                //-> 判断是否同步渲染
                if (snowflak.value.sync) {
                    var time = document.createDocumentFragment();
                    for (var i in htmls) {
                        time.appendChild(htmls[i]);
                    }
                    snowflak.dad.insertBefore(time, snowflak.after);
                } else {
                    //-> 没有则自己渲染 如果 数据量过多则需要分批添加
                    //-> 单次最多渲染 1024个
                    util.elem.append(snowflak.dad, snowflak.after, htmls, 1024);
                }
            }
        },
        filter: function (snowflak, childrens) {
            var htmls = [];
            var val = snowflak.value
            var ofLoop = val.loop
            //-> 是否还要循环 
            if (ofLoop) {
                var name = val.name;
                var value, loop, func;
                //-> 表达式还是 func
                func = Function("value", "index", "param", "snowflak", ("return " + ofLoop));
                for (var i = 0, index = 0, t; t = childrens[i]; i++) {
                    value = name ? t.current[name] : t.current;
                    loop = func(value, i, snowflak.params, snowflak);
                    if (loop === true) {
                        if (t.elem.parentNode || t.elem.parentElement) {
                            util.elem.remove(t.elem);
                        }
                        continue;
                    } else if (loop === "break") {
                        //-> 剩余的 都要移除
                        for (var index = i, v; v = childrens[index]; index++) {
                            if (v.elem.parentNode || v.elem.parentElement) {
                                util.elem.remove(v.elem);
                            }
                        }
                        break;
                    }
                    if (val.index) {
                        t.current[val.index] = index++;
                    }
                    htmls.push(t.elem);
                }
            } else {
                for (var i = 0, t; t = childrens[i]; i++) {
                    htmls.push(t.elem);
                }
            }
            return htmls;
        },
        /**
         * 
         * @param {*} snowflak 霜降
         * @param {*} elem 目标对象
         * @param {*} index 下标 或则 key 
         * @param {*} value 当前循环变量
         * @param {*} around 循环对象 可能是数字
         * @returns 返回执行时的参数信息
         */
        attrForin: function (snowflak, elem, index, value, around, recu) {
            //-> 当前循环变体 先确定是否给定 name 如果给定 则需要先绑定 没有则后绑定
            //-> 获取标签信息
            var analysis = snowflak.value;
            var current = {};
            var sg = new Ssangyong("");
            var indexSg;
            if (analysis.index) {
                indexSg = new Ssangyong(analysis.index);
                Object.defineProperty(current, analysis.index, new GetSet(index, analysis.index, current, around.path.concat("$current.", analysis.index), indexSg, snowflak.$frost));
                Object.defineProperty(sg, analysis.index, indexSg);
            }
            var nameSg = typeof (around) == "object" ? Ssangyong.getSsangyong(index, around.ssangyong) : new Ssangyong(index);
            if (typeof (around) != "object") {
                if (!analysis.name) {
                    analysis.name = "value";
                }
            } else {
                if (!is.basic(value) && !value.__binding__) {
                    Twining(value, index, nameSg, around.path, around, true, snowflak.$frost);
                }
            }
            var newSsangyongs = Array.apply(Array, snowflak.ssangyongs);
            if (analysis.name) {
                Object.defineProperty(current, analysis.name, new GetSet(value, analysis.name, current, around.path ? around.path.concat("$current.", analysis.name) : "$current.".concat(analysis.name), nameSg, snowflak.$frost))
                Object.defineProperty(sg, analysis.name, nameSg);
                newSsangyongs.unshift(sg);
            } else {
                //-> 是对象 但是不提供 name 
                current.__proto__ = value;
                newSsangyongs.unshift(nameSg);
                newSsangyongs.unshift(sg);
            }
            //-> 是否封闭环境
            var newParams = analysis.seal ? [] : Array.apply(Array, snowflak.params);
            //-> 处理数据
            //-> 赋值并渲染
            newParams.unshift(current);
            //-> 再度循环
            recu.recursiveParamElem(newParams, newSsangyongs, elem);
            return current;
        },
        initTarget: function (snowflak, elem) {
            //-> 需要存储当前位置 以及最后的位置 创建两个 text 对象 一个在前 一个在后
            snowflak.before = document.createTextNode("");
            snowflak.after = document.createTextNode("");
            //-> 从容器中寻找
            if (snowflak.value && snowflak.value.elem) {
                if (snowflak.value.free) {
                    snowflak.target = temp.get(snowflak.value.elem).children[0];
                } else {
                    snowflak.target = document.createElement(elem.tagName);
                    snowflak.target.appendChild(temp.get(snowflak.value.elem));
                }
            } else {
                if (snowflak.value.free) {
                    var ch = elem.children[0];
                    snowflak.target = ch.cloneNode(true);
                    elem.removeChild(ch);
                } else {
                    snowflak.target = elem.cloneNode(true);
                    snowflak.target.removeAttribute("f-for");
                }
            }
            //-> 脱离自己 只循环子集 子集不参与循环
            if (snowflak.value.free) {
                snowflak.dad = elem;
                elem.appendChild(snowflak.before);
                elem.appendChild(snowflak.after);
            } else {
                var dad = snowflak.dad = elem.parentNode || elem.parentElement;
                dad.insertBefore(snowflak.before, elem);
                dad.insertBefore(snowflak.after, elem.nextElementSibling || elem.nextSibling); // nextElementSibling nextSibling
                //-> 移除自己
                dad.removeChild(elem);
            }
            if (snowflak.value && snowflak.value.append) {
                snowflak.append = Function("elem", "childrens", "retun " + snowflak.value.append);
            }

        },
        execute: function (snowflak, around) {
            //-> 这里一般是从新渲染
            //-> 获取循环对象
            if (snowflak.childrens) {
                for (var i = 0, v, d; v = snowflak.childrens[i]; i++) {
                    d = (v.elem.parentElement || v.elem.parentNode);
                    if (d) {
                        d.removeChild(v.elem);
                    }
                }
            }
            //-> recursiveParamElem
            var recu = snowflak.$frost.$recursive;
            if (is.ava(around)) {
                recu.recursiveNext = false;
                return;
            }
            var childrens = snowflak.childrens = [];
            var target;
            var current;

            //-> 数字?
            if (typeof (around) == "number" || around instanceof Number) {
                //-> 自己就是个替代品
                for (var i = 0; i < around; i++) {
                    target = snowflak.target.cloneNode(true);
                    current = this.attrForin(snowflak, target, i, new Number(i), around, recu);
                    //-> 追加
                    childrens.push({
                        "elem": target,
                        "current": current
                    });
                }
            } else {
                //-> 将对象添加进去
                for (var k in around) {
                    target = snowflak.target.cloneNode(true);
                    current = this.attrForin(snowflak, target, k, around[k], around, recu);
                    childrens.push({
                        "elem": target,
                        "current": current
                    });
                }
            }
            //-> 添加上去
            this.addHtml(snowflak, this.filter(snowflak, childrens));
            //-> 跳过当前这个
            recu.recursiveNext = false;
        }
    });

    rain.add("f-class", {
        execute: function (snowflake, classValue) {
            var classList = snowflake.target.classList;
            //-> 判断类型
            if (snowflake.value.eval) {
                classValue = Function("classValue", "snowflake", "return " + snowflake.value.eval)(classValue, snowflake);
                if (snowflake.beforeClass) {
                    //-> 移除
                    classList.remove(snowflake.beforeClass);
                }
                if (!is.ava(classValue)) {
                    classList.add(classValue);
                }
                snowflake.beforeClass = classValue;
            } else {
                if (is.ava(classValue)) {
                    classList.remove(snowflake.beforeClass);
                } else {
                    classList.add(classValue);
                    snowflake.beforeClass = classValue;
                }
            }
        }
    });
    rain.add("f-elem", {
        binding: false,
        execute: function (snowflak) {
            var elemTemp;
            if (snowflak.name.indexOf("${") == 0) {
                var name = data.getValue(snowflak.name.substring(2, snowflak.name.length - 1), snowflak.params);
                if (is.ava(name)) {
                    console.warn("地址" + snowflak.name + "无值");
                    return;
                }
                elemTemp = temp.get(name);
            } else {
                elemTemp = temp.get(snowflak.name);
            }

            //-> 一个数组
            var k = snowflak.value.value;
            if (k) {
                var obj = {
                    value: util.data.getValue(k, snowflak.params),
                };
                //-> 有自定义参数
                snowflak.params.unshift(obj);
            }

            snowflak.target.appendChild(elemTemp);
        }
    });
    rain.add("f-skip", {
        binding: false,
        execute: function (snowflak) {
            snowflak.$frost.$recursive.recursiveNext = false;
        }
    });
    rain.add("f-if", {
        binding: false,
        execute: function (snowflak, value) {
            var isShow;
            if (snowflak.value.eval) {
                isShow = Function("value", "return " + snowflak.value.eval)(value);
            } else {
                isShow = !!value;
            }
            //->取反
            if (snowflak.value.negate) {
                isShow = !isShow;
            }
            if (isShow) {
                //-> 显示
            } else {
                //-> 隐藏
                var pa = snowflak.target.parentElement || snowflak.target.parentNode;
                if (pa) {
                    pa.removeChild(snowflak.target);
                }
            }
        }
    });


    var styleSet = {
        execute: function (snowflak, val) {
            if (val === undefined) {
                snowflak.target.style[snowflak.value.name] = "";
            } else {
                snowflak.target.style[snowflak.value.name] = val;
            }
        },
        initAttr: function (snowflak) {
            return !snowflak.target.getAttribute("f-style");
        }
    };
    rain.add("f-style", styleSet);
    rain.add("f-css", {
        binding: true,
        execute: NullFunc,
        initAttr: function (snowflak, keys, param) {
            snowflak.name = "";
            var val = data.getValue(keys, param);
            var sccs = [];
            if (val) {
                //-> 必须是对象 存储获取
                for (var k in val) {
                    sccs.push({
                        name: "f-style",
                        value: ("{".concat("key:", keys, ".", k, ",name:", k, "}")),
                    });
                }
            } else {
                return;
            }
            rain.attributeProcessing(snowflak.$frost, sccs, snowflak.target, param, snowflak.ssangyongs);
        }
    });


    rain.add("f-hanshu", {
        initTarget: function (snowflak, elem) {
            snowflak.target = document.createTextNode("");
            elem.appendChild(snowflak.target);
            if (snowflak.value.eval) {
                if (!is.func(snowflak.value.eval)) {
                    snowflak.value.eval = Function("value", "snowflak", "return " + snowflak.value.eval).bind(snowflak.$frost);
                }
            }
        }, //-> 处理目标元素
        execute: function (snowflak, value) {
            var val = snowflak.value;
            var unit = snowflak.value.unit || "";
            if (snowflak.value.eval) {
                value = snowflak.value.eval(value, snowflak);
            }
            if (val.format == "RMB") {
                value = num.RMB(value, unit);
            } else if (val.format == "pole") {
                value = num.pole(value, unit);
            } else {
                value = num.chineseDecimal(value);
            }
            snowflak.target.data = is.ava(value) ? "" : value;
        } //-> 执行时
    });




    function NullFunc() { }

    /**
     * 获取 路径参数
     */
    function LocationParam(keyv) {
        var searchObj = new GetObject();
        var search = wind.location.search;
        if (search && search.length > 1) {
            search = search.substr(1);
            var kvs = search.split("&");
            var kv;
            for (var i in kvs) {
                kv = kvs[i].split("=");
                searchObj.append(kv[0], kv[1] ? decodeURIComponent(kv[1]) : "");
            }
        }
        if (keyv) {
            return searchObj.get(keyv);
        }
        return searchObj;
    }

    //-> 路径数据
    Frost.search = LocationParam();



})(window, window.document);