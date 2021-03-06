/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.7.2
 * Copyright (C) 2016 Oliver Nightingale
 * @license MIT
 */
!function () {
    var t = function (e) {
        var n = new t.Index;
        return n
            .pipeline
            .add(t.trimmer, t.stopWordFilter, t.stemmer),
        e && e.call(n, n),
        n
    };
    t.version = "0.7.2",
    t.utils = {},
    t.utils.warn = function (t) {
        return function (e) {
            t.console && console.warn && console.warn(e)
        }
    }(this),
    t.utils.asString = function (t) {
        return void 0 === t || null === t
            ? ""
            : t.toString()
    },
    t.EventEmitter = function () {
        this.events = {}
    },
    t.EventEmitter.prototype.addListener = function () {
        var t = Array
                .prototype
                .slice
                .call(arguments),
            e = t.pop(),
            n = t;
        if ("function" != typeof e) 
            throw new TypeError("last argument must be a function");
        n.forEach(function (t) {
            this.hasHandler(t) || (this.events[t] = []),
            this
                .events[t]
                .push(e)
        }, this)
    },
    t.EventEmitter.prototype.removeListener = function (t, e) {
        if (this.hasHandler(t)) {
            var n = this
                .events[t]
                .indexOf(e);
            this
                .events[t]
                .splice(n, 1),
            this
                .events[t]
                .length || delete this
                .events[t]
        }
    },
    t.EventEmitter.prototype.emit = function (t) {
        if (this.hasHandler(t)) {
            var e = Array
                .prototype
                .slice
                .call(arguments, 1);
            this
                .events[t]
                .forEach(function (t) {
                    t.apply(void 0, e)
                })
        }
    },
    t.EventEmitter.prototype.hasHandler = function (t) {
        return t in this.events
    },
    t.tokenizer = function (e) {
        if (!arguments.length || null == e || void 0 == e) 
            return [];
        if (Array.isArray(e)) 
            return e.map(function (e) {
                return t
                    .utils
                    .asString(e)
                    .toLowerCase()
            });
        var n = t.tokenizer.seperator || t.tokenizer.separator;
        return e
            .toString()
            .trim()
            .toLowerCase()
            .split(n)
    },
    t.tokenizer.seperator = !1,
    t.tokenizer.separator = /[\s\-]+/,
    t.tokenizer.load = function (t) {
        var e = this.registeredFunctions[t];
        if (!e) 
            throw new Error("Cannot load un-registered function: " + t);
        return e
    },
    t.tokenizer.label = "default",
    t.tokenizer.registeredFunctions = {
        "default": t.tokenizer
    },
    t.tokenizer.registerFunction = function (e, n) {
        n in this.registeredFunctions && t
            .utils
            .warn("Overwriting existing tokenizer: " + n),
        e.label = n,
        this.registeredFunctions[n] = e
    },
    t.Pipeline = function () {
        this._stack = []
    },
    t.Pipeline.registeredFunctions = {},
    t.Pipeline.registerFunction = function (e, n) {
        n in this.registeredFunctions && t
            .utils
            .warn("Overwriting existing registered function: " + n),
        e.label = n,
        t
            .Pipeline
            .registeredFunctions[e.label] = e
    },
    t.Pipeline.warnIfFunctionNotRegistered = function (e) {
        var n = e.label && e.label in this.registeredFunctions;
        n || t
            .utils
            .warn(
                "Function is not registered with pipeline. This may cause problems when seriali" +
                        "sing the index.\n",
                e
            )
    },
    t.Pipeline.load = function (e) {
        var n = new t.Pipeline;
        return e.forEach(function (e) {
            var i = t
                .Pipeline
                .registeredFunctions[e];
            if (!i) 
                throw new Error("Cannot load un-registered function: " + e);
            n.add(i)
        }),
        n
    },
    t.Pipeline.prototype.add = function () {
        var e = Array
            .prototype
            .slice
            .call(arguments);
        e.forEach(function (e) {
            t
                .Pipeline
                .warnIfFunctionNotRegistered(e),
            this
                ._stack
                .push(e)
        }, this)
    },
    t.Pipeline.prototype.after = function (e, n) {
        t
            .Pipeline
            .warnIfFunctionNotRegistered(n);
        var i = this
            ._stack
            .indexOf(e);
        if (-1 == i) 
            throw new Error("Cannot find existingFn");
        i += 1,
        this
            ._stack
            .splice(i, 0, n)
    },
    t.Pipeline.prototype.before = function (e, n) {
        t
            .Pipeline
            .warnIfFunctionNotRegistered(n);
        var i = this
            ._stack
            .indexOf(e);
        if (-1 == i) 
            throw new Error("Cannot find existingFn");
        this
            ._stack
            .splice(i, 0, n)
    },
    t.Pipeline.prototype.remove = function (t) {
        var e = this
            ._stack
            .indexOf(t);
        -1 != e && this
            ._stack
            .splice(e, 1)
    },
    t.Pipeline.prototype.run = function (t) {
        for (var e = [], n = t.length, i = this._stack.length, r = 0; n > r; r++) {
            for (
                var o = t[r],
                s = 0;
                i > s && (o = this._stack[s](o, r, t), void 0 !== o && "" !== o);
                s++
            ) 
            ;
            void 0 !== o && "" !== o && e.push(o)
        }
        return e
    },
    t.Pipeline.prototype.reset = function () {
        this._stack = []
    },
    t.Pipeline.prototype.toJSON = function () {
        return this
            ._stack
            .map(function (e) {
                return t
                    .Pipeline
                    .warnIfFunctionNotRegistered(e),
                e.label
            })
    },
    t.Vector = function () {
        this._magnitude = null,
        this.list = void 0,
        this.length = 0
    },
    t.Vector.Node = function (t, e, n) {
        this.idx = t,
        this.val = e,
        this.next = n
    },
    t.Vector.prototype.insert = function (e, n) {
        this._magnitude = void 0;
        var i = this.list;
        if (!i) 
            return this.list = new t
                .Vector
                .Node(e, n, i),
            this.length++;
        if (e < i.idx) 
            return this.list = new t
                .Vector
                .Node(e, n, i),
            this.length++;
        for (var r = i, o = i.next; void 0 != o;) {
            if (e < o.idx) 
                return r.next = new t
                    .Vector
                    .Node(e, n, o),
                this.length++;
            r = o,
            o = o.next
        }
        return r.next = new t
            .Vector
            .Node(e, n, o),
        this.length++
    },
    t.Vector.prototype.magnitude = function () {
        if (this._magnitude) 
            return this._magnitude;
        for (var t, e = this.list, n = 0; e;) 
            t = e.val,
            n += t * t,
            e = e.next;
        return this._magnitude = Math.sqrt(n)
    },
    t.Vector.prototype.dot = function (t) {
        for (var e = this.list, n = t.list, i = 0; e && n;) 
            e.idx < n.idx
                ? e = e.next
                : e.idx > n.idx
                    ? n = n.next
                    : (i += e.val * n.val, e = e.next, n = n.next);
        return i
    },
    t.Vector.prototype.similarity = function (t) {
        return this.dot(t) / (this.magnitude() * t.magnitude())
    },
    t.SortedSet = function () {
        this.length = 0,
        this.elements = []
    },
    t.SortedSet.load = function (t) {
        var e = new this;
        return e.elements = t,
        e.length = t.length,
        e
    },
    t.SortedSet.prototype.add = function () {
        var t,
            e;
        for (t = 0; t < arguments.length; t++) 
            e = arguments[t], ~ this.indexOf(e) || this
                .elements
                .splice(this.locationFor(e), 0, e);
        this.length = this.elements.length
    },
    t.SortedSet.prototype.toArray = function () {
        return this
            .elements
            .slice()
    },
    t.SortedSet.prototype.map = function (t, e) {
        return this
            .elements
            .map(t, e)
    },
    t.SortedSet.prototype.forEach = function (t, e) {
        return this
            .elements
            .forEach(t, e)
    },
    t.SortedSet.prototype.indexOf = function (t) {
        for (
            var e = 0,
            n = this.elements.length,
            i = n - e,
            r = e + Math.floor(i / 2),
            o = this.elements[r];
            i > 1;
        ) {
            if (o === t) 
                return r;
            t > o && (e = r),
            o > t && (n = r),
            i = n - e,
            r = e + Math.floor(i / 2),
            o = this.elements[r]
        }
        return o === t
            ? r
            : -1
    },
    t.SortedSet.prototype.locationFor = function (t) {
        for (
            var e = 0,
            n = this.elements.length,
            i = n - e,
            r = e + Math.floor(i / 2),
            o = this.elements[r];
            i > 1;
        ) 
            t > o && (e = r),
            o > t && (n = r),
            i = n - e,
            r = e + Math.floor(i / 2),
            o = this.elements[r];
        return o > t
            ? r
            : t > o
                ? r + 1
                : void 0
    },
    t.SortedSet.prototype.intersect = function (e) {
        for (
            var n = new t.SortedSet,
            i = 0,
            r = 0,
            o = this.length,
            s = e.length,
            a = this.elements,
            h = e.elements;
            ;
        ) {
            if (i > o - 1 || r > s - 1) 
                break;
            a[i] !== h[r]
                ? a[i] < h[r]
                    ? i++
                    : a[i] > h[r] && r++
                : (n.add(a[i]), i++, r++)
        }
        return n
    },
    t.SortedSet.prototype.clone = function () {
        var e = new t.SortedSet;
        return e.elements = this.toArray(),
        e.length = e.elements.length,
        e
    },
    t.SortedSet.prototype.union = function (t) {
        var e,
            n,
            i;
        this.length >= t.length
            ? (e = this, n = t)
            : (e = t, n = this),
        i = e.clone();
        for (var r = 0, o = n.toArray(); r < o.length; r++) 
            i.add(o[r]);
        return i
    },
    t.SortedSet.prototype.toJSON = function () {
        return this.toArray()
    },
    t.Index = function () {
        this._fields = [],
        this._ref = "id",
        this.pipeline = new t.Pipeline,
        this.documentStore = new t.Store,
        this.tokenStore = new t.TokenStore,
        this.corpusTokens = new t.SortedSet,
        this.eventEmitter = new t.EventEmitter,
        this.tokenizerFn = t.tokenizer,
        this._idfCache = {},
        this.on("add", "remove", "update", function () {
            this._idfCache = {}
        }.bind(this))
    },
    t.Index.prototype.on = function () {
        var t = Array
            .prototype
            .slice
            .call(arguments);
        return this
            .eventEmitter
            .addListener
            .apply(this.eventEmitter, t)
    },
    t.Index.prototype.off = function (t, e) {
        return this
            .eventEmitter
            .removeListener(t, e)
    },
    t.Index.load = function (e) {
        e.version !== t.version && t
            .utils
            .warn("version mismatch: current " + t.version + " importing " + e.version);
        var n = new this;
        return n._fields = e.fields,
        n._ref = e.ref,
        n.tokenizer(t.tokenizer.load(e.tokenizer)),
        n.documentStore = t
            .Store
            .load(e.documentStore),
        n.tokenStore = t
            .TokenStore
            .load(e.tokenStore),
        n.corpusTokens = t
            .SortedSet
            .load(e.corpusTokens),
        n.pipeline = t
            .Pipeline
            .load(e.pipeline),
        n
    },
    t.Index.prototype.field = function (t, e) {
        var e = e || {},
            n = {
                name: t,
                boost: e.boost || 1
            };
        return this
            ._fields
            .push(n),
        this
    },
    t.Index.prototype.ref = function (t) {
        return this._ref = t,
        this
    },
    t.Index.prototype.tokenizer = function (e) {
        var n = e.label && e.label in t.tokenizer.registeredFunctions;
        return n || t
            .utils
            .warn(
                "Function is not a registered tokenizer. This may cause problems when serialisi" +
                "ng the index"
            ),
        this.tokenizerFn = e,
        this
    },
    t.Index.prototype.add = function (e, n) {
        var i = {},
            r = new t.SortedSet,
            o = e[this._ref],
            n = void 0 === n
                ? !0
                : n;
        this
            ._fields
            .forEach(function (t) {
                var n = this
                    .pipeline
                    .run(this.tokenizerFn(e[t.name]));
                i[t.name] = n;
                for (var o = 0; o < n.length; o++) {
                    var s = n[o];
                    r.add(s),
                    this
                        .corpusTokens
                        .add(s)
                }
            }, this),
        this
            .documentStore
            .set(o, r);
        for (var s = 0; s < r.length; s++) {
            for (var a = r.elements[s], h = 0, u = 0; u < this._fields.length; u++) {
                var l = this._fields[u],
                    c = i[l.name],
                    f = c.length;
                if (f) {
                    for (var d = 0, p = 0; f > p; p++) 
                        c[p] === a && d++;
                    h += d / f * l.boost
                }
            }
            this
                .tokenStore
                .add(a, {
                    ref: o,
                    tf: h
                })
        }
        n && this
            .eventEmitter
            .emit("add", e, this)
    },
    t.Index.prototype.remove = function (t, e) {
        var n = t[this._ref],
            e = void 0 === e
                ? !0
                : e;
        if (this.documentStore.has(n)) {
            var i = this
                .documentStore
                .get(n);
            this
                .documentStore
                .remove(n),
            i.forEach(function (t) {
                this
                    .tokenStore
                    .remove(t, n)
            }, this),
            e && this
                .eventEmitter
                .emit("remove", t, this)
        }
    },
    t.Index.prototype.update = function (t, e) {
        var e = void 0 === e
            ? !0
            : e;
        this.remove(t, !1),
        this.add(t, !1),
        e && this
            .eventEmitter
            .emit("update", t, this)
    },
    t.Index.prototype.idf = function (t) {
        var e = "@" + t;
        if (Object.prototype.hasOwnProperty.call(this._idfCache, e)) 
            return this._idfCache[e];
        var n = this
                .tokenStore
                .count(t),
            i = 1;
        return n > 0 && (i = 1 + Math.log(this.documentStore.length / n)),
        this._idfCache[e] = i
    },
    t.Index.prototype.search = function (e) {
        var n = this
                .pipeline
                .run(this.tokenizerFn(e)),
            i = new t.Vector,
            r = [],
            o = this
                ._fields
                .reduce(function (t, e) {
                    return t + e.boost
                }, 0),
            s = n.some(function (t) {
                return this
                    .tokenStore
                    .has(t)
            }, this);
        if (!s) 
            return [];
        n.forEach(function (e, n, s) {
            var a = 1 / s.length * this._fields.length * o,
                h = this,
                u = this
                    .tokenStore
                    .expand(e)
                    .reduce(function (n, r) {
                        var o = h
                                .corpusTokens
                                .indexOf(r),
                            s = h.idf(r),
                            u = 1,
                            l = new t.SortedSet;
                        if (r !== e) {
                            var c = Math.max(3, r.length - e.length);
                            u = 1 / Math.log(c)
                        }
                        o > -1 && i.insert(o, a * s * u);
                        for (
                            var f = h.tokenStore.get(r),
                            d = Object.keys(f),
                            p = d.length,
                            v = 0;
                            p > v;
                            v++
                        ) 
                            l.add(f[d[v]].ref);
                        return n.union(l)
                    }, new t.SortedSet);
            r.push(u)
        }, this);
        var a = r.reduce(function (t, e) {
            return t.intersect(e)
        });
        return a
            .map(function (t) {
                return {
                    ref: t,
                    score: i.similarity(this.documentVector(t))
                }
            }, this)
            .sort(function (t, e) {
                return e.score - t.score
            })
    },
    t.Index.prototype.documentVector = function (e) {
        for (
            var n = this.documentStore.get(e),
            i = n.length,
            r = new t.Vector,
            o = 0;
            i > o;
            o++
        ) {
            var s = n.elements[o],
                a = this
                    .tokenStore
                    .get(s)[e]
                    .tf,
                h = this.idf(s);
            r.insert(this.corpusTokens.indexOf(s), a * h)
        }
        return r
    },
    t.Index.prototype.toJSON = function () {
        return {
            version: t.version,
            fields: this._fields,
            ref: this._ref,
            tokenizer: this.tokenizerFn.label,
            documentStore: this
                .documentStore
                .toJSON(),
            tokenStore: this
                .tokenStore
                .toJSON(),
            corpusTokens: this
                .corpusTokens
                .toJSON(),
            pipeline: this
                .pipeline
                .toJSON()
        }
    },
    t.Index.prototype.use = function (t) {
        var e = Array
            .prototype
            .slice
            .call(arguments, 1);
        e.unshift(this),
        t.apply(this, e)
    },
    t.Store = function () {
        this.store = {},
        this.length = 0
    },
    t.Store.load = function (e) {
        var n = new this;
        return n.length = e.length,
        n.store = Object
            .keys(e.store)
            .reduce(function (n, i) {
                return n[i] = t
                    .SortedSet
                    .load(e.store[i]),
                n
            }, {}),
        n
    },
    t.Store.prototype.set = function (t, e) {
        this.has(t) || this.length++,
        this.store[t] = e
    },
    t.Store.prototype.get = function (t) {
        return this.store[t]
    },
    t.Store.prototype.has = function (t) {
        return t in this.store
    },
    t.Store.prototype.remove = function (t) {
        this.has(t) && (delete this.store[t], this.length--)
    },
    t.Store.prototype.toJSON = function () {
        return {store: this.store, length: this.length}
    },
    t.stemmer = function () {
        var t = {
                ational: "ate",
                tional: "tion",
                enci: "ence",
                anci: "ance",
                izer: "ize",
                bli: "ble",
                alli: "al",
                entli: "ent",
                eli: "e",
                ousli: "ous",
                ization: "ize",
                ation: "ate",
                ator: "ate",
                alism: "al",
                iveness: "ive",
                fulness: "ful",
                ousness: "ous",
                aliti: "al",
                iviti: "ive",
                biliti: "ble",
                logi: "log"
            },
            e = {
                icate: "ic",
                ative: "",
                alize: "al",
                iciti: "ic",
                ical: "ic",
                ful: "",
                ness: ""
            },
            n = "[^aeiou]",
            i = "[aeiouy]",
            r = n + "[^aeiouy]*",
            o = i + "[aeiou]*",
            s = "^(" + r + ")?" + o + r,
            a = "^(" + r + ")?" + o + r + "(" + o + ")?$",
            h = "^(" + r + ")?" + o + r + o + r,
            u = "^(" + r + ")?" + i,
            l = new RegExp(s),
            c = new RegExp(h),
            f = new RegExp(a),
            d = new RegExp(u),
            p = /^(.+?)(ss|i)es$/,
            v = /^(.+?)([^s])s$/,
            g = /^(.+?)eed$/,
            m = /^(.+?)(ed|ing)$/,
            y = /.$/,
            S = /(at|bl|iz)$/,
            w = new RegExp("([^aeiouylsz])\\1$"),
            k = new RegExp("^" + r + i + "[^aeiouwxy]$"),
            x = /^(.+?[^aeiou])y$/,
            b = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,
            E = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,
            F = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,
            _ = /^(.+?)(s|t)(ion)$/,
            z = /^(.+?)e$/,
            O = /ll$/,
            P = new RegExp("^" + r + i + "[^aeiouwxy]$"),
            T = function (n) {
                var i,
                    r,
                    o,
                    s,
                    a,
                    h,
                    u;
                if (n.length < 3) 
                    return n;
                if (
                    o = n.substr(0, 1),
                    "y" == o && (n = o.toUpperCase() + n.substr(1)),
                    s = p,
                    a = v,
                    s.test(n)
                        ? n = n.replace(s, "$1$2")
                        : a.test(n) && (n = n.replace(a, "$1$2")),
                    s = g,
                    a = m,
                    s.test(n)
                ) {
                    var T = s.exec(n);
                    s = l,
                    s.test(T[1]) && (s = y, n = n.replace(s, ""))
                } else if (a.test(n)) {
                    var T = a.exec(n);
                    i = T[1],
                    a = d,
                    a.test(i) && (
                        n = i,
                        a = S,
                        h = w,
                        u = k,
                        a.test(n)
                            ? n += "e"
                            : h.test(n)
                                ? (s = y, n = n.replace(s, ""))
                                : u.test(n) && (n += "e")
                    )
                }
                if (s = x, s.test(n)) {
                    var T = s.exec(n);
                    i = T[1],
                    n = i + "i"
                }
                if (s = b, s.test(n)) {
                    var T = s.exec(n);
                    i = T[1],
                    r = T[2],
                    s = l,
                    s.test(i) && (n = i + t[r])
                }
                if (s = E, s.test(n)) {
                    var T = s.exec(n);
                    i = T[1],
                    r = T[2],
                    s = l,
                    s.test(i) && (n = i + e[r])
                }
                if (s = F, a = _, s.test(n)) {
                    var T = s.exec(n);
                    i = T[1],
                    s = c,
                    s.test(i) && (n = i)
                } else if (a.test(n)) {
                    var T = a.exec(n);
                    i = T[1] + T[2],
                    a = c,
                    a.test(i) && (n = i)
                }
                if (s = z, s.test(n)) {
                    var T = s.exec(n);
                    i = T[1],
                    s = c,
                    a = f,
                    h = P,
                    (s.test(i) || a.test(i) && !h.test(i)) && (n = i)
                }
                return s = O,
                a = c,
                s.test(n) && a.test(n) && (s = y, n = n.replace(s, "")),
                "y" == o && (n = o.toLowerCase() + n.substr(1)),
                n
            };
        return T
    }(),
    t
        .Pipeline
        .registerFunction(t.stemmer, "stemmer"),
    t.generateStopWordFilter = function (t) {
        var e = t.reduce(function (t, e) {
            return t[e] = e,
            t
        }, {});
        return function (t) {
            return t && e[t] !== t
                ? t
                : void 0
        }
    },
    t.stopWordFilter = t.generateStopWordFilter([
        "a",
        "able",
        "about",
        "across",
        "after",
        "all",
        "almost",
        "also",
        "am",
        "among",
        "an",
        "and",
        "any",
        "are",
        "as",
        "at",
        "be",
        "because",
        "been",
        "but",
        "by",
        "can",
        "cannot",
        "could",
        "dear",
        "did",
        "do",
        "does",
        "either",
        "else",
        "ever",
        "every",
        "for",
        "from",
        "get",
        "got",
        "had",
        "has",
        "have",
        "he",
        "her",
        "hers",
        "him",
        "his",
        "how",
        "however",
        "i",
        "if",
        "in",
        "into",
        "is",
        "it",
        "its",
        "just",
        "least",
        "let",
        "like",
        "likely",
        "may",
        "me",
        "might",
        "most",
        "must",
        "my",
        "neither",
        "no",
        "nor",
        "not",
        "of",
        "off",
        "often",
        "on",
        "only",
        "or",
        "other",
        "our",
        "own",
        "rather",
        "said",
        "say",
        "says",
        "she",
        "should",
        "since",
        "so",
        "some",
        "than",
        "that",
        "the",
        "their",
        "them",
        "then",
        "there",
        "these",
        "they",
        "this",
        "tis",
        "to",
        "too",
        "twas",
        "us",
        "wants",
        "was",
        "we",
        "were",
        "what",
        "when",
        "where",
        "which",
        "while",
        "who",
        "whom",
        "why",
        "will",
        "with",
        "would",
        "yet",
        "you",
        "your"
    ]),
    t
        .Pipeline
        .registerFunction(t.stopWordFilter, "stopWordFilter"),
    t.trimmer = function (t) {
        return t
            .replace(/^\W+/, "")
            .replace(/\W+$/, "")
    },
    t
        .Pipeline
        .registerFunction(t.trimmer, "trimmer"),
    t.TokenStore = function () {
        this.root = {
            docs: {}
        },
        this.length = 0
    },
    t.TokenStore.load = function (t) {
        var e = new this;
        return e.root = t.root,
        e.length = t.length,
        e
    },
    t.TokenStore.prototype.add = function (t, e, n) {
        var n = n || this.root,
            i = t.charAt(0),
            r = t.slice(1);
        return i in n || (n[i] = {
            docs: {}
        }),
        0 === r.length
            ? (n[i].docs[e.ref] = e, void(this.length += 1))
            : this.add(r, e, n[i])
    },
    t.TokenStore.prototype.has = function (t) {
        if (!t) 
            return !1;
        for (var e = this.root, n = 0; n < t.length; n++) {
            if (!e[t.charAt(n)]) 
                return !1;
            e = e[t.charAt(n)]
        }
        return !0
    },
    t.TokenStore.prototype.getNode = function (t) {
        if (!t) 
            return {};
        for (var e = this.root, n = 0; n < t.length; n++) {
            if (!e[t.charAt(n)]) 
                return {};
            e = e[t.charAt(n)]
        }
        return e
    },
    t.TokenStore.prototype.get = function (t, e) {
        return this
            .getNode(t, e)
            .docs || {}
    },
    t.TokenStore.prototype.count = function (t, e) {
        return Object
            .keys(this.get(t, e))
            .length
    },
    t.TokenStore.prototype.remove = function (t, e) {
        if (t) {
            for (var n = this.root, i = 0; i < t.length; i++) {
                if (!(t.charAt(i) in n)) 
                    return;
                n = n[t.charAt(i)]
            }
            delete n.docs[e]
        }
    },
    t.TokenStore.prototype.expand = function (t, e) {
        var n = this.getNode(t),
            i = n.docs || {},
            e = e || [];
        return Object
            .keys(i)
            .length && e.push(t),
        Object
            .keys(n)
            .forEach(function (n) {
                "docs" !== n && e.concat(this.expand(t + n, e))
            }, this),
        e
    },
    t.TokenStore.prototype.toJSON = function () {
        return {root: this.root, length: this.length}
    },
    function (t, e) {
        "function" == typeof define && define.amd
            ? define(e)
            : "object" == typeof exports
                ? module.exports = e()
                : t.lunr = e()
    }(this, function () {
        return t
    })
}();