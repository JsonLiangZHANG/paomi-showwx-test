! function(a, b, c, d) {
    "use strict";

    function e(a, b, c) {
        return setTimeout(j(a, c), b)
    }

    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
    }

    function g(a, b, c) {
        var e;
        if (a)
            if (a.forEach) a.forEach(b, c);
            else if (a.length !== d)
                for (e = 0; e < a.length;) b.call(c, a[e], e, a), e++;
            else
                for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a)
    }

    function h(b, c, d) {
        var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
        return function() {
            var c = new Error("get-stack-trace"),
                d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                f = a.console && (a.console.warn || a.console.log);
            return f && f.call(a.console, e, d), b.apply(this, arguments)
        }
    }

    function i(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && hb(d, c)
    }

    function j(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function k(a, b) {
        return typeof a == kb ? a.apply(b ? b[0] || d : d, b) : a
    }

    function l(a, b) {
        return a === d ? b : a
    }

    function m(a, b, c) {
        g(q(b), function(b) {
            a.addEventListener(b, c, !1)
        })
    }

    function n(a, b, c) {
        g(q(b), function(b) {
            a.removeEventListener(b, c, !1)
        })
    }

    function o(a, b) {
        for (; a;) {
            if (a == b) return !0;
            a = a.parentNode
        }
        return !1
    }

    function p(a, b) {
        return a.indexOf(b) > -1
    }

    function q(a) {
        return a.trim().split(/\s+/g)
    }

    function r(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length;) {
            if (c && a[d][c] == b || !c && a[d] === b) return d;
            d++
        }
        return -1
    }

    function s(a) {
        return Array.prototype.slice.call(a, 0)
    }

    function t(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length;) {
            var g = b ? a[f][b] : a[f];
            r(e, g) < 0 && d.push(a[f]), e[f] = g, f++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()), d
    }

    function u(a, b) {
        for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ib.length;) {
            if (c = ib[g], e = c ? c + f : b, e in a) return e;
            g++
        }
        return d
    }

    function v() {
        return qb++
    }

    function w(b) {
        var c = b.ownerDocument || b;
        return c.defaultView || c.parentWindow || a
    }

    function x(a, b) {
        var c = this;
        this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function(b) {
            k(a.options.enable, [a]) && c.handler(b)
        }, this.init()
    }

    function y(a) {
        var b, c = a.options.inputClass;
        return new(b = c ? c : tb ? M : ub ? P : sb ? R : L)(a, z)
    }

    function z(a, b, c) {
        var d = c.pointers.length,
            e = c.changedPointers.length,
            f = b & Ab && d - e === 0,
            g = b & (Cb | Db) && d - e === 0;
        c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c
    }

    function A(a, b) {
        var c = a.session,
            d = b.pointers,
            e = d.length;
        c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput,
            g = c.firstMultiple,
            h = g ? g.center : f.center,
            i = b.center = E(d);
        b.timeStamp = nb(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY);
        var j = F(b.deltaTime, b.deltaX, b.deltaY);
        b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = mb(j.x) > mb(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b);
        var k = a.element;
        o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k
    }

    function B(a, b) {
        var c = b.center,
            d = a.offsetDelta || {},
            e = a.prevDelta || {},
            f = a.prevInput || {};
        (b.eventType === Ab || f.eventType === Cb) && (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        }, d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y)
    }

    function C(a, b) {
        var c, e, f, g, h = a.lastInterval || b,
            i = b.timeStamp - h.timeStamp;
        if (b.eventType != Db && (i > zb || h.velocity === d)) {
            var j = b.deltaX - h.deltaX,
                k = b.deltaY - h.deltaY,
                l = F(i, j, k);
            e = l.x, f = l.y, c = mb(l.x) > mb(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b
        } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
        b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g
    }

    function D(a) {
        for (var b = [], c = 0; c < a.pointers.length;) b[c] = {
            clientX: lb(a.pointers[c].clientX),
            clientY: lb(a.pointers[c].clientY)
        }, c++;
        return {
            timeStamp: nb(),
            pointers: b,
            center: E(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }

    function E(a) {
        var b = a.length;
        if (1 === b) return {
            x: lb(a[0].clientX),
            y: lb(a[0].clientY)
        };
        for (var c = 0, d = 0, e = 0; b > e;) c += a[e].clientX, d += a[e].clientY, e++;
        return {
            x: lb(c / b),
            y: lb(d / b)
        }
    }

    function F(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        }
    }

    function G(a, b) {
        return a === b ? Eb : mb(a) >= mb(b) ? 0 > a ? Fb : Gb : 0 > b ? Hb : Ib
    }

    function H(a, b, c) {
        c || (c = Mb);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e)
    }

    function I(a, b, c) {
        c || (c = Mb);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI
    }

    function J(a, b) {
        return I(b[1], b[0], Nb) + I(a[1], a[0], Nb)
    }

    function K(a, b) {
        return H(b[0], b[1], Nb) / H(a[0], a[1], Nb)
    }

    function L() {
        this.evEl = Pb, this.evWin = Qb, this.allow = !0, this.pressed = !1, x.apply(this, arguments)
    }

    function M() {
        this.evEl = Tb, this.evWin = Ub, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
    }

    function N() {
        this.evTarget = Wb, this.evWin = Xb, this.started = !1, x.apply(this, arguments)
    }

    function O(a, b) {
        var c = s(a.touches),
            d = s(a.changedTouches);
        return b & (Cb | Db) && (c = t(c.concat(d), "identifier", !0)), [c, d]
    }

    function P() {
        this.evTarget = Zb, this.targetIds = {}, x.apply(this, arguments)
    }

    function Q(a, b) {
        var c = s(a.touches),
            d = this.targetIds;
        if (b & (Ab | Bb) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
        var e, f, g = s(a.changedTouches),
            h = [],
            i = this.target;
        if (f = c.filter(function(a) {
                return o(a.target, i)
            }), b === Ab)
            for (e = 0; e < f.length;) d[f[e].identifier] = !0, e++;
        for (e = 0; e < g.length;) d[g[e].identifier] && h.push(g[e]), b & (Cb | Db) && delete d[g[e].identifier], e++;
        return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0
    }

    function R() {
        x.apply(this, arguments);
        var a = j(this.handler, this);
        this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a)
    }

    function S(a, b) {
        this.manager = a, this.set(b)
    }

    function T(a) {
        if (p(a, dc)) return dc;
        var b = p(a, ec),
            c = p(a, fc);
        return b && c ? dc : b || c ? b ? ec : fc : p(a, cc) ? cc : bc
    }

    function U(a) {
        this.options = hb({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = gc, this.simultaneous = {}, this.requireFail = []
    }

    function V(a) {
        return a & lc ? "cancel" : a & jc ? "end" : a & ic ? "move" : a & hc ? "start" : ""
    }

    function W(a) {
        return a == Ib ? "down" : a == Hb ? "up" : a == Fb ? "left" : a == Gb ? "right" : ""
    }

    function X(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }

    function Y() {
        U.apply(this, arguments)
    }

    function Z() {
        Y.apply(this, arguments), this.pX = null, this.pY = null
    }

    function $() {
        Y.apply(this, arguments)
    }

    function _() {
        U.apply(this, arguments), this._timer = null, this._input = null
    }

    function ab() {
        Y.apply(this, arguments)
    }

    function bb() {
        Y.apply(this, arguments)
    }

    function cb() {
        U.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
    }

    function db(a, b) {
        return b = b || {}, b.recognizers = l(b.recognizers, db.defaults.preset), new eb(a, b)
    }

    function eb(a, b) {
        this.options = hb({}, db.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, this.input = y(this), this.touchAction = new S(this, this.options.touchAction), fb(this, !0), g(this.options.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3])
        }, this)
    }

    function fb(a, b) {
        var c = a.element;
        c.style && g(a.options.cssProps, function(a, d) {
            c.style[u(c.style, d)] = b ? a : ""
        })
    }

    function gb(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d)
    }
    var hb, ib = ["", "webkit", "Moz", "MS", "ms", "o"],
        jb = b.createElement("div"),
        kb = "function",
        lb = Math.round,
        mb = Math.abs,
        nb = Date.now;
    hb = "function" != typeof Object.assign ? function(a) {
        if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");
        for (var b = Object(a), c = 1; c < arguments.length; c++) {
            var e = arguments[c];
            if (e !== d && null !== e)
                for (var f in e) e.hasOwnProperty(f) && (b[f] = e[f])
        }
        return b
    } : Object.assign;
    var ob = h(function(a, b, c) {
            for (var e = Object.keys(b), f = 0; f < e.length;)(!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
            return a
        }, "extend", "Use `assign`."),
        pb = h(function(a, b) {
            return ob(a, b, !0)
        }, "merge", "Use `assign`."),
        qb = 1,
        rb = /mobile|tablet|ip(ad|hone|od)|android/i,
        sb = "ontouchstart" in a,
        tb = u(a, "PointerEvent") !== d,
        ub = sb && rb.test(navigator.userAgent),
        vb = "touch",
        wb = "pen",
        xb = "mouse",
        yb = "kinect",
        zb = 25,
        Ab = 1,
        Bb = 2,
        Cb = 4,
        Db = 8,
        Eb = 1,
        Fb = 2,
        Gb = 4,
        Hb = 8,
        Ib = 16,
        Jb = Fb | Gb,
        Kb = Hb | Ib,
        Lb = Jb | Kb,
        Mb = ["x", "y"],
        Nb = ["clientX", "clientY"];
    x.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler)
        }
    };
    var Ob = {
            mousedown: Ab,
            mousemove: Bb,
            mouseup: Cb
        },
        Pb = "mousedown",
        Qb = "mousemove mouseup";
    i(L, x, {
        handler: function(a) {
            var b = Ob[a.type];
            b & Ab && 0 === a.button && (this.pressed = !0), b & Bb && 1 !== a.which && (b = Cb), this.pressed && this.allow && (b & Cb && (this.pressed = !1), this.callback(this.manager, b, {
                pointers: [a],
                changedPointers: [a],
                pointerType: xb,
                srcEvent: a
            }))
        }
    });
    var Rb = {
            pointerdown: Ab,
            pointermove: Bb,
            pointerup: Cb,
            pointercancel: Db,
            pointerout: Db
        },
        Sb = {
            2: vb,
            3: wb,
            4: xb,
            5: yb
        },
        Tb = "pointerdown",
        Ub = "pointermove pointerup pointercancel";
    a.MSPointerEvent && !a.PointerEvent && (Tb = "MSPointerDown", Ub = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, {
        handler: function(a) {
            var b = this.store,
                c = !1,
                d = a.type.toLowerCase().replace("ms", ""),
                e = Rb[d],
                f = Sb[a.pointerType] || a.pointerType,
                g = f == vb,
                h = r(b, a.pointerId, "pointerId");
            e & Ab && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Cb | Db) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }), c && b.splice(h, 1))
        }
    });
    var Vb = {
            touchstart: Ab,
            touchmove: Bb,
            touchend: Cb,
            touchcancel: Db
        },
        Wb = "touchstart",
        Xb = "touchstart touchmove touchend touchcancel";
    i(N, x, {
        handler: function(a) {
            var b = Vb[a.type];
            if (b === Ab && (this.started = !0), this.started) {
                var c = O.call(this, a, b);
                b & (Cb | Db) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: vb,
                    srcEvent: a
                })
            }
        }
    });
    var Yb = {
            touchstart: Ab,
            touchmove: Bb,
            touchend: Cb,
            touchcancel: Db
        },
        Zb = "touchstart touchmove touchend touchcancel";
    i(P, x, {
        handler: function(a) {
            var b = Yb[a.type],
                c = Q.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: vb,
                srcEvent: a
            })
        }
    }), i(R, x, {
        handler: function(a, b, c) {
            var d = c.pointerType == vb,
                e = c.pointerType == xb;
            if (d) this.mouse.allow = !1;
            else if (e && !this.mouse.allow) return;
            b & (Cb | Db) && (this.mouse.allow = !0), this.callback(a, b, c)
        },
        destroy: function() {
            this.touch.destroy(), this.mouse.destroy()
        }
    });
    var $b = u(jb.style, "touchAction"),
        _b = $b !== d,
        ac = "compute",
        bc = "auto",
        cc = "manipulation",
        dc = "none",
        ec = "pan-x",
        fc = "pan-y";
    S.prototype = {
        set: function(a) {
            a == ac && (a = this.compute()), _b && this.manager.element.style && (this.manager.element.style[$b] = a), this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) {
                k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }), T(a.join(" "))
        },
        preventDefaults: function(a) {
            if (!_b) {
                var b = a.srcEvent,
                    c = a.offsetDirection;
                if (this.manager.session.prevented) return void b.preventDefault();
                var d = this.actions,
                    e = p(d, dc),
                    f = p(d, fc),
                    g = p(d, ec);
                if (e) {
                    var h = 1 === a.pointers.length,
                        i = a.distance < 2,
                        j = a.deltaTime < 250;
                    if (h && i && j) return
                }
                if (!g || !f) return e || f && c & Jb || g && c & Kb ? this.preventSrc(b) : void 0
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0, a.preventDefault()
        }
    };
    var gc = 1,
        hc = 2,
        ic = 4,
        jc = 8,
        kc = jc,
        lc = 16,
        mc = 32;
    U.prototype = {
        defaults: {},
        set: function(a) {
            return hb(this.options, a), this.manager && this.manager.touchAction.update(), this
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            return a = X(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = X(a, this), delete this.simultaneous[a.id], this)
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            return a = X(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this)) return this;
            a = X(a, this);
            var b = r(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1), this
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(b, a)
            }
            var c = this,
                d = this.state;
            jc > d && b(c.options.event + V(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= jc && b(c.options.event + V(d))
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void(this.state = mc)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length;) {
                if (!(this.requireFail[a].state & (mc | gc))) return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            var b = hb({}, a);
            return k(this.options.enable, [this, b]) ? (this.state & (kc | lc | mc) && (this.state = gc), this.state = this.process(b), void(this.state & (hc | ic | jc | lc) && this.tryEmit(b))) : (this.reset(), void(this.state = mc))
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    }, i(Y, U, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
                c = a.eventType,
                d = b & (hc | ic),
                e = this.attrTest(a);
            return d && (c & Db || !e) ? b | lc : d || e ? c & Cb ? b | jc : b & hc ? b | ic : hc : mc
        }
    }), i(Z, Y, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Lb
        },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            return a & Jb && b.push(fc), a & Kb && b.push(ec), b
        },
        directionTest: function(a) {
            var b = this.options,
                c = !0,
                d = a.distance,
                e = a.direction,
                f = a.deltaX,
                g = a.deltaY;
            return e & b.direction || (b.direction & Jb ? (e = 0 === f ? Eb : 0 > f ? Fb : Gb, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Eb : 0 > g ? Hb : Ib, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return Y.prototype.attrTest.call(this, a) && (this.state & hc || !(this.state & hc) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX, this.pY = a.deltaY;
            var b = W(a.direction);
            b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a)
        }
    }), i($, Y, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [dc]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & hc)
        },
        emit: function(a) {
            if (1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                a.additionalEvent = this.options.event + b
            }
            this._super.emit.call(this, a)
        }
    }), i(_, U, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 251,
            threshold: 9
        },
        getTouchAction: function() {
            return [bc]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime > b.time;
            if (this._input = a, !d || !c || a.eventType & (Cb | Db) && !f) this.reset();
            else if (a.eventType & Ab) this.reset(), this._timer = e(function() {
                this.state = kc, this.tryEmit()
            }, b.time, this);
            else if (a.eventType & Cb) return kc;
            return mc
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            this.state === kc && (a && a.eventType & Cb ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb(), this.manager.emit(this.options.event, this._input)))
        }
    }), i(ab, Y, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [dc]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & hc)
        }
    }), i(bb, Y, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .3,
            direction: Jb | Kb,
            pointers: 1
        },
        getTouchAction: function() {
            return Z.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return c & (Jb | Kb) ? b = a.overallVelocity : c & Jb ? b = a.overallVelocityX : c & Kb && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && mb(b) > this.options.velocity && a.eventType & Cb
        },
        emit: function(a) {
            var b = W(a.offsetDirection);
            b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a)
        }
    }), i(cb, U, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [cc]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime < b.time;
            if (this.reset(), a.eventType & Ab && 0 === this.count) return this.failTimeout();
            if (d && f && c) {
                if (a.eventType != Cb) return this.failTimeout();
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
                    h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
                var i = this.count % b.taps;
                if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function() {
                    this.state = kc, this.tryEmit()
                }, b.interval, this), hc) : kc
            }
            return mc
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = mc
            }, this.options.interval, this), mc
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            this.state == kc && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    }), db.VERSION = "2.0.6", db.defaults = {
        domEvents: !1,
        touchAction: ac,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [ab, {
                enable: !1
            }],
            [$, {
                enable: !1
            },
                ["rotate"]
            ],
            [bb, {
                direction: Jb
            }],
            [Z, {
                direction: Jb
            },
                ["swipe"]
            ],
            [cb],
            [cb, {
                event: "doubletap",
                taps: 2
            },
                ["tap"]
            ],
            [_]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var nc = 1,
        oc = 2;
    eb.prototype = {
        set: function(a) {
            return hb(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
        },
        stop: function(a) {
            this.session.stopped = a ? oc : nc
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers,
                    e = b.curRecognizer;
                (!e || e && e.state & kc) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length;) c = d[f], b.stopped === oc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (hc | ic | jc) && (e = b.curRecognizer = c), f++
            }
        },
        get: function(a) {
            if (a instanceof U) return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++)
                if (b[c].options.event == a) return b[c];
            return null
        },
        add: function(a) {
            if (f(a, "add", this)) return this;
            var b = this.get(a.options.event);
            return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
        },
        remove: function(a) {
            if (f(a, "remove", this)) return this;
            if (a = this.get(a)) {
                var b = this.recognizers,
                    c = r(b, a); - 1 !== c && (b.splice(c, 1), this.touchAction.update())
            }
            return this
        },
        on: function(a, b) {
            var c = this.handlers;
            return g(q(a), function(a) {
                c[a] = c[a] || [], c[a].push(b)
            }), this
        },
        off: function(a, b) {
            var c = this.handlers;
            return g(q(a), function(a) {
                b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a]
            }), this
        },
        emit: function(a, b) {
            this.options.domEvents && gb(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a, b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                };
                for (var d = 0; d < c.length;) c[d](b), d++
            }
        },
        destroy: function() {
            this.element && fb(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
        }
    }, hb(db, {
        INPUT_START: Ab,
        INPUT_MOVE: Bb,
        INPUT_END: Cb,
        INPUT_CANCEL: Db,
        STATE_POSSIBLE: gc,
        STATE_BEGAN: hc,
        STATE_CHANGED: ic,
        STATE_ENDED: jc,
        STATE_RECOGNIZED: kc,
        STATE_CANCELLED: lc,
        STATE_FAILED: mc,
        DIRECTION_NONE: Eb,
        DIRECTION_LEFT: Fb,
        DIRECTION_RIGHT: Gb,
        DIRECTION_UP: Hb,
        DIRECTION_DOWN: Ib,
        DIRECTION_HORIZONTAL: Jb,
        DIRECTION_VERTICAL: Kb,
        DIRECTION_ALL: Lb,
        Manager: eb,
        Input: x,
        TouchAction: S,
        TouchInput: P,
        MouseInput: L,
        PointerEventInput: M,
        TouchMouseInput: R,
        SingleTouchInput: N,
        Recognizer: U,
        AttrRecognizer: Y,
        Tap: cb,
        Pan: Z,
        Swipe: bb,
        Pinch: $,
        Rotate: ab,
        Press: _,
        on: m,
        off: n,
        each: g,
        merge: pb,
        extend: ob,
        assign: hb,
        inherit: i,
        bindFn: j,
        prefixed: u
    });
    var pc = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {};
    pc.Hammer = db, "function" == typeof define && define.amd ? define(function() {
        return db
    }) : "undefined" != typeof module && module.exports ? module.exports = db : a[c] = db
}(window, document, "Hammer");
(function(win, doc) {
    $.fn.slide2del = function(options) {
        var opt = $.extend(true, {
            offset: 0,
            sItemClass: "session-box",
            sDelBtnClass: "del-btn"
        }, options);
        if (opt.sItemClass.indexOf(".") >= 0) {
            opt.sItemClass = opt.sItemClass.substring(1)
        }
        if (opt.sDelBtnClass.indexOf(".") >= 0) {
            opt.sDelBtnClass = opt.sDelBtnClass.substring(1)
        }
        opt.offset = $('.' + opt.sDelBtnClass).width();
        return $(this).each(function() {
            var offset = opt.offset;
            var _this = $(this).get(0);
            $(this).on('touchend', function(e) {
                var target = $(e.target);
                if (!target.hasClass(opt.sItemClass)) {
                    target = target.parents('.' + opt.sItemClass)
                }
                var isShow = $(this).attr("isShow");
                if (isShow != "true") {
                    console.log("鼠标抬起:", isShow, target);
                    target.animate({
                        left: 0
                    }, 300)
                }
            }).on('click', function() {
                var isShow = $(this).attr("isShow");
                if (isShow != "true") {
                    return false
                }
                if (opt.itemClickHandler) {
                    var result = opt.itemClickHandler.call(this, $(this));
                    if (result != false) {
                        $(this).slide2del_hideDel()
                    }
                } else {
                    $(this).slide2del_hideDel()
                }
            }).on('click', '.' + opt.sDelBtnClass, function(e) {
                var target = $(e.target);
                if (!target.hasClass(opt.sItemClass)) {
                    target = target.parents('.' + opt.sItemClass)
                }
                opt.delHandler && opt.delHandler(target, $(this));
                target.css({
                    left: 0,
                    'transition': 'left 300ms',
                    '-webkit-transition': 'left 300ms'
                }).attr("isShow", false)
            });
            $(this).__proto__.slide2del_hideDel = function() {
                $(this).css({
                    left: 0,
                    'transition': 'left 300ms',
                    '-webkit-transition': 'left 300ms'
                }).attr("isShow", false)
            };
            var hammertime = new Hammer(_this);
            var lastAngle = null;
            hammertime.on("pan", function(e) {
                var dx = e.deltaX;
                if (lastAngle != null) {
                    if (Math.abs(180 - Math.abs(e.angle)) > 45) {
                        return false
                    }
                }
                lastAngle = e.angle;
                var target = $(e.target);
                if (!target.hasClass(opt.sItemClass)) {
                    target = target.parents('.' + opt.sItemClass)
                }
                var isShow = target.attr("isShow");
                if (dx < 0 && isShow != "true") {
                    target.siblings('.' + opt.sItemClass).css({
                        left: 0,
                        'transition': 'left 300ms',
                        '-webkit-transition': 'left 300ms'
                    }).attr('isShow', false);
                    if (Math.abs(dx) > offset) {
                        target.css({
                            left: -Math.floor(offset),
                            'transition': 'none',
                            '-webkit-transition': 'none'
                        }).attr('isShow', true)
                    } else {
                        target.css({
                            left: Math.floor(dx),
                            'transition': 'none',
                            '-webkit-transition': 'none'
                        })
                    }
                } else if (dx > 0) {
                    target.css({
                        left: 0,
                        'transition': 'left 300ms',
                        '-webkit-transition': 'left 300ms'
                    }).attr('isShow', false)
                }
            })
        })
    }
})(window, document);