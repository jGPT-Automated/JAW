// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, D());
			else {
				var t = n(l);
				t !== null && re(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function ee() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function E() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ee());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && re(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? D() : S = !1;
			}
		}
	}
	var D;
	if (typeof y == "function") D = function() {
		y(E);
	};
	else if (typeof MessageChannel < "u") {
		var te = new MessageChannel(), ne = te.port2;
		te.port1.onmessage = E, D = function() {
			ne.postMessage(null);
		};
	} else D = function() {
		_(E, 0);
	};
	function re(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, re(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, D()))), r;
	}, e.unstable_shouldYield = ee, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ee = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function te(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ne(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var re = /\/+/g;
	function ie(e, t) {
		return typeof e == "object" && e && e.key != null ? ne("" + e.key) : t.toString(36);
	}
	function ae(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function oe(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, oe(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ie(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(re, "$&/") + "/"), oe(o, r, i, "", function(e) {
			return e;
		})) : o != null && (te(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(re, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ie(a, u), c += oe(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ie(a, u++), c += oe(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return oe(ae(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function se(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return oe(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function O(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var ce = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function le(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, ce);
		} catch (e) {
			ce(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function ue(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else le(ue.bind(null, e));
	}
	var de = {
		map: se,
		forEach: function(e, t, n) {
			se(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return se(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return se(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!te(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = de, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = ue, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ee.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ee.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = te, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: O
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = le, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = u(), n = f(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function ee(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var E = Object.assign, D = Symbol.for("react.element"), te = Symbol.for("react.transitional.element"), ne = Symbol.for("react.portal"), re = Symbol.for("react.fragment"), ie = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), oe = Symbol.for("react.consumer"), se = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), ce = Symbol.for("react.suspense"), le = Symbol.for("react.suspense_list"), ue = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), fe = Symbol.for("react.activity"), pe = Symbol.for("react.legacy_hidden"), me = Symbol.for("react.memo_cache_sentinel"), he = Symbol.for("react.view_transition"), k = Symbol.for("react.recoverable"), ge = Symbol.iterator;
	function _e(e) {
		return typeof e != "object" || !e ? null : (e = ge && e[ge] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ve = Symbol.for("react.client.reference");
	function ye(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ve ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case re: return "Fragment";
			case ae: return "Profiler";
			case ie: return "StrictMode";
			case ce: return "Suspense";
			case le: return "SuspenseList";
			case fe: return "Activity";
			case he: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case ne: return "Portal";
			case se: return e.displayName || "Context";
			case oe: return (e._context.displayName || "Context") + ".Consumer";
			case O:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ue: return t = e.displayName || null, t === null ? ye(e.type) || "Memo" : t;
			case de:
				t = e._payload, e = e._init;
				try {
					return ye(e(t));
				} catch {}
		}
		return null;
	}
	var be = Array.isArray, A = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, j = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, xe = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Se = [], Ce = -1;
	function we(e) {
		return { current: e };
	}
	function Te(e) {
		0 > Ce || (e.current = Se[Ce], Se[Ce] = null, Ce--);
	}
	function M(e, t) {
		Ce++, Se[Ce] = e.current, e.current = t;
	}
	var Ee = we(null), De = we(null), Oe = we(null), ke = we(null);
	function Ae(e, t) {
		switch (M(Oe, t), M(De, e), M(Ee, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Te(Ee), M(Ee, e);
	}
	function je() {
		Te(Ee), Te(De), Te(Oe);
	}
	function Me(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, M(ke, e)), t = Ee.current;
		var n = dp(t, e.type);
		t !== n && (M(De, e), M(Ee, n));
	}
	function Ne(e) {
		De.current === e && (Te(Ee), Te(De)), ke.current === e && (Te(ke), sh._currentValue = xe);
	}
	var Pe, Fe;
	function Ie(e) {
		if (Pe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Pe = t && t[1] || "", Fe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Pe + e + Fe;
	}
	var Le = !1;
	function Re(e, t) {
		if (!e || Le) return "";
		Le = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Le = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ie(n) : "";
	}
	function ze(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ie(e.type);
			case 16: return Ie("Lazy");
			case 13: return e.child !== t && t !== null ? Ie("Suspense Fallback") : Ie("Suspense");
			case 19: return Ie("SuspenseList");
			case 0:
			case 15: return Re(e.type, !1);
			case 11: return Re(e.type.render, !1);
			case 1: return Re(e.type, !0);
			case 31: return Ie("Activity");
			case 30: return Ie("ViewTransition");
			default: return "";
		}
	}
	function Be(e) {
		try {
			var t = "", n = null;
			do
				t += ze(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ve = Object.prototype.hasOwnProperty, He = t.unstable_scheduleCallback, Ue = t.unstable_cancelCallback, We = t.unstable_shouldYield, Ge = t.unstable_requestPaint, Ke = t.unstable_now, qe = t.unstable_getCurrentPriorityLevel, Je = t.unstable_ImmediatePriority, Ye = t.unstable_UserBlockingPriority, Xe = t.unstable_NormalPriority, Ze = t.unstable_LowPriority, Qe = t.unstable_IdlePriority, $e = t.log, et = t.unstable_setDisableYieldValue, tt = null, nt = null;
	function rt(e) {
		if (typeof $e == "function" && et(e), nt && typeof nt.setStrictMode == "function") try {
			nt.setStrictMode(tt, e);
		} catch {}
	}
	var it = Math.clz32 ? Math.clz32 : st, at = Math.log, ot = Math.LN2;
	function st(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (at(e) / ot | 0) | 0;
	}
	var ct = 256, lt = 262144, ut = 4194304;
	function dt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function ft(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = dt(n))) : i = dt(o) : i = dt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = dt(n))) : i = dt(o)) : i = dt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function pt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function mt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - it(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ht(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function gt() {
		var e = ut;
		return ut <<= 1, !(ut & 62914560) && (ut = 4194304), e;
	}
	function N(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function _t(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function vt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - it(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && yt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function yt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - it(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function bt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - it(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function xt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : St(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function St(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function Ct(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function wt() {
		var e = j.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function Tt(e, t) {
		var n = j.p;
		try {
			return j.p = e, t();
		} finally {
			j.p = n;
		}
	}
	var Et = Math.random().toString(36).slice(2), Dt = "__reactFiber$" + Et, Ot = "__reactProps$" + Et, kt = "__reactContainer$" + Et, At = "__reactEvents$" + Et, jt = "__reactListeners$" + Et, Mt = "__reactHandles$" + Et, Nt = "__reactResources$" + Et, Pt = "__reactMarker$" + Et, Ft = "__reactLoad$" + Et;
	function It(e) {
		delete e[Dt], delete e[Ot], delete e[jt], delete e[Mt];
	}
	function Lt(e) {
		var t;
		if (t = e[Dt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[kt] || n[Dt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[Dt]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Rt(e) {
		if (e = e[Dt] || e[kt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function zt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Bt(e) {
		var t = e[Nt];
		return t ||= e[Nt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Vt(e) {
		e[Pt] = !0;
	}
	function Ht(e) {
		e[Ft] = void 0;
	}
	var Ut = /* @__PURE__ */ new Set(), P = {};
	function Wt(e, t) {
		Gt(e, t), Gt(e + "Capture", t);
	}
	function Gt(e, t) {
		for (P[e] = t, e = 0; e < t.length; e++) Ut.add(t[e]);
	}
	var Kt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), qt = {}, Jt = {};
	function Yt(e) {
		return Ve.call(Jt, e) ? !0 : Ve.call(qt, e) ? !1 : Kt.test(e) ? Jt[e] = !0 : (qt[e] = !0, !1);
	}
	var F = !1;
	function Xt() {
		var e = F;
		return F = !1, e;
	}
	function Zt(e, t, n) {
		if (Yt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Qt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function $t(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function en(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function tn(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function nn(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function rn(e) {
		if (!e._valueTracker) {
			var t = tn(e) ? "checked" : "value";
			e._valueTracker = nn(e, t, "" + e[t]);
		}
	}
	function an(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = tn(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var on = /[\n"\\]/g;
	function sn(e) {
		return e.replace(on, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function cn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + en(t)) : e.value !== "" + en(t) && (e.value = "" + en(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : I(e, en(n)) : o === "number" && e.value == t ? I(e, en(e.value)) : I(e, en(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + en(s) : e.removeAttribute("name");
	}
	function ln(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				rn(e);
				return;
			}
			n = n == null ? "" : "" + en(n), t = t == null ? n : "" + en(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), rn(e);
	}
	function I(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function un(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + en(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function dn(e, t, n) {
		t != null && (t = "" + en(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + en(n);
	}
	function fn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (be(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = en(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), rn(e);
	}
	function pn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var mn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function hn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || mn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function gn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", F = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (hn(e, a, r), F = !0);
		} else for (var o in t) t.hasOwnProperty(o) && hn(e, o, t[o]);
	}
	function _n(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var vn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), yn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function bn(e) {
		return yn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function xn() {}
	var Sn = null;
	function Cn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var wn = null, Tn = null;
	function En(e) {
		var t = Rt(e);
		if (t && (e = t.stateNode)) {
			var n = e[Ot] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (cn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + sn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Ot] || null;
								if (!a) throw Error(i(90));
								cn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && an(r);
					}
					break a;
				case "textarea":
					dn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && un(e, !!n.multiple, t, !1);
			}
		}
	}
	var Dn = !1;
	function On(e, t, n) {
		if (Dn) return e(t, n);
		Dn = !0;
		try {
			return e(t);
		} finally {
			if (Dn = !1, (wn !== null || Tn !== null) && (Hd(), wn && (t = wn, e = Tn, Tn = wn = null, En(t), e))) for (t = 0; t < e.length; t++) En(e[t]);
		}
	}
	function kn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Ot] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var An = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, jn = !1;
	if (An) try {
		var Mn = {};
		Object.defineProperty(Mn, "passive", { get: function() {
			jn = !0;
		} }), window.addEventListener("test", Mn, Mn), window.removeEventListener("test", Mn, Mn);
	} catch {
		jn = !1;
	}
	var Nn = null, Pn = null, Fn = null;
	function In() {
		if (Fn) return Fn;
		var e, t = Pn, n = t.length, r, i = "value" in Nn ? Nn.value : Nn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Fn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Ln(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Rn() {
		return !0;
	}
	function zn() {
		return !1;
	}
	function Bn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Rn : zn, this.isPropagationStopped = zn, this;
		}
		return E(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Rn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Rn);
			},
			persist: function() {},
			isPersistent: Rn
		}), t;
	}
	var Vn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Hn = Bn(Vn), Un = E({}, Vn, {
		view: 0,
		detail: 0
	}), Wn = Bn(Un), Gn, Kn, qn, Jn = E({}, Un, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: ar,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== qn && (qn && e.type === "mousemove" ? (Gn = e.screenX - qn.screenX, Kn = e.screenY - qn.screenY) : Kn = Gn = 0, qn = e), Gn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Kn;
		}
	}), Yn = Bn(Jn), Xn = Bn(E({}, Jn, { dataTransfer: 0 })), Zn = Bn(E({}, Un, { relatedTarget: 0 })), Qn = Bn(E({}, Vn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), $n = Bn(E({}, Vn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), er = Bn(E({}, Vn, { data: 0 })), tr = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, nr = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, rr = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function ir(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = rr[e]) ? !!t[e] : !1;
	}
	function ar() {
		return ir;
	}
	var or = Bn(E({}, Un, {
		key: function(e) {
			if (e.key) {
				var t = tr[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Ln(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? nr[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: ar,
		charCode: function(e) {
			return e.type === "keypress" ? Ln(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Ln(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), sr = Bn(E({}, Jn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), cr = Bn(E({}, Vn, { submitter: 0 })), lr = Bn(E({}, Un, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: ar
	})), ur = Bn(E({}, Vn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), dr = Bn(E({}, Jn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), fr = Bn(E({}, Vn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), pr = [
		9,
		13,
		27,
		32
	], mr = An && "CompositionEvent" in window, hr = null;
	An && "documentMode" in document && (hr = document.documentMode);
	var gr = An && "TextEvent" in window && !hr, _r = An && (!mr || hr && 8 < hr && 11 >= hr), vr = " ", yr = !1;
	function br(e, t) {
		switch (e) {
			case "keyup": return pr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function xr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Sr = !1;
	function Cr(e, t) {
		switch (e) {
			case "compositionend": return xr(t);
			case "keypress": return t.which === 32 ? (yr = !0, vr) : null;
			case "textInput": return e = t.data, e === vr && yr ? null : e;
			default: return null;
		}
	}
	function wr(e, t) {
		if (Sr) return e === "compositionend" || !mr && br(e, t) ? (e = In(), Fn = Pn = Nn = null, Sr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return _r && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Tr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Er(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Tr[e.type] : t === "textarea";
	}
	function Dr(e, t, n, r) {
		wn ? Tn ? Tn.push(r) : Tn = [r] : wn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Hn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Or = null, kr = null;
	function Ar(e) {
		Vf(e, 0);
	}
	function jr(e) {
		if (an(zt(e))) return e;
	}
	function Mr(e, t) {
		if (e === "change") return t;
	}
	var Nr = !1;
	if (An) {
		var Pr;
		if (An) {
			var Fr = "oninput" in document;
			if (!Fr) {
				var Ir = document.createElement("div");
				Ir.setAttribute("oninput", "return;"), Fr = typeof Ir.oninput == "function";
			}
			Pr = Fr;
		} else Pr = !1;
		Nr = Pr && (!document.documentMode || 9 < document.documentMode);
	}
	function Lr() {
		Or && (Or.detachEvent("onpropertychange", Rr), kr = Or = null);
	}
	function Rr(e) {
		if (e.propertyName === "value" && jr(kr)) {
			var t = [];
			Dr(t, kr, e, Cn(e)), On(Ar, t);
		}
	}
	function zr(e, t, n) {
		e === "focusin" ? (Lr(), Or = t, kr = n, Or.attachEvent("onpropertychange", Rr)) : e === "focusout" && Lr();
	}
	function Br(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return jr(kr);
	}
	function Vr(e, t) {
		if (e === "click") return jr(t);
	}
	function Hr(e, t) {
		if (e === "input" || e === "change") return jr(t);
	}
	function Ur(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Wr = typeof Object.is == "function" ? Object.is : Ur;
	function Gr(e, t) {
		if (Wr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ve.call(t, i) || !Wr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Kr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function qr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Jr(e, t) {
		var n = qr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = qr(n);
		}
	}
	function Yr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Yr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Xr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Kr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Kr(e.document);
		}
		return t;
	}
	function Zr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Qr = An && "documentMode" in document && 11 >= document.documentMode, $r = null, ei = null, ti = null, ni = !1;
	function ri(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ni || $r == null || $r !== Kr(r) || (r = $r, "selectionStart" in r && Zr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ti && Gr(ti, r) || (ti = r, r = Jf(ei, "onSelect"), 0 < r.length && (t = new Hn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = $r)));
	}
	function ii(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ai = {
		animationend: ii("Animation", "AnimationEnd"),
		animationiteration: ii("Animation", "AnimationIteration"),
		animationstart: ii("Animation", "AnimationStart"),
		transitionrun: ii("Transition", "TransitionRun"),
		transitionstart: ii("Transition", "TransitionStart"),
		transitioncancel: ii("Transition", "TransitionCancel"),
		transitionend: ii("Transition", "TransitionEnd")
	}, oi = {}, si = {};
	An && (si = document.createElement("div").style, "AnimationEvent" in window || (delete ai.animationend.animation, delete ai.animationiteration.animation, delete ai.animationstart.animation), "TransitionEvent" in window || delete ai.transitionend.transition);
	function ci(e) {
		if (oi[e]) return oi[e];
		if (!ai[e]) return e;
		var t = ai[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in si) return oi[e] = t[n];
		return e;
	}
	var li = ci("animationend"), ui = ci("animationiteration"), di = ci("animationstart"), fi = ci("transitionrun"), pi = ci("transitionstart"), mi = ci("transitioncancel"), hi = ci("transitionend"), gi = /* @__PURE__ */ new Map(), _i = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	_i.push("scrollEnd");
	function vi(e, t) {
		gi.set(e, t), Wt(t, [e]);
	}
	var yi = 0;
	function bi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Cd.identifierPrefix;
		var n = yi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function xi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = jd;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function Si(e, t) {
		return e = xi(e), t = xi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Ci = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, wi = [], Ti = 0, Ei = 0;
	function Di() {
		for (var e = Ti, t = Ei = Ti = 0; t < e;) {
			var n = wi[t];
			wi[t++] = null;
			var r = wi[t];
			wi[t++] = null;
			var i = wi[t];
			wi[t++] = null;
			var a = wi[t];
			if (wi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ji(n, i, a);
		}
	}
	function Oi(e, t, n, r) {
		wi[Ti++] = e, wi[Ti++] = t, wi[Ti++] = n, wi[Ti++] = r, Ei |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ki(e, t, n, r) {
		return Oi(e, t, n, r), Mi(e);
	}
	function Ai(e, t) {
		return Oi(e, null, null, t), Mi(e);
	}
	function ji(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - it(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Mi(e) {
		if (50 < Md) throw Md = 0, Nd = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Ni = {};
	function Pi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Fi(e, t, n, r) {
		return new Pi(e, t, n, r);
	}
	function Ii(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Li(e, t) {
		var n = e.alternate;
		return n === null ? (n = Fi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ri(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function zi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ii(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ee.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case fe: return e = Fi(31, n, t, a), e.elementType = fe, e.lanes = o, e;
			case re: return Bi(n.children, a, o, t);
			case ie:
				s = 8, a |= 24;
				break;
			case ae: return e = Fi(12, n, t, a | 2), e.elementType = ae, e.lanes = o, e;
			case ce: return e = Fi(13, n, t, a), e.elementType = ce, e.lanes = o, e;
			case le: return e = Fi(19, n, t, a), e.elementType = le, e.lanes = o, e;
			case pe:
			case he: return e = a | 32, e = Fi(30, n, t, e), e.elementType = he, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case se:
						s = 10;
						break a;
					case oe:
						s = 9;
						break a;
					case O:
						s = 11;
						break a;
					case ue:
						s = 14;
						break a;
					case de:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Fi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Bi(e, t, n, r) {
		return e = Fi(7, e, r, t), e.lanes = n, e;
	}
	function Vi(e, t, n) {
		return e = Fi(6, e, null, t), e.lanes = n, e;
	}
	function Hi(e) {
		var t = Fi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ui(e, t, n) {
		return t = Fi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Wi = /* @__PURE__ */ new WeakMap();
	function Gi(e, t) {
		if (typeof e == "object" && e) {
			var n = Wi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Be(t)
			}, Wi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Be(t)
		};
	}
	var Ki = [], qi = 0, Ji = null, Yi = 0, Xi = [], Zi = 0, Qi = null, $i = 1, ea = "";
	function ta(e, t) {
		Ki[qi++] = Yi, Ki[qi++] = Ji, Ji = e, Yi = t;
	}
	function na(e, t, n) {
		Xi[Zi++] = $i, Xi[Zi++] = ea, Xi[Zi++] = Qi, Qi = e;
		var r = $i;
		e = ea;
		var i = 32 - it(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - it(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, $i = 1 << 32 - it(t) + i | n << i | r, ea = a + e;
		} else $i = 1 << a | n << i | r, ea = e;
	}
	function ra(e) {
		e.return !== null && (ta(e, 1), na(e, 1, 0));
	}
	function ia(e) {
		for (; e === Ji;) Ji = Ki[--qi], Ki[qi] = null, Yi = Ki[--qi], Ki[qi] = null;
		for (; e === Qi;) Qi = Xi[--Zi], Xi[Zi] = null, ea = Xi[--Zi], Xi[Zi] = null, $i = Xi[--Zi], Xi[Zi] = null;
	}
	function aa(e, t) {
		Xi[Zi++] = $i, Xi[Zi++] = ea, Xi[Zi++] = Qi, $i = t.id, ea = t.overflow, Qi = e;
	}
	var oa = null, L = null, R = !1, sa = null, ca = !1, la = Error(i(519));
	function ua(e) {
		throw ga(Gi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), la;
	}
	function da(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Dt] = e, t[Ot] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), ln(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), fn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = xn), t = !0) : t = !1, t || ua(e, !0);
	}
	function fa(e) {
		for (oa = e.return; oa;) switch (oa.tag) {
			case 5:
			case 31:
			case 13:
				ca = !1;
				return;
			case 27:
			case 3:
				ca = !0;
				return;
			default: oa = oa.return;
		}
	}
	function pa(e) {
		if (e !== oa) return !1;
		if (!R) return fa(e), R = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && L && ua(e), fa(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			L = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			L = dm(e);
		} else t === 27 ? (t = L, Sp(e.type) ? (e = um, um = null, L = e) : L = t) : L = oa ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ma() {
		L = oa = null, R = !1;
	}
	function ha() {
		var e = sa;
		return e !== null && (hd === null ? hd = e : hd.push.apply(hd, e), sa = null), e;
	}
	function ga(e) {
		sa === null ? sa = [e] : sa.push(e);
	}
	var _a = we(null), va = null, ya = null;
	function ba(e, t, n) {
		M(_a, t._currentValue), t._currentValue = n;
	}
	function xa(e) {
		e._currentValue = _a.current, Te(_a);
	}
	function Sa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ca(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Sa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Sa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), Sa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function wa(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Wr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ke.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && Ca(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Ta(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Wr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ea(e) {
		va = e, ya = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Da(e) {
		return ka(va, e);
	}
	function Oa(e, t) {
		return va === null && Ea(e), ka(e, t);
	}
	function ka(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ya === null) {
			if (e === null) throw Error(i(308));
			ya = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ya = ya.next = t;
		return n;
	}
	var Aa = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, ja = t.unstable_scheduleCallback, Ma = t.unstable_NormalPriority, Na = {
		$$typeof: se,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Pa() {
		return {
			controller: new Aa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Fa(e) {
		e.refCount--, e.refCount === 0 && ja(Ma, function() {
			e.controller.abort();
		});
	}
	function Ia(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var La = null;
	function Ra(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var za = null, Ba = 0, Va = 0, Ha = null;
	function Ua(e, t) {
		if (za === null) {
			var n = za = [];
			Ba = 0, Va = Pf(), Ha = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ba++, t.then(Wa, Wa), t;
	}
	function Wa() {
		if (--Ba === 0 && (La = null, za !== null)) {
			Ha !== null && (Ha.status = "fulfilled");
			var e = za;
			za = null, Va = 0, Ha = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ga(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ka = A.S;
	A.S = function(e, t) {
		if (vd = Ke(), typeof t == "object" && t && typeof t.then == "function" && Ua(e, t), La !== null) for (var n = X; n !== null;) Ia(n, La), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = X; r !== null;) Ia(r, n), r = r.next;
			if (Va !== 0) {
				r = La, r === null && (r = La = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ka !== null && Ka(e, t);
	};
	var qa = we(null);
	function Ja() {
		var e = qa.current;
		return e === null ? W.pooledCache : e;
	}
	function Ya(e, t) {
		t === null ? M(qa, qa.current) : M(qa, t.pool);
	}
	function Xa() {
		var e = Ja();
		return e === null ? null : {
			parent: Na._currentValue,
			pool: e
		};
	}
	var Za = Error(i(460)), Qa = Error(i(474)), $a = Error(i(542)), eo = { then: function() {} };
	function to(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function no(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(xn, xn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, oo(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(xn, xn);
				else {
					if (e = W, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, oo(e), e;
				}
				throw io = t, Za;
		}
	}
	function ro(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (io = e, Za) : e;
		}
	}
	var io = null;
	function ao() {
		if (io === null) throw Error(i(459));
		var e = io;
		return io = null, e;
	}
	function oo(e) {
		if (e === Za || e === $a) throw Error(i(483));
	}
	var so = null, co = 0;
	function lo(e) {
		var t = co;
		return co += 1, so === null && (so = []), no(so, e, t);
	}
	function uo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function fo(e, t) {
		throw t.$$typeof === D ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function po(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Li(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Vi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === re ? (e = d(e, t, n.props.children, r, n.key), uo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === de && ro(i) === t.type) ? (t = a(t, n.props), uo(t, n), t.return = e, t) : (t = zi(n.type, n.key, n.props, null, e.mode, r), uo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ui(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Bi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Vi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case te: return n = zi(t.type, t.key, t.props, null, e.mode, n), uo(n, t), n.return = e, n;
					case ne: return t = Ui(t, e.mode, n), t.return = e, t;
					case de: return t = ro(t), f(e, t, n);
				}
				if (be(t) || _e(t)) return t = Bi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, lo(t), n);
				if (t.$$typeof === se) return f(e, Oa(e, t), n);
				fo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case te: return n.key === i ? l(e, t, n, r) : null;
					case ne: return n.key === i ? u(e, t, n, r) : null;
					case de: return n = ro(n), p(e, t, n, r);
				}
				if (be(n) || _e(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, lo(n), r);
				if (n.$$typeof === se) return p(e, t, Oa(e, n), r);
				fo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case te: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case ne: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case de: return r = ro(r), m(e, t, n, r, i);
				}
				if (be(r) || _e(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, lo(r), i);
				if (r.$$typeof === se) return m(e, t, n, Oa(t, r), i);
				fo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), R && ta(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return R && ta(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), R && ta(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), R && ta(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return R && ta(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), R && ta(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === re && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case te:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === re) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), uo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === de && ro(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), uo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === re ? (c = Bi(o.props.children, e.mode, c, o.key), uo(c, o), c.return = e, e = c) : (c = zi(o.type, o.key, o.props, null, e.mode, c), uo(c, o), c.return = e, e = c);
						}
						return s(e);
					case ne:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Ui(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case de: return o = ro(o), _(e, r, o, c);
				}
				if (be(o)) return h(e, r, o, c);
				if (_e(o)) {
					if (l = _e(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, lo(o), c);
				if (o.$$typeof === se) return _(e, r, Oa(e, o), c);
				fo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Vi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				co = 0;
				var i = _(e, t, n, r);
				return so = null, i;
			} catch (t) {
				if (t === Za || t === $a) throw t;
				var a = Fi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var mo = po(!0), ho = po(!1), go = !1;
	function _o(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function vo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function yo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function bo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, U & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Mi(e), ji(e, null, n), t;
		}
		return Oi(e, r, t, n), Mi(e);
	}
	function xo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, bt(e, n);
		}
	}
	function So(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Co = !1;
	function wo() {
		if (Co) {
			var e = Ha;
			if (e !== null) throw e;
		}
	}
	function To(e, t, n, r) {
		Co = !1;
		var i = e.updateQueue;
		go = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (K & f) === f : (r & f) === f) {
					f !== 0 && f === Va && (Co = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = E({}, d, f);
								break a;
							case 2: go = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), ld |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Eo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Do(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Eo(n[e], t);
	}
	var Oo = we(null), ko = we(0);
	function Ao(e, t) {
		e = sd, M(ko, e), M(Oo, t), sd = e | t.baseLanes;
	}
	function jo() {
		M(ko, sd), M(Oo, Oo.current);
	}
	function Mo() {
		sd = ko.current, Te(Oo), Te(ko);
	}
	var No = we(null), Po = null;
	function Fo(e) {
		var t = e.alternate;
		M(Bo, Bo.current & 1), M(No, e), Po === null && (t === null || Oo.current !== null || t.memoizedState !== null) && (Po = e);
	}
	function Io(e) {
		M(Bo, Bo.current), M(No, e), Po === null && (Po = e);
	}
	function Lo(e) {
		e.tag === 22 ? (M(Bo, Bo.current), M(No, e), Po === null && (Po = e)) : Ro();
	}
	function Ro() {
		M(Bo, Bo.current), M(No, No.current);
	}
	function zo(e) {
		Te(No), Po === e && (Po = null), Te(Bo);
	}
	var Bo = we(0);
	function Vo(e, t) {
		M(No, No.current), M(Bo, t);
	}
	function Ho(e) {
		Te(Bo), Te(No), Po === e && (Po = null);
	}
	function Uo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Wo = 0, z = null, B = null, Go = null, Ko = !1, qo = !1, Jo = !1, Yo = 0, Xo = 0, Zo = null, Qo = 0;
	function $o() {
		throw Error(i(321));
	}
	function es(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Wr(e[n], t[n])) return !1;
		return !0;
	}
	function ts(e, t, n, r, i, a) {
		return Wo = a, z = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = e === null || e.memoizedState === null ? vc : yc, Jo = !1, a = n(r, i), Jo = !1, qo && (a = rs(t, n, r, i)), ns(e), a;
	}
	function ns(e) {
		A.H = _c;
		var t = B !== null && B.next !== null;
		if (Wo = 0, Go = B = z = null, Ko = !1, Xo = 0, Zo = null, t) throw Error(i(300));
		e === null || Ic || (e = e.dependencies, e !== null && Ta(e) && (Ic = !0));
	}
	function rs(e, t, n, r) {
		z = e;
		var a = 0;
		do {
			if (qo && (Zo = null), Xo = 0, qo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Go = B = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			A.H = bc, o = t(n, r);
		} while (qo);
		return o;
	}
	function is() {
		var e = A.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ds(t) : t, e = e.useState()[0], (B === null ? null : B.memoizedState) !== e && (z.flags |= 1024), t;
	}
	function as() {
		var e = Yo !== 0;
		return Yo = 0, e;
	}
	function os(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ss(e) {
		if (Ko) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ko = !1;
		}
		Wo = 0, Go = B = z = null, qo = !1, Xo = Yo = 0, Zo = null;
	}
	function cs() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Go === null ? z.memoizedState = Go = e : Go = Go.next = e, Go;
	}
	function ls() {
		if (B === null) {
			var e = z.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = B.next;
		var t = Go === null ? z.memoizedState : Go.next;
		if (t !== null) Go = t, B = e;
		else {
			if (e === null) throw z.alternate === null ? Error(i(467)) : Error(i(310));
			B = e, e = {
				memoizedState: B.memoizedState,
				baseState: B.baseState,
				baseQueue: B.baseQueue,
				queue: B.queue,
				next: null
			}, Go === null ? z.memoizedState = Go = e : Go = Go.next = e;
		}
		return Go;
	}
	function us() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ds(e) {
		var t = Xo;
		return Xo += 1, Zo === null && (Zo = []), e = no(Zo, e, t), t = z, (Go === null ? t.memoizedState : Go.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? vc : yc), e;
	}
	function fs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ds(e);
			if (e.$$typeof === k) return;
			if (e.$$typeof === se) return Da(e);
		}
		throw Error(i(438, String(e)));
	}
	function ps(e) {
		var t = null, n = z.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = z.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = us(), z.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = me;
		return t.index++, n;
	}
	function ms(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function hs(e) {
		return gs(ls(), B, e);
	}
	function gs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Wo & f) === f : (K & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Va && (d = !0);
					else if ((Wo & p) === p) {
						u = u.next, p === Va && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, z.lanes |= p, ld |= p;
					f = u.action, Jo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, z.lanes |= f, ld |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Wr(o, e.memoizedState) && (Ic = !0, d && (n = Ha, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function _s(e) {
		var t = ls(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Wr(o, t.memoizedState) || (Ic = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function vs(e, t, n) {
		var r = z, a = ls(), o = R;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Wr((B || a).memoizedState, n);
		if (s && (a.memoizedState = n, Ic = !0), a = a.queue, Us(xs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Go !== null && !!(Go.memoizedState.tag & 1), Rs(e ? 9 : 8, { destroy: void 0 }, bs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, W === null) throw Error(i(349));
			o || Wo & 127 || ys(r, t, n);
		}
		return n;
	}
	function ys(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = z.updateQueue, t === null ? (t = us(), z.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function bs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Ss(t) && Cs(e);
	}
	function xs(e, t, n) {
		return n(function() {
			Ss(t) && Cs(e);
		});
	}
	function Ss(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Wr(e, n);
		} catch {
			return !0;
		}
	}
	function Cs(e) {
		var t = Ai(e, 2);
		t !== null && Ld(t, e, 2);
	}
	function ws(e) {
		var t = cs();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Jo) {
				rt(!0);
				try {
					n();
				} finally {
					rt(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ms,
			lastRenderedState: e
		}, t;
	}
	function Ts(e, t, n, r) {
		return e.baseState = n, gs(e, B, typeof r == "function" ? r : ms);
	}
	function Es(e, t, n, r, a) {
		if (mc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			A.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Ds(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Ds(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = A.T, o = {};
			o.types = a === null ? null : a.types, A.T = o;
			try {
				var s = n(i, r), c = A.S;
				c !== null && c(o, s), Os(e, t, s);
			} catch (n) {
				As(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), A.T = a;
			}
		} else try {
			a = n(i, r), Os(e, t, a);
		} catch (n) {
			As(e, t, n);
		}
	}
	function Os(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			ks(e, t, n);
		}, function(n) {
			return As(e, t, n);
		}) : ks(e, t, n);
	}
	function ks(e, t, n) {
		t.status = "fulfilled", t.value = n, js(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ds(e, n)));
	}
	function As(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, js(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function js(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ms(e, t) {
		return t;
	}
	function Ns(e, t) {
		if (R) {
			var n = W.formState;
			if (n !== null) {
				a: {
					var r = z;
					if (R) {
						if (L) {
							b: {
								for (var i = L, a = ca; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								L = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ua(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = cs(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ms,
			lastRenderedState: t
		}, n.queue = r, n = dc.bind(null, z, r), r.dispatch = n, r = ws(!1), a = pc.bind(null, z, !1, r.queue), r = cs(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Es.bind(null, z, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ps(e) {
		return Fs(ls(), B, e);
	}
	function Fs(e, t, n) {
		if (t = gs(e, t, Ms)[0], e = hs(ms)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ds(t);
		} catch (e) {
			throw e === Za ? $a : e;
		}
		else r = t;
		t = ls();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (z.flags |= 2048, Rs(9, { destroy: void 0 }, Is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Is(e, t) {
		e.action = t;
	}
	function Ls(e) {
		var t = ls(), n = B;
		if (n !== null) return Fs(t, n, e);
		ls(), t = t.memoizedState, n = ls();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Rs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = z.updateQueue, t === null && (t = us(), z.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function zs() {
		return ls().memoizedState;
	}
	function Bs(e, t, n, r) {
		var i = cs();
		z.flags |= e, i.memoizedState = Rs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Vs(e, t, n, r) {
		var i = ls();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		B !== null && r !== null && es(r, B.memoizedState.deps) ? i.memoizedState = Rs(t, a, n, r) : (z.flags |= e, i.memoizedState = Rs(1 | t, a, n, r));
	}
	function Hs(e, t) {
		Bs(8390656, 8, e, t);
	}
	function Us(e, t) {
		Vs(2048, 8, e, t);
	}
	function Ws(e) {
		z.flags |= 4;
		var t = z.updateQueue;
		if (t === null) t = us(), z.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Gs(e) {
		var t = ls().memoizedState;
		return Ws({
			ref: t,
			nextImpl: e
		}), function() {
			if (U & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Ks(e, t) {
		return Vs(4, 2, e, t);
	}
	function qs(e, t) {
		return Vs(4, 4, e, t);
	}
	function Js(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Ys(e, t, n) {
		n = n == null ? null : n.concat([e]), Vs(4, 4, Js.bind(null, t, e), n);
	}
	function Xs() {}
	function Zs(e, t) {
		var n = ls();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && es(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Qs(e, t) {
		var n = ls();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && es(t, r[1])) return r[0];
		if (r = e(), Jo) {
			rt(!0);
			try {
				e();
			} finally {
				rt(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function $s(e, t, n) {
		return n === void 0 || Wo & 1073741824 && !(K & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Fd(), z.lanes |= e, ld |= e, n);
	}
	function ec(e, t, n, r) {
		return Wr(n, t) ? n : Oo.current === null ? !(Wo & 106) || Wo & 1073741824 && !(K & 261930) ? (Ic = !0, e.memoizedState = n) : (e = Fd(), z.lanes |= e, ld |= e, t) : (e = $s(e, n, r), Wr(e, t) || (Ic = !0), e);
	}
	function tc(e, t, n, r, i) {
		var a = j.p;
		j.p = a !== 0 && 8 > a ? a : 8;
		var o = A.T, s = {};
		s.types = o === null ? null : o.types, A.T = s, pc(e, !1, t, n);
		try {
			var c = i(), l = A.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? fc(e, t, Ga(c, r), Pd(e)) : fc(e, t, r, Pd(e));
		} catch (n) {
			fc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Pd());
		} finally {
			j.p = a, o !== null && s.types !== null && (o.types = s.types), A.T = o;
		}
	}
	function nc() {}
	function rc(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = ic(e).queue;
		tc(e, a, t, xe, n === null ? nc : function() {
			return ac(e), n(r);
		});
	}
	function ic(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: xe,
			baseState: xe,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ms,
				lastRenderedState: xe
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ms,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ac(e) {
		var t = ic(e);
		t.next === null && (t = e.alternate.memoizedState), fc(e, t.next.queue, {}, Pd());
	}
	function oc() {
		return Da(sh);
	}
	function sc() {
		return ls().memoizedState;
	}
	function cc() {
		return ls().memoizedState;
	}
	function lc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Pd();
					e = yo(n);
					var r = bo(t, e, n);
					r !== null && (Ld(r, t, n), xo(r, t, n)), t = { cache: Pa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function uc(e, t, n) {
		var r = Pd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, mc(e) ? hc(t, n) : (n = ki(e, t, n, r), n !== null && (Ld(n, e, r), gc(n, t, r)));
	}
	function dc(e, t, n) {
		fc(e, t, n, Pd());
	}
	function fc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (mc(e)) hc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Wr(s, o)) return Oi(e, t, i, 0), W === null && Di(), !1;
			} catch {}
			if (n = ki(e, t, i, r), n !== null) return Ld(n, e, r), gc(n, t, r), !0;
		}
		return !1;
	}
	function pc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, mc(e)) {
			if (t) throw Error(i(479));
		} else t = ki(e, n, r, 2), t !== null && Ld(t, e, 2);
	}
	function mc(e) {
		var t = e.alternate;
		return e === z || t !== null && t === z;
	}
	function hc(e, t) {
		qo = Ko = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function gc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, bt(e, n);
		}
	}
	var _c = {
		readContext: Da,
		use: fs,
		useCallback: $o,
		useContext: $o,
		useEffect: $o,
		useImperativeHandle: $o,
		useLayoutEffect: $o,
		useInsertionEffect: $o,
		useMemo: $o,
		useReducer: $o,
		useRef: $o,
		useState: $o,
		useDebugValue: $o,
		useDeferredValue: $o,
		useTransition: $o,
		useSyncExternalStore: $o,
		useId: $o,
		useHostTransitionStatus: $o,
		useFormState: $o,
		useActionState: $o,
		useOptimistic: $o,
		useMemoCache: $o,
		useCacheRefresh: $o,
		useEffectEvent: $o
	}, vc = {
		readContext: Da,
		use: fs,
		useCallback: function(e, t) {
			return cs().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Da,
		useEffect: Hs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Bs(4194308, 4, Js.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Bs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Bs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = cs();
			t = t === void 0 ? null : t;
			var r = e();
			if (Jo) {
				rt(!0);
				try {
					e();
				} finally {
					rt(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = cs();
			if (n !== void 0) {
				var i = n(t);
				if (Jo) {
					rt(!0);
					try {
						n(t);
					} finally {
						rt(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = uc.bind(null, z, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = cs();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = ws(e);
			var t = e.queue, n = dc.bind(null, z, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			return $s(cs(), e, t);
		},
		useTransition: function() {
			var e = ws(!1);
			return e = tc.bind(null, z, e.queue, !0, !1), cs().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = z, a = cs();
			if (R) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), W === null) throw Error(i(349));
				K & 127 || ys(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Hs(xs.bind(null, r, o, e), [e]), r.flags |= 2048, Rs(9, { destroy: void 0 }, bs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = cs(), t = W.identifierPrefix;
			if (R) {
				var n = ea, r = $i;
				n = (r & ~(1 << 32 - it(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Yo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Qo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: oc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e) {
			var t = cs();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = pc.bind(null, z, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ps,
		useCacheRefresh: function() {
			return cs().memoizedState = lc.bind(null, z);
		},
		useEffectEvent: function(e) {
			var t = cs(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (U & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, yc = {
		readContext: Da,
		use: fs,
		useCallback: Zs,
		useContext: Da,
		useEffect: Us,
		useImperativeHandle: Ys,
		useInsertionEffect: Ks,
		useLayoutEffect: qs,
		useMemo: Qs,
		useReducer: hs,
		useRef: zs,
		useState: function() {
			return hs(ms);
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			return ec(ls(), B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = hs(ms)[0], t = ls().memoizedState;
			return [typeof e == "boolean" ? e : ds(e), t];
		},
		useSyncExternalStore: vs,
		useId: sc,
		useHostTransitionStatus: oc,
		useFormState: Ps,
		useActionState: Ps,
		useOptimistic: function(e, t) {
			return Ts(ls(), B, e, t);
		},
		useMemoCache: ps,
		useCacheRefresh: cc,
		useEffectEvent: Gs
	}, bc = {
		readContext: Da,
		use: fs,
		useCallback: Zs,
		useContext: Da,
		useEffect: Us,
		useImperativeHandle: Ys,
		useInsertionEffect: Ks,
		useLayoutEffect: qs,
		useMemo: Qs,
		useReducer: _s,
		useRef: zs,
		useState: function() {
			return _s(ms);
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			var n = ls();
			return B === null ? $s(n, e, t) : ec(n, B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = _s(ms)[0], t = ls().memoizedState;
			return [typeof e == "boolean" ? e : ds(e), t];
		},
		useSyncExternalStore: vs,
		useId: sc,
		useHostTransitionStatus: oc,
		useFormState: Ls,
		useActionState: Ls,
		useOptimistic: function(e, t) {
			var n = ls();
			return B === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ts(n, B, e, t);
		},
		useMemoCache: ps,
		useCacheRefresh: cc,
		useEffectEvent: Gs
	};
	function xc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : E({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Sc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Pd(), i = yo(r);
			i.payload = t, n != null && (i.callback = n), t = bo(e, i, r), t !== null && (Ld(t, e, r), xo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Pd(), i = yo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = bo(e, i, r), t !== null && (Ld(t, e, r), xo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Pd(), r = yo(n);
			r.tag = 2, t != null && (r.callback = t), t = bo(e, r, n), t !== null && (Ld(t, e, n), xo(t, e, n));
		}
	};
	function Cc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Gr(n, r) || !Gr(i, a) : !0;
	}
	function wc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Sc.enqueueReplaceState(t, t.state, null);
	}
	function Tc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = E({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Ec(e) {
		Ci(e);
	}
	function Dc(e) {
		console.error(e);
	}
	function Oc(e) {
		Ci(e);
	}
	function kc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ac(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function jc(e, t, n) {
		return n = yo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			kc(e, t);
		}, n;
	}
	function Mc(e) {
		return e = yo(e), e.tag = 3, e;
	}
	function Nc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ac(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ac(t, n, r), typeof i != "function" && (xd === null ? xd = /* @__PURE__ */ new Set([this]) : xd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Pc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && wa(t, n, a, !0), n = No.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Po === null ? Yd() : n.alternate === null && cd === 0 && (cd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === eo ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), gf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === eo ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), gf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return gf(e, r, a), Yd(), !1;
		}
		if (R) return t = No.current, t === null ? (r !== la && (t = Error(i(423), { cause: r }), ga(Gi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Gi(r, n), a = jc(e.stateNode, r, a), So(e, a), cd !== 4 && (cd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== la && (e = Error(i(422), { cause: r }), ga(Gi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Gi(o, n), md === null ? md = [o] : md.push(o), cd !== 4 && (cd = 2), t === null) return !0;
		r = Gi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = jc(n.stateNode, r, e), So(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (xd === null || !xd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Mc(a), Nc(a, e, n, r), So(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Fc = Error(i(461)), Ic = !1;
	function Lc(e, t, n, r) {
		t.child = e === null ? ho(t, null, n, r) : mo(t, e.child, n, r);
	}
	function Rc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ea(t), r = ts(e, t, n, o, a, i), s = as(), e !== null && !Ic ? (os(e, t, i), fl(e, t, i)) : (R && s && ra(t), t.flags |= 1, Lc(e, t, r, i), t.child);
	}
	function zc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ii(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Bc(e, t, a, r, i)) : (e = zi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !pl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Gr : n, n(o, r) && e.ref === t.ref) return fl(e, t, i);
		}
		return t.flags |= 1, e = Li(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Bc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Gr(a, r) && e.ref === t.ref) {
				if (Ic = !1, t.pendingProps = r = a, pl(e, i)) e.flags & 131072 && (Ic = !0);
				else return t.lanes = e.lanes, fl(e, t, i);
			}
		}
		return Jc(e, t, n, r, i);
	}
	function Vc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Uc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ya(t, a === null ? null : a.cachePool), a === null ? jo() : Ao(t, a), Lo(t);
			else return r = t.lanes = 536870912, Uc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ya(t, null), jo(), Ro()) : (Ya(t, a.cachePool), Ao(t, a), Ro(), t.memoizedState = null);
		return Lc(e, t, i, n), t.child;
	}
	function Hc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Uc(e, t, n, r, i) {
		var a = Ja();
		return a = a === null ? null : {
			parent: Na._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ya(t, null), jo(), Lo(t), e !== null && wa(e, t, r, !0), t.childLanes = i, null;
	}
	function Wc(e, t) {
		return t = rl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Gc(e, t, n) {
		return mo(t, e.child, null, n), e = Wc(t, t.pendingProps), e.flags |= 2, zo(t), t.memoizedState = null, e;
	}
	function Kc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (R) {
				if (r.mode === "hidden") return e = Wc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Hc(null, e);
				if (Io(t), (e = L) ? (e = am(e, ca), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Qi === null ? null : {
						id: $i,
						overflow: ea
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Hi(e), n.return = t, t.child = n, oa = t, L = null)) : e = null, e === null) throw ua(t);
				return t.lanes = 536870912, null;
			}
			return Wc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Io(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Gc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Ic || wa(e, t, n, !1), a = (n & e.childLanes) !== 0, Ic || a) {
				if (Oo.current === null) {
					if (r = W, r !== null && (s = xt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ai(e, s), Ld(r, e, s), Fc;
					Yd();
				}
				t = Gc(e, t, n);
			} else e = o.treeContext, L = lm(s.nextSibling), oa = t, R = !0, sa = null, ca = !1, e !== null && aa(t, e), t = Wc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Li(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function qc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Jc(e, t, n, r, i) {
		return Ea(t), n = ts(e, t, n, r, void 0, i), r = as(), e !== null && !Ic ? (os(e, t, i), fl(e, t, i)) : (R && r && ra(t), t.flags |= 1, Lc(e, t, n, i), t.child);
	}
	function Yc(e, t, n, r, i, a) {
		return Ea(t), t.updateQueue = null, n = rs(t, r, n, i), ns(e), r = as(), e !== null && !Ic ? (os(e, t, a), fl(e, t, a)) : (R && r && ra(t), t.flags |= 1, Lc(e, t, n, a), t.child);
	}
	function Xc(e, t, n, r, i) {
		if (Ea(t), t.stateNode === null) {
			var a = Ni, o = n.contextType;
			typeof o == "object" && o && (a = Da(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Sc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, _o(t), o = n.contextType, a.context = typeof o == "object" && o ? Da(o) : Ni, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (xc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Sc.enqueueReplaceState(a, a.state, null), To(t, r, a, i), wo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Tc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Ni, typeof u == "object" && u && (o = Da(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && wc(t, a, r, o), go = !1;
			var f = t.memoizedState;
			a.state = f, To(t, r, a, i), wo(), l = t.memoizedState, s || f !== l || go ? (typeof d == "function" && (xc(t, n, d, r), l = t.memoizedState), (c = go || Cc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, vo(e, t), o = t.memoizedProps, u = Tc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Ni, typeof l == "object" && l && (c = Da(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && wc(t, a, r, c), go = !1, f = t.memoizedState, a.state = f, To(t, r, a, i), wo();
			var p = t.memoizedState;
			o !== d || f !== p || go || e !== null && e.dependencies !== null && Ta(e.dependencies) ? (typeof s == "function" && (xc(t, n, s, r), p = t.memoizedState), (u = go || Cc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Ta(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, qc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = mo(t, e.child, null, i), t.child = mo(t, null, n, i)) : Lc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = fl(e, t, i), e;
	}
	function Zc(e, t, n, r) {
		return ma(), t.flags |= 256, Lc(e, t, n, r), t.child;
	}
	var Qc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function $c(e) {
		return {
			baseLanes: e,
			cachePool: Xa()
		};
	}
	function el(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= fd), e;
	}
	function tl(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Bo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (R) {
				if (i ? Fo(t) : Ro(), (e = L) ? (e = am(e, ca), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Qi === null ? null : {
						id: $i,
						overflow: ea
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Hi(e), n.return = t, t.child = n, oa = t, L = null)) : e = null, e === null) throw ua(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Ro(), i = t.mode, a = rl({
				mode: "hidden",
				children: a
			}, i), r = Bi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = $c(n), r.childLanes = el(e, o, n), t.memoizedState = Qc, Hc(null, r)) : (Fo(t), nl(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return al(e, t, a, o, r, c, s, n);
		}
		return i ? (Ro(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Li(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Bi(i, a, n, null), i.flags |= 2) : i = Li(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Hc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = $c(n) : (a = i.cachePool, a === null ? a = Xa() : (s = Na._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = el(e, o, n), t.memoizedState = Qc, Hc(e.child, r)) : (Fo(t), n = e.child, e = n.sibling, n = Li(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function nl(e, t) {
		return t = rl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function rl(e, t) {
		return e = Fi(22, e, null, t), e.lanes = 0, e;
	}
	function il(e, t, n) {
		return mo(t, e.child, null, n), e = nl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function al(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Fo(t), t.flags &= -257, il(e, t, c)) : t.memoizedState === null ? (Ro(), o = a.fallback, s = t.mode, a = rl({
			mode: "visible",
			children: a.children
		}, s), o = Bi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, mo(t, e.child, null, c), a = t.child, a.memoizedState = $c(c), a.childLanes = el(e, r, c), t.memoizedState = Qc, Hc(null, a)) : (Ro(), t.child = e.child, t.flags |= 128, null);
		if (Fo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ga({
				value: a,
				source: null,
				stack: null
			})), il(e, t, c);
		}
		if (Ic || wa(e, t, c, !1), r = (c & e.childLanes) !== 0, Ic || r) {
			if (Oo.current !== null) return il(e, t, c);
			if (r = W, r !== null && (a = xt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ai(e, a), Ld(r, e, a), Fc;
			return om(o) || Yd(), il(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, L = lm(o.nextSibling), oa = t, R = !0, sa = null, ca = !1, e !== null && aa(t, e), t = nl(t, a.children), t.flags |= 134221824, t);
	}
	function ol(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Sa(e.return, t, n);
	}
	function sl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Uo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function cl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function ll(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ul(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Bo.current;
		if (t.flags & 128) return Vo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Vo(t, o), i === "backwards" && e !== null ? (ll(e), Lc(e, t, r, n), ll(e)) : Lc(e, t, r, n), r = R ? Yi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && ol(e, n, t);
			else if (e.tag === 19) ol(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, ll(t)), cl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Uo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				cl(t, !0, n, null, a, r);
				break;
			case "together":
				cl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), cl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function dl(e, t, n) {
		var r = t.pendingProps;
		return ba(t, t.type, r.value), Lc(e, t, r.children, n), t.child;
	}
	function fl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), ld |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (wa(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Li(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Li(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function pl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Ta(e)));
	}
	function ml(e, t, n) {
		switch (t.tag) {
			case 3:
				Ae(t, t.stateNode.containerInfo), ba(t, Na, e.memoizedState.cache), ma();
				break;
			case 27:
			case 5:
				Me(t);
				break;
			case 4:
				Ae(t, t.stateNode.containerInfo);
				break;
			case 10:
				ba(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Io(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Fo(t), t.flags |= 128, null;
					r = wa(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? tl(e, t, n) : (Fo(t), e = fl(e, t, n), e === null ? null : e.sibling);
				}
				Fo(t);
				break;
			case 19:
				if (t.flags & 128) return ul(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (wa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ul(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Vo(t, Bo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Vc(e, t, n, t.pendingProps);
			case 24: ba(t, Na, e.memoizedState.cache);
		}
		return fl(e, t, n);
	}
	function hl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Ic = !0;
			else {
				if (!pl(e, n) && !(t.flags & 128)) return Ic = !1, ml(e, t, n);
				Ic = !!(e.flags & 131072);
			}
		} else Ic = !1, R && t.flags & 1048576 && na(t, Yi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ro(t.elementType), t.type = e, typeof e == "function") Ii(e) ? (r = Tc(e, r), t.tag = 1, t = Xc(null, t, e, r, n)) : (t.tag = 0, t = Jc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === O) {
								t.tag = 11, t = Rc(null, t, e, r, n);
								break a;
							}
							if (a === ue) {
								t.tag = 14, t = zc(null, t, e, r, n);
								break a;
							}
							if (a === se) {
								t.tag = 10, t.type = e, t = dl(null, t, n);
								break a;
							}
						}
						throw t = ye(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Jc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Tc(r, t.pendingProps), Xc(e, t, r, a, n);
			case 3:
				a: {
					if (Ae(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, vo(e, t), To(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ba(t, Na, r), r !== o.cache && Ca(t, [Na], n, !0), wo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Zc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Gi(Error(i(424)), t), ga(a), t = Zc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (L = lm(e.firstChild), oa = t, R = !0, sa = null, ca = !0, n = ho(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ma(), r === a) {
							t = fl(e, t, n);
							break a;
						}
						Lc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return qc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : R || (t.stateNode = fp(t.type, t.pendingProps, Oe.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Me(t), e === null && R && (r = t.stateNode = hm(t.type, t.pendingProps, Oe.current), oa = t, ca = !0, a = L, Sp(t.type) ? (um = a, L = lm(r.firstChild)) : L = a), Lc(e, t, t.pendingProps.children, n), qc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && R && ((a = r = L) && (r = rm(r, t.type, t.pendingProps, ca), r === null ? a = !1 : (t.stateNode = r, oa = t, L = lm(r.firstChild), ca = !1, a = !0)), a || ua(t)), Me(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = ts(e, t, is, null, null, n), sh._currentValue = a), qc(e, t), Lc(e, t, r, n), t.child;
			case 6: return e === null && R && ((e = n = L) && (n = im(n, t.pendingProps, ca), n === null ? e = !1 : (t.stateNode = n, oa = t, L = null, e = !0)), e || ua(t)), null;
			case 13: return tl(e, t, n);
			case 4: return Ae(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = mo(t, null, r, n) : Lc(e, t, r, n), t.child;
			case 11: return Rc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, qc(e, t), Lc(e, t, r, n), t.child;
			case 8: return Lc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Lc(e, t, t.pendingProps.children, n), t.child;
			case 10: return dl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Ea(t), a = Da(a), r = r(a), t.flags |= 1, Lc(e, t, r, n), t.child;
			case 14: return zc(e, t, t.type, t.pendingProps, n);
			case 15: return Bc(e, t, t.type, t.pendingProps, n);
			case 19: return ul(e, t, n);
			case 31: return Kc(e, t, n);
			case 22: return Vc(e, t, n, t.pendingProps);
			case 24: return Ea(t), r = Da(Na), e === null ? (a = Ja(), a === null && (a = W, o = Pa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, _o(t), ba(t, Na, a)) : ((e.lanes & n) !== 0 && (vo(e, t), To(t, null, null, n), wo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ba(t, Na, r), r !== a.cache && Ca(t, [Na], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ba(t, Na, r))), Lc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : R && ra(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : qc(e, t), Lc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function gl(e) {
		e.flags |= 4;
	}
	function _l(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Kd()) e.flags |= 8192;
				else throw io = eo, Qa;
			}
		} else e.flags &= -16777217;
	}
	function vl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Kd()) e.flags |= 8192;
			else throw io = eo, Qa;
		}
	}
	function yl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : gt(), e.lanes |= t, pd |= t);
	}
	function bl(e, t) {
		if (!R) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function xl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Sl(e, t, n) {
		var r = t.pendingProps;
		switch (ia(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return xl(t), null;
			case 1: return xl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), xa(Na), je(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (pa(t) ? gl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, ha())), xl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (gl(t), o === null ? (xl(t), _l(t, a, null, r, n)) : (xl(t), vl(t, o))) : o ? o === e.memoizedState ? (xl(t), t.flags &= -16777217) : (gl(t), xl(t), vl(t, o)) : (e = e.memoizedProps, e !== r && gl(t), xl(t), _l(t, a, e, r, n)), null;
			case 27:
				if (Ne(t), n = Oe.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return xl(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ee.current, pa(t) ? da(t, e) : (e = hm(a, r, n), t.stateNode = e, gl(t));
				}
				return xl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Ne(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return xl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ee.current, pa(t)) da(t, o);
					else {
						var s = lp(Oe.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[Dt] = t, o[Ot] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && gl(t);
					}
				}
				return xl(t), t.subtreeFlags &= -33554433, _l(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Oe.current, pa(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = oa, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Dt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || ua(t, !0);
					} else e = lp(e).createTextNode(r), e[Dt] = t, t.stateNode = e;
				}
				return xl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = pa(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Dt] = t;
						} else ma(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						xl(t), e = !1;
					} else n = ha(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (zo(t), t) : (zo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return xl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = pa(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Dt] = t;
						} else ma(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						xl(t), a = !1;
					} else a = ha(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (zo(t), t) : (zo(t), null);
				}
				return zo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), yl(t, t.updateQueue), xl(t), null);
			case 4: return je(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, xl(t), null;
			case 10: return xa(t.type), xl(t), null;
			case 19:
				if (Ho(t), r = t.memoizedState, r === null) return xl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) bl(r, !1);
					else {
						if (cd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Uo(e), o !== null) {
								for (t.flags |= 128, bl(r, !1), e = o.updateQueue, t.updateQueue = e, yl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ri(n, e), n = n.sibling;
								return Vo(t, Bo.current & 1 | 2), R && ta(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Ke() > yd && (t.flags |= 128, a = !0, bl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Uo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, yl(t, e), bl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !R) return xl(t), null;
						} else 2 * Ke() - r.renderingStartTime > yd && n !== 536870912 && (t.flags |= 128, a = !0, bl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ke(), e.sibling = null, o = Bo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || R ? Vo(t, o) : (n = o, M(No, t), M(Bo, n), Po === null && (Po = t)), R && ta(t, r.treeForkCount), e;
				}
				return xl(t), null;
			case 22:
			case 23: return zo(t), Mo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (xl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : xl(t), n = t.updateQueue, n !== null && yl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Te(qa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), xa(Na), xl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, xl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function Cl(e, t) {
		switch (ia(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return xa(Na), je(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ne(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (zo(t), t.alternate === null) throw Error(i(340));
					ma();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (zo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ma();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Ho(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return je(), null;
			case 10: return xa(t.type), null;
			case 22:
			case 23: return zo(t), Mo(), e !== null && Te(qa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return xa(Na), null;
			case 25: return null;
			default: return null;
		}
	}
	function wl(e, t) {
		switch (ia(t), t.tag) {
			case 3:
				xa(Na), je();
				break;
			case 26:
			case 27:
			case 5:
				Ne(t);
				break;
			case 4:
				je();
				break;
			case 31:
				t.memoizedState !== null && zo(t);
				break;
			case 13:
				zo(t);
				break;
			case 19:
				Ho(t);
				break;
			case 10:
				xa(t.type);
				break;
			case 22:
			case 23:
				zo(t), Mo(), e !== null && Te(qa);
				break;
			case 24: xa(Na);
		}
	}
	function Tl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function El(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Y(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function Dl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Do(t, n);
			} catch (t) {
				Y(e, e.return, t);
			}
		}
	}
	function Ol(e, t, n) {
		n.props = Tc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Y(e, t, n);
		}
	}
	function kl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = bi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Y(e, t, n);
		}
	}
	function Al(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Y(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Y(e, t, n);
			}
			else n.current = null;
		}
	}
	function jl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Ml(e) {
		for (var t = e.return; t !== null && (Fl(t) && em(e.stateNode, t.stateNode), !Pl(t));) t = t.return;
	}
	function Nl(e) {
		for (var t = e.return; t !== null && (Fl(t) && tm(e.stateNode, t.stateNode), !Pl(t));) t = t.return;
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Fl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Il(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function Ll(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[Ot] = t;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function Rl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function zl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Rl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Bl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = xn)), jl(e, r), F = !0;
		else if (i !== 4 && (i === 27 && (jl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Bl(e, t, n, r), e = e.sibling; e !== null;) Bl(e, t, n, r), e = e.sibling;
	}
	function Vl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), jl(e, r), F = !0;
		else if (i !== 4 && (i === 27 && (jl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Vl(e, t, n, r), e = e.sibling; e !== null;) Vl(e, t, n, r), e = e.sibling;
	}
	function Hl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[Dt] = e, t[Ot] = n;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	var Ul = !1, Wl = null;
	function Gl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Ul = !0);
	}
	var Kl = null;
	function ql() {
		var e = Kl;
		return Kl = null, e;
	}
	var Jl = 0;
	function Yl(e, t, n, r, i) {
		return Jl = 0, Xl(e.child, t, n, r, i);
	}
	function Xl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Ul = !0, Tp(o, Jl === 0 ? t : t + "_" + Jl, n), Jl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Xl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Zl(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Zl(e.child, t), e = e.sibling;
	}
	function Ql(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Ql(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = Si(t.default, t.share), t !== "none" && (Yl(e, n, t, null, !1) || Zl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function $l(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = bi(r, n), a = Si(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Ql(e) : Yl(e, i, a, null, !1) ? (Ql(e), n.paired || t || Id(e, r.onEnter)) : Zl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) $l(e, t), e = e.sibling;
		else Ql(e);
	}
	function eu(e) {
		if (Wl !== null && Wl.size !== 0) {
			var t = Wl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = Si(n.default, n.share);
								if (a !== "none" && (Yl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Id(e, n.onShare)) : Zl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					eu(e);
				}
				e = e.sibling;
			}
		}
	}
	function tu(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = bi(t, e.stateNode), r = Wl === null ? void 0 : Wl.get(n), i = Si(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Yl(e, n, i, null, !1) ? r === void 0 ? Id(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Wl.delete(n), Id(e, t.onShare)) : Zl(e.child, !1)), Wl !== null && eu(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) tu(e), e = e.sibling;
		else Wl !== null && eu(e);
	}
	function nu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = bi(t, e.stateNode);
				t = Si(t.default, t.update), e.flags &= -5, t !== "none" && Yl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && nu(e);
			e = e.sibling;
		}
	}
	function ru(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Zl(e.child, !1));
				}
				ru(e);
			}
			e = e.sibling;
		}
	}
	function iu(e) {
		if (e.tag === 30) e.stateNode.paired = null, Zl(e.child, !1), ru(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) iu(e), e = e.sibling;
		else ru(e);
	}
	function V(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Zl(e.child, !1) : e.subtreeFlags & 33554432 && V(e), e = e.sibling;
	}
	function au(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Jl < a.length) {
					var l = a[Jl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Jl === 0 ? n : n + "_" + Jl, i), s && e.flags & 4 || (Kl === null && (Kl = []), Kl.push(c, Jl === 0 ? r : r + "_" + Jl, t.memoizedProps)), Jl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : au(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ou(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = bi(n, r), a = Si(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Jl = 0, i = au(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Id(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ou(e, t);
			e = e.sibling;
		}
	}
	var su = !1, H = !1, cu = !1, lu = !1, uu = typeof WeakSet == "function" ? WeakSet : Set, du = null, fu = !1, pu = !1, mu = !1, hu = !1;
	function gu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Xr(e), Zr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, du = t, t = n ? 9270 : 1024; du !== null;) {
			if (e = du, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && tu(r[a]);
			if (e.alternate === null && e.flags & 2) n && Gl(e), _u(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && tu(r), _u(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Gl(e), _u(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, du = r) : (n && nu(e), _u(n));
			}
		}
		Wl = null;
	}
	function _u(e) {
		for (; du !== null;) {
			var t = du, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = Tc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Y(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = bi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = Si(a.default, a.update), a !== "none" && Yl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, du = r;
				break;
			}
			du = t.return;
		}
	}
	function vu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Ru(e, n), r & 4 && Tl(5, n);
				break;
			case 1:
				if (Ru(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Y(n, n.return, e);
					}
					else {
						var i = Tc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Y(n, n.return, e);
						}
					}
				}
				r & 64 && Dl(n), r & 512 && kl(n, n.return);
				break;
			case 3:
				if (Ru(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Do(e, t);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Hl(n);
			case 26:
			case 5:
				Ru(e, n), t === null && r & 4 && Il(n), r & 512 && kl(n, n.return);
				break;
			case 12:
				Ru(e, n);
				break;
			case 31:
				Ru(e, n), r & 4 && Du(e, n);
				break;
			case 13:
				Ru(e, n), r & 4 && Ou(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = yf.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || su, !r) {
					var a = t !== null && t.memoizedState !== null || H;
					t = su, i = H, su = r, (H = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Bu(e, n, r)) : Ru(e, n), su = t, H = i;
				}
				break;
			case 30:
				Ru(e, n), r & 512 && kl(n, n.return);
				break;
			case 7: r & 512 && kl(n, n.return);
			default: Ru(e, n);
		}
	}
	function yu(e, t) {
		for (e = e.child; e !== null;) bu(e, t), e = e.sibling;
	}
	function bu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Y(e, e.return, t);
				}
				xu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, F = !0;
				} catch (t) {
					Y(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Y(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && yu(e, t);
				break;
			default: yu(e, t);
		}
	}
	function xu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						bu(n, r);
						break a;
					case 22:
						n.memoizedState === null && xu(n, r);
						break a;
					default: xu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function Su(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, Su(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && It(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var Cu = null, wu = !1;
	function Tu(e, t, n) {
		for (n = n.child; n !== null;) Eu(e, t, n), n = n.sibling;
	}
	function Eu(e, t, n) {
		if (nt && typeof nt.onCommitFiberUnmount == "function") try {
			nt.onCommitFiberUnmount(tt, n);
		} catch {}
		switch (n.tag) {
			case 26:
				H || Al(n, t), Tu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !H && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				H || Al(n, t), Nl(n);
				var r = Cu, i = wu;
				Sp(n.type) && (Cu = n.stateNode, wu = !1), Tu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), Cu = r, wu = i;
				break;
			case 5: H || Al(n, t), Nl(n);
			case 6:
				if (n.tag === 6 && Nl(n), r = Cu, i = wu, Cu = null, Tu(e, t, n), Cu = r, wu = i, Cu !== null) {
					if (wu) try {
						(Cu.nodeType === 9 ? Cu.body : Cu.nodeName === "HTML" ? Cu.ownerDocument.body : Cu).removeChild(n.stateNode), F = !0;
					} catch (e) {
						Y(n, t, e);
					}
					else try {
						Cu.removeChild(n.stateNode), F = !0;
					} catch (e) {
						Y(n, t, e);
					}
				}
				break;
			case 18:
				Cu !== null && (wu ? (e = Cu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(Cu, n.stateNode));
				break;
			case 4:
				r = Cu, i = wu, Cu = n.stateNode.containerInfo, wu = !0, Tu(e, t, n), Cu = r, wu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				El(2, n, t), H || El(4, n, t), Tu(e, t, n);
				break;
			case 1:
				H || (Al(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Ol(n, t, r)), Tu(e, t, n);
				break;
			case 21:
				Tu(e, t, n);
				break;
			case 22:
				H = (r = H) || n.memoizedState !== null, Tu(e, t, n), H = r;
				break;
			case 30:
				Al(n, t), Tu(e, t, n);
				break;
			case 7:
				H || Al(n, t), Tu(e, t, n);
				break;
			default: Tu(e, t, n);
		}
	}
	function Du(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Y(t, t.return, e);
			}
		}
	}
	function Ou(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function ku(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new uu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new uu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Au(e, t) {
		var n = ku(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = bf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function ju(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							Cu = l.stateNode, wu = !1;
							break a;
						}
						break;
					case 5:
						Cu = l.stateNode, wu = !1;
						break a;
					case 3:
					case 4:
						Cu = l.stateNode.containerInfo, wu = !0;
						break a;
				}
				l = l.return;
			}
			if (Cu === null) throw Error(i(160));
			Eu(s, c, o), Cu = null, wu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Nu(t, e, n), t = t.sibling;
	}
	var Mu = null;
	function Nu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				ju(t, e, n), Pu(e), a & 4 && (El(3, e, e.return), Tl(3, e), El(5, e, e.return));
				break;
			case 1:
				ju(t, e, n), Pu(e), a & 512 && (H || r === null || Al(r, r.return)), a & 64 && su && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Mu, ju(t, e, n), Pu(e), a & 512 && (H || r === null || Al(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (su) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Pt] || r[Dt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[Dt] = e, Vt(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[Dt] = e, Vt(r), t = r;
									}
									e.stateNode = t;
								}
							} else su || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Ll(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || H || t.parentNode.removeChild(t)) : a.count--, n === null ? su || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				ju(t, e, n), Pu(e), a & 512 && (H || r === null || Al(r, r.return)), r !== null && a & 4 && Ll(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = cu, cu = !1, ju(t, e, n), cu = o, Pu(e), a & 512 && (H || r === null || Al(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						pn(t, ""), F = !0;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Ll(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (lu = !0);
				break;
			case 6:
				if (ju(t, e, n), Pu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, F = !0;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				break;
			case 3:
				if (F = !1, Wm = null, o = Mu, Mu = bm(t.containerInfo), ju(t, e, n), Mu = o, Pu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Y(e, e.return, t);
				}
				lu && (lu = !1, Fu(e)), F = !1;
				break;
			case 4:
				a = cu, cu = su, r = Xt(), o = Mu, Mu = bm(e.stateNode.containerInfo), ju(t, e, n), Pu(e), Mu = o, F && pu && (mu = !0), F = r, cu = a;
				break;
			case 12:
				ju(t, e, n), Pu(e);
				break;
			case 31:
				ju(t, e, n), Pu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 13:
				ju(t, e, n), Pu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (_d = Ke()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = su, l = H, u = cu;
				su = c || o, cu = u || o, H = l || s, ju(t, e, n), H = l, cu = u, su = c, Pu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || su || H || (t = s || H, n = su, r = H, su = o || su, H = t, zu(e, 2), su = n, H = r), !o && cu || yu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Au(e, n))));
				break;
			case 19:
				ju(t, e, n), Pu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Au(e, t)));
				break;
			case 30:
				a & 512 && (H || r === null || Al(r, r.return)), a = Xt(), o = pu, s = (n & 335544064) === n, c = e.memoizedProps, pu = s && Si(c.default, c.update) !== "none", ju(t, e, n), Pu(e), s && r !== null && F && (e.flags |= 4), pu = o, F = a;
				break;
			case 21: break;
			case 7: a & 512 && (H || r === null || Al(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: ju(t, e, n), Pu(e);
		}
	}
	function Pu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Rl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Fl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Pl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Vl(e, zl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (pn(l, ""), n.flags &= -33), Vl(e, zl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Bl(e, zl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Y(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Fu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Fu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Iu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Lu(t, e), t = t.sibling;
		else ou(t, !1);
	}
	function Lu(e, t) {
		var n = e.alternate;
		if (n === null) $l(e, !1);
		else switch (e.tag) {
			case 3:
				if (hu = fu = !1, ql(), Iu(t, e), !fu && !mu) {
					if (e = Kl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), hu = !0;
				}
				Kl = null;
				break;
			case 5:
				Iu(t, e);
				break;
			case 4:
				r = fu, fu = !1, Iu(t, e), fu && (mu = !0), fu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Iu(t, e) : $l(e, !1));
				break;
			case 30:
				r = fu, i = ql(), fu = !1, Iu(t, e), fu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = bi(a, o), o = bi(n.memoizedProps, o);
				var s = Si(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Jl = 0, t = au(e, n, t, o, s, a, !0), Jl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Id(e, e.memoizedProps.onUpdate), Kl = i) : i !== null && (i.push.apply(i, Kl), Kl = i), fu = e.flags & 32 ? !0 : r;
				break;
			default: Iu(t, e);
		}
	}
	function Ru(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) vu(e, t.alternate, t), t = t.sibling;
	}
	function zu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					El(4, n, n.return), zu(n, r);
					break;
				case 1:
					Al(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Ol(n, n.return, i), zu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Al(n, n.return), n.tag !== 5 && n.tag !== 27 || Nl(n), zu(n, r);
					break;
				case 6:
					Nl(n);
					break;
				case 26:
					Al(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || H || i.parentNode.removeChild(i), zu(n, r);
					break;
				case 22:
					n.memoizedState === null && zu(n, r);
					break;
				case 30:
					Al(n, n.return), zu(n, r);
					break;
				case 7: Al(n, n.return);
				default: zu(n, r);
			}
			e = e.sibling;
		}
	}
	function Bu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Bu(i, a, n), Tl(4, a);
					break;
				case 1:
					if (Bu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Y(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Eo(l[i], c);
						} catch (e) {
							Y(r, r.return, e);
						}
					}
					s && o & 64 && Dl(a), kl(a, a.return);
					break;
				case 27: n & 2 && Hl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ml(a), Bu(i, a, n), s && r === null && o & 4 && Il(a), kl(a, a.return);
					break;
				case 6:
					Ml(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || su || Km(bm(c.ownerDocument), a.type, c), Bu(i, a, n), s && r === null && o & 4 && Il(a), kl(a, a.return);
					break;
				case 12:
					Bu(i, a, n);
					break;
				case 31:
					Bu(i, a, n), s && o & 4 && Du(i, a);
					break;
				case 13:
					Bu(i, a, n), s && o & 4 && Ou(i, a);
					break;
				case 22:
					a.memoizedState === null && Bu(i, a, n), kl(a, a.return);
					break;
				case 30:
					Bu(i, a, n), kl(a, a.return);
					break;
				case 7: kl(a, a.return);
				default: Bu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Vu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Fa(n));
	}
	function Hu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Fa(e));
	}
	function Uu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Wu(e, t, n, r), t = t.sibling;
		else i && V(t);
	}
	function Wu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && iu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Uu(e, t, n, r), a & 2048 && Tl(9, t);
				break;
			case 1:
				Uu(e, t, n, r);
				break;
			case 3:
				Uu(e, t, n, r), i && hu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Fa(a)));
				break;
			case 12:
				if (a & 2048) {
					Uu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Y(t, t.return, e);
					}
				} else Uu(e, t, n, r);
				break;
			case 31:
				Uu(e, t, n, r);
				break;
			case 13:
				Uu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && iu(t), o._visibility & 2 ? Uu(e, t, n, r) : (o._visibility |= 2, Gu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && iu(s), o._visibility & 2 ? Uu(e, t, n, r) : Ku(e, t)), a & 2048 && Vu(s, t);
				break;
			case 24:
				Uu(e, t, n, r), a & 2048 && Hu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Zl(a.child, !0), Zl(t.child, !0))), Uu(e, t, n, r);
				break;
			default: Uu(e, t, n, r);
		}
	}
	function Gu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Gu(a, o, s, c, i), Tl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Gu(a, o, s, c, i)) : u._visibility & 2 ? Gu(a, o, s, c, i) : Ku(a, o), i && l & 2048 && Vu(o.alternate, o);
					break;
				case 24:
					Gu(a, o, s, c, i), i && l & 2048 && Hu(o.alternate, o);
					break;
				default: Gu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ku(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ku(n, r), i & 2048 && Vu(r.alternate, r);
					break;
				case 24:
					Ku(n, r), i & 2048 && Hu(r.alternate, r);
					break;
				default: Ku(n, r);
			}
			t = t.sibling;
		}
	}
	var qu = 8192;
	function Ju(e, t, n) {
		if (e.subtreeFlags & qu) for (e = e.child; e !== null;) Yu(e, t, n), e = e.sibling;
	}
	function Yu(e, t, n) {
		switch (e.tag) {
			case 26:
				Ju(e, t, n), e.flags & qu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Mu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Ju(e, t, n), e.flags & qu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Mu;
				Mu = bm(e.stateNode.containerInfo), Ju(e, t, n), Mu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = qu, qu = 16777216, Ju(e, t, n), qu = r) : Ju(e, t, n));
				break;
			case 30:
				if ((e.flags & qu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Wl === null && (Wl = /* @__PURE__ */ new Map()), Wl.set(r, i);
				}
				Ju(e, t, n);
				break;
			default: Ju(e, t, n);
		}
	}
	function Xu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Zu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, ed(r, e);
			}
			Xu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Qu(e), e = e.sibling;
	}
	function Qu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Zu(e), e.flags & 2048 && El(9, e, e.return);
				break;
			case 3:
				Zu(e);
				break;
			case 12:
				Zu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, $u(e)) : Zu(e);
				break;
			default: Zu(e);
		}
	}
	function $u(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, ed(r, e);
			}
			Xu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					El(8, t, t.return), $u(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, $u(t));
					break;
				default: $u(t);
			}
			e = e.sibling;
		}
	}
	function ed(e, t) {
		for (; du !== null;) {
			var n = du;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					El(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Fa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, du = r;
			else a: for (n = e; du !== null;) {
				r = du;
				var i = r.sibling, a = r.return;
				if (Su(r), r === n) {
					du = null;
					break a;
				}
				if (i !== null) {
					i.return = a, du = i;
					break a;
				}
				du = a;
			}
		}
	}
	var td = {
		getCacheForType: function(e) {
			var t = Da(Na), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Da(Na).controller.signal;
		}
	}, nd = typeof WeakMap == "function" ? WeakMap : Map, U = 0, W = null, G = null, K = 0, q = 0, rd = null, id = !1, ad = !1, od = !1, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = 0, pd = 0, md = null, hd = null, gd = !1, _d = 0, vd = 0, yd = Infinity, bd = null, xd = null, Sd = 0, Cd = null, wd = null, Td = 0, Ed = 0, Dd = null, Od = null, kd = null, Ad = null, jd = null, Md = 0, Nd = null;
	function Pd() {
		return U & 2 && K !== 0 ? K & -K : A.T === null ? wt() : Pf();
	}
	function Fd() {
		if (fd === 0) {
			if (!(K & 536870912) || R) {
				var e = lt;
				lt <<= 1, !(lt & 3932160) && (lt = 262144), fd = e;
			} else fd = 536870912;
		}
		return e = No.current, e !== null && (e.flags |= 32), fd;
	}
	function Id(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(bi(e.memoizedProps, n))), Ad === null && (Ad = []), Ad.push(t.bind(null, r));
		}
	}
	function Ld(e, t, n) {
		(e === W && (q === 2 || q === 9) || e.cancelPendingCommit !== null) && (Wd(e, 0), Vd(e, K, fd, !1)), _t(e, n), U & 2 && e === W || (e === W && (!(U & 2) && (ud |= n), cd === 4 && Vd(e, K, fd, !1)), Df(e));
	}
	function Rd(e, t, n) {
		if (U & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || pt(e, t), a = r ? Qd(e, t) : Xd(e, t, !0), o = r;
		do {
			if (a === 0) {
				ad && !r && Vd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Bd(n)) a = Xd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = md;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Wd(c, s).flags |= 256), s = Xd(c, s, !1), s !== 2 && s !== 6) {
								if (od && !l) {
									c.errorRecoveryDisabledLanes |= o, ud |= o, a = 4;
									break a;
								}
								o = hd, hd = a, o !== null && (hd === null ? hd = o : hd.push.apply(hd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Wd(e, 0), Vd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Vd(r, t, fd, !id);
							break a;
						case 2:
							hd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = _d + 300 - Ke(), 10 < a)) {
						if (Vd(r, t, fd, !id), ft(r, 0, !0) !== 0) break a;
						Td = t, r.timeoutHandle = gp(zd.bind(null, r, n, hd, bd, gd, t, fd, ud, pd, id, o, "Throttled", -0, 0), a);
						break a;
					}
					zd(r, n, hd, bd, gd, t, fd, ud, pd, id, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Df(e);
	}
	function zd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: xn
		}, Wl = null, Yu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? _d - Ke() : (a & 4194048) === a ? vd - Ke() : 0, m = eh(d, m), m !== null) ? (Td = a, e.cancelPendingCommit = m(of.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Vd(e, a, o, !l)) : of(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Bd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Wr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Vd(e, t, n, r) {
		t = mt(e, t), t &= ~dd, t &= ~ud, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - it(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && yt(e, n, t);
	}
	function Hd() {
		return U & 6 ? !0 : (Of(0, !1), !1);
	}
	function Ud() {
		if (G !== null) {
			if (q === 0) var e = G.return;
			else e = G, ya = va = null, ss(e), so = null, co = 0, e = G;
			for (; e !== null;) wl(e.alternate, e), e = e.return;
			G = null;
		}
	}
	function Wd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Td = 0, Ud(), W = e, G = n = Li(e.current, null), K = t, q = 0, rd = null, id = !1, ad = pt(e, t), od = !1, pd = fd = dd = ud = ld = cd = 0, hd = md = null, gd = !1, sd = mt(e, t), Di(), n;
	}
	function Gd(e, t) {
		z = null, A.H = _c, t === Za || t === $a ? (t = ao(), q = 3) : t === Qa ? (t = ao(), q = 4) : q = t === Fc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, rd = t, G === null && (cd = 1, kc(e, Gi(t, e.current)));
	}
	function Kd() {
		var e = No.current;
		return e === null ? !0 : (K & 4194048) === K ? Po === null : (K & 62914560) === K || K & 536870912 ? e === Po : !1;
	}
	function qd() {
		var e = A.H;
		return A.H = _c, e === null ? _c : e;
	}
	function Jd() {
		var e = A.A;
		return A.A = td, e;
	}
	function Yd() {
		cd = 4, id || (K & 4194048) !== K && No.current !== null || (ad = !0), !(ld & 134217727) && !(ud & 134217727) || W === null || Vd(W, K, fd, !1);
	}
	function Xd(e, t, n) {
		var r = U;
		U |= 2;
		var i = qd(), a = Jd();
		(W !== e || K !== t) && (bd = null, Wd(e, t)), t = !1;
		var o = cd;
		a: do
			try {
				if (q !== 0 && G !== null) {
					var s = G, c = rd;
					switch (q) {
						case 8:
							Ud(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							No.current === null && (t = !0);
							var l = q;
							if (q = 0, rd = null, nf(e, s, c, l), n && ad) {
								o = 0;
								break a;
							}
							break;
						default: l = q, q = 0, rd = null, nf(e, s, c, l);
					}
				}
				Zd(), o = cd;
				break;
			} catch (t) {
				Gd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ya = va = null, U = r, A.H = i, A.A = a, G === null && (W = null, K = 0, Di()), o;
	}
	function Zd() {
		for (; G !== null;) ef(G);
	}
	function Qd(e, t) {
		var n = U;
		U |= 2;
		var r = qd(), a = Jd();
		W !== e || K !== t ? (bd = null, yd = Ke() + 500, Wd(e, t)) : ad = pt(e, t);
		a: do
			try {
				if (q !== 0 && G !== null) {
					t = G;
					var o = rd;
					b: switch (q) {
						case 1:
							q = 0, rd = null, nf(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (to(o)) {
								q = 0, rd = null, tf(t);
								break;
							}
							t = function() {
								q !== 2 && q !== 9 || W !== e || (q = 7), Df(e);
							}, o.then(t, t);
							break a;
						case 3:
							q = 7;
							break a;
						case 4:
							q = 5;
							break a;
						case 7:
							to(o) ? (q = 0, rd = null, tf(t)) : (q = 0, rd = null, nf(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (G.tag) {
								case 26: s = G.memoizedState;
								case 5:
								case 27:
									var c = G;
									if (s ? Ym(s) : c.stateNode.complete) {
										q = 0, rd = null;
										var l = c.sibling;
										if (l !== null) G = l;
										else {
											var u = c.return;
											u === null ? G = null : (G = u, rf(u));
										}
										break b;
									}
							}
							q = 0, rd = null, nf(e, t, o, 5);
							break;
						case 6:
							q = 0, rd = null, nf(e, t, o, 6);
							break;
						case 8:
							Ud(), cd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				$d();
				break;
			} catch (t) {
				Gd(e, t);
			}
		while (1);
		return ya = va = null, A.H = r, A.A = a, U = n, G === null ? (W = null, K = 0, Di(), cd) : 0;
	}
	function $d() {
		for (; G !== null && !We();) ef(G);
	}
	function ef(e) {
		var t = hl(e.alternate, e, sd);
		e.memoizedProps = e.pendingProps, t === null ? rf(e) : G = t;
	}
	function tf(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Yc(n, t, t.pendingProps, t.type, void 0, K);
				break;
			case 11:
				t = Yc(n, t, t.pendingProps, t.type.render, t.ref, K);
				break;
			case 5:
				ss(t);
				var r = t;
				r === oa && (R ? (fa(r), r.tag === 5 && r.stateNode != null && (L = r.stateNode)) : (fa(r), R = !0));
			default: wl(n, t), t = G = Ri(t, sd), t = hl(n, t, sd);
		}
		e.memoizedProps = e.pendingProps, t === null ? rf(e) : G = t;
	}
	function nf(e, t, n, r) {
		ya = va = null, ss(t), so = null, co = 0;
		var i = t.return;
		try {
			if (Pc(e, i, t, n, K)) {
				cd = 1, kc(e, Gi(n, e.current)), G = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw G = i, t;
			cd = 1, kc(e, Gi(n, e.current)), G = null;
			return;
		}
		t.flags & 32768 ? (R || r === 1 ? e = !0 : ad || K & 536870912 ? e = !1 : (id = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = No.current, r !== null && r.tag === 13 && (r.flags |= 16384))), af(t, e)) : rf(t);
	}
	function rf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				af(t, id);
				return;
			}
			e = t.return;
			var n = Sl(t.alternate, t, sd);
			if (n !== null) {
				G = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				G = t;
				return;
			}
			G = t = e;
		} while (t !== null);
		cd === 0 && (cd = 5);
	}
	function af(e, t) {
		do {
			var n = Cl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, G = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				G = e;
				return;
			}
			G = e = n;
		} while (e !== null);
		cd = 6, G = null;
	}
	function of(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			pf();
		while (Sd !== 0);
		if (U & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === W && (G = W = null, K = 0), wd = t, Cd = e, Td = n, Dd = a, Od = r, sf(e, t, n, s, c, l, f);
		}
	}
	function sf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Ed = s, s |= Ei, vt(e, n, s, r, i, a), Ad = null, (n & 335544064) === n ? (jd = Ra(e), r = 10262) : (jd = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, xf(Xe, function() {
			return mf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Ul = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = A.T, A.T = null, i = j.p, j.p = 2, a = U, U |= 4;
			try {
				gu(e, t, n);
			} finally {
				U = a, j.p = i, A.T = r;
			}
		}
		Sd = 1, Ul ? kd = Mp(o, e.containerInfo, jd, uf, df, lf, J, mf, cf, null, null) : (uf(), df(), J());
	}
	function cf(e) {
		if (Sd !== 0) {
			var t = Cd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function lf() {
		Sd === 3 && (Sd = 0, Lu(wd, Cd), Sd = 4);
	}
	function uf() {
		if (Sd === 1) {
			Sd = 0;
			var e = Cd, t = wd, n = Td, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = A.T, A.T = null;
				var i = j.p;
				j.p = 2;
				var a = U;
				U |= 4;
				try {
					pu = mu = !1, Nu(t, e, n), n = cp;
					var o = Xr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Yr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Zr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Jr(s, h), v = Jr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					U = a, j.p = i, A.T = r;
				}
			}
			e.current = t, Sd = 2;
		}
	}
	function df() {
		if (Sd === 2) {
			Sd = 0;
			var e = Cd, t = wd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = A.T, A.T = null;
				var r = j.p;
				j.p = 2;
				var i = U;
				U |= 4;
				try {
					vu(e, t.alternate, t);
				} finally {
					U = i, j.p = r, A.T = n;
				}
			}
			Sd = 3;
		}
	}
	function J() {
		if (Sd === 4 || Sd === 3) {
			Sd = 0;
			var e = kd;
			kd = null, Ge();
			var t = Cd, n = wd, r = Td, i = Od, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? Sd = 5 : (Sd = 0, wd = Cd = null, ff(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (xd = null), Ct(r), n = n.stateNode, nt && typeof nt.onCommitFiberRoot == "function") try {
				nt.onCommitFiberRoot(tt, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = A.T, a = j.p, j.p = 2, A.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					A.T = n, j.p = a;
				}
			}
			if (i = Ad, o = jd, jd = null, i !== null && (Ad = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Td & 3 && pf(), Df(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Nd ? Md++ : (Md = 0, Nd = t) : (Md = 0, Nd = null), Of(0, !1);
		}
	}
	function ff(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Fa(t)));
	}
	function pf() {
		return kd !== null && (kd.skipTransition(), kd = null), uf(), df(), J(), mf();
	}
	function mf() {
		if (Sd !== 5) return !1;
		var e = Cd, t = Ed;
		Ed = 0;
		var n = Ct(Td), r = A.T, a = j.p;
		try {
			j.p = 32 > n ? 32 : n, A.T = null, n = Dd, Dd = null;
			var o = Cd, s = Td;
			if (Sd = 0, wd = Cd = null, Td = 0, U & 6) throw Error(i(331));
			var c = U;
			if (U |= 4, Qu(o.current), Wu(o, o.current, s, n), U = c, Of(0, !1), nt && typeof nt.onPostCommitFiberRoot == "function") try {
				nt.onPostCommitFiberRoot(tt, o);
			} catch {}
			return !0;
		} finally {
			j.p = a, A.T = r, ff(e, t);
		}
	}
	function hf(e, t, n) {
		t = Gi(n, t), t = jc(e.stateNode, t, 2), e = bo(e, t, 2), e !== null && (_t(e, 2), Df(e));
	}
	function Y(e, t, n) {
		if (e.tag === 3) hf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				hf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (xd === null || !xd.has(r))) {
					e = Gi(n, e), n = Mc(2), r = bo(t, n, 2), r !== null && (Nc(n, r, t, e), _t(r, 2), Df(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new nd();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (od = !0, i.add(n), e = _f.bind(null, e, t, n), t.then(e, e));
	}
	function _f(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, W === e && (K & n) === n && (cd === 4 || cd === 3 && (K & 62914560) === K && 300 > Ke() - _d ? U & 2 ? dd |= n : Wd(e, 0) : dd |= n, pd === K && (pd = 0)), Df(e);
	}
	function vf(e, t) {
		t === 0 && (t = gt()), e = Ai(e, t), e !== null && (_t(e, t), Df(e));
	}
	function yf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), vf(e, n);
	}
	function bf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), vf(e, n);
	}
	function xf(e, t) {
		return He(e, t);
	}
	var X = null, Sf = null, Cf = !1, wf = !1, Tf = !1, Ef = 0;
	function Df(e) {
		e !== Sf && e.next === null && (Sf === null ? X = Sf = e : Sf = Sf.next = e), wf = !0, Cf || (Cf = !0, Nf());
	}
	function Of(e, t) {
		if (!Tf && wf) {
			Tf = !0;
			do
				for (var n = !1, r = X; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - it(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = K, a = ft(r, r === W ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || pt(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			Tf = !1;
		}
	}
	function Z() {
		kf();
	}
	function kf() {
		wf = Cf = !1;
		var e = 0;
		Ef !== 0 && hp() && (e = Ef);
		for (var t = Ke(), n = null, r = X; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? X = i : n.next = i, i === null && (Sf = n)) : (n = r, (e !== 0 || a & 3) && (wf = !0)), r = i;
		}
		Sd !== 0 && Sd !== 5 || Of(e, !1), Ef !== 0 && (Ef = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - it(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ht(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = W, n = K, n = ft(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (q === 2 || q === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ue(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || pt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ue(r), Ct(n)) {
				case 2:
				case 8:
					n = Ye;
					break;
				case 32:
					n = Xe;
					break;
				case 268435456:
					n = Qe;
					break;
				default: n = Xe;
			}
			return r = jf.bind(null, e), n = He(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ue(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (Sd !== 0 && Sd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (pf() && e.callbackNode !== n) return null;
		var r = K;
		return r = ft(e, e === W ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Rd(e, r, t), Af(e, Ke()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (pf()) return null;
		Rd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			U & 6 ? He(Je, Z) : kf();
		});
	}
	function Pf() {
		if (Ef === 0) {
			var e = Va;
			e === 0 && (e = ct, ct <<= 1, !(ct & 261888) && (ct = 256)), Ef = e;
		}
		return Ef;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : bn(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[Ot] || null).action), o = r.submitter;
			o && (t = (t = o[Ot] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Hn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Ef !== 0) {
								var e = new FormData(i, o);
								rc(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), rc(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < _i.length; Lf++) {
		var Rf = _i[Lf];
		vi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	vi(li, "onAnimationEnd"), vi(ui, "onAnimationIteration"), vi(di, "onAnimationStart"), vi("dblclick", "onDoubleClick"), vi("focusin", "onFocus"), vi("focusout", "onBlur"), vi(fi, "onTransitionRun"), vi(pi, "onTransitionStart"), vi(mi, "onTransitionCancel"), vi(hi, "onTransitionEnd"), Gt("onMouseEnter", ["mouseout", "mouseover"]), Gt("onMouseLeave", ["mouseout", "mouseover"]), Gt("onPointerEnter", ["pointerout", "pointerover"]), Gt("onPointerLeave", ["pointerout", "pointerover"]), Wt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Wt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Wt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Wt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Wt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Wt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ci(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ci(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[At];
		n === void 0 && (n = t[At] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Ut.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !jn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Lt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		On(function() {
			var r = a, i = Cn(n), s = [];
			a: {
				var c = gi.get(e);
				if (c !== void 0) {
					var l = Hn, u = e;
					switch (e) {
						case "keypress": if (Ln(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = or;
							break;
						case "focusin":
							u = "focus", l = Zn;
							break;
						case "focusout":
							u = "blur", l = Zn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Zn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Yn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Xn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = lr;
							break;
						case li:
						case ui:
						case di:
							l = Qn;
							break;
						case hi:
							l = ur;
							break;
						case "scroll":
						case "scrollend":
							l = Wn;
							break;
						case "wheel":
							l = dr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = $n;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = sr;
							break;
						case "submit":
							l = cr;
							break;
						case "toggle":
						case "beforetoggle": l = fr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = kn(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== Sn && (u = n.relatedTarget || n.fromElement) && (Lt(u) || u[kt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Lt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Yn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = sr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : zt(c), h = l == null ? u : zt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Lt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? ee(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? zt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Mr;
					else if (Er(c)) {
						if (Nr) _ = Hr;
						else {
							_ = Br;
							var v = zr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && _n(r.elementType) && (_ = Mr) : _ = Vr;
					if (_ &&= _(e, r)) {
						Dr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? zt(r) : window, e) {
					case "focusin":
						(Er(v) || v.contentEditable === "true") && ($r = v, ei = r, ti = null);
						break;
					case "focusout":
						ti = ei = $r = null;
						break;
					case "mousedown":
						ni = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ni = !1, ri(s, n, i);
						break;
					case "selectionchange": if (Qr) break;
					case "keydown":
					case "keyup": ri(s, n, i);
				}
				var y;
				if (mr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else Sr ? br(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (_r && n.locale !== "ko" && (Sr || b !== "onCompositionStart" ? b === "onCompositionEnd" && Sr && (y = In()) : (Nn = i, Pn = "value" in Nn ? Nn.value : Nn.textContent, Sr = !0)), v = Jf(r, b), 0 < v.length && (b = new er(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = xr(n), y !== null && (b.data = y)))), (y = gr ? Cr(e, n) : wr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new er("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = kn(e, n), i != null && r.unshift(qf(e, i, a)), i = kn(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = kn(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = kn(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || pn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && pn(e, "" + r);
				else return;
				break;
			case "className":
				Qt(e, "class", r);
				break;
			case "tabIndex":
				Qt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Qt(e, n, r);
				break;
			case "style":
				gn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Qt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = bn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = bn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = xn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = bn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Zt(e, "popover", r);
				break;
			case "xlinkActuate":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				$t(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				$t(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				$t(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				$t(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Zt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = vn.get(n) || n, Zt(e, n, r);
			else return;
		}
		F = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				gn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") pn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") pn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = xn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!P.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Ot] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					F = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Zt(e, n, r);
				}
				return;
		}
		F = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				ln(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && un(e, !!r, n, !0) : un(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				fn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (_n(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (F = !0), o = m;
							break;
						case "name":
							m !== f && (F = !0), a = m;
							break;
						case "checked":
							m !== f && (F = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (F = !0), d = m;
							break;
						case "value":
							m !== f && (F = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (F = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				cn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (F = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (F = !0), c = o;
						break;
					case "multiple": o !== l && (F = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? un(e, !!n, n ? [] : "", !1) : un(e, !!n, t, !0)) : un(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (F = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (F = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				dn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (F = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (_n(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[Dt] = r, n[Ot] = t, np(n, e, t), Vt(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Pt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : E({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Lt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = ee(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = ee(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), It(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Pt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === xn && (e.onclick = null), It(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		It(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = j.d;
	j.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = Hd();
		return e || t;
	}
	function Cm(e) {
		var t = Rt(e);
		t !== null && t.tag === 5 && t.type === "form" ? ac(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = sn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), Vt(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + sn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + sn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + sn(n.imageSizes) + "\"]")) : i += "[href=\"" + sn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = E({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Ft] = !0, o.onload = o.onerror = function() {
					Ht(o);
				}), Vt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + sn(r) + "\"][href=\"" + sn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = E({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), Vt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Bt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = E({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					Vt(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Bt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Vt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Bt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Vt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Oe.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Bt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Bt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Bt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + sn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return E({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Ft]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Ft] = !0, t.onload = t.onerror = Ht.bind(null, t), np(t, "link", n), Vt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + sn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + sn(n.href) + "\"]");
				if (r) return t.instance = r, Vt(r), r;
				var a = E({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Vt(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Vt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), Vt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, Vt(a), a) : (r = n, (a = vm.get(o)) && (r = E({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Vt(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Pt] || a[Dt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Vt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), Vt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: se,
		Provider: null,
		Consumer: null,
		_currentValue: xe,
		_currentValue2: xe,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = N(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = N(0), this.hiddenUpdates = N(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Fi(3, null, null, t), e.current = a, a.stateNode = e, t = Pa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, _o(a), e;
	}
	function uh(e) {
		return e ? (e = Ni, e) : Ni;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = yo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = bo(e, r, t), n !== null && (Ld(n, e, t), xo(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ai(e, 67108864);
			t !== null && Ld(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Pd();
			t = St(t);
			var n = Ai(e, t);
			n !== null && Ld(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 2, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 8, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Rt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = dt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - it(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Df(a), !(U & 6) && (yd = Ke() + 500, Of(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ai(a, 2), s !== null && Ld(s, a, 2), Hd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = Cn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Lt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (qe()) {
				case Je: return 2;
				case Ye: return 8;
				case Xe:
				case Ze: return 32;
				case Qe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Rt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Lt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, Tt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, Tt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				Sn = r, n.target.dispatchEvent(r), Sn = null;
			} else return t = Rt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Rt(n);
				a !== null && (e.splice(t, 3), t -= 3, rc(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Ot] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Ot] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, Pd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), Hd(), t[kt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = wt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	j.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: A,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			tt = Jh.inject(qh), nt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Ec, s = Dc, c = Oc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[kt] = t.current, Wf(e), new Wh(t);
	};
})), g = (/* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})))(), _ = "/*! tailwindcss v4.3.3 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){:root,:host{--shimmer-angle:20deg}*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-content:\"\";--tw-animation-delay:0s;--tw-animation-direction:normal;--tw-animation-duration:initial;--tw-animation-fill-mode:none;--tw-animation-iteration-count:1;--tw-enter-blur:0;--tw-enter-opacity:1;--tw-enter-rotate:0;--tw-enter-scale:1;--tw-enter-translate-x:0;--tw-enter-translate-y:0;--tw-exit-blur:0;--tw-exit-opacity:1;--tw-exit-rotate:0;--tw-exit-scale:1;--tw-exit-translate-x:0;--tw-exit-translate-y:0;--scroll-fade-t:0px;--scroll-fade-b:0px;--scroll-fade-s:0px;--scroll-fade-e:0px;--scroll-fade-mask:initial;--shimmer-image:initial;--shimmer-text-fill:initial}}}@layer theme{:root,:host{--font-sans:\"Geist Variable\", sans-serif;--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-amber-500:oklch(76.9% .188 70.08);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-500:oklch(69.6% .17 162.48);--color-emerald-600:oklch(59.6% .145 163.225);--color-sky-500:oklch(68.5% .169 237.323);--color-rose-400:oklch(71.2% .194 13.428);--color-rose-500:oklch(64.5% .246 16.439);--color-rose-600:oklch(58.6% .253 17.585);--spacing:.25rem;--container-xs:20rem;--container-md:28rem;--container-xl:36rem;--container-3xl:48rem;--container-6xl:72rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:calc(1.5 / 1);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-3xl:1.875rem;--text-3xl--line-height:calc(2.25 / 1.875);--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--text-5xl:3rem;--text-5xl--line-height:1;--font-weight-medium:500;--font-weight-semibold:600;--tracking-tighter:-.05em;--tracking-tight:-.025em;--leading-snug:1.375;--leading-relaxed:1.625;--radius-md:calc(var(--radius) * .8);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:\"Geist Variable\", sans-serif;--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}*{border-color:var(--border);outline-color:var(--ring)}@supports (color:color-mix(in lab, red, red)){*{outline-color:color-mix(in oklab, var(--ring) 50%, transparent)}}body{background-color:var(--background);color:var(--foreground)}html{font-family:Geist Variable,sans-serif}}@layer components;@layer utilities{.\\@container\\/card-header{container:card-header/inline-size}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.-inset-0\\.5{inset:calc(var(--spacing) * -.5)}.inset-0{inset:0}.inset-x-0{inset-inline:0}.inset-y-0{inset-block:0}.inset-y-auto{inset-block:auto}.top-0{top:0}.top-1\\/2{top:50%}.top-2{top:calc(var(--spacing) * 2)}.top-\\[0\\.08em\\]{top:.08em}.right-0{right:0}.right-2{right:calc(var(--spacing) * 2)}.bottom-0{bottom:0}.left-0{left:0}.left-1\\/2{left:50%}.isolate{isolation:isolate}.z-10{z-index:10}.z-20{z-index:20}.z-50{z-index:50}.z-\\[9999\\]{z-index:9999}.col-start-1{grid-column-start:1}.col-start-2{grid-column-start:2}.row-span-2{grid-row:span 2/span 2}.row-start-1{grid-row-start:1}.container{width:100%}@media (width>=40rem){.container{max-width:40rem}}@media (width>=48rem){.container{max-width:48rem}}@media (width>=64rem){.container{max-width:64rem}}@media (width>=80rem){.container{max-width:80rem}}@media (width>=96rem){.container{max-width:96rem}}.m-0{margin:0}.-mx-3{margin-inline:calc(var(--spacing) * -3)}.mx-0\\.5{margin-inline:calc(var(--spacing) * .5)}.mx-auto{margin-inline:auto}.-my-1{margin-block:calc(var(--spacing) * -1)}.-my-\\[0\\.08em\\]{margin-block:-.08em}.ms-auto{margin-inline-start:auto}.-me-1\\.5{margin-inline-end:calc(var(--spacing) * -1.5)}.mt-1{margin-top:var(--spacing)}.mt-4{margin-top:calc(var(--spacing) * 4)}.mr-1\\.5{margin-right:calc(var(--spacing) * 1.5)}.-mb-px{margin-bottom:-1px}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-row{display:table-row}.aspect-\\[16\\/10\\]{aspect-ratio:16/10}.size-1\\.5{width:calc(var(--spacing) * 1.5);height:calc(var(--spacing) * 1.5)}.size-2\\.5{width:calc(var(--spacing) * 2.5);height:calc(var(--spacing) * 2.5)}.size-3{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.size-5{width:calc(var(--spacing) * 5);height:calc(var(--spacing) * 5)}.size-5\\.5{width:calc(var(--spacing) * 5.5);height:calc(var(--spacing) * 5.5)}.size-6{width:calc(var(--spacing) * 6);height:calc(var(--spacing) * 6)}.size-7{width:calc(var(--spacing) * 7);height:calc(var(--spacing) * 7)}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.size-9{width:calc(var(--spacing) * 9);height:calc(var(--spacing) * 9)}.size-full{width:100%;height:100%}.h-1{height:var(--spacing)}.h-2{height:calc(var(--spacing) * 2)}.h-3{height:calc(var(--spacing) * 3)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-7{height:calc(var(--spacing) * 7)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-12{height:calc(var(--spacing) * 12)}.h-\\[calc\\(100\\%-1px\\)\\]{height:calc(100% - 1px)}.h-full{height:100%}.h-px{height:1px}.max-h-80{max-height:calc(var(--spacing) * 80)}.min-h-0{min-height:0}.min-h-9{min-height:calc(var(--spacing) * 9)}.min-h-\\[44px\\]{min-height:44px}.min-h-\\[54px\\]{min-height:54px}.min-h-lh{min-height:1lh}.min-h-svh{min-height:100svh}.w-1\\.5{width:calc(var(--spacing) * 1.5)}.w-4{width:calc(var(--spacing) * 4)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-28{width:calc(var(--spacing) * 28)}.w-32{width:calc(var(--spacing) * 32)}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.w-px{width:1px}.max-w-3xl{max-width:var(--container-3xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-64{max-width:calc(var(--spacing) * 64)}.max-w-\\[min\\(20rem\\,calc\\(100vw-16px\\)\\)\\]{max-width:min(20rem,100vw - 16px)}.max-w-full{max-width:100%}.max-w-md{max-width:var(--container-md)}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:0}.min-w-max{min-width:max-content}.flex-1{flex:1}.shrink-0{flex-shrink:0}.caption-bottom{caption-side:bottom}.origin-\\(--radix-tooltip-content-transform-origin\\){transform-origin:var(--radix-tooltip-content-transform-origin)}.origin-left{transform-origin:0}.origin-top{transform-origin:top}.-translate-x-1\\/2{--tw-translate-x:calc(calc(1 / 2 * 100%) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y:calc(calc(1 / 2 * 100%) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-y-\\[calc\\(-50\\%_-_2px\\)\\]{--tw-translate-y:calc(-50% - 2px);translate:var(--tw-translate-x) var(--tw-translate-y)}.rotate-45{rotate:45deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.scroll-fade-x{--_scroll-fade-size-s:var(--scroll-fade-s-size,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))));--_scroll-fade-size-e:var(--scroll-fade-e-size,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))));--scroll-fade-inline:linear-gradient(to right, transparent 0, #000 var(--scroll-fade-s,0px), #000 calc(100% - var(--scroll-fade-e,0px)), transparent 100%)}.scroll-fade-x:where([dir=rtl],[dir=rtl] *){--scroll-fade-inline:linear-gradient(to left, transparent 0, #000 var(--scroll-fade-s,0px), #000 calc(100% - var(--scroll-fade-e,0px)), transparent 100%)}.scroll-fade-x{-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-inline));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-inline));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-inline));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-inline));mask-image:var(--scroll-fade-mask,var(--scroll-fade-inline));-webkit-mask-composite:source-in;-webkit-mask-composite:source-in;-webkit-mask-composite:source-in;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-composite:source-in;mask-composite:intersect}@supports (animation-timeline:scroll()){.scroll-fade-x{animation:1ms ease-in-out scroll-fade-reveal-s,1ms ease-in-out scroll-fade-reveal-e;animation-timeline:scroll(self inline),scroll(self inline);animation-range:0 var(--scroll-fade-reveal,calc(var(--spacing) * 24)), calc(100% - var(--scroll-fade-reveal,calc(var(--spacing) * 24))) 100%;animation-fill-mode:both}}@supports not (animation-timeline:scroll()){.scroll-fade-x{--scroll-fade-s:var(--_scroll-fade-size-s);--scroll-fade-e:var(--_scroll-fade-size-e)}}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-crosshair{cursor:crosshair}.cursor-grab{cursor:grab}.cursor-pointer{cursor:pointer}.touch-pan-y{--tw-pan-y:pan-y;touch-action:var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)}.touch-none{touch-action:none}.\\[scrollbar-width\\:none\\]{scrollbar-width:none}.scrollbar-thin{scrollbar-width:thin}.auto-rows-min{grid-auto-rows:min-content}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-\\[2\\.25rem_2\\.25rem_1rem_minmax\\(0\\,1fr\\)\\]{grid-template-columns:2.25rem 2.25rem 1rem minmax(0,1fr)}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.content-start{align-content:flex-start}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.\\[gap\\:inherit\\]{gap:inherit}.gap-\\(--card-spacing\\){gap:var(--card-spacing)}.gap-0{gap:0}.gap-0\\.5{gap:calc(var(--spacing) * .5)}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-2\\.5{gap:calc(var(--spacing) * 2.5)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-10{gap:calc(var(--spacing) * 10)}.gap-\\[2px\\]{gap:2px}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.space-y-1\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 1.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-y-2{row-gap:calc(var(--spacing) * 2)}.self-start{align-self:flex-start}.justify-self-end{justify-self:flex-end}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-auto{overflow-x:auto}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-x-contain{overscroll-behavior-x:contain}.\\[border-radius\\:inherit\\]{border-radius:inherit}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:calc(var(--radius) * 1.8)}.rounded-3xl{border-radius:calc(var(--radius) * 2.2)}.rounded-4xl{border-radius:calc(var(--radius) * 2.6)}.rounded-\\[1px\\]{border-radius:1px}.rounded-\\[2px\\]{border-radius:2px}.rounded-\\[inherit\\]{border-radius:inherit}.rounded-\\[min\\(var\\(--radius-md\\)\\,10px\\)\\]{border-radius:min(var(--radius-md), 10px)}.rounded-\\[min\\(var\\(--radius-md\\)\\,12px\\)\\]{border-radius:min(var(--radius-md), 12px)}.rounded-full{border-radius:2147483647px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) * .8)}.rounded-xl{border-radius:calc(var(--radius) * 1.4)}.rounded-t-xl{border-top-left-radius:calc(var(--radius) * 1.4);border-top-right-radius:calc(var(--radius) * 1.4)}.rounded-l-\\[inherit\\]{border-top-left-radius:inherit;border-bottom-left-radius:inherit}.rounded-l-full{border-top-left-radius:2147483647px;border-bottom-left-radius:2147483647px}.rounded-r-\\[inherit\\]{border-top-right-radius:inherit;border-bottom-right-radius:inherit}.rounded-r-full{border-top-right-radius:2147483647px;border-bottom-right-radius:2147483647px}.rounded-b-xl{border-bottom-right-radius:calc(var(--radius) * 1.4);border-bottom-left-radius:calc(var(--radius) * 1.4)}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-border,.border-border\\/70{border-color:var(--border)}@supports (color:color-mix(in lab, red, red)){.border-border\\/70{border-color:color-mix(in oklab, var(--border) 70%, transparent)}}.border-destructive\\/30{border-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.border-destructive\\/30{border-color:color-mix(in oklab, var(--destructive) 30%, transparent)}}.border-input{border-color:var(--input)}.border-transparent{border-color:#0000}.bg-background,.bg-background\\/90{background-color:var(--background)}@supports (color:color-mix(in lab, red, red)){.bg-background\\/90{background-color:color-mix(in oklab, var(--background) 90%, transparent)}}.bg-border,.bg-border\\/70{background-color:var(--border)}@supports (color:color-mix(in lab, red, red)){.bg-border\\/70{background-color:color-mix(in oklab, var(--border) 70%, transparent)}}.bg-card{background-color:var(--card)}.bg-current{background-color:currentColor}.bg-destructive\\/10{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.bg-destructive\\/10{background-color:color-mix(in oklab, var(--destructive) 10%, transparent)}}.bg-emerald-500\\/\\[0\\.07\\]{background-color:#00bb7f12}@supports (color:color-mix(in lab, red, red)){.bg-emerald-500\\/\\[0\\.07\\]{background-color:color-mix(in oklab, var(--color-emerald-500) 7.0%, transparent)}}.bg-foreground,.bg-foreground\\/25{background-color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.bg-foreground\\/25{background-color:color-mix(in oklab, var(--foreground) 25%, transparent)}}.bg-foreground\\/45{background-color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.bg-foreground\\/45{background-color:color-mix(in oklab, var(--foreground) 45%, transparent)}}.bg-muted,.bg-muted\\/50{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.bg-muted\\/50{background-color:color-mix(in oklab, var(--muted) 50%, transparent)}}.bg-muted\\/80{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.bg-muted\\/80{background-color:color-mix(in oklab, var(--muted) 80%, transparent)}}.bg-primary{background-color:var(--primary)}.bg-rose-500\\/\\[0\\.07\\]{background-color:#ff235712}@supports (color:color-mix(in lab, red, red)){.bg-rose-500\\/\\[0\\.07\\]{background-color:color-mix(in oklab, var(--color-rose-500) 7.0%, transparent)}}.bg-secondary{background-color:var(--secondary)}.bg-transparent{background-color:#0000}.\\[mask-image\\:linear-gradient\\(to_bottom\\,transparent\\,black_6\\%\\,black_94\\%\\,transparent\\)\\]{-webkit-mask-image:linear-gradient(#0000,#000 6% 94%,#0000);mask-image:linear-gradient(#0000,#000 6% 94%,#0000)}.\\[mask-image\\:linear-gradient\\(to_left\\,black\\,transparent\\)\\]{-webkit-mask-image:linear-gradient(270deg,#000,#0000);mask-image:linear-gradient(270deg,#000,#0000)}.\\[mask-image\\:linear-gradient\\(to_right\\,black\\,transparent\\)\\]{-webkit-mask-image:linear-gradient(90deg,#000,#0000);mask-image:linear-gradient(90deg,#000,#0000)}.\\[mask-image\\:linear-gradient\\(to_right\\,transparent\\,black_6\\%\\,black_94\\%\\,transparent\\)\\]{-webkit-mask-image:linear-gradient(90deg,#0000,#000 6% 94%,#0000);mask-image:linear-gradient(90deg,#0000,#000 6% 94%,#0000)}.bg-clip-padding{background-clip:padding-box}.fill-foreground{fill:var(--foreground)}.stroke-foreground\\/\\[0\\.14\\]{stroke:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.stroke-foreground\\/\\[0\\.14\\]{stroke:color-mix(in oklab, var(--foreground) 14.0%, transparent)}}.\\[padding\\:inherit\\]{padding:inherit}.p-\\(--card-spacing\\){padding:var(--card-spacing)}.p-0\\.5{padding:calc(var(--spacing) * .5)}.p-1{padding:var(--spacing)}.p-2{padding:calc(var(--spacing) * 2)}.p-3{padding:calc(var(--spacing) * 3)}.p-\\[3px\\]{padding:3px}.p-px{padding:1px}.px-\\(--card-spacing\\){padding-inline:var(--card-spacing)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-5{padding-inline:calc(var(--spacing) * 5)}.py-\\(--card-spacing\\){padding-block:var(--card-spacing)}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-4{padding-block:calc(var(--spacing) * 4)}.py-10{padding-block:calc(var(--spacing) * 10)}.py-\\[0\\.08em\\]{padding-block:.08em}.pt-1{padding-top:var(--spacing)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-3{padding-top:calc(var(--spacing) * 3)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pt-6{padding-top:calc(var(--spacing) * 6)}.pr-2{padding-right:calc(var(--spacing) * 2)}.pb-1\\.5{padding-bottom:calc(var(--spacing) * 1.5)}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-2\\.5{padding-bottom:calc(var(--spacing) * 2.5)}.pb-3{padding-bottom:calc(var(--spacing) * 3)}.pb-5{padding-bottom:calc(var(--spacing) * 5)}.pl-6{padding-left:calc(var(--spacing) * 6)}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.text-start{text-align:start}.align-bottom{vertical-align:bottom}.align-middle{vertical-align:middle}.align-top{vertical-align:top}.font-heading{font-family:var(--font-sans)}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:Geist Variable,sans-serif}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.8rem\\]{font-size:.8rem}.text-\\[15px\\]{font-size:15px}.leading-5{--tw-leading:calc(var(--spacing) * 5);line-height:calc(var(--spacing) * 5)}.leading-6{--tw-leading:calc(var(--spacing) * 6);line-height:calc(var(--spacing) * 6)}.leading-none{--tw-leading:1;line-height:1}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[0\\.15em\\]{--tw-tracking:.15em;letter-spacing:.15em}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-tighter{--tw-tracking:var(--tracking-tighter);letter-spacing:var(--tracking-tighter)}.text-balance{text-wrap:balance}.break-words{overflow-wrap:break-word}.break-all{word-break:break-all}.whitespace-normal{white-space:normal}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.text-\\(--shiki-light\\){color:var(--shiki-light)}.text-\\[var\\(--agent-code-light\\)\\]{color:var(--agent-code-light)}.text-amber-500{color:var(--color-amber-500)}.text-background{color:var(--background)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-emerald-500{color:var(--color-emerald-500)}.text-emerald-600{color:var(--color-emerald-600)}.text-foreground,.text-foreground\\/60{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/60{color:color-mix(in oklab, var(--foreground) 60%, transparent)}}.text-foreground\\/80{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/80{color:color-mix(in oklab, var(--foreground) 80%, transparent)}}.text-foreground\\/85{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/85{color:color-mix(in oklab, var(--foreground) 85%, transparent)}}.text-foreground\\/90{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/90{color:color-mix(in oklab, var(--foreground) 90%, transparent)}}.text-foreground\\/\\[0\\.06\\]{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/\\[0\\.06\\]{color:color-mix(in oklab, var(--foreground) 6%, transparent)}}.text-muted-foreground,.text-muted-foreground\\/40{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/40{color:color-mix(in oklab, var(--muted-foreground) 40%, transparent)}}.text-muted-foreground\\/45{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/45{color:color-mix(in oklab, var(--muted-foreground) 45%, transparent)}}.text-muted-foreground\\/50{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/50{color:color-mix(in oklab, var(--muted-foreground) 50%, transparent)}}.text-muted-foreground\\/55{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/55{color:color-mix(in oklab, var(--muted-foreground) 55%, transparent)}}.text-muted-foreground\\/60{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/60{color:color-mix(in oklab, var(--muted-foreground) 60%, transparent)}}.text-muted-foreground\\/65{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/65{color:color-mix(in oklab, var(--muted-foreground) 65%, transparent)}}.text-muted-foreground\\/70{color:var(--muted-foreground)}@supports (color:color-mix(in lab, red, red)){.text-muted-foreground\\/70{color:color-mix(in oklab, var(--muted-foreground) 70%, transparent)}}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-rose-600{color:var(--color-rose-600)}.text-secondary-foreground{color:var(--secondary-foreground)}.text-sky-500{color:var(--color-sky-500)}.uppercase{text-transform:uppercase}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.underline{text-decoration-line:underline}.underline-offset-4{text-underline-offset:4px}.opacity-0{opacity:0}.opacity-20{opacity:.2}.opacity-50{opacity:.5}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-1{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-foreground\\/10{--tw-ring-color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.ring-foreground\\/10{--tw-ring-color:color-mix(in oklab, var(--foreground) 10%, transparent)}}.ring-foreground\\/60{--tw-ring-color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.ring-foreground\\/60{--tw-ring-color:color-mix(in oklab, var(--foreground) 60%, transparent)}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-\\[2px\\]{--tw-backdrop-blur:blur(2px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[color\\,box-shadow\\]{transition-property:color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.will-change-\\[opacity\\,filter\\,transform\\]{will-change:opacity,filter,transform}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[--card-spacing\\:--spacing\\(4\\)\\]{--card-spacing:calc(var(--spacing) * 4)}.\\[-webkit-touch-callout\\:none\\]{-webkit-touch-callout:none}.\\[clip-path\\:inset\\(0\\)\\]{clip-path:inset(0)}.running{animation-play-state:running}@media (hover:hover){.group-hover\\:text-muted-foreground:is(:where(.group):hover *){color:var(--muted-foreground)}.group-hover\\/file-tree\\:text-foreground:is(:where(.group\\/file-tree):hover *){color:var(--foreground)}}.group-has-data-\\[slot\\=code-block-footer\\]\\/code-block\\:pb-2:is(:where(.group\\/code-block):has([data-slot=code-block-footer]) *){padding-bottom:calc(var(--spacing) * 2)}.group-has-data-\\[slot\\=code-block-header\\]\\/code-block\\:pt-2:is(:where(.group\\/code-block):has([data-slot=code-block-header]) *){padding-top:calc(var(--spacing) * 2)}.group-has-\\[\\>svg\\]\\/alert\\:col-start-2:is(:where(.group\\/alert):has(>svg) *){grid-column-start:2}.group-data-\\[size\\=sm\\]\\/card\\:text-sm:is(:where(.group\\/card)[data-size=sm] *){font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.group-data-\\[size\\=sm\\]\\/code-block\\:-mx-2\\.5:is(:where(.group\\/code-block)[data-size=sm] *){margin-inline:calc(var(--spacing) * -2.5)}.group-data-\\[size\\=sm\\]\\/code-block\\:px-2\\.5:is(:where(.group\\/code-block)[data-size=sm] *){padding-inline:calc(var(--spacing) * 2.5)}.group-data-\\[size\\=sm\\]\\/code-block\\:py-2\\.5:is(:where(.group\\/code-block)[data-size=sm] *){padding-block:calc(var(--spacing) * 2.5)}.group-data-\\[size\\=sm\\]\\/code-block\\:pt-2\\.5:is(:where(.group\\/code-block)[data-size=sm] *){padding-top:calc(var(--spacing) * 2.5)}.group-data-\\[size\\=sm\\]\\/code-block\\:pb-2\\.5:is(:where(.group\\/code-block)[data-size=sm] *){padding-bottom:calc(var(--spacing) * 2.5)}.group-data-\\[size\\=sm\\]\\/code-block\\:text-xs:is(:where(.group\\/code-block)[data-size=sm] *){font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.group-data-\\[size\\=sm\\]\\/code-block\\:group-has-data-\\[slot\\=code-block-header\\]\\/code-block\\:pt-1\\.5:is(:where(.group\\/code-block)[data-size=sm] *):is(:where(.group\\/code-block):has([data-slot=code-block-header]) *){padding-top:calc(var(--spacing) * 1.5)}.group-data-\\[variant\\=destructive\\]\\/code-block\\:text-destructive:is(:where(.group\\/code-block)[data-variant=destructive] *){color:var(--destructive)}.group-data-\\[variant\\=line\\]\\/tabs-list\\:bg-transparent:is(:where(.group\\/tabs-list)[data-variant=line] *){background-color:#0000}.group-data-horizontal\\/tabs\\:h-8:is(:where(.group\\/tabs):where([data-orientation=horizontal]) *){height:calc(var(--spacing) * 8)}.group-data-vertical\\/tabs\\:h-fit:is(:where(.group\\/tabs):where([data-orientation=vertical]) *){height:fit-content}.group-data-vertical\\/tabs\\:w-full:is(:where(.group\\/tabs):where([data-orientation=vertical]) *){width:100%}.group-data-vertical\\/tabs\\:flex-col:is(:where(.group\\/tabs):where([data-orientation=vertical]) *){flex-direction:column}.group-data-vertical\\/tabs\\:justify-start:is(:where(.group\\/tabs):where([data-orientation=vertical]) *){justify-content:flex-start}.before\\:min-w-6:before{content:var(--tw-content);min-width:calc(var(--spacing) * 6)}.before\\:text-end:before{content:var(--tw-content);text-align:end}.before\\:text-muted-foreground:before{content:var(--tw-content);color:var(--muted-foreground)}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:start-1:after{content:var(--tw-content);inset-inline-start:calc(var(--spacing) * 1)}.after\\:top-0:after{content:var(--tw-content);top:0}.after\\:bg-foreground:after{content:var(--tw-content);background-color:var(--foreground)}.after\\:text-destructive:after{content:var(--tw-content);color:var(--destructive)}.after\\:text-muted-foreground:after{content:var(--tw-content);color:var(--muted-foreground)}.after\\:opacity-0:after{content:var(--tw-content);opacity:0}.after\\:transition-opacity:after{content:var(--tw-content);transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.after\\:content-\\[\\'\\+\\'\\]:after{--tw-content:\"+\";content:var(--tw-content)}.after\\:content-\\[\\'−\\'\\]:after{--tw-content:\"−\";content:var(--tw-content)}.after\\:select-none:after{content:var(--tw-content);-webkit-user-select:none;user-select:none}.group-data-horizontal\\/tabs\\:after\\:inset-x-0:is(:where(.group\\/tabs):where([data-orientation=horizontal]) *):after{content:var(--tw-content);inset-inline:0}.group-data-horizontal\\/tabs\\:after\\:bottom-\\[-5px\\]:is(:where(.group\\/tabs):where([data-orientation=horizontal]) *):after{content:var(--tw-content);bottom:-5px}.group-data-horizontal\\/tabs\\:after\\:h-0\\.5:is(:where(.group\\/tabs):where([data-orientation=horizontal]) *):after{content:var(--tw-content);height:calc(var(--spacing) * .5)}.group-data-vertical\\/tabs\\:after\\:inset-y-0:is(:where(.group\\/tabs):where([data-orientation=vertical]) *):after{content:var(--tw-content);inset-block:0}.group-data-vertical\\/tabs\\:after\\:-right-1:is(:where(.group\\/tabs):where([data-orientation=vertical]) *):after{content:var(--tw-content);right:calc(var(--spacing) * -1)}.group-data-vertical\\/tabs\\:after\\:w-0\\.5:is(:where(.group\\/tabs):where([data-orientation=vertical]) *):after{content:var(--tw-content);width:calc(var(--spacing) * .5)}@media (hover:hover){.hover\\:border-border:hover{border-color:var(--border)}.hover\\:bg-\\[color-mix\\(in_oklch\\,var\\(--secondary\\)\\,var\\(--foreground\\)_5\\%\\)\\]:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-\\[color-mix\\(in_oklch\\,var\\(--secondary\\)\\,var\\(--foreground\\)_5\\%\\)\\]:hover{background-color:color-mix(in oklch,var(--secondary),var(--foreground) 5%)}}.hover\\:bg-background\\/70:hover{background-color:var(--background)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-background\\/70:hover{background-color:color-mix(in oklab, var(--background) 70%, transparent)}}.hover\\:bg-destructive\\/20:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-destructive\\/20:hover{background-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.hover\\:bg-muted:hover,.hover\\:bg-muted\\/50:hover{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-muted\\/50:hover{background-color:color-mix(in oklab, var(--muted) 50%, transparent)}}.hover\\:bg-muted\\/60:hover{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-muted\\/60:hover{background-color:color-mix(in oklab, var(--muted) 60%, transparent)}}.hover\\:bg-primary\\/80:hover{background-color:var(--primary)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-primary\\/80:hover{background-color:color-mix(in oklab, var(--primary) 80%, transparent)}}.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab, var(--primary) 90%, transparent)}}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:text-muted-foreground:hover{color:var(--muted-foreground)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-70:hover{opacity:.7}}.focus-visible\\:border-destructive\\/40:focus-visible{border-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:border-destructive\\/40:focus-visible{border-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}.focus-visible\\:border-ring:focus-visible{border-color:var(--ring)}.focus-visible\\:bg-muted\\/25:focus-visible{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:bg-muted\\/25:focus-visible{background-color:color-mix(in oklab, var(--muted) 25%, transparent)}}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus-visible\\:ring-3:focus-visible,.focus-visible\\:ring-\\[3px\\]:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.focus-visible\\:ring-foreground:focus-visible{--tw-ring-color:var(--foreground)}.focus-visible\\:ring-ring:focus-visible,.focus-visible\\:ring-ring\\/40:focus-visible{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:ring-ring\\/40:focus-visible{--tw-ring-color:color-mix(in oklab, var(--ring) 40%, transparent)}}.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab, var(--ring) 50%, transparent)}}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus-visible\\:ring-offset-background:focus-visible{--tw-ring-offset-color:var(--background)}.focus-visible\\:outline-1:focus-visible{outline-style:var(--tw-outline-style);outline-width:1px}.focus-visible\\:outline-2:focus-visible{outline-style:var(--tw-outline-style);outline-width:2px}.focus-visible\\:-outline-offset-4:focus-visible{outline-offset:calc(4px * -1)}.focus-visible\\:outline-ring:focus-visible{outline-color:var(--ring)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.focus-visible\\:ring-inset:focus-visible{--tw-ring-inset:inset}.active\\:cursor-grabbing:active{cursor:grabbing}.active\\:not-aria-\\[haspopup\\]\\:translate-y-px:active:not([aria-haspopup]){--tw-translate-y:1px;translate:var(--tw-translate-x) var(--tw-translate-y)}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-0:disabled{opacity:0}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:opacity-50:disabled{opacity:.5}:where([data-numbered]) .in-data-numbered\\:col-span-2{grid-column:span 2/span 2}:where([data-numbered]) .in-data-numbered\\:grid{display:grid}:where([data-numbered]) .in-data-numbered\\:grid-cols-\\[auto_1fr\\]{grid-template-columns:auto 1fr}:where([data-numbered]) .in-data-numbered\\:grid-cols-subgrid{grid-template-columns:subgrid}:where([data-numbered]) .in-data-numbered\\:gap-x-3{column-gap:calc(var(--spacing) * 3)}:where([data-numbered]) .in-data-numbered\\:\\[counter-increment\\:line\\]{counter-increment:line}:where([data-numbered]) .in-data-numbered\\:before\\:content-\\[counter\\(line\\)\\]:before{--tw-content:counter(line);content:var(--tw-content)}:where([data-numbered]) .in-data-numbered\\:before\\:select-none:before{content:var(--tw-content);-webkit-user-select:none;user-select:none}:where([data-wrap]) .in-data-wrap\\:min-w-0{min-width:0}:where([data-slot=button-group]) .in-data-\\[slot\\=button-group\\]\\:rounded-lg{border-radius:var(--radius)}.has-focus-visible\\:outline-2:has(:focus-visible){outline-style:var(--tw-outline-style);outline-width:2px}.has-focus-visible\\:outline-offset-4:has(:focus-visible){outline-offset:4px}.has-focus-visible\\:outline-ring:has(:focus-visible){outline-color:var(--ring)}.has-aria-expanded\\:bg-muted\\/50:has([aria-expanded=true]){background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.has-aria-expanded\\:bg-muted\\/50:has([aria-expanded=true]){background-color:color-mix(in oklab, var(--muted) 50%, transparent)}}.has-data-\\[icon\\=inline-end\\]\\:pr-1:has([data-icon=inline-end]){padding-right:var(--spacing)}.has-data-\\[icon\\=inline-end\\]\\:pr-1\\.5:has([data-icon=inline-end]){padding-right:calc(var(--spacing) * 1.5)}.has-data-\\[icon\\=inline-end\\]\\:pr-2:has([data-icon=inline-end]){padding-right:calc(var(--spacing) * 2)}.has-data-\\[icon\\=inline-start\\]\\:pl-1:has([data-icon=inline-start]){padding-left:var(--spacing)}.has-data-\\[icon\\=inline-start\\]\\:pl-1\\.5:has([data-icon=inline-start]){padding-left:calc(var(--spacing) * 1.5)}.has-data-\\[icon\\=inline-start\\]\\:pl-2:has([data-icon=inline-start]){padding-left:calc(var(--spacing) * 2)}.has-data-\\[slot\\=alert-action\\]\\:relative:has([data-slot=alert-action]){position:relative}.has-data-\\[slot\\=alert-action\\]\\:pr-18:has([data-slot=alert-action]){padding-right:calc(var(--spacing) * 18)}.has-data-\\[slot\\=card-action\\]\\:grid-cols-\\[1fr_auto\\]:has([data-slot=card-action]){grid-template-columns:1fr auto}.has-data-\\[slot\\=card-description\\]\\:grid-rows-\\[auto_auto\\]:has([data-slot=card-description]){grid-template-rows:auto auto}.has-data-\\[slot\\=card-footer\\]\\:pb-0:has([data-slot=card-footer]){padding-bottom:0}.has-data-\\[slot\\=kbd\\]\\:pr-1\\.5:has([data-slot=kbd]){padding-right:calc(var(--spacing) * 1.5)}.has-\\[\\>\\[data-slot\\=code-block-content\\]\\:focus-visible\\]\\:border-ring:has(>[data-slot=code-block-content]:focus-visible){border-color:var(--ring)}.has-\\[\\>\\[data-slot\\=code-block-content\\]\\:focus-visible\\]\\:ring-3:has(>[data-slot=code-block-content]:focus-visible){--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.has-\\[\\>\\[data-slot\\=code-block-content\\]\\:focus-visible\\]\\:ring-ring\\/50:has(>[data-slot=code-block-content]:focus-visible){--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab, red, red)){.has-\\[\\>\\[data-slot\\=code-block-content\\]\\:focus-visible\\]\\:ring-ring\\/50:has(>[data-slot=code-block-content]:focus-visible){--tw-ring-color:color-mix(in oklab, var(--ring) 50%, transparent)}}:is(.\\*\\:has-\\[\\>\\[data-slot\\=code-block-title\\]\\]\\:min-w-0>*):has(>[data-slot=code-block-title]){min-width:0}.has-\\[\\>img\\:first-child\\]\\:pt-0:has(>img:first-child){padding-top:0}.has-\\[\\>svg\\]\\:grid-cols-\\[auto_1fr\\]:has(>svg){grid-template-columns:auto 1fr}.has-\\[\\>svg\\]\\:gap-x-2:has(>svg){column-gap:calc(var(--spacing) * 2)}.aria-disabled\\:cursor-not-allowed[aria-disabled=true]{cursor:not-allowed}.aria-expanded\\:bg-muted[aria-expanded=true]{background-color:var(--muted)}.aria-expanded\\:bg-secondary[aria-expanded=true]{background-color:var(--secondary)}.aria-expanded\\:text-foreground[aria-expanded=true]{color:var(--foreground)}.aria-expanded\\:text-secondary-foreground[aria-expanded=true]{color:var(--secondary-foreground)}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--destructive)}.aria-invalid\\:ring-3[aria-invalid=true]{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.data-wrap\\:scroll-fade-y[data-wrap]{--_scroll-fade-size-t:var(--scroll-fade-t-size,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))));--_scroll-fade-size-b:var(--scroll-fade-b-size,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))));--scroll-fade-block:linear-gradient(to bottom, transparent 0, #000 var(--scroll-fade-t,0px), #000 calc(100% - var(--scroll-fade-b,0px)), transparent 100%);-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-block));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-block));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-block));-webkit-mask-image:var(--scroll-fade-mask,var(--scroll-fade-block));mask-image:var(--scroll-fade-mask,var(--scroll-fade-block));-webkit-mask-composite:source-in;-webkit-mask-composite:source-in;-webkit-mask-composite:source-in;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-composite:source-in;mask-composite:intersect}@supports (animation-timeline:scroll()){.data-wrap\\:scroll-fade-y[data-wrap]{animation:1ms ease-in-out scroll-fade-reveal-t,1ms ease-in-out scroll-fade-reveal-b;animation-timeline:scroll(self y),scroll(self y);animation-range:0 var(--scroll-fade-reveal,calc(var(--spacing) * 24)), calc(100% - var(--scroll-fade-reveal,calc(var(--spacing) * 24))) 100%;animation-fill-mode:both}}@supports not (animation-timeline:scroll()){.data-wrap\\:scroll-fade-y[data-wrap]{--scroll-fade-t:var(--_scroll-fade-size-t);--scroll-fade-b:var(--_scroll-fade-size-b)}}.data-wrap\\:wrap-break-word[data-wrap]{overflow-wrap:break-word}.data-wrap\\:whitespace-pre-wrap[data-wrap]{white-space:pre-wrap}.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=bottom]{--tw-enter-translate-y:calc(2*var(--spacing)*-1)}.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=left]{--tw-enter-translate-x:calc(2*var(--spacing))}.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=right]{--tw-enter-translate-x:calc(2*var(--spacing)*-1)}.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=top]{--tw-enter-translate-y:calc(2*var(--spacing))}.data-\\[size\\=sm\\]\\:text-xs[data-size=sm]{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.data-\\[size\\=sm\\]\\:\\[--card-spacing\\:--spacing\\(3\\)\\][data-size=sm]{--card-spacing:calc(var(--spacing) * 3)}.data-\\[size\\=sm\\]\\:has-data-\\[slot\\=card-footer\\]\\:pb-0[data-size=sm]:has([data-slot=card-footer]){padding-bottom:0}:is(.\\*\\:data-\\[slot\\=alert-description\\]\\:text-destructive\\/90>*)[data-slot=alert-description]{color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){:is(.\\*\\:data-\\[slot\\=alert-description\\]\\:text-destructive\\/90>*)[data-slot=alert-description]{color:color-mix(in oklab, var(--destructive) 90%, transparent)}}:is(.\\*\\*\\:data-\\[slot\\=kbd\\]\\:relative *)[data-slot=kbd]{position:relative}:is(.\\*\\*\\:data-\\[slot\\=kbd\\]\\:isolate *)[data-slot=kbd]{isolation:isolate}:is(.\\*\\*\\:data-\\[slot\\=kbd\\]\\:z-50 *)[data-slot=kbd]{z-index:50}:is(.\\*\\*\\:data-\\[slot\\=kbd\\]\\:rounded-sm *)[data-slot=kbd]{border-radius:calc(var(--radius) * .6)}.data-\\[state\\=delayed-open\\]\\:animate-in[data-state=delayed-open]{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.data-\\[state\\=delayed-open\\]\\:fade-in-0[data-state=delayed-open]{--tw-enter-opacity:0}.data-\\[state\\=delayed-open\\]\\:zoom-in-95[data-state=delayed-open]{--tw-enter-scale:.95}.data-\\[state\\=selected\\]\\:bg-muted[data-state=selected]{background-color:var(--muted)}.data-\\[variant\\=line\\]\\:rounded-none[data-variant=line]{border-radius:0}@supports (content:counter(line) / ''){:where([data-numbered]) .in-data-numbered\\:supports-\\[content\\:counter\\(line\\)_\\/_\\'\\'\\]\\:before\\:content-\\[counter\\(line\\)_\\/_\\'\\'\\]:before{--tw-content:counter(line) / \"\";content:var(--tw-content)}}@media (width>=40rem){.sm\\:gap-1{gap:var(--spacing)}.sm\\:px-6{padding-inline:calc(var(--spacing) * 6)}.sm\\:text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}}@media (width>=48rem){.md\\:text-pretty{text-wrap:pretty}}@media (width>=64rem){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-\\[18rem_1fr\\]{grid-template-columns:18rem 1fr}}.dark\\:border-destructive\\/40:is(.dark *){border-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:border-destructive\\/40:is(.dark *){border-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}.dark\\:border-input:is(.dark *){border-color:var(--input)}.dark\\:bg-destructive\\/20:is(.dark *){background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:bg-destructive\\/20:is(.dark *){background-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.dark\\:bg-input\\/30:is(.dark *){background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:bg-input\\/30:is(.dark *){background-color:color-mix(in oklab, var(--input) 30%, transparent)}}.dark\\:text-\\(--shiki-dark\\):is(.dark *){color:var(--shiki-dark)}.dark\\:text-\\[var\\(--agent-code-dark\\)\\]:is(.dark *){color:var(--agent-code-dark)}.dark\\:text-emerald-400:is(.dark *){color:var(--color-emerald-400)}.dark\\:text-muted-foreground:is(.dark *){color:var(--muted-foreground)}.dark\\:text-rose-400:is(.dark *){color:var(--color-rose-400)}@media (hover:hover){.dark\\:hover\\:bg-destructive\\/30:is(.dark *):hover{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:hover\\:bg-destructive\\/30:is(.dark *):hover{background-color:color-mix(in oklab, var(--destructive) 30%, transparent)}}.dark\\:hover\\:bg-input\\/50:is(.dark *):hover{background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:hover\\:bg-input\\/50:is(.dark *):hover{background-color:color-mix(in oklab, var(--input) 50%, transparent)}}.dark\\:hover\\:bg-muted\\/50:is(.dark *):hover{background-color:var(--muted)}@supports (color:color-mix(in lab, red, red)){.dark\\:hover\\:bg-muted\\/50:is(.dark *):hover{background-color:color-mix(in oklab, var(--muted) 50%, transparent)}}.dark\\:hover\\:text-foreground:is(.dark *):hover{color:var(--foreground)}}.dark\\:focus-visible\\:ring-destructive\\/40:is(.dark *):focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:focus-visible\\:ring-destructive\\/40:is(.dark *):focus-visible{--tw-ring-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}.dark\\:aria-invalid\\:border-destructive\\/50:is(.dark *)[aria-invalid=true]{border-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:aria-invalid\\:border-destructive\\/50:is(.dark *)[aria-invalid=true]{border-color:color-mix(in oklab, var(--destructive) 50%, transparent)}}.dark\\:aria-invalid\\:ring-destructive\\/40:is(.dark *)[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:aria-invalid\\:ring-destructive\\/40:is(.dark *)[aria-invalid=true]{--tw-ring-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}@media (pointer:coarse){.pointer-coarse\\:select-none{-webkit-user-select:none;user-select:none}}.data-open\\:animate-in:where([data-state=open]),.data-open\\:animate-in:where([data-open]:not([data-open=false])){animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.data-open\\:fade-in-0:where([data-state=open]),.data-open\\:fade-in-0:where([data-open]:not([data-open=false])){--tw-enter-opacity:0}.data-open\\:zoom-in-95:where([data-state=open]),.data-open\\:zoom-in-95:where([data-open]:not([data-open=false])){--tw-enter-scale:.95}.data-closed\\:animate-out:where([data-state=closed]),.data-closed\\:animate-out:where([data-closed]:not([data-closed=false])){animation:exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.data-closed\\:fade-out-0:where([data-state=closed]),.data-closed\\:fade-out-0:where([data-closed]:not([data-closed=false])){--tw-exit-opacity:0}.data-closed\\:zoom-out-95:where([data-state=closed]),.data-closed\\:zoom-out-95:where([data-closed]:not([data-closed=false])){--tw-exit-scale:.95}.data-active\\:bg-background:where([data-state=active]),.data-active\\:bg-background:where([data-active]:not([data-active=false])){background-color:var(--background)}.data-active\\:text-foreground:where([data-state=active]),.data-active\\:text-foreground:where([data-active]:not([data-active=false])){color:var(--foreground)}.group-data-\\[variant\\=default\\]\\/tabs-list\\:data-active\\:shadow-sm:is(:where(.group\\/tabs-list)[data-variant=default] *):where([data-state=active]),.group-data-\\[variant\\=default\\]\\/tabs-list\\:data-active\\:shadow-sm:is(:where(.group\\/tabs-list)[data-variant=default] *):where([data-active]:not([data-active=false])){--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:bg-transparent:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-state=active]),.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:bg-transparent:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-active]:not([data-active=false])){background-color:#0000}.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:shadow-none:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-state=active]),.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:shadow-none:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-active]:not([data-active=false])){--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}:is(.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:after\\:opacity-100:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-state=active]),.group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:after\\:opacity-100:is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-active]:not([data-active=false]))):after{content:var(--tw-content);opacity:1}.dark\\:data-active\\:border-input:is(.dark *):where([data-state=active]),.dark\\:data-active\\:border-input:is(.dark *):where([data-active]:not([data-active=false])){border-color:var(--input)}.dark\\:data-active\\:bg-input\\/30:is(.dark *):where([data-state=active]),.dark\\:data-active\\:bg-input\\/30:is(.dark *):where([data-active]:not([data-active=false])){background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:data-active\\:bg-input\\/30:is(.dark *):where([data-state=active]),.dark\\:data-active\\:bg-input\\/30:is(.dark *):where([data-active]:not([data-active=false])){background-color:color-mix(in oklab, var(--input) 30%, transparent)}}.dark\\:data-active\\:text-foreground:is(.dark *):where([data-state=active]),.dark\\:data-active\\:text-foreground:is(.dark *):where([data-active]:not([data-active=false])){color:var(--foreground)}.dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:border-transparent:is(.dark *):is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-state=active]),.dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:border-transparent:is(.dark *):is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-active]:not([data-active=false])){border-color:#0000}.dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:bg-transparent:is(.dark *):is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-state=active]),.dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-active\\:bg-transparent:is(.dark *):is(:where(.group\\/tabs-list)[data-variant=line] *):where([data-active]:not([data-active=false])){background-color:#0000}.data-horizontal\\:h-2\\.5:where([data-orientation=horizontal]){height:calc(var(--spacing) * 2.5)}.data-horizontal\\:h-px:where([data-orientation=horizontal]){height:1px}.data-horizontal\\:w-full:where([data-orientation=horizontal]){width:100%}.data-horizontal\\:flex-col:where([data-orientation=horizontal]){flex-direction:column}.data-horizontal\\:border-t:where([data-orientation=horizontal]){border-top-style:var(--tw-border-style);border-top-width:1px}.data-horizontal\\:border-t-transparent:where([data-orientation=horizontal]){border-top-color:#0000}.data-vertical\\:h-full:where([data-orientation=vertical]){height:100%}.data-vertical\\:w-2\\.5:where([data-orientation=vertical]){width:calc(var(--spacing) * 2.5)}.data-vertical\\:w-px:where([data-orientation=vertical]){width:1px}.data-vertical\\:self-stretch:where([data-orientation=vertical]){align-self:stretch}.data-vertical\\:border-l:where([data-orientation=vertical]){border-left-style:var(--tw-border-style);border-left-width:1px}.data-vertical\\:border-l-transparent:where([data-orientation=vertical]){border-left-color:#0000}.\\[\\&_a\\]\\:underline a{text-decoration-line:underline}.\\[\\&_a\\]\\:underline-offset-3 a{text-underline-offset:3px}@media (hover:hover){.\\[\\&_a\\]\\:hover\\:text-foreground a:hover{color:var(--foreground)}}.\\[\\&_p\\:not\\(\\:last-child\\)\\]\\:mb-4 p:not(:last-child){margin-bottom:calc(var(--spacing) * 4)}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:inline-block svg{display:inline-block}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\]\\:align-middle svg{vertical-align:middle}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-3 svg:not([class*=size-]){width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-3\\.5 svg:not([class*=size-]){width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.\\[\\&_tr\\]\\:border-b tr{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.\\[\\&_tr\\:last-child\\]\\:border-0 tr:last-child{border-style:var(--tw-border-style);border-width:0}.\\[\\&\\:\\:-webkit-scrollbar\\]\\:hidden::-webkit-scrollbar{display:none}.\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:pr-0:has([role=checkbox]){padding-right:0}.\\[\\.border-b\\]\\:pb-\\(--card-spacing\\).border-b{padding-bottom:var(--card-spacing)}@media (hover:hover){.\\[a\\]\\:hover\\:bg-destructive\\/20:is(a):hover{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.\\[a\\]\\:hover\\:bg-destructive\\/20:is(a):hover{background-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.\\[a\\]\\:hover\\:bg-muted:is(a):hover{background-color:var(--muted)}.\\[a\\]\\:hover\\:bg-primary\\/80:is(a):hover{background-color:var(--primary)}@supports (color:color-mix(in lab, red, red)){.\\[a\\]\\:hover\\:bg-primary\\/80:is(a):hover{background-color:color-mix(in oklab, var(--primary) 80%, transparent)}}.\\[a\\]\\:hover\\:bg-secondary\\/80:is(a):hover{background-color:var(--secondary)}@supports (color:color-mix(in lab, red, red)){.\\[a\\]\\:hover\\:bg-secondary\\/80:is(a):hover{background-color:color-mix(in oklab, var(--secondary) 80%, transparent)}}.\\[a\\]\\:hover\\:text-muted-foreground:is(a):hover{color:var(--muted-foreground)}}:is(.\\*\\:\\[img\\:first-child\\]\\:rounded-t-xl>*):is(img:first-child){border-top-left-radius:calc(var(--radius) * 1.4);border-top-right-radius:calc(var(--radius) * 1.4)}:is(.\\*\\:\\[img\\:last-child\\]\\:rounded-b-xl>*):is(img:last-child){border-bottom-right-radius:calc(var(--radius) * 1.4);border-bottom-left-radius:calc(var(--radius) * 1.4)}:is(.\\*\\:\\[svg\\]\\:row-span-2>*):is(svg){grid-row:span 2/span 2}:is(.\\*\\:\\[svg\\]\\:me-1\\.5>*):is(svg){margin-inline-end:calc(var(--spacing) * 1.5)}:is(.\\*\\:\\[svg\\]\\:translate-y-0\\.5>*):is(svg){--tw-translate-y:calc(var(--spacing) * .5);translate:var(--tw-translate-x) var(--tw-translate-y)}:is(.\\*\\:\\[svg\\]\\:text-current>*):is(svg){color:currentColor}:is(.\\*\\:\\[svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4>*):is(svg:not([class*=size-])){width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.\\[\\&\\>svg\\]\\:pointer-events-none>svg{pointer-events:none}.\\[\\&\\>svg\\]\\:size-3\\!>svg{width:calc(var(--spacing) * 3)!important;height:calc(var(--spacing) * 3)!important}.\\[\\&\\>tr\\]\\:last\\:border-b-0>tr:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:absolute{position:absolute}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:end-2{inset-inline-end:calc(var(--spacing) * 2)}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:top-2{top:calc(var(--spacing) * 2)}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:z-10{z-index:10}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:m-0{margin:0}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:opacity-0{opacity:0}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:group-focus-within\\/code-block\\:opacity-100:is(:where(.group\\/code-block):focus-within *){opacity:1}@media (hover:hover){[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:group-hover\\/code-block\\:opacity-100:is(:where(.group\\/code-block):hover *){opacity:1}}[data-slot=code-block]>.group-data-\\[size\\=sm\\]\\/code-block\\:\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:end-1\\.5:is(:where(.group\\/code-block)[data-size=sm] *){inset-inline-end:calc(var(--spacing) * 1.5)}[data-slot=code-block]>.group-data-\\[size\\=sm\\]\\/code-block\\:\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:top-1\\.5:is(:where(.group\\/code-block)[data-size=sm] *){top:calc(var(--spacing) * 1.5)}@media (pointer:coarse){[data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:pointer-coarse\\:opacity-100{opacity:1}}:is([data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:\\*\\:\\[button\\]\\:bg-background>*):is(button){background-color:var(--background)}:is([data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:\\*\\:\\[button\\]\\:ring-1>*):is(button){--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}:is([data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:\\*\\:\\[button\\]\\:ring-foreground\\/10>*):is(button){--tw-ring-color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){:is([data-slot=code-block]>.\\[\\[data-slot\\=code-block\\]\\>\\&\\]\\:\\*\\:\\[button\\]\\:ring-foreground\\/10>*):is(button){--tw-ring-color:color-mix(in oklab, var(--foreground) 10%, transparent)}}}@property --tw-animation-delay{syntax:\"*\";inherits:false;initial-value:0s}@property --tw-animation-direction{syntax:\"*\";inherits:false;initial-value:normal}@property --tw-animation-duration{syntax:\"*\";inherits:false}@property --tw-animation-fill-mode{syntax:\"*\";inherits:false;initial-value:none}@property --tw-animation-iteration-count{syntax:\"*\";inherits:false;initial-value:1}@property --tw-enter-blur{syntax:\"*\";inherits:false;initial-value:0}@property --tw-enter-opacity{syntax:\"*\";inherits:false;initial-value:1}@property --tw-enter-rotate{syntax:\"*\";inherits:false;initial-value:0}@property --tw-enter-scale{syntax:\"*\";inherits:false;initial-value:1}@property --tw-enter-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-enter-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-exit-blur{syntax:\"*\";inherits:false;initial-value:0}@property --tw-exit-opacity{syntax:\"*\";inherits:false;initial-value:1}@property --tw-exit-rotate{syntax:\"*\";inherits:false;initial-value:0}@property --tw-exit-scale{syntax:\"*\";inherits:false;initial-value:1}@property --tw-exit-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-exit-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --scroll-fade-t{syntax:\"<length-percentage>\";inherits:false;initial-value:0}@property --scroll-fade-b{syntax:\"<length-percentage>\";inherits:false;initial-value:0}@property --scroll-fade-s{syntax:\"<length-percentage>\";inherits:false;initial-value:0}@property --scroll-fade-e{syntax:\"<length-percentage>\";inherits:false;initial-value:0}@property --scroll-fade-mask{syntax:\"*\";inherits:false}@property --shimmer-angle{syntax:\"<angle>\";inherits:true;initial-value:20deg}@property --shimmer-image{syntax:\"*\";inherits:false}@property --shimmer-text-fill{syntax:\"*\";inherits:false}@media (prefers-reduced-motion:reduce){.shimmer{-webkit-text-fill-color:currentColor;background-image:none;animation:none}}@font-face{font-family:Geist Variable;font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,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)format(\"woff2-variations\");unicode-range:U+460-52F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:Geist Variable;font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,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)format(\"woff2-variations\");unicode-range:U+301,U+400-45F,U+490-491,U+4B0-4B1,U+2116}@font-face{font-family:Geist Variable;font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,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)format(\"woff2-variations\");unicode-range:U+102-103,U+110-111,U+128-129,U+168-169,U+1A0-1A1,U+1AF-1B0,U+300-301,U+303-304,U+308-309,U+323,U+329,U+1EA0-1EF9,U+20AB}@font-face{font-family:Geist Variable;font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,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)format(\"woff2-variations\");unicode-range:U+100-2BA,U+2BD-2C5,U+2C7-2CC,U+2CE-2D7,U+2DD-2FF,U+304,U+308,U+329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:Geist Variable;font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,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)format(\"woff2-variations\");unicode-range:U+??,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,U+329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}:root,:host{--background:oklch(96.2% .006 95);--foreground:oklch(24% .012 160);--card:oklch(98.5% .004 95);--card-foreground:oklch(22% .01 160);--popover:oklch(98.5% .004 95);--popover-foreground:oklch(14.5% 0 0);--primary:oklch(39% .06 165);--primary-foreground:oklch(98.5% .004 95);--secondary:oklch(97% 0 0);--secondary-foreground:oklch(20.5% 0 0);--muted:oklch(97% 0 0);--muted-foreground:oklch(55.6% 0 0);--accent:oklch(97% 0 0);--accent-foreground:oklch(20.5% 0 0);--destructive:oklch(57.7% .245 27.325);--border:oklch(87% .012 120);--input:oklch(92.2% 0 0);--ring:oklch(70.8% 0 0);--chart-1:oklch(87% 0 0);--chart-2:oklch(55.6% 0 0);--chart-3:oklch(43.9% 0 0);--chart-4:oklch(37.1% 0 0);--chart-5:oklch(26.9% 0 0);--radius:.625rem;--sidebar:oklch(98.5% 0 0);--sidebar-foreground:oklch(14.5% 0 0);--sidebar-primary:oklch(20.5% 0 0);--sidebar-primary-foreground:oklch(98.5% 0 0);--sidebar-accent:oklch(97% 0 0);--sidebar-accent-foreground:oklch(20.5% 0 0);--sidebar-border:oklch(92.2% 0 0);--sidebar-ring:oklch(70.8% 0 0)}.dark{--background:oklch(14.5% 0 0);--foreground:oklch(98.5% 0 0);--card:oklch(20.5% 0 0);--card-foreground:oklch(98.5% 0 0);--popover:oklch(20.5% 0 0);--popover-foreground:oklch(98.5% 0 0);--primary:oklch(92.2% 0 0);--primary-foreground:oklch(20.5% 0 0);--secondary:oklch(26.9% 0 0);--secondary-foreground:oklch(98.5% 0 0);--muted:oklch(26.9% 0 0);--muted-foreground:oklch(70.8% 0 0);--accent:oklch(26.9% 0 0);--accent-foreground:oklch(98.5% 0 0);--destructive:oklch(70.4% .191 22.216);--border:oklch(100% 0 0/.1);--input:oklch(100% 0 0/.15);--ring:oklch(55.6% 0 0);--chart-1:oklch(87% 0 0);--chart-2:oklch(55.6% 0 0);--chart-3:oklch(43.9% 0 0);--chart-4:oklch(37.1% 0 0);--chart-5:oklch(26.9% 0 0);--sidebar:oklch(20.5% 0 0);--sidebar-foreground:oklch(98.5% 0 0);--sidebar-primary:oklch(48.8% .243 264.376);--sidebar-primary-foreground:oklch(98.5% 0 0);--sidebar-accent:oklch(26.9% 0 0);--sidebar-accent-foreground:oklch(98.5% 0 0);--sidebar-border:oklch(100% 0 0/.1);--sidebar-ring:oklch(55.6% 0 0)}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-pan-x{syntax:\"*\";inherits:false}@property --tw-pan-y{syntax:\"*\";inherits:false}@property --tw-pinch-zoom{syntax:\"*\";inherits:false}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-tracking{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-content{syntax:\"*\";inherits:false;initial-value:\"\"}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));filter:blur(var(--tw-enter-blur,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));filter:blur(var(--tw-exit-blur,0))}}@keyframes scroll-fade-reveal-t{0%{--scroll-fade-t:0px}to{--scroll-fade-t:var(--_scroll-fade-size-t,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))))}}@keyframes scroll-fade-reveal-b{0%{--scroll-fade-b:var(--_scroll-fade-size-b,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))))}to{--scroll-fade-b:0px}}@keyframes scroll-fade-reveal-s{0%{--scroll-fade-s:0px}to{--scroll-fade-s:var(--_scroll-fade-size-s,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))))}}@keyframes scroll-fade-reveal-e{0%{--scroll-fade-e:var(--_scroll-fade-size-e,var(--scroll-fade-size,min(12%, calc(var(--spacing) * 10))))}to{--scroll-fade-e:0px}}", v = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function y(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: v(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var b = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, x = (e) => {
	let t = b(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, S = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), C = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function w(e) {
	return e != null;
}
function T(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? C.width, a = e.size ?? e.height ?? C.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? S(...c) : S("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? C["stroke-width"]) * Number(e.size ?? e.width ?? C.width) / Number(t.size ?? t.width ?? C.width) : t.strokeWidth ?? C["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(C).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && w(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && w(t.width) && { [r("width")]: t.width },
			..."height" in t && w(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function ee(e, t = {}) {
	return T(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
// node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var E = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, D = /* @__PURE__ */ c(f(), 1), te = (0, D.createContext)({}), ne = () => (0, D.useContext)(te), re = (0, D.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = ne() ?? {}, y = !!c || E(d), [b, x, C = []] = ee(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: S(v, s),
		hasA11yProp: y,
		attributes: d
	});
	return (0, D.createElement)(b, {
		ref: f,
		...x
	}, [...C.map(([e, t]) => (0, D.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function ie(e, t = [], n = []) {
	let r = typeof e == "string" ? y(e, t, n) : e, i = (0, D.forwardRef)(({ className: e, ...t }, n) => (0, D.createElement)(re, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = x(r.name)), i;
}
// node_modules/lucide-react/dist/esm/icons/chevron-left.mjs
var ae = {
	name: "chevron-left",
	size: 24,
	node: [["path", {
		d: "m15 18-6-6 6-6",
		key: "1wnfg3"
	}]]
};
ae.node;
var oe = ie(ae), se = {
	name: "chevron-right",
	size: 24,
	node: [["path", {
		d: "m9 18 6-6-6-6",
		key: "mthhwq"
	}]]
};
se.node;
var O = ie(se), ce = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), le = /* @__PURE__ */ o(((e, t) => {
	t.exports = ce();
})), ue = /* @__PURE__ */ (0, D.createContext)({});
// node_modules/framer-motion/dist/es/utils/use-constant.mjs
function de(e) {
	let t = (0, D.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
// node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var fe = typeof window < "u" ? D.useLayoutEffect : D.useEffect, pe = /* @__PURE__ */ (0, D.createContext)(null);
// node_modules/motion-utils/dist/es/array.mjs
function me(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function he(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
// node_modules/motion-utils/dist/es/clamp.mjs
var k = (e, t, n) => n > t ? t : n < e ? e : n, ge = {}, _e = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), ve = (e) => typeof e == "object" && !!e, ye = (e) => /^0[^.\s]+$/u.test(e);
// node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function be(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
// node_modules/motion-utils/dist/es/noop.mjs
var A = /* @__NO_SIDE_EFFECTS__ */ (e) => e, j = (...e) => e.reduce((e, t) => (n) => t(e(n))), xe = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, Se = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return me(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		he(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, Ce = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, we = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, Te = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, M = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function Ee(e, t, n, r) {
	return e === t && n === r ? A : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = M(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (M(s + 1e-7, e, n) - i - r);
		}
		return M(s, t, r);
	};
}
// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var De = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Oe = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), ke = /*@__PURE__*/ Ee(.33, 1.53, .69, .99), Ae = /*@__PURE__*/ Oe(ke), je = /*@__PURE__*/ De(Ae), Me = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * Ae(e) : .5 * (2 - 2 ** (-10 * (e - 1))), Ne = (e) => 1 - Math.sin(Math.acos(e)), Pe = /* @__PURE__ */ Oe(Ne), Fe = /* @__PURE__ */ De(Ne), Ie = /*@__PURE__*/ Ee(.42, 0, 1, 1), Le = /*@__PURE__*/ Ee(0, 0, .58, 1), Re = /*@__PURE__*/ Ee(.42, 0, .58, 1), ze = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", Be = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", Ve = {
	linear: A,
	easeIn: Ie,
	easeInOut: Re,
	easeOut: Le,
	circIn: Ne,
	circInOut: Fe,
	circOut: Pe,
	backIn: Ae,
	backInOut: je,
	backOut: ke,
	anticipate: Me
}, He = (e) => typeof e == "string", Ue = (e) => {
	if (/* @__PURE__ */ Be(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ Ee(t, n, r, i);
	}
	return He(e) ? (Ve[e], `${e}`, Ve[e]) : e;
}, We = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, Ge;
function Ke() {
	Ge = void 0;
}
var qe = {
	now: () => (Ge === void 0 && qe.set(We.isProcessing || ge.useManualTiming ? We.timestamp : performance.now()), Ge),
	set: (e) => {
		Ge = e, queueMicrotask(Ke);
	}
}, Je = (e) => Math.round(e * 1e5) / 1e5, Ye = (e) => (t) => typeof t == "string" && t.startsWith(e), Xe = /*@__PURE__*/ Ye("--"), Ze = /*@__PURE__*/ Ye("var(--"), Qe = (e) => Ze(e) ? $e.test(e.split("/*")[0].trim()) : !1, $e = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function et(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var tt = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, nt = {
	...tt,
	transform: (e) => k(0, 1, e)
}, rt = {
	...tt,
	default: 1
}, it = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function at(e) {
	return e == null;
}
// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var ot = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, st = (e, t) => (n) => !!(typeof n == "string" && ot.test(n) && n.startsWith(e) || t && !at(n) && Object.prototype.hasOwnProperty.call(n, t)), ct = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(it);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, lt = (e) => k(0, 255, e), ut = {
	...tt,
	transform: (e) => Math.round(lt(e))
}, dt = {
	test: /*@__PURE__*/ st("rgb", "red"),
	parse: /*@__PURE__*/ ct("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + ut.transform(e) + ", " + ut.transform(t) + ", " + ut.transform(n) + ", " + Je(nt.transform(r)) + ")"
};
// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function ft(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var pt = {
	test: /*@__PURE__*/ st("#"),
	parse: ft,
	transform: dt.transform
}, mt = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), ht = /*@__PURE__*/ mt("deg"), gt = /*@__PURE__*/ mt("%"), N = /*@__PURE__*/ mt("px"), _t = /*@__PURE__*/ mt("vh"), vt = /*@__PURE__*/ mt("vw"), yt = {
	...gt,
	parse: (e) => gt.parse(e) / 100,
	transform: (e) => gt.transform(e * 100)
}, bt = {
	test: /*@__PURE__*/ st("hsl", "hue"),
	parse: /*@__PURE__*/ ct("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + gt.transform(Je(t)) + ", " + gt.transform(Je(n)) + ", " + Je(nt.transform(r)) + ")"
}, xt = {
	test: (e) => dt.test(e) || pt.test(e) || bt.test(e),
	parse: (e) => dt.test(e) ? dt.parse(e) : bt.test(e) ? bt.parse(e) : pt.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? dt.transform(e) : bt.transform(e),
	getAnimatableNone: (e) => {
		let t = xt.parse(e);
		return t.alpha = 0, xt.transform(t);
	}
}, St = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, Ct = /*@__PURE__*/ new RegExp(it.source), wt = /*@__PURE__*/ new RegExp(St.source, "i");
function Tt(e) {
	return isNaN(e) && typeof e == "string" && (Ct.test(e) || wt.test(e));
}
var Et = "number", Dt = "color", Ot = "var", kt = "var(", At = "${}", jt = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function Mt(e) {
	let t = e.toString();
	return Ct.test(t) || wt.test(t);
}
function Nt(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(jt, (e) => (xt.test(e) ? (r.color.push(a), i.push(Dt), n.push(xt.parse(e))) : e.startsWith(kt) ? (r.var.push(a), i.push(Ot), n.push(e)) : (r.number.push(a), i.push(Et), n.push(parseFloat(e))), ++a, At)).split(At),
		indexes: r,
		types: i
	};
}
function Pt(e) {
	return Nt(e).values;
}
function Ft({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Et ? Je(r[a]) : e === Dt ? xt.transform(r[a]) : r[a];
		}
		return i;
	};
}
function It(e) {
	return Ft(Nt(e));
}
var Lt = (e) => typeof e == "number" ? 0 : xt.test(e) ? xt.getAnimatableNone(e) : e, Rt = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : Lt(e);
function zt(e) {
	let t = Nt(e);
	return Ft(t)(t.values.map((e, n) => Rt(e, t.split[n])));
}
var Bt = {
	test: Tt,
	parse: Pt,
	createTransformer: It,
	getAnimatableNone: zt
};
// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function Vt(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function Ht({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = Vt(s, r, e + 1 / 3), a = Vt(s, r, e), o = Vt(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function Ut(e, t) {
	return (n) => n > 0 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var P = (e, t, n) => e + (t - e) * n, Wt = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, Gt = [
	pt,
	dt,
	bt
], Kt = (e) => Gt.find((t) => t.test(e));
function qt(e) {
	let t = Kt(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === bt && (n = Ht(n)), n;
}
var Jt = (e, t) => {
	let n = qt(e), r = qt(t);
	if (!n || !r) return Ut(e, t);
	let i = { ...n };
	return (e) => (i.red = Wt(n.red, r.red, e), i.green = Wt(n.green, r.green, e), i.blue = Wt(n.blue, r.blue, e), i.alpha = P(n.alpha, r.alpha, e), dt.transform(i));
}, Yt = /* @__PURE__ */ new Set(["none", "hidden"]);
function F(e, t) {
	return Yt.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function Xt(e, t) {
	return (n) => P(e, t, n);
}
function Zt(e) {
	return typeof e == "number" ? Xt : typeof e == "string" ? Qe(e) ? Ut : xt.test(e) ? Jt : tn : Array.isArray(e) ? Qt : typeof e == "object" ? xt.test(e) ? Jt : $t : Ut;
}
function Qt(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => Zt(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function $t(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = Zt(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function en(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var tn = (e, t) => {
	let n = Bt.createTransformer(t), r = Nt(e), i = Nt(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? Yt.has(e) && !i.values.length || Yt.has(t) && !r.values.length ? F(e, t) : j(Qt(en(r, i), i.values), n) : (`${e}${t}`, Ut(e, t));
}, nn = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function rn(e, t) {
	let n = nn.exec(e);
	if (!n) return;
	let r = nn.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => Je(P(a, o, e)) + i;
}
function an(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return P(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = rn(e, t);
		if (n) return n;
	}
	return Zt(e)(e, t);
}
// node_modules/motion-dom/dist/es/frameloop/order.mjs
var on = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
// node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function sn(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a, o = /* @__PURE__ */ new Set(), s = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function c(t) {
		o.has(t) && (n.add(t), e()), (a = t)(s);
	}
	let l = {
		schedule: (e, i = !1, s = !1) => {
			let c = s && r, l = c ? t : n;
			return i && o.add(e), c && e !== a && l.delete(e), l.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), o.delete(e);
		},
		process: (e) => {
			if (s = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let o = t;
			t = n, n = o, t.forEach(c), t.clear(), a = void 0, r = !1, i && (i = !1, l.process(e));
		}
	};
	return l;
}
// node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var cn = 40;
function ln(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = on.reduce((e, t) => (e[t] = sn(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = ge.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, cn), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: on.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < on.length; t++) o[on[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: I, cancel: un, steps: dn } = /* @__PURE__ */ ln(typeof requestAnimationFrame < "u" ? requestAnimationFrame : A, !0, We), fn = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => I.update(t, e),
		stop: () => un(t),
		now: () => We.isProcessing ? We.timestamp : qe.now()
	};
}, pn = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, mn = 2e4;
function hn(e, t = 50, n = mn, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function gn(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(hn(o), mn);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ we(s)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var _n = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05
}, vn = (e) => e < 0 ? 1 / Math.max(1 + e, _n.minDamping) : Math.max(1 - e, _n.minDamping);
function yn(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return Sn((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function bn(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var xn = 12;
function Sn(e, t, n) {
	let r = n;
	for (let n = 1; n < xn; n++) r -= e(r) / t(r);
	return r;
}
var Cn = .001;
function wn({ duration: e = _n.duration, bounce: t = _n.bounce }) {
	let n, r;
	_n.maxDuration;
	let i = vn(t);
	e = k(_n.minDuration, _n.maxDuration, /* @__PURE__ */ we(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = bn(t, i), o = Math.exp(-r);
		return Cn - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = bn(t * t, i);
		return (-n(t) + Cn > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = Sn(n, r, a), s = o * yn(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ Ce(e)
	};
}
var Tn = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function En(e, t) {
	if (Tn(e, t)) return e;
}
function Dn(e) {
	let t = En(e.stiffness), n = En(e.damping, !0), r = En(e.mass), i = {
		...e,
		stiffness: t ?? _n.stiffness,
		damping: n ?? _n.damping,
		mass: r ?? _n.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = vn(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * yn(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, wn(i)), i.isResolvedFromDuration = !0;
		Tn(i.stiffness) && Tn(i.damping, !0) || (i.stiffness = _n.stiffness, i.damping = _n.damping);
	}
	return i;
}
function On(e = _n.visualDuration, t = _n.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Dn({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ we(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ we(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? _n.restSpeed.granular : _n.restSpeed.default), g.restDelta = n.restDelta || (e ? _n.restDelta.granular : _n.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = bn(m, p), t = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		b = () => {
			t.A = (g.velocity + h * g.delta) / e, t.sinC = h * t.A + g.delta * e, t.cosC = h * g.delta - t.A * e;
		};
		let n = (n) => {
			n !== t.t && (t.t = n, t.env = Math.exp(-h * n), t.sin = Math.sin(e * n), t.cos = Math.cos(e * n));
		};
		v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos)), y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos));
	} else if (p === 1) {
		v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
		let e = { C: 0 };
		b = () => {
			e.C = g.velocity + m * g.delta;
		}, y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity);
	} else {
		let e = m * Math.sqrt(p * p - 1), t = h - e, n = h + e, r = d ? Infinity : 300 / e, i = (e, t) => Math.exp(t > r ? -e * r - h * (t - r) : -e * t), a = {
			S: 0,
			F: 0
		};
		b = () => {
			let t = (g.velocity + h * g.delta) / e;
			a.S = (g.delta + t) / 2, a.F = (g.delta - t) / 2;
		}, v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e), y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e);
	}
	b();
	let x = u && l || null, S = {
		calculatedDuration: x,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ Ce(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ Ce(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(hn(S), mn), t = pn((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
var kn = /* @__PURE__ */ Object.assign(On, { applyToOptions: (e) => {
	let t = gn(e, 100, On);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ Ce(t.duration), e.type = "keyframes", e;
} });
// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function An({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = kn({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return S(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !x && b === void 0 && (t = !0, y(e), S(e)), b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f);
		}
	};
}
// node_modules/motion-dom/dist/es/utils/interpolate.mjs
function jn(e, t, n) {
	let r = [], i = n || ge.mix || an, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = j(Array.isArray(t) ? t[n] || A : t, a)), r.push(a);
	}
	return r;
}
function Mn(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = jn(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ xe(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(k(e[0], e[a - 1], t)) : l;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function Nn(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ xe(0, t, r);
		e.push(P(n, 1, i));
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function Pn(e) {
	let t = [0];
	return Nn(t, e.length - 1), t;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function Fn(e, t) {
	return e.map((e) => e * t);
}
// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function In(e, t) {
	return e.map(() => t || Re).splice(0, e.length - 1);
}
function Ln({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ ze(r) ? r.map(Ue) : Ue(r) || Re, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (ge.mix || an)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? k(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = Mn(Fn(n && n.length === t.length ? n : Pn(t), e), t, { ease: Array.isArray(i) ? i : In(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var Rn = 5;
function zn(e, t, n) {
	let r = Math.max(t - Rn, 0);
	return /* @__PURE__ */ Te(n - e(r), t - r);
}
function Bn(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : zn((t) => e.next(t).value, t, e.next(t).value);
}
// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var Vn = (e) => e !== null;
function Hn(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(Vn), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var Un = {
	decay: An,
	inertia: An,
	tween: Ln,
	keyframes: Ln,
	spring: kn
};
function Wn(e) {
	typeof e.type == "string" && (e.type = Un[e.type]);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var Gn = 40, Kn = (e, t) => t - e > Gn && !ge.useManualTiming ? t : e;
// node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function qn(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: qe.now(),
		frameTimestamp: We.timestamp,
		frameIsProcessing: We.isProcessing
	};
}
function Jn(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...qn("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function Yn(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...qn("layout-animation-start", e),
			node: t
		});
	} catch {}
}
// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Xn = class {
	constructor() {
		this.isResolved = !1;
	}
	get finished() {
		return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
			this._resolve = e;
		}), this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0, this.isResolved = !1;
	}
	notifyFinished() {
		this.isResolved = !0, this._resolve?.();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, Zn = (e) => e / 100, Qn = (e) => Math.round(e * 1e4) / 1e4, $n = class extends Xn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== qe.now() && this.tick(qe.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), Jn(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		Wn(e);
		let { type: t = Ln, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || Ln;
		s !== Ln && typeof o[0] != "number" && (this.mixKeyframes = j(Zn, an(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = hn(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		let t = Math.round(e - this.startTime) * this.playbackSpeed;
		this.currentTime = this.holdTime === null ? t : this.holdTime;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, calculatedDuration: i } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: a = 0, keyframes: o, type: s, onUpdate: c, finalKeyframe: l } = this.options;
		this.startTime === this.pendingStartTime && (this.startTime = Kn(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		!d && i !== null && (p = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== An && (f.value = Hn(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? Qn((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== An ? Hn(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
	}
	generate(e, t) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o } = this, { keyframes: s, repeat: c, repeatType: l, repeatDelay: u } = this.options, d = e, f = n;
		if (c) {
			let t = Math.min(e, r) / o, n = Math.floor(t), i = t % 1;
			!i && t >= 1 && (i = 1), i === 1 && n--, n = Math.min(n, c + 1), n % 2 && (l === "reverse" ? (i = 1 - i, u && (i -= u / o)) : l === "mirror" && (f = a)), d = k(0, 1, i) * o;
		}
		let p;
		return t ? (this.delayState.value = s[0], p = this.delayState) : p = f.next(d), i && !t && (p.value = i(p.value)), p;
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	get duration() {
		return /* @__PURE__ */ we(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ we(e);
	}
	get time() {
		return /* @__PURE__ */ we(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ Ce(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return Bn(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(qe.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ we(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = fn, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(qe.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
	}
	stopDriver() {
		this.driver &&= (this.driver.stop(), void 0);
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
}, er = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function tr(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(it) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!er.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var nr = /\b([a-z-]*)\(.*?\)/gu, rr = {
	...Bt,
	getAnimatableNone: (e) => {
		let t = e.match(nr);
		return t ? t.map(tr).join(" ") : e;
	}
}, ir = {
	...Bt,
	getAnimatableNone: (e) => {
		let t = Bt.parse(e);
		return Bt.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, ar = {
	...tt,
	transform: Math.round
}, or = {
	borderWidth: N,
	borderTopWidth: N,
	borderRightWidth: N,
	borderBottomWidth: N,
	borderLeftWidth: N,
	borderRadius: N,
	borderTopLeftRadius: N,
	borderTopRightRadius: N,
	borderBottomRightRadius: N,
	borderBottomLeftRadius: N,
	width: N,
	maxWidth: N,
	height: N,
	maxHeight: N,
	top: N,
	right: N,
	bottom: N,
	left: N,
	inset: N,
	insetBlock: N,
	insetBlockStart: N,
	insetBlockEnd: N,
	insetInline: N,
	insetInlineStart: N,
	insetInlineEnd: N,
	padding: N,
	paddingTop: N,
	paddingRight: N,
	paddingBottom: N,
	paddingLeft: N,
	paddingBlock: N,
	paddingBlockStart: N,
	paddingBlockEnd: N,
	paddingInline: N,
	paddingInlineStart: N,
	paddingInlineEnd: N,
	margin: N,
	marginTop: N,
	marginRight: N,
	marginBottom: N,
	marginLeft: N,
	marginBlock: N,
	marginBlockStart: N,
	marginBlockEnd: N,
	marginInline: N,
	marginInlineStart: N,
	marginInlineEnd: N,
	fontSize: N,
	backgroundPositionX: N,
	backgroundPositionY: N,
	rotate: ht,
	pathRotation: ht,
	rotateX: ht,
	rotateY: ht,
	rotateZ: ht,
	scale: rt,
	scaleX: rt,
	scaleY: rt,
	scaleZ: rt,
	skew: ht,
	skewX: ht,
	skewY: ht,
	distance: N,
	translateX: N,
	translateY: N,
	translateZ: N,
	x: N,
	y: N,
	z: N,
	perspective: N,
	transformPerspective: N,
	opacity: nt,
	originX: yt,
	originY: yt,
	originZ: N,
	zIndex: ar,
	fillOpacity: nt,
	strokeOpacity: nt,
	numOctaves: ar
}, sr = {
	...or,
	color: xt,
	backgroundColor: xt,
	outlineColor: xt,
	fill: xt,
	stroke: xt,
	borderColor: xt,
	borderTopColor: xt,
	borderRightColor: xt,
	borderBottomColor: xt,
	borderLeftColor: xt,
	filter: rr,
	WebkitFilter: rr,
	mask: ir,
	WebkitMask: ir
}, cr = (e) => sr[e], lr = /*@__PURE__*/ new Set([rr, ir]);
function ur(e, t) {
	let n = cr(e);
	return lr.has(n) || (n = Bt), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function dr(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var fr = (e) => e * 180 / Math.PI, pr = (e) => hr(fr(Math.atan2(e[1], e[0]))), mr = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: pr,
	rotateZ: pr,
	skewX: (e) => fr(Math.atan(e[1])),
	skewY: (e) => fr(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, hr = (e) => (e %= 360, e < 0 && (e += 360), e), gr = pr, _r = (e) => Math.hypot(e[0], e[1]), vr = (e) => Math.hypot(e[4], e[5]), yr = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: _r,
	scaleY: vr,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (_r(e) + vr(e)) / 2,
	rotateX: (e) => hr(fr(Math.atan2(e[6], e[5]))),
	rotateY: (e) => hr(fr(Math.atan2(-e[2], e[0]))),
	rotateZ: gr,
	rotate: gr,
	skewX: (e) => fr(Math.atan(e[4])),
	skewY: (e) => fr(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function br(e) {
	return +!!e.includes("scale");
}
function xr(e, t) {
	if (!e || e === "none") return br(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = yr, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = mr, i = t;
	}
	if (!i) return br(t);
	let a = r[t], o = i[1].split(",").map(Cr);
	return typeof a == "function" ? a(o) : o[a];
}
var Sr = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return xr(n, t);
};
function Cr(e) {
	return parseFloat(e.trim());
}
// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var wr = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], Tr = /* @__PURE__ */ new Set([...wr, "pathRotation"]), Er = (e) => e === tt || e === N, Dr = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Or = /* @__PURE__ */ wr.filter((e) => !Dr.has(e));
function kr(e) {
	let t = [];
	return Or.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var Ar = /* @__PURE__ */ new Set(["bottom", "right"]);
function jr(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var Mr = ({ transform: e }) => xr(e, "x"), Nr = ({ transform: e }) => xr(e, "y"), Pr = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => jr(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => jr(e, i, "y", t, n, r),
	top: ({ top: e }) => parseFloat(e),
	left: ({ left: e }) => parseFloat(e),
	bottom: ({ top: e }, t) => {
		let { y: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	right: ({ left: e }, t) => {
		let { x: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	x: Mr,
	y: Nr,
	translateX: Mr,
	translateY: Nr
}, Fr = /* @__PURE__ */ new Set(), Ir = !1, Lr = !1, Rr = !1;
function zr() {
	if (Lr) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		Fr.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), Ar.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = kr(e);
			t.length && (r.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = r.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	Lr = !1, Ir = !1, Fr.forEach((e) => e.complete(Rr)), Fr.clear();
}
function Br() {
	Fr.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (Lr = !0);
	});
}
function Vr() {
	Rr = !0, Br(), zr(), Rr = !1;
}
function Hr(e, t, n) {
	if (typeof e == "string") {
		if (_e(e) || ye(e)) return parseFloat(e);
		if (!Bt.test(e) && Bt.test(n)) return ur(t, n);
	}
	return e ?? void 0;
}
var Ur = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (Fr.add(this), Ir || (Ir = !0, I.read(Br), I.resolveKeyframes(zr))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = Hr(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		dr(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), Fr.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (Fr.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, Wr = (e) => e.startsWith("--");
// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Gr(e, t, n) {
	Wr(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var Kr = {};
// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function qr(e, t) {
	let n = /* @__PURE__ */ be(e);
	return () => Kr[t] ?? n();
}
// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var Jr = /* @__PURE__ */ qr(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Yr = /*@__PURE__*/ qr(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Xr = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Zr = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Xr([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Xr([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Xr([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Xr([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Qr(e, t) {
	if (e) return typeof e == "function" ? Yr() ? pn(e, t) : "ease-out" : /* @__PURE__ */ Be(e) ? Xr(e) : Array.isArray(e) ? e.map((e) => Qr(e, t) || Zr.easeOut) : Zr[e];
}
// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function $r(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Qr(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
// node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function ei(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function ti({ type: e, ...t }) {
	return ei(e) && Yr() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var ni = class extends Xn {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = ti(e);
		this.animation = $r(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = Hn(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), Gr(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, Jn(this, e, c);
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		this.isStopped || (this.isStopped = !0, this.state !== "idle" && this.finishedTime === null && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || (this.animation.onfinish = null, this.cancel())));
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ we(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ we(e);
	}
	get time() {
		return /* @__PURE__ */ we(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Ce(e), t && this.animation.pause();
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, onAttach: t, observe: n }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && Jr() ? (this.animation.timeline = e, t?.(this.animation), A) : n(this);
	}
}, ri = {
	anticipate: Me,
	backInOut: je,
	circInOut: Fe
};
function ii(e) {
	return e in ri;
}
function ai(e) {
	typeof e.ease == "string" && ii(e.ease) && (e.ease = ri[e.ease]);
}
var oi = class extends ni {
	constructor(e) {
		ai(e), Wn(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (qe.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new $n({
				...o,
				autoplay: !1
			}), this.sampler.stop();
		}
		return this.sampler.sample(Math.max(0, e)).value;
	}
	liveValue() {
		let { state: e } = this;
		if (e === "running" || e === "paused") return this.sample(this.elapsed());
	}
	updateMotionValue(e) {
		let { motionValue: t, element: n, name: r } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let { speed: i } = this, a = this.elapsed(), o = this.state === "running" && i ? k(0, 10, a) : 0, s = this.sample(a);
		n && r && Gr(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, si = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (Bt.test(e) || e === "0") && !e.startsWith("url("));
// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function ci(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function li(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = si(i, t), s = si(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : ci(e) || (n === "spring" || ei(n)) && r;
}
// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function ui(e) {
	e.duration = 0, e.type = "keyframes";
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var di = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), fi = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function pi(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && fi.test(e[t])) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var mi = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), hi = () => !ge.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function gi(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(di.has(n) || mi.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return hi() && (di.has(n) || mi.has(n) && pi(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var _i = (e, t) => t && typeof e == "number" ? t.transform(e) : e, vi = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, yi = wr.length;
function bi(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < yi; a++) {
		let o = wr[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = _i(s, or[o]);
			if (!c) {
				i = !1;
				let t = vi[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${_i(a, or.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
// node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var xi = /* @__PURE__ */ new WeakMap(), Si = 200, Ci = .001, wi = .1, Ti = .001, Ei = 100, Di = (e) => /^(linear|ease(In|Out|InOut))$/.test(e), Oi = (e, t) => e - t, ki = (e, t, n) => {
	let r = [];
	for (let i = 0; i <= n; i++) r.push(P(e, t, i / n));
	return r;
}, Ai = (e) => e.motionValue.owner, ji = (e) => xi.get(e), Mi = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), Ni = ({ name: e, motionValue: t }) => e && wr.includes(e) && t?.owner?.current instanceof HTMLElement && hi() && Yr();
function Pi(e) {
	let t = Ai(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (Mi(t, "transform") || "none") === "none" && !Mi(t, "pathRotation") && !t.projection?.isProjecting();
}
var Fi = class extends $n {
	constructor(e) {
		let t = Ai(e).current, { driver: n = fn } = e, r, i = Pi(e);
		e.driver = (e) => {
			let i = n(e);
			return {
				js: i,
				now: i.now,
				start: (e = !0) => {
					let n = ji(t);
					!n || n.isJS ? i.start(e) : n.schedule(!1, !e);
				},
				stop: () => {
					i.stop();
					let e = ji(t);
					e && !e.isFinishing && e.release(r);
				}
			};
		}, super(e), r = this, this.canAccelerate = i;
		let { stop: a } = this;
		this.stop = () => {
			this.isAccelerated() && this.sync(), a();
		};
	}
	get group() {
		return ji(Ai(this.options).current);
	}
	get js() {
		return this.driver?.js;
	}
	get name() {
		return this.options.name;
	}
	timing() {
		let { startTime: e, speed: t, totalDuration: n } = this, { delay: r = 0, repeatType: i } = this.options;
		return this.holdTime === null ? n === Infinity ? [e + r / t, this.resolvedDuration * (i === "loop" ? 1 : 2) / t || 1] : [e + (r + n) / t, 0] : [Infinity, 0];
	}
	isAccelerated() {
		let { group: e, state: t } = this;
		return e?.tracks.has(this) && !e.isJS && this.canAccelerate && (t === "running" || t === "paused");
	}
	liveValue() {
		return this.isAccelerated() ? this.sampleAt(qe.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, ease: n, times: r, repeat: i, delay: a = 0 } = this.options, o = /* @__PURE__ */ Be(n) ? Xr(n) : Di(n) && Zr[n];
		if (o && !i && !r && e.length === 2 && t === Ln && this.holdTime === null) {
			let e = this.startTime + a / this.speed;
			return [
				e,
				e + this.resolvedDuration / this.speed,
				o
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, times: u, keyframes: d, type: f } = a, p = (f || Ln) === Ln ? u || Pn(d) : [0, 1], m = n + o / r, h = [];
		if (this.holdTime !== null || !(i > 0)) return h;
		for (let n = Math.max(0, Math.floor((e - m) * r / i)); n <= s; n++) {
			let a = m + n * i / r;
			if (a > t) break;
			for (let o of p) {
				let s = a + (n % 2 && l && l !== "loop" ? 1 - o : o) * (i - c) / r;
				s > e && s < t && h.push(s);
			}
		}
		return h;
	}
	numberAt(e) {
		return parseFloat(this.sampleAt(e, !0));
	}
	sync() {
		let e = qe.now();
		this.options.motionValue.setWithVelocity(this.sampleAt(e - 10, !0), this.sampleAt(e, !0), 10);
	}
	play() {
		this.isStopped || ((this.group || Ii(Ai(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && (this.sync(), this.group.schedule(!1));
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.canAccelerate && this.tick(qe.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ we(k(0, this.totalDuration, this.at(qe.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		super.time = e, this.isAccelerated() && this.sync();
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
};
function Ii(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, m = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? wr : a) {
			let a = r.get(s), c = t === void 0 ? Mi(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, h = (e, t) => {
		let n = "", r = m(e, t);
		for (let e in r) n += (vi[e] || e) + "(" + _i(r[e], or[e]) + ") ";
		return n || "none";
	}, g = (e = m()) => {
		t.style.transform = bi(e, {});
	}, _ = (e = !0) => {
		e && g(), s.forEach(({ animation: e }) => e.cancel()), s = [];
	}, v = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = qe.now() + t, n < Infinity && (e.onfinish = () => {
			r.isDone = !0, s.some((e) => e.end === Infinity) && (e.cancel(), s = s.filter((e) => e !== r)), D.schedule(!1);
		}), e.oncancel = () => s.includes(r) && D.demote(), s.push(r);
	}, y = (e, t, n) => {
		let r = (t, n) => Math.abs(e(n) - e(t)), i = r(t, n);
		for (; n - t > .01;) {
			let e = (t + n) / 2;
			r(t, e) > r(e, n) ? n = e : t = e;
		}
		return r(t, n) > i / 2 ? [t, n] : [];
	}, b = (e, t, n, r) => {
		let i = Math.min(Si, Math.max(2, Math.ceil((n - t) / 10)));
		if (r.length * 4 > i) return;
		let a = ki(t, n, i).concat(r).sort(Oi), o = (e) => /* @__PURE__ */ xe(t, n, e), s, c;
		for (let t of e) {
			let e = a.map((e) => t.numberAt(e)), [n] = e, r = e.map((e) => e - n), i = r[r.length - 1], o = r.some((e) => Math.abs(e) * Ci > Math.abs(i)) ? 0 : i, l = r.map((e) => o ? e / o : e);
			if (!o) {
				if (l.some((e) => !(Math.abs(e) <= Ci))) return;
			} else if (!s) s = l, c = (e) => (t.numberAt(e) - n) / o;
			else if (l.some((e, t) => !(Math.abs(e - s[t]) <= Ci))) return;
		}
		if (!s || s.every((e, t) => Math.abs(e - o(a[t])) <= Ci)) return "linear";
		let l = [], u = (e, t = c(e)) => l.push(Qn(t) + " " + Qn(o(e) * 100) + "%");
		return s.forEach((e, t) => {
			t && Math.abs(e - s[t - 1]) > .2 && y(c, a[t - 1], a[t]).forEach((e) => u(e)), u(a[t], e);
		}), "linear(" + l + ")";
	}, x = (e, t, n, r) => {
		let i = [t], a = (t, n) => e.every((e) => !(Math.abs(e.numberAt((t + n) / 2) - (e.numberAt(t) + e.numberAt(n)) / 2) > (e.name.startsWith("scale") ? Ti : wi))), o = (t, n, r) => {
			if (n - t < 1 || a(t, n)) i.push(n);
			else if (r < 4) o(t, (t + n) / 2, r + 1), o((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...y((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, s = ki(t, n, Math.ceil((n - t) / 100));
		for (let e of r) s.push(e, Math.min(e + .01, n));
		let c = t;
		for (let e of s.sort(Oi)) e > c && o(c, e, 0), c = e;
		return i.sort(Oi);
	}, S = (e) => {
		let t;
		for (let n of e) {
			let e = n.tween();
			if (!e || t?.some((t, n) => n < 2 ? Math.abs(e[n] - t) > 1 : e[n] !== t)) return;
			t = e;
		}
		return t;
	}, C = (e, n, r, i = { fill: "both" }, a, o) => {
		let s = e.flatMap((e) => e.boundaries(n, r)), c = o || b(e, n, r, s), l = c ? [n, r] : x(e, n, r, s), u = l.map((e) => h(e, a)), d = { transform: u };
		return c || (d.offset = l.map((e) => /* @__PURE__ */ xe(n, r, e))), u.every((e) => e === u[0]) && (g(m(n, a)), d = null), t.animate(d, {
			...i,
			duration: r - n,
			easing: c || "linear"
		});
	}, w = (c) => {
		let l = c, u = 0, d = 0, f = [], p = [], m = /* @__PURE__ */ new Set();
		r.clear(), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			r.set(e.name, e);
			let [t, n] = e.timing(), i = t === Infinity;
			if (o.set(e, [
				e.at(c),
				e.speed,
				i
			]), i) e.sync();
			else {
				if (e.speed < 0) return;
				if (n) {
					if (u) {
						let e = (t - d) / n;
						if (Math.abs(n - u) > 1 || Math.abs(e - Math.round(e)) * u > 1) return;
					} else u = n, d = t;
					p.push(e);
				} else m.add(t);
				f.push(e), l = Math.max(l, t);
			}
		}
		i = {}, a = wr.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = Mi(e, t);
			return n !== void 0 && parseFloat(n) !== +!!t.startsWith("scale");
		}), _(!1);
		let h = !u && S(f);
		try {
			if (h && h[1] > c) {
				let [e, t, n] = h;
				v(C(f, e, t, void 0, void 0, n), e - c, t - e);
			} else l > c && (v(C(f, c, l), 0, l - c), m.forEach((e) => e < l - 1 && v(t.animate(null, { duration: e - c }), 0, e - c)));
			if (u) {
				let e = d + Math.floor((l - d) / u) * u;
				v(C(p, e, e + u, {
					iterations: Infinity,
					iterationStart: (l - e) / u,
					fill: "forwards"
				}, l), l - c);
			}
		} catch {
			return;
		}
		return s.length || _(), !0;
	}, T = (e) => {
		let t, r = 0;
		for (let i of n) {
			let n = o.get(i);
			if (!n) return !1;
			let [a, s, c] = n, l = i.at(e), u = i.timing()[0] === Infinity;
			if (c) {
				if (u && l === a) continue;
				return !1;
			}
			let d = (l - a) / s, f = u ? 0 : i.speed / s;
			if (t === void 0) t = d, r = f;
			else if (Math.abs(d - t) > 1 || f !== r) return !1;
		}
		if (t === void 0) return !0;
		if (!s.length) return !1;
		for (let { offset: e, end: n, isDone: r } of s) {
			let i = t - e;
			if (n < Infinity && (r ? i < n - 1 : i < 0 || i >= n)) return !1;
		}
		for (let { animation: n, offset: i, isDone: a } of s) {
			if (a) continue;
			let o = t - i;
			r ? (n.playbackRate = r, n.startTime = e - o / r) : (n.pause(), n.currentTime = o);
		}
		return !0;
	}, ee = () => !n.size && (u = !0, ji(t) === D && xi.delete(t), D.isJS || _(), !0), E = () => {
		let t = qe.now();
		if (D.isJS || (D.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = Mi(e, n.name), o.has(n) || (c = !0));
		}), D.isFinishing = !1), l = !1, u || (n.forEach(({ state: e }, t) => {
			(e === "idle" || e === "finished") && n.delete(t);
		}), ee())) return;
		for (let e of n) if (!e.canAccelerate) return D.demote(!0);
		D.isJS && (D.isJS = !1, c = !0, n.forEach((e) => e.js?.stop()));
		let r = c, a = d;
		if (c = d = !1, r || !T(t)) {
			if (a) {
				if (t - f < Ei) return D.demote();
				f = t;
			}
			if (!w(t)) return D.demote();
		}
	}, D = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, We.isProcessing ? I.render(E, !1, !0) : queueMicrotask(E)));
		},
		release(e) {
			let { state: t } = e;
			(t === "idle" || t === "finished") && n.delete(e), ee() || D.schedule(!0);
		},
		check() {
			if (!D.isJS) {
				for (let t in i) if (Mi(e, t) !== i[t] && !p(t)) return D.schedule(!0, !0);
			}
		},
		demote(e) {
			D.isJS || u || (n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), D.isJS = !0, o = /* @__PURE__ */ new Map(), _(), n.forEach((e) => e.state === "running" && e.js?.start()));
		}
	};
	return xi.set(t, D), D;
}
// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var Li = class extends Xn {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = qe.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || Ur;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = qe.now();
		let u = !0;
		li(e, i, a, o) || (u = !1, (ge.instantAnimations || !s) && l?.(Hn(e, n, t)), e[0] = e[e.length - 1], ui(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && gi(n), p = !f && Ni(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= Kn(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new oi(n);
			} catch {
				m = new $n(n);
			}
		} else m = p ? new Fi(n) : new $n(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	liveValue() {
		return this._animation?.liveValue?.();
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), Vr()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
	}
};
// node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function Ri(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
// node_modules/motion-dom/dist/es/value/index.mjs
var zi = 30, Bi = (e) => !isNaN(parseFloat(e)), Vi = { current: void 0 }, Hi = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = qe.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = qe.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Bi(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new Se())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new Se(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		I.read(() => {
			!this.changeSubscriber && !this.events.change?.getSize() && this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, t && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
	dirty() {
		this.notifyChange();
	}
	notifyChange() {
		let { current: e, changeSubscriber: t } = this;
		t ? t(e) : this.events.change?.notify(e);
	}
	addDependent(e) {
		this.dependents ||= /* @__PURE__ */ new Set(), this.dependents.add(e);
	}
	removeDependent(e) {
		this.dependents && this.dependents.delete(e);
	}
	get() {
		Vi.current && Vi.current.push(this);
		let e = this.animation?.liveValue?.();
		return e === void 0 ? this.current : e;
	}
	getCurrent() {
		return this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = qe.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > zi) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, zi);
		return /* @__PURE__ */ Te(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return this.stop(), new Promise((t) => {
			this.hasAnimated = !0;
			let n = !1, r;
			r = e(() => {
				n = !0, this.events.animationComplete?.notify(), this.animation === r && this.clearAnimation(), t();
			}), n || (this.animation = r), this.events.animationStart?.notify();
		});
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
	}
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		this.animation = void 0;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
};
function Ui(e, t) {
	return new Hi(e, t);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function Wi(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
// node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function Gi(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : Wi(n, e);
}
// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var Ki = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, qi = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), Ji = {
	type: "keyframes",
	duration: .8
}, Yi = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, Xi = (e, { keyframes: t }) => t.length > 2 ? Ji : Tr.has(e) ? e.startsWith("scale") ? qi(t[1]) : Ki : Yi, Zi = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed"
]);
function Qi(e) {
	for (let t in e) if (!Zi.has(t)) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var $i = (e, t, n, r = {}, i, a) => (o) => {
	let s = Gi(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ Ce(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i,
		hasOnUpdate: !!s.onUpdate
	};
	Qi(s) || Object.assign(u, Xi(e, u)), u.duration &&= /* @__PURE__ */ Ce(u.duration), u.repeatDelay &&= /* @__PURE__ */ Ce(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (ui(u), u.delay === 0 && (d = !0)), (ge.instantAnimations || ge.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, ui(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = Hn(u.keyframes, s);
		if (e !== void 0) {
			I.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new $n(u) : new Li(u);
}, ea = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function ta(e) {
	let t = ea.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function na(e, t, n = 1) {
	`${e}`;
	let [r, i] = ta(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return _e(e) ? parseFloat(e) : e;
	}
	return Qe(i) ? na(i, t, n + 1) : i;
}
// node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function ra(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function ia(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...ra(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
// node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function aa(e, t, n) {
	return ia(e.getProps(), t, n, e);
}
var oa = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, L = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...wr
]), R = (e) => Array.isArray(e);
// node_modules/motion-dom/dist/es/render/utils/setters.mjs
function sa(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Ui(n));
}
function ca(e) {
	return R(e) ? e[e.length - 1] || 0 : e;
}
function la(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = aa(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) sa(e, t, ca(i[t]));
}
// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var ua = (e) => !!(e && e.getVelocity);
// node_modules/motion-dom/dist/es/value/will-change/is.mjs
function da(e) {
	return !!(ua(e) && e.add);
}
// node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function fa(e, t) {
	let n = e.getValue("willChange");
	if (da(n)) return n.add(t);
	if (!n && ge.WillChange) {
		let n = new ge.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
// node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var pa = "data-framer-appear-id";
// node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function ma(e) {
	return e.props[pa];
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var ha = typeof window < "u";
function ga({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function _a(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? Wi(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && (p.animateValues ? p.animateValues((t) => e.getValue(t, e.latestValues[t] ?? 0), s, a, n, d) : p.animateVisualElement?.(e, s, a, n, d));
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && ga(f, t)) continue;
		let o = {
			delay: n,
			...Gi(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			I.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (ha && window.MotionHandoffAnimation) {
			let n = ma(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, I);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		fa(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start($i(t, r, i, m && L.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => I.update(() => {
			o && la(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function va(e, t, n = {}) {
	let r = aa(e, t, oa(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? _a(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(va(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + Ri(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function ya(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => va(e, t, n))) : typeof t == "string" ? va(e, t, n) : Promise.all(_a(e, aa(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
// node_modules/motion-dom/dist/es/value/types/auto.mjs
var ba = {
	test: (e) => e === "auto",
	parse: (e) => e
}, xa = (e) => (t) => t.test(e), Sa = [
	tt,
	N,
	gt,
	ht,
	vt,
	_t,
	ba
], Ca = (e) => Sa.find(xa(e));
// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function wa(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || ye(e);
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var Ta = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function Ea(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !Ta.has(t) && Mt(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = ur(n, i));
}
// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var Da = class extends Ur {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	scheduleResolve() {
		if (this.canReadNow() && (this.readKeyframes(), !this.needsMeasurement)) return this.complete();
		super.scheduleResolve();
	}
	canReadNow() {
		let { unresolvedKeyframes: e, element: t, motionValue: n } = this, r = e[0] ?? n?.get();
		if (!t?.current || r === void 0) return !1;
		for (let t = 0; t < e.length; t++) if (et(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), Qe(r))) {
				let i = na(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !L.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = Ca(r), o = Ca(i);
		if (et(r) !== et(i) && Pr[n]) this.needsMeasurement = !0;
		else if (a !== o) {
			if (Er(a) && Er(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else Pr[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || wa(e[t])) && n.push(t);
		n.length && Ea(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return Pr[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e || !e.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && this.motionValue?.jump(r, !1);
	}
	measureEndState() {
		let { element: e, unresolvedKeyframes: t } = this;
		if (!e || !e.current) return;
		this.motionValue?.jump(this.measuredOrigin, !1);
		let n = t.length - 1, r = t[n];
		t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([t, n]) => {
			e.getValue(t).set(n);
		}), this.resolveNoneKeyframes();
	}
}, Oa = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function ka(e) {
	return ve(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function Aa(e) {
	return ve(e) && "ownerSVGElement" in e;
}
// node_modules/motion-dom/dist/es/scope/active.mjs
var ja = {};
function Ma(e) {
	return ja.current?.add(e), e;
}
var Na = (e) => ja.current ? ja.current.bind(e) : e;
// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function Pa(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : ja.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Fa(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
// node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function Ia(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (Tr.has(e)) o = !0;
		else if (Xe(e)) i[e] = n;
		else {
			let t = _i(n, or[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = bi(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
// node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var La = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, Ra = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function za(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? La : Ra;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var Ba = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function Va(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (Ia(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of Ba) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && za(d, i, a, o, !1);
}
// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function Ha({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function Ua({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function Wa(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
// node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function Ga(e) {
	return e === void 0 || e === 1;
}
function Ka({ scale: e, scaleX: t, scaleY: n }) {
	return !Ga(e) || !Ga(t) || !Ga(n);
}
function qa(e) {
	return Ka(e) || Ja(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.rotateZ || e.skewX || e.skewY;
}
function Ja(e) {
	return Ya(e.x) || Ya(e.y);
}
function Ya(e) {
	return e && e !== "0%";
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function Xa(e, t, n) {
	return n + t * (e - n);
}
function Za(e, t, n, r, i) {
	return i !== void 0 && (e = Xa(e, i, r)), Xa(e, n, r) + t;
}
function Qa(e, t = 0, n = 1, r, i) {
	e.min = Za(e.min, t, n, r, i), e.max = Za(e.max, t, n, r, i);
}
function $a(e, { x: t, y: n }) {
	Qa(e.x, t.translate, t.scale, t.originPoint), Qa(e.y, n.translate, n.scale, n.originPoint);
}
var eo = .999999999999, to = 1.0000000000001;
function no(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (ro(e.x, -a.scroll.offset.x), ro(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, $a(e, o)), r && qa(a.latestValues) && oo(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < to && t.x > eo && (t.x = 1), t.y < to && t.y > eo && (t.y = 1);
}
function ro(e, t) {
	e.min += t, e.max += t;
}
function io(e, t, n, r, i = .5) {
	Qa(e, t, n, P(e.min, e.max, i), r);
}
function ao(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function oo(e, t, n) {
	let r = n ?? e;
	io(e.x, ao(t.x, r.x), t.scaleX, t.scale, t.originX), io(e.y, ao(t.y, r.y), t.scaleY, t.scale, t.originY);
}
// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function so(e, t) {
	return Ha(Wa(e.getBoundingClientRect(), t));
}
function co(e, t, n) {
	let r = so(e, n), { scroll: i } = t;
	return i && (ro(r.x, i.offset.x), ro(r.y, i.offset.y)), r;
}
// node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: lo, cancel: uo } = /* @__PURE__ */ ln(queueMicrotask, !1);
// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function fo(e, t, n) {
	let r = ua(e) ? e : Ui(e);
	return r.start($i("", r, t, n)), r.animation;
}
// node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var po = {}, mo = {
	value: null,
	addProjectionMetrics: null
};
// node_modules/motion-dom/dist/es/utils/delay.mjs
function ho(e, t) {
	let n = qe.now();
	e = Na(e);
	let r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (un(r), e(a - t));
	};
	return I.setup(r, !0), Ma(() => un(r));
}
// node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function go(e) {
	return Aa(e) && e.tagName === "svg";
}
// node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function _o(e) {
	return ua(e) ? e.get() : e;
}
// node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var vo = (e) => typeof e == "number" ? e : parseFloat(e), yo = Oa.length, bo = [
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skewX",
	"skewY"
], xo = bo.length, So = (e) => typeof e == "number" || N.test(e);
function Co(e, t, n, r, i, a) {
	i ? (e.opacity = P(0, n.opacity ?? 1, To(r)), e.opacityExit = P(t.opacity ?? 1, 0, Eo(r))) : a && (e.opacity = P(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < yo; i++) {
		let a = Oa[i], o = wo(t, a), s = wo(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || So(o) === So(s) ? (e[a] = Math.max(P(vo(o), vo(s), r), 0), (gt.test(s) || gt.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	for (let i = 0; i < xo; i++) {
		let a = bo[i];
		(t[a] || n[a]) && (e[a] = P(t[a] || 0, n[a] || 0, r));
	}
}
function wo(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var To = /*@__PURE__*/ Do(0, .5, Pe), Eo = /*@__PURE__*/ Do(.5, .95, A);
function Do(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ xe(e, t, r));
}
// node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function Oo(e, t) {
	e.min = t.min, e.max = t.max;
}
function ko(e, t) {
	Oo(e.x, t.x), Oo(e.y, t.y);
}
function Ao(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var jo = .9999, Mo = 1.0001, No = -.01, Po = .01;
function Fo(e) {
	return e.max - e.min;
}
function Io(e, t, n) {
	return Math.abs(e - t) <= n;
}
function Lo(e, t, n, r = .5) {
	e.origin = r, e.originPoint = P(t.min, t.max, e.origin), e.scale = Fo(n) / Fo(t), e.translate = P(n.min, n.max, e.origin) - e.originPoint, (e.scale >= jo && e.scale <= Mo || isNaN(e.scale)) && (e.scale = 1), (e.translate >= No && e.translate <= Po || isNaN(e.translate)) && (e.translate = 0);
}
function Ro(e, t, n, r) {
	Lo(e.x, t.x, n.x, r ? r.originX : void 0), Lo(e.y, t.y, n.y, r ? r.originY : void 0);
}
function zo(e, t, n, r = 0) {
	e.min = (r ? P(n.min, n.max, r) : n.min) + t.min, e.max = e.min + Fo(t);
}
function Bo(e, t, n, r) {
	zo(e.x, t.x, n.x, r?.x), zo(e.y, t.y, n.y, r?.y);
}
function Vo(e, t, n, r = 0) {
	let i = r ? P(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + Fo(t);
}
function Ho(e, t, n, r) {
	Vo(e.x, t.x, n.x, r?.x), Vo(e.y, t.y, n.y, r?.y);
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function Uo(e, t, n, r, i) {
	return e -= t, e = Xa(e, 1 / n, r), i !== void 0 && (e = Xa(e, 1 / i, r)), e;
}
function Wo(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (gt.test(t) && (t = parseFloat(t), t = P(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = P(a.min, a.max, r);
	e === a && (s -= t), e.min = Uo(e.min, t, n, s, i), e.max = Uo(e.max, t, n, s, i);
}
function z(e, t, [n, r, i], a, o) {
	Wo(e, t[n], t[r], t[i], t.scale, a, o);
}
var B = [
	"x",
	"scaleX",
	"originX"
], Go = [
	"y",
	"scaleY",
	"originY"
];
function Ko(e, t, n, r) {
	z(e.x, t, B, n ? n.x : void 0, r ? r.x : void 0), z(e.y, t, Go, n ? n.y : void 0, r ? r.y : void 0);
}
// node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var qo = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), Jo = () => ({
	x: qo(),
	y: qo()
}), Yo = () => ({
	min: 0,
	max: 0
}), Xo = () => ({
	x: Yo(),
	y: Yo()
});
// node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function Zo(e) {
	return e.translate === 0 && e.scale === 1;
}
function Qo(e) {
	return Zo(e.x) && Zo(e.y);
}
function $o(e, t) {
	return e.min === t.min && e.max === t.max;
}
function es(e, t) {
	return $o(e.x, t.x) && $o(e.y, t.y);
}
function ts(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function ns(e, t) {
	return ts(e.x, t.x) && ts(e.y, t.y);
}
function rs(e) {
	return Fo(e.x) / Fo(e.y);
}
function is(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
// node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var as = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		me(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			r && r.isConnected !== !1 || n.snapshot || (he(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (he(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
			let e = this.members[this.members.length - 1];
			e && this.promote(e);
		}
	}
	relegate(e) {
		for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
			let e = this.members[t];
			if (e.isPresent !== !1 && e.instance?.isConnected !== !1) return this.promote(e), !0;
		}
		return !1;
	}
	promote(e, t) {
		let n = this.lead;
		if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
			n.updateSnapshot(), e.scheduleRender();
			let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
			(r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = !0), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && n.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((e) => {
			e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((e) => e.instance && e.scheduleRender(!1));
	}
	removeLeadSnapshot() {
		this.lead?.snapshot && (this.lead.snapshot = void 0);
	}
};
// node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function os(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var ss = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (N.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${os(e, t.target.x)}% ${os(e, t.target.y)}%`;
} }, cs = {
	borderRadius: /* @__PURE__ */ Object.assign({}, ss, { applyTo: /* @__PURE__ */ Oa.slice() }),
	borderTopLeftRadius: ss,
	borderTopRightRadius: ss,
	borderBottomLeftRadius: ss,
	borderBottomRightRadius: ss,
	boxShadow: { correct: (e, { treeScale: t, projectionDelta: n }) => {
		let r = e, i = Bt.parse(e);
		if (i.length > 5) return r;
		let a = Bt.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
		i[0 + o] /= s, i[1 + o] /= c;
		let l = P(s, c, .5);
		return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
	} }
};
// node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function ls(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, rotateZ: s, skewX: c, skewY: l } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `rotateZ(${s}deg) `), c && (r += `skewX(${c}deg) `), l && (r += `skewY(${l}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
// node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function us(e) {
	return [e("x"), e("y")];
}
// node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var ds = (e, t) => e.depth - t.depth, fs = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		me(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		he(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort(ds), this.isDirty = !1, this.children.forEach(e);
	}
}, ps = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, ms = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, hs = [
	"",
	"X",
	"Y",
	"Z"
], gs = 1e3, _s = 0;
function vs(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
var ys = ({ instance: e }) => e && xi.get(e)?.demote();
function bs(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = ma(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", I, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && bs(r);
}
function xs({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return Object.assign(po, {
		...cs,
		...po
	}), class {
		constructor(e = {}, n = t?.()) {
			this.id = _s++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, mo.value && (ms.nodes = ms.calculatedTargetDeltas = ms.calculatedProjections = 0), this.nodes.forEach(ws), this.nodes.forEach(Fs), this.nodes.forEach(Is), this.nodes.forEach(Ts), mo.addProjectionMetrics && mo.addProjectionMetrics(ms);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new fs());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new Se()), this.eventHandlers.get(e).add(t);
		}
		notifyListeners(e, ...t) {
			let n = this.eventHandlers.get(e);
			n && n.notify(...t);
		}
		hasListeners(e) {
			return this.eventHandlers.has(e);
		}
		mount(t) {
			if (this.instance) return;
			this.isSVG = Aa(t) && !go(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				I.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = ho(i, 250), ps.hasAnimatedSinceResize && (ps.hasAnimatedSinceResize = !1, this.nodes.forEach(Ps)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.addLayoutListener();
		}
		addLayoutListener() {
			let { layoutId: e, layout: t, visualElement: n, animate: r } = this.options;
			this.instance && !this.hasLayoutListener && r !== !1 && n && (e || t) && (this.hasLayoutListener = !0, this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: r, layout: i }) => {
				if (this.isAnimationBlocked) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || n.getDefaultTransition() || Hs, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = n.getProps(), c = !this.targetLayout || !ns(this.targetLayout, i), l = !t && r;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...Gi(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(n.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || Ps(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = i;
			}));
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, un(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Ls), this.animationId++);
		}
		getTransformTemplate() {
			let { visualElement: e } = this.options;
			return e && e.getProps().transformTemplate;
		}
		willUpdate(e = !0) {
			if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && bs(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			ys(this), this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, ys(t), (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1), t.isAnimationBlocked && (t.dragSnapshot ||= t.measure(), this.dragAncestor = t);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(Os), this.nodes.forEach(Ds);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(ks);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(js), this.nodes.forEach(Ms), this.nodes.forEach(Ns), this.nodes.forEach(Ss), this.nodes.forEach(Cs)) : this.nodes.forEach(ks), this.clearAllSnapshots();
			let e = qe.now();
			We.delta = k(0, 1e3 / 60, e - We.timestamp), We.timestamp = e, We.isProcessing = !0, dn.update.process(We), dn.preRender.process(We), dn.render.process(We), We.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, lo.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(Es), this.sharedNodes.forEach((e, t) => e.members.length ? e.removeLeadSnapshot() : this.sharedNodes.delete(t));
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, I.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			I.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !Fo(this.snapshot.measuredBox.x) && !Fo(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= Xo(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
			let { visualElement: t } = this.options;
			t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0);
		}
		updateScroll(e = "measure") {
			let t = !!(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1), t && this.instance) {
				let t = r(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase: e,
					isRoot: t,
					offset: n(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : t
				};
			}
		}
		resetTransform() {
			if (!i) return;
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
			e && ys(this);
			let t = this.projectionDelta && !Qo(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || qa(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), Ks(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return Xo();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(Js))) {
				let { scroll: e } = this.root;
				e && (ro(t.x, e.offset.x), ro(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = Xo();
			if (ko(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && ko(t, e), ro(t.x, i.offset.x), ro(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n, r) {
			let i = n || Xo();
			ko(i, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (ro(i.x, -n.scroll.offset.x), ro(i.y, -n.scroll.offset.y)), qa(n.latestValues) && oo(i, n.latestValues, n.layout?.layoutBox);
			}
			return !r && qa(this.latestValues) && oo(i, this.latestValues, this.layout?.layoutBox), i;
		}
		removeTransform(e) {
			let t = Xo();
			ko(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!qa(n.latestValues)) continue;
				let r;
				n.instance && (Ka(n.latestValues) && n.updateSnapshot(), r = Xo(), ko(r, n.measurePageBox())), Ko(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return qa(this.latestValues) && Ko(t, this.latestValues), t;
		}
		setTargetDelta(e) {
			this.targetDelta = e, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
		}
		setOptions(e) {
			this.options = {
				...this.options,
				...e,
				crossfade: e.crossfade === void 0 || e.crossfade
			}, this.addLayoutListener();
		}
		clearMeasurements() {
			this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== We.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = We.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = Xo(), this.targetWithTransforms = Xo()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Bo(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : ko(this.target, this.layout.layoutBox), $a(this.target, this.targetDelta)) : ko(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), mo.value && ms.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || Ka(this.parent.latestValues) || Ja(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Xo(), this.relativeTargetOrigin = Xo(), Ho(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), ko(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === We.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			ko(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			no(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = Xo());
			let { target: s } = e;
			s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ao(this.prevProjectionDelta.x, this.projectionDelta.x), Ao(this.prevProjectionDelta.y, this.projectionDelta.y)), Ro(this.projectionDelta, this.layoutCorrected, s, this.latestValues), this.treeScale.x === a && this.treeScale.y === o && is(this.projectionDelta.x, this.prevProjectionDelta.x) && is(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), mo.value && ms.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
		}
		hide() {
			this.isVisible = !1;
		}
		show() {
			this.isVisible = !0;
		}
		scheduleRender(e = !0) {
			if (this.options.visualElement?.scheduleRender(), e) {
				let e = this.getStack();
				e && e.scheduleRender();
			}
			this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = Jo(), this.projectionDelta = Jo(), this.projectionDeltaWithTransform = Jo();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = Jo();
			this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = Xo(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(Vs));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = P(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = P(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (Rs(o.x, e.x, n), Rs(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ho(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), Bs(this.relativeTarget, this.relativeTargetOrigin, s, n), f && es(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= Xo(), ko(f, this.relativeTarget)), c && (this.animationValues = a, Co(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (un(this.pendingAnimation), void 0), this.pendingAnimation = I.update(() => {
				ps.hasAnimatedSinceResize = !0, this.motionValue ||= Ui(0), this.motionValue.jump(0, !1), this.currentAnimation = fo(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), Yn(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(gs), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && qs(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || Xo();
					let t = Fo(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = Fo(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				ko(t, i), oo(t, r), Ro(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new as()), this.sharedNodes.get(e).add(t);
			let n = t.options.initialPromotionConfig;
			t.promote({
				transition: n ? n.transition : void 0,
				preserveFollowOpacity: n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
			});
		}
		isLead() {
			let e = this.getStack();
			return !e || e.lead === this;
		}
		getLead() {
			let { layoutId: e } = this.options;
			return e && this.getStack()?.lead || this;
		}
		getPrevLead() {
			let { layoutId: e } = this.options;
			return e ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			let { layoutId: e } = this.options;
			if (e) return this.root.sharedNodes.get(e);
		}
		promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
			let r = this.getStack();
			r && r.promote(this, n), e && (this.projectionDelta = void 0, this.needsReset = !0), t && this.setOptions({ transition: t });
		}
		relegate() {
			let e = this.getStack();
			return e ? e.relegate(this) : !1;
		}
		resetSkewAndRotation() {
			let { visualElement: e } = this.options;
			if (!e) return;
			let t = !1, { latestValues: n } = e;
			if ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (t = !0), !t) return;
			let r = {};
			n.z && vs("z", e, r, this.animationValues);
			for (let t = 0; t < hs.length; t++) vs(`rotate${hs[t]}`, e, r, this.animationValues), vs(`skew${hs[t]}`, e, r, this.animationValues);
			e.render();
			for (let t in r) e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]);
			e.scheduleRender();
		}
		applyProjectionStyles(e, t) {
			if (!this.instance || this.isSVG) return;
			if (!this.isVisible) {
				e.visibility = "hidden";
				return;
			}
			let n = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = _o(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = _o(t?.pointerEvents) || ""), this.hasProjected && !qa(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = ls(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in po) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = po[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? _o(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(Ds), this.root.sharedNodes.clear();
		}
	};
}
function Ss(e) {
	e.updateLayout(), As(e);
}
function Cs(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") us((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = Fo(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			Oo(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else qs(i, t.layoutBox, n) && us((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = Fo(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = Jo();
		Ro(o, n, t.layoutBox);
		let s = Jo();
		a ? Ro(s, e.applyTransform(r, !0), t.measuredBox) : Ro(s, n, t.layoutBox);
		let c = !Qo(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = Xo();
					Ho(s, t.layoutBox, i.layoutBox, o);
					let c = Xo();
					Ho(c, n, a.layoutBox, o), ns(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
				}
			}
		}
		e.notifyListeners("didUpdate", {
			layout: n,
			snapshot: t,
			delta: s,
			layoutDelta: o,
			hasLayoutChanged: c,
			hasRelativeLayoutChanged: l
		});
	} else if (e.isLead()) {
		let { onExitComplete: t } = e.options;
		t && t();
	}
	e.options.transition = void 0;
}
function ws(e) {
	mo.value && ms.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Ts(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Es(e) {
	e.clearSnapshot();
}
function Ds(e) {
	e.clearMeasurements();
}
function Os(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function ks(e) {
	e.isLayoutDirty = !1;
}
function As(e) {
	let { snapshot: t, dragAncestor: n } = e, r = n?.isAnimationBlocked && n.layout;
	if (!t || !r || e.resumeFrom || e.isAnimationBlocked) return;
	let i = n.dragSnapshot;
	us((e) => ro(t.layoutBox[e], r.layoutBox[e].min - i.layoutBox[e].min));
}
function js(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.dragSnapshot || e.layout, e.isLayoutDirty = !0);
}
function Ms(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function Ns(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Ps(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function Fs(e) {
	e.resolveTargetDelta();
}
function Is(e) {
	e.calcProjection();
}
function Ls(e) {
	e.resetSkewAndRotation();
}
function Rs(e, t, n) {
	e.translate = P(t.translate, 0, n), e.scale = P(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function zs(e, t, n, r) {
	e.min = P(t.min, n.min, r), e.max = P(t.max, n.max, r);
}
function Bs(e, t, n, r) {
	zs(e.x, t.x, n.x, r), zs(e.y, t.y, n.y, r);
}
function Vs(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var Hs = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, Us = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Ws = Us("applewebkit/") && !Us("chrome/") ? Math.round : A;
function Gs(e) {
	e.min = Ws(e.min), e.max = Ws(e.max);
}
function Ks(e) {
	Gs(e.x), Gs(e.y);
}
function qs(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !Io(rs(t), rs(n), .2);
}
function Js(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
// node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function Ys(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
// node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var Xs = /* @__PURE__ */ xs({
	attachResizeListener: (e, t) => Ys(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), Zs = { current: void 0 }, Qs = /* @__PURE__ */ xs({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!Zs.current) {
			let e = new Xs({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), Zs.current = e;
		}
		return Zs.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), $s = /* @__PURE__ */ new WeakMap();
// node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function ec(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
// node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function tc(e) {
	return typeof e == "string" || Array.isArray(e);
}
// node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var nc = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], rc = /* @__PURE__ */ ["initial"].concat(nc);
// node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function ic(e) {
	if (ec(e.animate)) return !0;
	for (let t = 0; t < rc.length; t++) if (tc(e[rc[t]])) return !0;
	return !1;
}
function ac(e) {
	return !!(ic(e) || e.variants);
}
// node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function oc(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (ua(i)) e.addValue(r, i);
		else if (ua(a)) e.addValue(r, Ui(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, Ui(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
// node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var sc = { current: null }, cc = { current: !1 }, lc = typeof window < "u";
function uc() {
	if (cc.current = !0, lc) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => sc.current = e.matches;
			e.addEventListener("change", t), t();
		} else sc.current = !1;
	}
}
// node_modules/motion-dom/dist/es/render/VisualElement.mjs
var dc = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], fc = {};
function pc(e) {
	fc = e;
}
function mc() {
	return fc;
}
var hc = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Ur, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = qe.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, I.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = ic(t), this.isVariantNode = ac(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && ua(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, $s.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (cc.current || uc(), this.shouldReduceMotion = sc.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), un(this.notifyUpdate), un(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
		for (let e in this.events) this.events[e].clear();
		for (let e in this.features) {
			let t = this.features[e];
			t && (t.unmount(), t.isMounted = !1);
		}
		this.current = null;
	}
	addChild(e) {
		this.children.add(e), this.enteringChildren ??= /* @__PURE__ */ new Set(), this.enteringChildren.add(e);
	}
	removeChild(e) {
		this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
	}
	bindToMotionValue(e, t) {
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && di.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new ni({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ Ce(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = Tr.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && I.preRender(this.notifyUpdate), n && (this.projection && (this.projection.isTransformDirty = !0), xi.get(this.current)?.check()), this.scheduleRender();
		}), i;
		typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
			r(), i && i();
		});
	}
	sortNodePosition(e) {
		return !this.current || !e.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
	}
	updateFeatures() {
		let e = "animation";
		for (e in fc) {
			let t = fc[e];
			if (!t) continue;
			let { isEnabled: n, Feature: r } = t;
			if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
				let t = this.features[e];
				t.isMounted ? t.update() : (t.mount(), t.isMounted = !0);
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Xo();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		let { transformTemplate: n, onUpdate: r } = this.props;
		(e.transformTemplate || n) && this.scheduleRender(), (e.transformTemplate && !n || e.onUpdate && !r) && xi.get(this.current)?.demote(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < dc.length; t++) {
			let n = dc[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = oc(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
	}
	getProps() {
		return this.props;
	}
	getVariant(e) {
		return this.props.variants ? this.props.variants[e] : void 0;
	}
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	addValue(e, t) {
		let n = this.values.get(e);
		if (t !== n) {
			n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t);
			let r = t.get();
			r !== void 0 && (this.latestValues[e] = r);
		}
	}
	removeValue(e) {
		this.values.delete(e);
		let t = this.valueSubscriptions.get(e);
		t && (t(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
	}
	hasValue(e) {
		return this.values.has(e);
	}
	getValue(e, t) {
		if (this.props.values && this.props.values[e]) return this.props.values[e];
		let n = this.values.get(e);
		return n === void 0 && t !== void 0 && (n = Ui(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (_e(n) || ye(n)) ? n = parseFloat(n) : typeof n != "number" && !Bt.test(n) && Bt.test(t) && (n = ur(e, t)), this.setBaseTarget(e, ua(n) ? n.get() : n)), ua(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new Se()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		lo.render(this.render);
	}
}, gc = class extends hc {
	constructor() {
		super(...arguments), this.KeyframeResolver = Da;
	}
	sortInstanceNodePosition(e, t) {
		return e.compareDocumentPosition(t) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(e, t) {
		let n = e.style;
		return n ? n[t] : void 0;
	}
	removeValueFromRenderState(e, { vars: t, style: n }) {
		delete t[e], delete n[e];
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(), delete this.childSubscription);
		let { children: e } = this.props;
		ua(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
};
// node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function _c(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
// node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function vc(e, { layout: t, layoutId: n }) {
	return Tr.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!po[e] || e === "opacity");
}
// node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function yc(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (ua(r[t]) || i && ua(i[t]) || vc(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
// node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function bc(e) {
	return window.getComputedStyle(e);
}
var xc = class extends gc {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = _c;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (Tr.has(t)) return this.projection?.isProjecting ? br(t) : Sr(e, t);
		{
			let n = bc(e), r = (Xe(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return so(e, t);
	}
	build(e, t, n) {
		Ia(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return yc(e, t, n);
	}
}, Sc = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
// node_modules/motion-dom/dist/es/events/event-info.mjs
function Cc(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var wc = (e) => (t) => Sc(t) && e(t, Cc(t));
// node_modules/motion-dom/dist/es/events/add-pointer-event.mjs
function Tc(e, t, n, r) {
	return Ys(e, t, wc(n), r);
}
// node_modules/motion-dom/dist/es/resize/handle-element.mjs
var Ec = /* @__PURE__ */ new WeakMap(), Dc, Oc = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : Aa(r) && "getBBox" in r ? r.getBBox()[t] : r[n], kc = /*@__PURE__*/ Oc("inline", "width", "offsetWidth"), Ac = /*@__PURE__*/ Oc("block", "height", "offsetHeight");
function jc({ target: e, borderBoxSize: t }) {
	Ec.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return kc(e, t);
			},
			get height() {
				return Ac(e, t);
			}
		});
	});
}
function Mc(e) {
	e.forEach(jc);
}
function Nc() {
	typeof ResizeObserver < "u" && (Dc = new ResizeObserver(Mc));
}
function Pc(e, t) {
	Dc || Nc();
	let n = Pa(e);
	return n.forEach((e) => {
		let n = Ec.get(e);
		n || (n = /* @__PURE__ */ new Set(), Ec.set(e, n)), n.add(t), Dc?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = Ec.get(e);
			n?.delete(t), n?.size || Dc?.unobserve(e);
		});
	};
}
// node_modules/motion-dom/dist/es/resize/handle-window.mjs
var Fc = /* @__PURE__ */ new Set(), Ic;
function Lc() {
	Ic = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		Fc.forEach((t) => t(e));
	}, window.addEventListener("resize", Ic);
}
function Rc(e) {
	return Fc.add(e), Ic || Lc(), () => {
		Fc.delete(e), !Fc.size && typeof Ic == "function" && (window.removeEventListener("resize", Ic), Ic = void 0);
	};
}
// node_modules/motion-dom/dist/es/resize/index.mjs
function zc(e, t) {
	return Ma(typeof e == "function" ? Rc(e) : Pc(e, t));
}
// node_modules/motion-dom/dist/es/utils/distance.mjs
var Bc = (e, t) => Math.abs(e - t);
function Vc(e, t) {
	let n = Bc(e.x, t.x), r = Bc(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
// node_modules/motion-dom/dist/es/gestures/pan/PanSession.mjs
var Hc = /*#__PURE__*/ new Set(["auto", "scroll"]), Uc = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Wc(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = Kc(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = Vc(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: qe.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.handleScroll(window), this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = Wc(t, this.transformPagePoint), this.hasPendingMove = !0, I.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = Kc(e.type === "pointercancel" ? this.lastMoveEventInfo : Wc(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !Sc(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = Wc(Cc(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = We;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, Kc(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = j(Tc(this.contextWindow, "pointermove", this.handlePointerMove, d), Tc(this.contextWindow, "pointerup", this.handlePointerUp, d), Tc(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(Hc.has(e.overflowX) || Hc.has(e.overflowY)) && this.scrollPositions.set(t, {
				x: t.scrollLeft,
				y: t.scrollTop
			}), t = t.parentElement;
		}
		this.scrollPositions.set(window, {
			x: window.scrollX,
			y: window.scrollY
		}), window.addEventListener("scroll", this.onElementScroll, { capture: !0 }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
			window.removeEventListener("scroll", this.onElementScroll, { capture: !0 }), window.removeEventListener("scroll", this.onWindowScroll);
		};
	}
	handleScroll(e) {
		let t = this.scrollPositions.get(e);
		if (!t) return;
		let n = e === window, r = n ? {
			x: window.scrollX,
			y: window.scrollY
		} : {
			x: e.scrollLeft,
			y: e.scrollTop
		}, i = {
			x: r.x - t.x,
			y: r.y - t.y
		};
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), I.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), un(this.updatePoint);
	}
};
function Wc(e, t) {
	return t ? { point: t(e.point) } : e;
}
function Gc(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function Kc({ point: e }, t) {
	return {
		point: e,
		delta: Gc(e, Jc(t)),
		offset: Gc(e, qc(t)),
		velocity: Yc(t, .1)
	};
}
function qc(e) {
	return e[0];
}
function Jc(e) {
	return e[e.length - 1];
}
function Yc(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = Jc(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ Ce(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ Ce(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ we(i.timestamp - r.timestamp);
	if (a === 0) return {
		x: 0,
		y: 0
	};
	let o = {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a
	};
	return o.x === Infinity && (o.x = 0), o.y === Infinity && (o.y = 0), o;
}
// node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
var Xc = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Zc(e) {
	return Xc.has(e.tagName) || e.isContentEditable === !0;
}
var Qc = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function $c(e) {
	return Qc.has(e.tagName) || e.isContentEditable === !0;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var el = {
	x: !1,
	y: !1
};
function tl() {
	return el.x || el.y;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function nl(e) {
	return e === "x" || e === "y" ? el[e] ? null : (el[e] = !0, () => {
		el[e] = !1;
	}) : el.x || el.y ? null : (el.x = el.y = !0, () => {
		el.x = el.y = !1;
	});
}
// node_modules/motion-dom/dist/es/gestures/drag/utils/constraints.mjs
function rl(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? P(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? P(n, e, r.max) : Math.min(e, n)), e;
}
function il(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function al(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: il(e.x, n, i),
		y: il(e.y, t, r)
	};
}
function ol(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function sl(e, t) {
	return {
		x: ol(e.x, t.x),
		y: ol(e.y, t.y)
	};
}
function cl(e, t) {
	let n = .5, r = Fo(e), i = Fo(t);
	return i > r ? n = /* @__PURE__ */ xe(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ xe(e.min, e.max - i, t.min)), k(0, 1, n);
}
function ll(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var ul = .35;
function dl(e = ul) {
	return e === !1 ? e = 0 : e === !0 && (e = ul), {
		x: fl(e, "left", "right"),
		y: fl(e, "top", "bottom")
	};
}
function fl(e, t, n) {
	return {
		min: pl(e, t),
		max: pl(e, n)
	};
}
function pl(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
// node_modules/motion-dom/dist/es/gestures/drag/VisualElementDragControls.mjs
var ml = /* @__PURE__ */ new WeakMap(), hl = class {
	constructor(e, t = () => e.getProps()) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Xo(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e, this.readProps = t;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = nl(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), us((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (Qe(t) && (t = na(t, this.visualElement.current) || 0), N.test(t)) t = parseFloat(t);
				else if (gt.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = Fo(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && I.update(() => i(e, t), !1, !0), fa(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				if (this.currentDirection = xl(o), this.currentDirection === null) return;
				i && i(this.currentDirection);
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && I.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new Uc(e, {
			onSessionStart: i,
			onStart: a,
			onMove: o,
			onSessionEnd: s,
			resumeAnimation: c
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: l,
			distanceThreshold: n,
			contextWindow: this.visualElement.current?.ownerDocument.defaultView,
			element: this.visualElement.current
		});
	}
	stop(e, t, n) {
		let r = e || this.latestPointerEvent, i = t || this.latestPanInfo, a = this.isDragging;
		if (this.cancel(), !a || !i || !r) return;
		let { velocity: o } = i;
		this.startAnimation(o, n);
		let { onDragEnd: s } = this.getProps();
		s && I.postRender(() => s(r, i));
	}
	cancel() {
		this.isDragging = !1;
		let { projection: e, animationState: t } = this.visualElement;
		e && (e.isAnimationBlocked = !1), this.endPanSession();
		let { dragPropagation: n } = this.getProps();
		!n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t && t.setActive("whileDrag", !1);
	}
	endPanSession() {
		this.panSession && this.panSession.end(), this.panSession = void 0;
	}
	updateAxis(e, t, n) {
		let { drag: r } = this.getProps();
		if (!n || !bl(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = rl(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		gl(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? al(n.layoutBox, e) : !1, this.elastic = dl(t), r !== this.constraints && !gl(e) && n && this.constraints && !this.hasMutatedConstraints && us((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = ll(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!gl(e)) return !1;
		let n = _l(e), { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = co(n, r.root, this.visualElement.getTransformPagePoint()), a = sl(r.layout.layoutBox, i);
		if (t) {
			let e = t(Ua(a));
			this.hasMutatedConstraints = !!e, e && (a = Ha(e));
		}
		return a;
	}
	startAnimation(e, t) {
		let { drag: n, dragMomentum: r, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: s } = this.getProps(), c = this.constraints || {}, l = us((s) => {
			if (!bl(s, t || n, this.currentDirection)) return;
			let l = c && c[s] || {};
			(o === !0 || o === s) && (l = {
				min: 0,
				max: 0
			});
			let u = i ? 200 : 1e6, d = i ? 40 : 1e7, f = {
				type: "inertia",
				velocity: r ? e[s] : 0,
				bounceStiffness: u,
				bounceDamping: d,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...a,
				...l
			};
			return this.startAxisValueAnimation(s, f);
		});
		return Promise.all(l).then(s);
	}
	startAxisValueAnimation(e, t) {
		let n = this.getAxisMotionValue(e);
		return fa(this.visualElement, e), n.start($i(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		us((e) => this.getAxisMotionValue(e).stop());
	}
	getAxisMotionValue(e) {
		let t = `_drag${e.toUpperCase()}`;
		return this.readProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
	}
	snapToCursor({ clientX: e, clientY: t }) {
		let { drag: n } = this.getProps(), r = {
			x: e,
			y: t
		}, i = this.visualElement.getTransformPagePoint()?.(r) || r, a = this.visualElement.measureViewportBox();
		us((e) => {
			if (!bl(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - P(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!gl(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		us((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = cl({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), us((t) => {
			let n = this.getAxisMotionValue(t);
			if (!bl(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(P(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		ml.set(this.visualElement, this);
		let e = this.visualElement.current, t = Tc(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && $c(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps(), r = gl(t) && _l(t);
			r && (this.constraints = this.resolveRefConstraints(), n ||= yl(e, r, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), I.read(r);
		let o = Ys(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (us((t) => {
				if (!bl(t, this.getProps().drag, this.currentDirection)) return;
				let n = this.getAxisMotionValue(t);
				this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate);
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.readProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = ul, dragMomentum: o = !0 } = e;
		return {
			...e,
			drag: t,
			dragDirectionLock: n,
			dragPropagation: r,
			dragConstraints: i,
			dragElastic: a,
			dragMomentum: o
		};
	}
};
function gl(e) {
	return !!e && typeof e == "object" && ("current" in e || "nodeType" in e);
}
var _l = (e) => "current" in e ? e.current : e;
function vl(e) {
	let t = !0;
	return () => {
		t ? t = !1 : e();
	};
}
function yl(e, t, n) {
	let r = zc(e, vl(n)), i = zc(t, vl(n));
	return () => {
		r(), i();
	};
}
function bl(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function xl(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function Sl(e, t) {
	let n = Pa(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		Ma(() => r.abort())
	];
}
// node_modules/motion-dom/dist/es/gestures/hover.mjs
function Cl(e) {
	return !(e.pointerType === "touch" || tl());
}
function wl(e, t, n = {}) {
	t = Na(t);
	let [r, i, a] = Sl(e, n);
	return r.forEach((e) => {
		let n = !1, r = !1, a, o = () => {
			e.removeEventListener("pointerleave", u);
		}, s = (e) => {
			a &&= (a(e), void 0), o();
		}, c = (e) => {
			n = !1, window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), r && (r = !1, s(e));
		}, l = () => {
			n = !0, window.addEventListener("pointerup", c, i), window.addEventListener("pointercancel", c, i);
		}, u = (e) => {
			e.pointerType !== "touch" && (n ? r = !0 : s(e));
		};
		e.addEventListener("pointerenter", (n) => {
			if (!Cl(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Tl = (e, t) => t ? e === t || Tl(e, t.parentElement) : !1, El = /* @__PURE__ */ new WeakSet();
// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function Dl(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function Ol(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var kl = (e, t) => {
	let n = !1, r = Dl(() => {
		El.has(e) || (n = !0, Ol(e, "down"));
	}), i = Dl(() => {
		n && (n = !1, Ol(e, "up"));
	});
	e.addEventListener("keydown", r, t), e.addEventListener("keyup", i, t), e.addEventListener("blur", () => {
		e.removeEventListener("keydown", r), e.removeEventListener("keyup", i), n && Ol(e, "cancel");
	}, {
		...t,
		once: !0
	});
};
// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function Al(e) {
	return Sc(e) && !tl();
}
var jl = /* @__PURE__ */ new WeakSet();
function Ml(e, t, n = {}) {
	t = Na(t);
	let [r, i, a] = Sl(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!Al(e) || jl.has(e)) return;
		El.add(r), n.stopPropagation && jl.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), El.has(r) && El.delete(r), Al(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Tl(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), ka(e) && (e.addEventListener("focus", () => kl(e, i), i), !Zc(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
// node_modules/motion-dom/dist/es/utils/transform.mjs
function Nl(...e) {
	let t = !Array.isArray(e[0]), n = t ? 0 : -1, r = e[0 + n], i = e[1 + n], a = e[2 + n], o = e[3 + n], s = Mn(i, a, o);
	return t ? s(r) : s;
}
// node_modules/motion-dom/dist/es/animation/FollowAnimation.mjs
var Pl = /* @__PURE__ */ new Set(), Fl = ({ timestamp: e }) => {
	Pl.forEach((t) => t.tick(e));
}, Il = class extends Xn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = 0, this.currentTime = 0, this.started = !1, this.hasNextTarget = !1, this.nextTarget = 0, this.stop = () => {
			this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.factory = e.type, this.generator = this.factory(e);
		let { driver: t } = e;
		t && (this.driver = t((e) => this.tick(e))), this.startTime = this.now(), this.state = "running", this.driver ? this.driver.start() : (Pl.size || I.update(Fl, !0), Pl.add(this));
	}
	setTarget(e, t) {
		this.nextTarget = e, this.nextVelocity = t, this.hasNextTarget = !0;
	}
	retarget(e, t) {
		let { options: n, generator: r } = this;
		n.keyframes = e, n.velocity = t, this.startTime = this.now(), this.currentTime = 0, r.retarget ? r.retarget(e, t) : this.generator = this.factory(n);
	}
	tick(e) {
		let { options: t, hasNextTarget: n } = this, { delay: r = 0, onUpdate: i, onPlay: a } = t;
		this.started || (this.startTime = Kn(this.startTime, e));
		let o = Math.round(e - this.startTime) - r, s = this.currentTime = Math.max(0, o), c = this.generator.next(s), l = o < 0 ? t.keyframes[0] : c.value;
		if (n) {
			this.hasNextTarget = !1;
			let { keyframes: e } = t;
			e[0] = l, e[1] = this.nextTarget, this.retarget(e, this.nextVelocity ?? this.getGeneratorVelocity());
		}
		(n || !this.started) && (this.started = !0, a?.()), this.state === "running" && (i?.(l), c.done && o >= 0 && !n && !this.hasNextTarget && this.state === "running" && (this.notifyFinished(), this.teardown(), this.state = "finished", t.onComplete?.()));
	}
	getGeneratorVelocity() {
		return Bn(this.generator, this.currentTime, this.options.velocity);
	}
	now() {
		return this.driver ? this.driver.now() : qe.now();
	}
	teardown() {
		this.state = "idle", this.driver ? this.driver.stop() : (Pl.delete(this), Pl.size || un(Fl));
	}
};
// node_modules/motion-dom/dist/es/value/utils/follow.mjs
function Ll(e, t, n) {
	let r = e.get(), i = null, a, o = typeof r == "string" ? r.replace(/[\d.-]/g, "") : void 0, s = (e) => a(o ? e + o : e), c = () => e.events.animationStart?.notify(), l = () => {
		i &&= (i.stop(), null), e.animation = void 0;
	};
	if (e.attach((t, r) => {
		a = r;
		let o = vo(t);
		if (i?.state === "running") {
			i.setTarget(o, n.velocity);
			return;
		}
		let u = vo(e.get()), d = i ? i.getGeneratorVelocity() : e.getVelocity();
		if (l(), u === o) return;
		let f = i = new Il({
			keyframes: [u, o],
			velocity: d,
			restDelta: .001,
			restSpeed: .01,
			...n,
			onUpdate: s,
			onPlay: c
		});
		e.animation = f, f.then(() => {
			i === f && (i = null, e.animation = void 0, e.events.animationComplete?.notify());
		});
	}, l), ua(t)) {
		let r = n.skipInitialAnimation === !0, i = (t) => {
			r ? (r = !1, e.jump(Rl(t, o), !1)) : e.set(Rl(t, o));
		}, a = t.on("change", i), s = t.get();
		vo(s) - vo(e.get()) && i(s);
		let c = e.on("destroy", a);
		return () => {
			a(), c(), l();
		};
	}
	return l;
}
function Rl(e, t) {
	return t ? e + t : e;
}
// node_modules/motion-dom/dist/es/value/spring-value.mjs
function zl(e, t, n) {
	return Ll(e, t, {
		...n,
		type: kn
	});
}
// node_modules/motion-dom/dist/es/render/Feature.mjs
var Bl = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
}, Vl = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]), Hl = (e) => typeof e == "string" && e.toLowerCase() === "svg";
// node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function Ul(e, t, n, r) {
	_c(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(Vl.has(n) ? n : Fa(n), t.attrs[n]);
}
// node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function Wl(e, t, n) {
	let r = yc(e, t, n);
	for (let n in e) if (n !== "children" && (ua(e[n]) || ua(t[n]))) {
		let t = wr.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
// node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var Gl = class extends gc {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Xo;
	}
	getBaseTargetFromProps(e, t) {
		return Tr.has(t) ? super.getBaseTargetFromProps(e, t) ?? br(t) : e[t];
	}
	getDefaultValue(e) {
		return Tr.has(e) ? this.latestValues[e] ?? br(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (Tr.has(t)) {
			let e = cr(t);
			return e && e.default || 0;
		}
		if (Ba.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = Vl.has(t) ? t : Fa(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Wl(e, t, n);
	}
	build(e, t, n) {
		Va(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		Ul(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = Hl(e.tagName), super.mount(e);
	}
};
// node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function Kl(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
// node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var ql = [...nc].reverse();
function Jl(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => ya(e, t, n))), n = Xl(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (ql.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? tc(g) || g === !1 ? g : void 0 : h, v = tc(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || ec(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let x = Yl(i.prevProp, _), S = x || v && (y && !b || r > p), C = !1, w = Array.isArray(_) ? _ : [_], T = {};
			if (y !== !1) for (let n of w) {
				let { transition: r, transitionEnd: i, ...a } = aa(e, n, oa(e, t)) || {};
				T = {
					...T,
					...a,
					...i
				};
			}
			let { prevResolvedValues: ee } = i;
			for (let t in {
				...ee,
				...T
			}) {
				if (t in f) continue;
				let n = T[t], r = ee[t], a = Array.isArray(n) && Array.isArray(r) ? !Kl(n, r) || x : n !== r;
				if (a && n == null) d.add(t);
				else if (a || n !== void 0 && d.has(t)) {
					S = !0, d.delete(t) && (C = !0), i.needsAnimating[t] = !0;
					let n = e.getValue(t);
					n && (n.liveStyle = !1);
				} else i.protectedKeys[t] = !0;
			}
			if (i.prevProp = _, i.prevResolvedValues = T, i.isActive && (f = {
				...f,
				...T
			}), S && (!(b && x) || C)) for (let n of w) {
				let r = { type: t };
				if (typeof n == "string" && l && c && s?.enteringChildren) {
					let t = aa(s, n)?.transition?.delayChildren;
					r.delay = Ri(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && aa(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !ua(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
			}), u.push({ animation: n });
		}
		let h = l && e.blockInitialAnimation || r && !c && (o.initial === !1 || o.initial === o.animate);
		return r = i = !1, !h && u.length ? t(u) : Promise.resolve();
	}
	function o(t, r) {
		if (n[t].isActive === r) return Promise.resolve();
		e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), n[t].isActive = r;
		let i = a(t);
		for (let e in n) n[e].protectedKeys = {};
		return i;
	}
	return {
		animateChanges: a,
		setActive: o,
		setAnimateFunction: (n) => {
			t = n(e);
		},
		getState: () => n,
		reset: () => {
			n = Xl(), i = !0;
		}
	};
}
function Yl(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !Kl(t, e) : !1;
}
function Xl() {
	let e = {};
	for (let t of nc) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var Zl = /* @__PURE__ */ (0, D.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function Ql(e = !0) {
	let t = (0, D.useContext)(pe);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, D.useId)();
	(0, D.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, D.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
// node_modules/framer-motion/dist/es/context/LazyContext.mjs
var $l = /* @__PURE__ */ (0, D.createContext)({ strict: !1 }), eu = {
	animation: [
		"animate",
		"variants",
		"whileHover",
		"whileTap",
		"exit",
		"whileInView",
		"whileFocus",
		"whileDrag"
	],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
}, tu = !1;
function nu() {
	if (tu) return;
	let e = {};
	for (let t in eu) e[t] = { isEnabled: (e) => eu[t].some((t) => !!e[t]) };
	pc(e), tu = !0;
}
function ru() {
	return nu(), mc();
}
// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function iu(e) {
	let t = ru();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	pc(t);
}
// node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs
var V = le();
function au({ children: e, ...t }) {
	let n = (0, D.useContext)(Zl);
	t = {
		...n,
		...t
	}, t.transition = Wi(t.transition, n.transition), t.isStatic = de(() => t.isStatic);
	let r = (0, D.useMemo)(() => t, [
		JSON.stringify(t.transition),
		t.transformPagePoint,
		t.reducedMotion,
		t.skipAnimations,
		t.isValidProp
	]);
	return (0, V.jsx)(Zl.Provider, {
		value: r,
		children: e
	});
}
// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var ou = /* @__PURE__ */ (0, D.createContext)({});
// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function su(e, t) {
	if (ic(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || tc(t) ? t : void 0,
			animate: tc(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function H(e) {
	let { initial: t, animate: n } = su(e, (0, D.useContext)(ou));
	return (0, D.useMemo)(() => ({
		initial: t,
		animate: n
	}), [cu(t), cu(n)]);
}
function cu(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var lu = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
// node_modules/framer-motion/dist/es/render/html/use-props.mjs
function uu(e, t, n) {
	for (let r in t) !ua(t[r]) && !vc(r, n) && (e[r] = t[r]);
}
function du({ transformTemplate: e }, t) {
	return (0, D.useMemo)(() => {
		let n = lu();
		return Ia(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function fu(e, t) {
	let n = e.style || {}, r = {};
	return uu(r, n, e), Object.assign(r, du(e, t)), r;
}
function pu(e, t) {
	let n = {}, r = fu(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var mu = () => ({
	...lu(),
	attrs: {}
});
// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function hu(e, t, n, r) {
	let i = (0, D.useMemo)(() => {
		let n = mu();
		return Va(n, t, Hl(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		return uu(t, e.style, e), {
			...i,
			style: {
				...t,
				...i.style
			}
		};
	}
	return i;
}
// node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var gu = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function _u(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || gu.has(e);
}
// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function vu(e, t) {
	return e.startsWith("on") ? !_u(e) : t?.(e) ?? !_u(e);
}
function yu(e, t, n, r) {
	let i = {};
	for (let a in e) a === "values" && typeof e.values == "object" || ua(e[a]) || (vu(a, r) || n === !0 && _u(a) || !t && !_u(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]);
	return i;
}
// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var bu = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
// node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function xu(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(bu.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Su(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? xu(e) ? hu : pu)(t, r, i, e), l = yu(t, typeof e == "string", a, s), u = e === D.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, D.useMemo)(() => ua(d) ? d.get() : d, [d]);
	return (0, D.createElement)(e, {
		...u,
		children: f
	});
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Cu({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: wu(n, r, i, e),
		renderState: t()
	};
}
function wu(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = _o(a[e]);
	let { initial: o, animate: s } = e, c = ic(e), l = ac(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !ec(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = ia(e, t[n]);
			if (r) {
				let { transitionEnd: e, transition: t, ...n } = r;
				for (let e in n) {
					let t = n[e];
					if (Array.isArray(t)) {
						let e = u ? t.length - 1 : 0;
						t = t[e];
					}
					t !== null && (i[e] = t);
				}
				for (let t in e) i[t] = e[t];
			}
		}
	}
	return i;
}
var Tu = (e) => (t, n) => {
	let r = (0, D.useContext)(ou), i = (0, D.useContext)(pe), a = () => Cu(e, t, r, i);
	return n ? a() : de(a);
}, Eu = /*@__PURE__*/ Tu({
	scrapeMotionValuesFromProps: yc,
	createRenderState: lu
}), Du = /*@__PURE__*/ Tu({
	scrapeMotionValuesFromProps: Wl,
	createRenderState: mu
}), Ou = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function ku(e, t, n) {
	let r = (0, D.useRef)(n);
	(0, D.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, D.useRef)(null);
	return (0, D.useCallback)((n) => {
		n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount());
		let a = r.current;
		if (typeof a == "function") {
			if (n) {
				let e = a(n);
				typeof e == "function" && (i.current = e);
			} else i.current ? (i.current(), i.current = null) : a(n);
		} else a && (a.current = n);
	}, [t]);
}
// node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var Au = /* @__PURE__ */ (0, D.createContext)({});
// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function ju(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Mu(e, t, n, r, i, a) {
	let { visualElement: o } = (0, D.useContext)(ou), s = (0, D.useContext)($l), c = (0, D.useContext)(pe), l = (0, D.useContext)(Zl), u = l.reducedMotion, d = l.skipAnimations, f = (0, D.useRef)(null), p = (0, D.useRef)(!1);
	r ||= s.renderer, !f.current && r && (f.current = r(e, {
		visualState: t,
		parent: o,
		props: n,
		presenceContext: c,
		blockInitialAnimation: c ? c.initial === !1 : !1,
		reducedMotionConfig: u,
		skipAnimations: d,
		isSVG: a
	}), p.current && f.current && (f.current.manuallyAnimateOnMount = !0));
	let m = f.current, h = (0, D.useContext)(Au);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && Nu(f.current, n, i, h), (0, D.useInsertionEffect)(() => {
		m && m.props !== n && m.update(n, c);
	});
	let g = n[pa], _ = (0, D.useRef)(!!g && typeof window < "u" && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g));
	return fe(() => {
		p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0);
	}, []), fe(() => {
		p.current = !0, m && (window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), _.current && m.animationState && m.animationState.animateChanges());
	}), (0, D.useEffect)(() => {
		m && (!_.current && m.animationState && m.animationState.animateChanges(), _.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(g);
		}), !1), m.enteringChildren = void 0);
	}), m;
}
function Nu(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t, f = e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : Pu(e.parent));
	f.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && ju(s),
		visualElement: e,
		animationType: typeof a == "string" ? a : "both",
		initialPromotionConfig: r,
		crossfade: d,
		layoutScroll: c,
		layoutRoot: l,
		layoutAnchor: u
	});
	let p = f.getStack()?.lead;
	p && !f.root.isUpdateBlocked() && (p.willUpdate(), p.scheduleCheckAfterUnmount());
}
function Pu(e) {
	if (e) return e.options.allowProjection === !1 ? Pu(e.parent) : e.projection;
}
// node_modules/framer-motion/dist/es/motion/index.mjs
function Fu(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && iu(r);
	let a = n ? n === "svg" : xu(e), o = a ? Du : Eu;
	function s(n, s) {
		let c, l = Iu(n);
		de(() => !!Zs.current?.sharedNodes.get(l)?.lead && n.initial) && (n = {
			...n,
			initial: !1
		});
		let u = {
			...(0, D.useContext)(Zl),
			...n,
			layoutId: l
		}, { isStatic: d, isValidProp: f } = u, p = H(n), m = o(n, d);
		if (!d && typeof window < "u") {
			Lu(u, r);
			let t = Ru(u);
			c = t.MeasureLayout, p.visualElement = Mu(e, m, u, i, t.ProjectionNode, a);
		}
		return (0, V.jsxs)(ou.Provider, {
			value: p,
			children: [c && p.visualElement ? (0, V.jsx)(c, {
				visualElement: p.visualElement,
				...u
			}) : null, Su(e, n, ku(m, p.visualElement, s), m, d, t, a, f)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, D.forwardRef)(s);
	return c[Ou] = e, c;
}
function Iu({ layoutId: e }) {
	let t = (0, D.useContext)(ue).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function Lu(e, t) {
	(0, D.useContext)($l).strict;
}
function Ru(e) {
	let { drag: t, layout: n } = ru();
	if (!t && !n) return {};
	let r = {
		...t,
		...n
	};
	return {
		MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
		ProjectionNode: r.ProjectionNode
	};
}
// node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function zu(e, t) {
	if (typeof Proxy > "u") return Fu;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => Fu(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, Fu(a, void 0, e, t)), n.get(a)) });
}
// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var Bu = (e, t) => t.isSVG ?? xu(e) ? new Gl(t) : new xc(t, { allowProjection: e !== D.Fragment }), Vu = class extends Bl {
	constructor(e) {
		super(e), e.animationState ||= Jl(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		ec(e) && (this.unmountControls = e.subscribe(this.node));
	}
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		let { animate: e } = this.node.getProps(), { animate: t } = this.node.prevProps || {};
		e !== t && this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.node.animationState.reset(), this.unmountControls?.();
	}
}, Hu = 0, Uu = {
	animation: { Feature: Vu },
	exit: { Feature: class extends Bl {
		constructor() {
			super(...arguments), this.id = Hu++;
		}
		update() {
			let { presenceContext: e, prevPresenceContext: t, animationState: n } = this.node;
			if (!e || !n) return;
			let { isPresent: r, onExitComplete: i } = e, a = t?.isPresent;
			if (r === a) return;
			if (r && a === !1) {
				if (this.exit === !0) {
					let { initial: e } = this.node.getProps();
					if (e && !Array.isArray(e)) {
						let { transition: t, transitionEnd: n, ...r } = aa(this.node, e) || {};
						for (let e in r) this.node.getValue(e)?.jump(r[e]);
					}
					this.node.blockInitialAnimation = !1, n.reset(), n.animateChanges();
				} else n.setActive("exit", !1);
				this.exit = void 0;
				return;
			}
			let o = this.exit = n.setActive("exit", !r);
			i && !r && o.then(() => {
				this.exit === o && (this.exit = !0, i(this.id));
			});
		}
		mount() {
			let { register: e, onExitComplete: t } = this.node.presenceContext || {};
			t && t(this.id), e && (this.unmount = e(this.id, this.node));
		}
		unmount() {}
	} }
}, Wu = class extends Bl {
	constructor(e) {
		super(e), this.removeGroupControls = A, this.removeListeners = A, this.controls = new hl(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || A;
	}
	update() {
		let { dragControls: e, drag: t } = this.node.getProps(), { dragControls: n, drag: r } = this.node.prevProps || {};
		e !== n && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls))), r && !t && this.controls.stop(void 0, void 0, r);
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, Gu = ({ current: e }) => e ? e.ownerDocument.defaultView : null, Ku = (e) => (t, n) => {
	e && I.update(() => e(t, n), !1, !0);
}, qu = class extends Bl {
	constructor() {
		super(...arguments), this.removePointerDownListener = A;
	}
	onPointerDown(e) {
		this.session = new Uc(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: Gu(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: Ku(e),
			onStart: Ku(t),
			onMove: Ku(n),
			onEnd: (e, t) => {
				delete this.session, r && I.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Tc(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, Ju = !1, Yu = ({ layout: e, layoutDependency: t }) => ({
	layout: e,
	layoutDependency: t,
	animationType: typeof e == "string" ? e : "both"
}), Xu = class extends D.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), Ju && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			...Yu(this.props),
			onExitComplete: () => this.safeToRemove()
		})), ps.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layout: t, layoutDependency: n, visualElement: r, drag: i, isPresent: a } = this.props, { projection: o } = r;
		return o && (o.isPresent = a, (e.layoutDependency !== n || e.layout !== t) && o.setOptions({
			...o.options,
			...Yu(this.props)
		}), Ju = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== a ? o.willUpdate() : this.safeToRemove(), e.isPresent !== a && (a ? o.promote() : o.relegate() || I.postRender(() => {
			let e = o.getStack();
			e && e.members.length || this.safeToRemove();
		}))), null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), lo.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		Ju = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function Zu(e) {
	let [t, n] = Ql(), r = (0, D.useContext)(ue);
	return (0, V.jsx)(Xu, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, D.useContext)(Au),
		isPresent: t,
		safeToRemove: n
	});
}
// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var Qu = {
	pan: { Feature: qu },
	drag: {
		Feature: Wu,
		ProjectionNode: Qs,
		MeasureLayout: Zu
	}
};
// node_modules/framer-motion/dist/es/gestures/hover.mjs
function $u(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && I.postRender(() => i(t, Cc(t)));
}
var ed = class extends Bl {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = wl(e, (e, t) => ($u(this.node, t, "Start"), (e) => $u(this.node, e, "End"))));
	}
	unmount() {}
}, td = class extends Bl {
	constructor() {
		super(...arguments), this.isActive = !1;
	}
	onFocus() {
		let e = !1;
		try {
			e = this.node.current.matches(":focus-visible");
		} catch {
			e = !0;
		}
		e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
	}
	onBlur() {
		this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
	}
	mount() {
		this.unmount = j(Ys(this.node.current, "focus", () => this.onFocus()), Ys(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
// node_modules/framer-motion/dist/es/gestures/press.mjs
function nd(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && I.postRender(() => i(t, Cc(t)));
}
var U = class extends Bl {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = Ml(e, (e, t) => (nd(this.node, t, "Start"), (e, { success: t }) => nd(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, W = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), K = (e) => {
	let t = W.get(e.target);
	t && t(e);
}, q = (e) => {
	e.forEach(K);
};
function rd({ root: e, ...t }) {
	let n = e || document;
	G.has(n) || G.set(n, {});
	let r = G.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(q, {
		root: e,
		...t
	})), r[i];
}
function id(e, t, n) {
	let r = rd(t);
	return W.set(e, n), r.observe(e), () => {
		W.delete(e), r.unobserve(e);
	};
}
// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var ad = {
	some: 0,
	all: 1
}, od = class extends Bl {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : ad[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = id(this.node.current, a, o);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver > "u") return;
		let { props: e, prevProps: t } = this.node;
		[
			"amount",
			"margin",
			"root"
		].some(sd(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function sd({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var cd = /*@__PURE__*/ zu(/* @__PURE__ */ Object.assign({}, Uu, {
	inView: { Feature: od },
	tap: { Feature: U },
	focus: { Feature: td },
	hover: { Feature: ed }
}, Qu, { layout: {
	ProjectionNode: Qs,
	MeasureLayout: Zu
} }), Bu);
// node_modules/framer-motion/dist/es/value/use-motion-value.mjs
function ld(e) {
	let t = de(() => Ui(e)), { isStatic: n } = (0, D.useContext)(Zl);
	if (n) {
		let [, n] = (0, D.useState)(e);
		(0, D.useEffect)(() => t.on("change", n), []);
	}
	return t;
}
// node_modules/framer-motion/dist/es/value/use-combine-values.mjs
function ud(e, t) {
	let n = ld(t()), r = () => n.set(t());
	return r(), fe(() => {
		let t = () => I.preRender(r, !1, !0), n = e.map((e) => e.on("change", t));
		return r(), () => {
			n.forEach((e) => e()), un(r);
		};
	}), n;
}
// node_modules/framer-motion/dist/es/value/use-computed.mjs
function dd(e) {
	Vi.current = [], e();
	let t = ud(Vi.current, e);
	return Vi.current = void 0, t;
}
// node_modules/framer-motion/dist/es/value/use-transform.mjs
function fd(e, t, n, r) {
	if (typeof e == "function") return dd(e);
	if (n !== void 0 && !Array.isArray(n) && typeof t != "function") return md(e, t, n, r);
	let i = typeof t == "function" ? t : Nl(t, n, r), a = Array.isArray(e) ? pd(e, i) : pd([e], ([e]) => i(e)), o = Array.isArray(e) ? void 0 : e.accelerate;
	if (o && !o.isTransformed && typeof t != "function" && Array.isArray(n) && r?.clamp !== !1) {
		let e = r?.ease;
		a.accelerate = {
			...o,
			times: [
				0,
				...t,
				1
			],
			keyframes: [
				n[0],
				...n,
				n[n.length - 1]
			],
			isTransformed: !0,
			...e ? { ease: Array.isArray(e) ? [e[0], ...e] : e } : {}
		};
	}
	return a;
}
function pd(e, t) {
	let n = de(() => []);
	return ud(e, () => {
		n.length = 0;
		let r = e.length;
		for (let t = 0; t < r; t++) n[t] = e[t].get();
		return t(n);
	});
}
function md(e, t, n, r) {
	let i = de(() => Object.keys(n)), a = de(() => ({}));
	for (let o of i) a[o] = fd(e, t, n[o], r);
	return a;
}
// node_modules/framer-motion/dist/es/value/use-follow-value.mjs
function hd(e, t, n) {
	let { isStatic: r } = (0, D.useContext)(Zl), i = () => ua(e) ? e.get() : e;
	if (r) return fd(i);
	let a = ld(i());
	return (0, D.useInsertionEffect)(() => n(a, e, t), [a, JSON.stringify(t)]), a;
}
// node_modules/framer-motion/dist/es/value/use-spring.mjs
function gd(e, t = {}) {
	return hd(e, t, zl);
}
// node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs
function _d() {
	!cc.current && uc();
	let [e] = (0, D.useState)(sc.current);
	return e;
}
// node_modules/motion/dist/es/react.mjs
var vd = cd, yd = {
	type: "spring",
	stiffness: 460,
	damping: 30,
	mass: .55
};
// node_modules/clsx/dist/clsx.mjs
function bd(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = bd(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function xd() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = bd(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Sd = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Cd = (e, t) => ({
	classGroupId: e,
	validator: t
}), wd = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Td = "-", Ed = [], Dd = "arbitrary..", Od = (e) => {
	let t = jd(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return Ad(e);
			let n = e.split(Td);
			return kd(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Sd(i, t) : t : i || Ed;
			}
			return n[e] || Ed;
		}
	};
}, kd = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = kd(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Td) : e.slice(t).join(Td), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, Ad = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Dd + r : void 0;
})(), jd = (e) => {
	let { theme: t, classGroups: n } = e;
	return Md(n, t);
}, Md = (e, t) => {
	let n = wd();
	for (let r in e) {
		let i = e[r];
		Nd(i, n, r, t);
	}
	return n;
}, Nd = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		Pd(i, t, n, r);
	}
}, Pd = (e, t, n, r) => {
	typeof e == "string" ? Fd(e, t, n) : typeof e == "function" ? Id(e, t, n, r) : Ld(e, t, n, r);
}, Fd = (e, t, n) => {
	let r = e === "" ? t : Rd(t, e);
	r.classGroupId = n;
}, Id = (e, t, n, r) => {
	zd(e) ? Nd(e(r), t, n, r) : (t.validators === null && (t.validators = []), t.validators.push(Cd(n, e)));
}, Ld = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Nd(o, Rd(t, a), n, r);
	}
}, Rd = (e, t) => {
	let n = e, r = t.split(Td), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = wd(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, zd = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Bd = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, Vd = "!", Hd = ":", Ud = [], Wd = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), Gd = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === Hd) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(Vd) ? (c = s.slice(0, -1), l = !0) : s.startsWith(Vd) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return Wd(t, l, c, u);
	};
	if (t) {
		let e = t + Hd, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : Wd(Ud, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, Kd = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, qd = (e) => ({
	cache: Bd(e.cacheSize),
	parseClassName: Gd(e),
	sortModifiers: Kd(e),
	postfixLookupClassGroupIds: Jd(e),
	...Od(e)
}), Jd = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, Yd = /\s+/, Xd = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(Yd), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h || (g = r(p), !g)) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + Vd : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, Zd = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = Qd(n)) && (i && (i += " "), i += r);
	return i;
}, Qd = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = Qd(e[r])) && (n && (n += " "), n += t);
	return n;
}, $d = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = qd(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = Xd(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(Zd(...e));
}, ef = [], tf = (e) => {
	let t = (t) => t[e] || ef;
	return t.isThemeGetter = !0, t.themeKey = e, t;
}, nf = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, rf = /^\((?:(\w[\w-]*):)?(.+)\)$/i, af = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, of = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, sf = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, cf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, lf = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, uf = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, df = (e) => af.test(e), J = (e) => !!e && !Number.isNaN(Number(e)), ff = (e) => !!e && Number.isInteger(Number(e)), pf = (e) => e.endsWith("%") && J(e.slice(0, -1)), mf = (e) => of.test(e), hf = () => !0, Y = (e) => sf.test(e) && !cf.test(e), gf = () => !1, _f = (e) => lf.test(e), vf = (e) => uf.test(e), yf = (e) => !X(e) && !Z(e), bf = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), xf = (e) => If(e, Bf, gf), X = (e) => nf.test(e), Sf = (e) => If(e, Vf, Y), Cf = (e) => If(e, Q, J), wf = (e) => If(e, Uf, hf), Tf = (e) => If(e, Hf, gf), Ef = (e) => If(e, Rf, gf), Df = (e) => If(e, zf, vf), Of = (e) => If(e, Wf, _f), Z = (e) => rf.test(e), kf = (e) => Lf(e, Vf), Af = (e) => Lf(e, Hf), jf = (e) => Lf(e, Rf), Mf = (e) => Lf(e, Bf), Nf = (e) => Lf(e, zf), Pf = (e) => Lf(e, Wf, !0), Ff = (e) => Lf(e, Uf, !0), If = (e, t, n) => {
	let r = nf.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, Lf = (e, t, n = !1) => {
	let r = rf.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Rf = (e) => e === "position" || e === "percentage", zf = (e) => e === "image" || e === "url", Bf = (e) => e === "length" || e === "size" || e === "bg-size", Vf = (e) => e === "length", Q = (e) => e === "number", Hf = (e) => e === "family-name", Uf = (e) => e === "number" || e === "weight", Wf = (e) => e === "shadow", Gf = /*#__PURE__*/ $d(() => {
	let e = tf("color"), t = tf("font"), n = tf("text"), r = tf("font-weight"), i = tf("tracking"), a = tf("leading"), o = tf("breakpoint"), s = tf("container"), c = tf("spacing"), l = tf("radius"), u = tf("shadow"), d = tf("inset-shadow"), f = tf("text-shadow"), p = tf("drop-shadow"), m = tf("blur"), h = tf("perspective"), g = tf("aspect"), _ = tf("ease"), v = tf("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		Z,
		X
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		Z,
		X,
		c
	], T = () => [
		df,
		"full",
		"auto",
		...w()
	], ee = () => [
		ff,
		"none",
		"subgrid",
		Z,
		X
	], E = () => [
		"auto",
		{ span: [
			"full",
			ff,
			Z,
			X
		] },
		ff,
		Z,
		X
	], D = () => [
		ff,
		"auto",
		Z,
		X
	], te = () => [
		"auto",
		"min",
		"max",
		"fr",
		Z,
		X
	], ne = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], re = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], ie = () => ["auto", ...w()], ae = () => [
		df,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], oe = () => [
		s,
		df,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], se = () => [
		df,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], O = () => [
		e,
		Z,
		X
	], ce = () => [
		...b(),
		jf,
		Ef,
		{ position: [Z, X] }
	], le = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], ue = () => [
		"auto",
		"cover",
		"contain",
		Mf,
		xf,
		{ size: [Z, X] }
	], de = () => [
		pf,
		kf,
		Sf
	], fe = () => [
		"",
		"none",
		"full",
		l,
		Z,
		X
	], pe = () => [
		"",
		J,
		kf,
		Sf
	], me = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], he = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], k = () => [
		J,
		pf,
		jf,
		Ef
	], ge = () => [
		"",
		"none",
		m,
		Z,
		X
	], _e = () => [
		"none",
		J,
		Z,
		X
	], ve = () => [
		"none",
		J,
		Z,
		X
	], ye = () => [
		J,
		Z,
		X
	], be = () => [
		df,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [mf],
			breakpoint: [mf],
			color: [hf],
			container: [mf],
			"drop-shadow": [mf],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [yf],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [mf],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [mf],
			shadow: [mf],
			spacing: ["px", J],
			text: [mf],
			"text-shadow": [mf],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				df,
				X,
				Z,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				Z,
				X
			] }],
			"container-named": [bf],
			columns: [{ columns: [
				J,
				"auto",
				X,
				Z,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				ff,
				"auto",
				Z,
				X
			] }],
			basis: [{ basis: [
				df,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				J,
				df,
				"auto",
				"initial",
				"none",
				X
			] }],
			grow: [{ grow: [
				"",
				J,
				Z,
				X
			] }],
			shrink: [{ shrink: [
				"",
				J,
				Z,
				X
			] }],
			order: [{ order: [
				ff,
				"first",
				"last",
				"none",
				Z,
				X
			] }],
			"grid-cols": [{ "grid-cols": ee() }],
			"col-start-end": [{ col: E() }],
			"col-start": [{ "col-start": D() }],
			"col-end": [{ "col-end": D() }],
			"grid-rows": [{ "grid-rows": ee() }],
			"row-start-end": [{ row: E() }],
			"row-start": [{ "row-start": D() }],
			"row-end": [{ "row-end": D() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": te() }],
			"auto-rows": [{ "auto-rows": te() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...ne(), "normal"] }],
			"justify-items": [{ "justify-items": [...re(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...re()] }],
			"align-content": [{ content: ["normal", ...ne()] }],
			"align-items": [{ items: [...re(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...re(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": ne() }],
			"place-items": [{ "place-items": [...re(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...re()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: ie() }],
			mx: [{ mx: ie() }],
			my: [{ my: ie() }],
			ms: [{ ms: ie() }],
			me: [{ me: ie() }],
			mbs: [{ mbs: ie() }],
			mbe: [{ mbe: ie() }],
			mt: [{ mt: ie() }],
			mr: [{ mr: ie() }],
			mb: [{ mb: ie() }],
			ml: [{ ml: ie() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: ae() }],
			"inline-size": [{ inline: ["auto", ...oe()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...oe()] }],
			"max-inline-size": [{ "max-inline": ["none", ...oe()] }],
			"block-size": [{ block: ["auto", ...se()] }],
			"min-block-size": [{ "min-block": ["auto", ...se()] }],
			"max-block-size": [{ "max-block": ["none", ...se()] }],
			w: [{ w: [
				s,
				"screen",
				...ae()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...ae()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...ae()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...ae()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...ae()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				"none",
				...ae()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				kf,
				Sf
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Ff,
				wf
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				pf,
				X
			] }],
			"font-family": [{ font: [
				Af,
				Tf,
				t
			] }],
			"font-features": [{ "font-features": [X] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				Z,
				X
			] }],
			"line-clamp": [{ "line-clamp": [
				J,
				"none",
				Z,
				Cf
			] }],
			leading: [{ leading: [
				"none",
				a,
				...w()
			] }],
			"list-image": [{ "list-image": [
				"none",
				Z,
				X
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				Z,
				X
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: O() }],
			"text-color": [{ text: O() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...me(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				J,
				"from-font",
				"auto",
				Z,
				Sf
			] }],
			"text-decoration-color": [{ decoration: O() }],
			"underline-offset": [{ "underline-offset": [
				J,
				"auto",
				Z,
				X
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				ff,
				Z,
				X
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				Z,
				X
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				Z,
				X
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: ce() }],
			"bg-repeat": [{ bg: le() }],
			"bg-size": [{ bg: ue() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						ff,
						Z,
						X
					],
					radial: [
						"",
						Z,
						X
					],
					conic: [
						"",
						ff,
						Z,
						X
					]
				},
				Nf,
				Df
			] }],
			"bg-color": [{ bg: O() }],
			"gradient-from-pos": [{ from: de() }],
			"gradient-via-pos": [{ via: de() }],
			"gradient-to-pos": [{ to: de() }],
			"gradient-from": [{ from: O() }],
			"gradient-via": [{ via: O() }],
			"gradient-to": [{ to: O() }],
			rounded: [{ rounded: fe() }],
			"rounded-s": [{ "rounded-s": fe() }],
			"rounded-e": [{ "rounded-e": fe() }],
			"rounded-t": [{ "rounded-t": fe() }],
			"rounded-r": [{ "rounded-r": fe() }],
			"rounded-b": [{ "rounded-b": fe() }],
			"rounded-l": [{ "rounded-l": fe() }],
			"rounded-ss": [{ "rounded-ss": fe() }],
			"rounded-se": [{ "rounded-se": fe() }],
			"rounded-ee": [{ "rounded-ee": fe() }],
			"rounded-es": [{ "rounded-es": fe() }],
			"rounded-tl": [{ "rounded-tl": fe() }],
			"rounded-tr": [{ "rounded-tr": fe() }],
			"rounded-br": [{ "rounded-br": fe() }],
			"rounded-bl": [{ "rounded-bl": fe() }],
			"border-w": [{ border: pe() }],
			"border-w-x": [{ "border-x": pe() }],
			"border-w-y": [{ "border-y": pe() }],
			"border-w-s": [{ "border-s": pe() }],
			"border-w-e": [{ "border-e": pe() }],
			"border-w-bs": [{ "border-bs": pe() }],
			"border-w-be": [{ "border-be": pe() }],
			"border-w-t": [{ "border-t": pe() }],
			"border-w-r": [{ "border-r": pe() }],
			"border-w-b": [{ "border-b": pe() }],
			"border-w-l": [{ "border-l": pe() }],
			"divide-x": [{ "divide-x": pe() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": pe() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...me(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...me(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: O() }],
			"border-color-x": [{ "border-x": O() }],
			"border-color-y": [{ "border-y": O() }],
			"border-color-s": [{ "border-s": O() }],
			"border-color-e": [{ "border-e": O() }],
			"border-color-bs": [{ "border-bs": O() }],
			"border-color-be": [{ "border-be": O() }],
			"border-color-t": [{ "border-t": O() }],
			"border-color-r": [{ "border-r": O() }],
			"border-color-b": [{ "border-b": O() }],
			"border-color-l": [{ "border-l": O() }],
			"divide-color": [{ divide: O() }],
			"outline-style": [{ outline: [
				...me(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				J,
				Z,
				X
			] }],
			"outline-w": [{ outline: [
				"",
				J,
				kf,
				Sf
			] }],
			"outline-color": [{ outline: O() }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				u,
				Pf,
				Of
			] }],
			"shadow-color": [{ shadow: O() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Pf,
				Of
			] }],
			"inset-shadow-color": [{ "inset-shadow": O() }],
			"ring-w": [{ ring: pe() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: O() }],
			"ring-offset-w": [{ "ring-offset": [J, Sf] }],
			"ring-offset-color": [{ "ring-offset": O() }],
			"inset-ring-w": [{ "inset-ring": pe() }],
			"inset-ring-color": [{ "inset-ring": O() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Pf,
				Of
			] }],
			"text-shadow-color": [{ "text-shadow": O() }],
			opacity: [{ opacity: [
				J,
				Z,
				X
			] }],
			"mix-blend": [{ "mix-blend": [
				...he(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": he() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [J] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": k() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": k() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": O() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": O() }],
			"mask-image-t-from-pos": [{ "mask-t-from": k() }],
			"mask-image-t-to-pos": [{ "mask-t-to": k() }],
			"mask-image-t-from-color": [{ "mask-t-from": O() }],
			"mask-image-t-to-color": [{ "mask-t-to": O() }],
			"mask-image-r-from-pos": [{ "mask-r-from": k() }],
			"mask-image-r-to-pos": [{ "mask-r-to": k() }],
			"mask-image-r-from-color": [{ "mask-r-from": O() }],
			"mask-image-r-to-color": [{ "mask-r-to": O() }],
			"mask-image-b-from-pos": [{ "mask-b-from": k() }],
			"mask-image-b-to-pos": [{ "mask-b-to": k() }],
			"mask-image-b-from-color": [{ "mask-b-from": O() }],
			"mask-image-b-to-color": [{ "mask-b-to": O() }],
			"mask-image-l-from-pos": [{ "mask-l-from": k() }],
			"mask-image-l-to-pos": [{ "mask-l-to": k() }],
			"mask-image-l-from-color": [{ "mask-l-from": O() }],
			"mask-image-l-to-color": [{ "mask-l-to": O() }],
			"mask-image-x-from-pos": [{ "mask-x-from": k() }],
			"mask-image-x-to-pos": [{ "mask-x-to": k() }],
			"mask-image-x-from-color": [{ "mask-x-from": O() }],
			"mask-image-x-to-color": [{ "mask-x-to": O() }],
			"mask-image-y-from-pos": [{ "mask-y-from": k() }],
			"mask-image-y-to-pos": [{ "mask-y-to": k() }],
			"mask-image-y-from-color": [{ "mask-y-from": O() }],
			"mask-image-y-to-color": [{ "mask-y-to": O() }],
			"mask-image-radial": [{ "mask-radial": [Z, X] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": k() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": k() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": O() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": O() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [J] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": k() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": k() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": O() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": O() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: ce() }],
			"mask-repeat": [{ mask: le() }],
			"mask-size": [{ mask: ue() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				Z,
				X
			] }],
			filter: [{ filter: [
				"",
				"none",
				Z,
				X
			] }],
			blur: [{ blur: ge() }],
			brightness: [{ brightness: [
				J,
				Z,
				X
			] }],
			contrast: [{ contrast: [
				J,
				Z,
				X
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Pf,
				Of
			] }],
			"drop-shadow-color": [{ "drop-shadow": O() }],
			grayscale: [{ grayscale: [
				"",
				J,
				Z,
				X
			] }],
			"hue-rotate": [{ "hue-rotate": [
				J,
				Z,
				X
			] }],
			invert: [{ invert: [
				"",
				J,
				Z,
				X
			] }],
			saturate: [{ saturate: [
				J,
				Z,
				X
			] }],
			sepia: [{ sepia: [
				"",
				J,
				Z,
				X
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				Z,
				X
			] }],
			"backdrop-blur": [{ "backdrop-blur": ge() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				J,
				Z,
				X
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				J,
				Z,
				X
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				J,
				Z,
				X
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				J,
				Z,
				X
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				J,
				Z,
				X
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				J,
				Z,
				X
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				J,
				Z,
				X
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				J,
				Z,
				X
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				Z,
				X
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				J,
				"initial",
				Z,
				X
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				Z,
				X
			] }],
			delay: [{ delay: [
				J,
				Z,
				X
			] }],
			animate: [{ animate: [
				"none",
				v,
				Z,
				X
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				Z,
				X
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: _e() }],
			"rotate-x": [{ "rotate-x": _e() }],
			"rotate-y": [{ "rotate-y": _e() }],
			"rotate-z": [{ "rotate-z": _e() }],
			scale: [{ scale: ve() }],
			"scale-x": [{ "scale-x": ve() }],
			"scale-y": [{ "scale-y": ve() }],
			"scale-z": [{ "scale-z": ve() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ye() }],
			"skew-x": [{ "skew-x": ye() }],
			"skew-y": [{ "skew-y": ye() }],
			transform: [{ transform: [
				Z,
				X,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: be() }],
			"translate-x": [{ "translate-x": be() }],
			"translate-y": [{ "translate-y": be() }],
			"translate-z": [{ "translate-z": be() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				ff,
				Z,
				X
			] }],
			accent: [{ accent: O() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: O() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				Z,
				X
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": O() }],
			"scrollbar-track-color": [{ "scrollbar-track": O() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				Z,
				X
			] }],
			fill: [{ fill: ["none", ...O()] }],
			"stroke-w": [{ stroke: [
				J,
				kf,
				Sf,
				Cf
			] }],
			stroke: [{ stroke: ["none", ...O()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": [
				"start",
				"end",
				"right",
				"left"
			],
			"inset-y": [
				"inset-bs",
				"inset-be",
				"top",
				"bottom"
			],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: [
				"ps",
				"pe",
				"pr",
				"pl"
			],
			py: [
				"pbs",
				"pbe",
				"pt",
				"pb"
			],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: [
				"ms",
				"me",
				"mr",
				"ml"
			],
			my: [
				"mbs",
				"mbe",
				"mt",
				"mb"
			],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": [
				"border-w-s",
				"border-w-e",
				"border-w-r",
				"border-w-l"
			],
			"border-w-y": [
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-b"
			],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": [
				"border-color-s",
				"border-color-e",
				"border-color-r",
				"border-color-l"
			],
			"border-color-y": [
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-b"
			],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": [
				"scroll-ms",
				"scroll-me",
				"scroll-mr",
				"scroll-ml"
			],
			"scroll-my": [
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mb"
			],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": [
				"scroll-ps",
				"scroll-pe",
				"scroll-pr",
				"scroll-pl"
			],
			"scroll-py": [
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pb"
			],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
// src/lib/utils.ts
function Kf(...e) {
	return Gf(xd(e));
}
// src/components/motion/tabs.tsx
var qf = (0, D.createContext)(null);
function Jf() {
	let e = (0, D.useContext)(qf);
	if (!e) throw Error("Tabs.* must be used inside <Tabs>");
	return e;
}
var Yf = {
	type: "spring",
	stiffness: 245,
	damping: 36,
	mass: 1.2
};
function Xf({ defaultValue: e, value: t, onValueChange: n, variant: r = "pill", icons: i = "always", children: a, className: o }) {
	let [s, c] = (0, D.useState)(e ?? ""), l = (0, D.useId)(), u = _d(), d = t !== void 0, f = d ? t : s, p = (0, D.useCallback)((e) => {
		d || c(e), n?.(e);
	}, [d, n]), m = gd(0, Yf), h = gd(0, Yf), g = gd(0, Yf), _ = gd(0, Yf), v = (0, D.useMemo)(() => ({
		x: m,
		y: h,
		width: g,
		height: _
	}), [
		m,
		h,
		g,
		_
	]), [y, b] = (0, D.useState)(!1), [x, S] = (0, D.useState)(/* @__PURE__ */ new Map()), C = (0, D.useCallback)((e, t) => {
		S((n) => n.get(e) === t ? n : new Map(n).set(e, t));
	}, []), w = (0, D.useCallback)((e) => {
		S((t) => {
			if (!t.has(e)) return t;
			let n = new Map(t);
			return n.delete(e), n;
		});
	}, []), [T, ee] = (0, D.useState)(/* @__PURE__ */ new Set()), E = (0, D.useCallback)((e) => {
		ee((t) => t.has(e) ? t : new Set(t).add(e));
	}, []), te = (0, D.useCallback)((e) => {
		ee((t) => {
			if (!t.has(e)) return t;
			let n = new Set(t);
			return n.delete(e), n;
		});
	}, []), ne = null;
	if (x.size > 0) {
		let e = Array.from(x).filter(([, e]) => !e);
		ne = e.some(([e]) => e === f) ? f : e[0]?.[0] ?? "";
	}
	let re = (0, D.useId)(), ie = (0, D.useCallback)((e) => `${re}-tab-${e.replace(/[^\w-]/g, "_")}`, [re]), ae = (0, D.useCallback)((e) => `${re}-panel-${e.replace(/[^\w-]/g, "_")}`, [re]), oe = (0, D.useMemo)(() => ({
		value: f,
		setValue: p,
		layoutId: l,
		variant: r,
		icons: i,
		track: v,
		placed: y,
		setPlaced: b,
		tabStop: ne,
		registerTab: C,
		unregisterTab: w,
		panels: T,
		registerPanel: E,
		unregisterPanel: te,
		tabId: ie,
		panelId: ae
	}), [
		f,
		i,
		l,
		p,
		r,
		v,
		y,
		ne,
		C,
		w,
		T,
		E,
		te,
		ie,
		ae
	]);
	return /* @__PURE__ */ (0, V.jsx)(au, {
		transition: u ? { duration: 0 } : Yf,
		children: /* @__PURE__ */ (0, V.jsx)(qf.Provider, {
			value: oe,
			children: /* @__PURE__ */ (0, V.jsx)(vd.div, {
				layoutRoot: !0,
				className: o,
				children: a
			})
		})
	});
}
var Zf = {
	pill: "inline-flex items-center gap-1 rounded-full bg-card p-1",
	underline: "inline-flex items-center gap-1 border-b border-border",
	segment: "inline-flex items-center gap-0 rounded-lg bg-card p-0.5"
};
function Qf({ children: e, className: t, wrapperClassName: n, onKeyDown: r, ...i }) {
	let { variant: a, value: o, icons: s, track: c, placed: l, setPlaced: u } = Jf(), d = _d(), f = s === "selected" && a !== "underline", p = (0, D.useRef)(null), m = (0, D.useRef)(null), h = (0, D.useRef)(null), g = (0, D.useId)(), [_, v] = (0, D.useState)({
		overflow: !1,
		left: !1,
		right: !1
	}), y = (0, D.useCallback)(() => {
		let e = p.current, t = m.current;
		if (!e || !t) return;
		let n = t.scrollWidth > e.clientWidth + 1, r = Math.max(0, t.scrollWidth - t.clientWidth), i = getComputedStyle(t).direction === "rtl", a = Math.max(0, Math.min(r, i ? r + t.scrollLeft : t.scrollLeft)), o = {
			overflow: n,
			left: a > 1,
			right: a < r - 1
		};
		v((e) => e.overflow === o.overflow && e.left === o.left && e.right === o.right ? e : o);
	}, []), b = (0, D.useCallback)((e) => {
		let t = m.current;
		if (!t || !e) return;
		let n = t.getBoundingClientRect(), r = e.getBoundingClientRect(), i = Math.max(0, t.scrollWidth - t.clientWidth), a = getComputedStyle(t).direction === "rtl", o = Math.max(0, Math.min(i, a ? i + t.scrollLeft : t.scrollLeft)), s = n.left + (o > 1 ? 36 : 0), c = n.right - (o < i - 1 ? 36 : 0), l = r.left < s ? r.left - s : r.right > c ? r.right - c : 0;
		l && t.scrollBy({
			left: l,
			behavior: d ? "instant" : "smooth"
		});
	}, [d]);
	(0, D.useLayoutEffect)(() => {
		let e = p.current, t = m.current, n = h.current;
		if (!e || !t || !n) return;
		let r = () => {
			y(), b(n.querySelector("[role=\"tab\"][aria-selected=\"true\"]"));
		}, i = new ResizeObserver(r);
		return i.observe(e), i.observe(t), i.observe(n), t.addEventListener("scroll", y, { passive: !0 }), r(), () => {
			i.disconnect(), t.removeEventListener("scroll", y);
		};
	}, [y, b]), (0, D.useLayoutEffect)(() => {
		_.overflow, y(), b(h.current?.querySelector("[role=\"tab\"][aria-selected=\"true\"]") ?? null);
	}, [
		e,
		o,
		_.overflow,
		y,
		b
	]), (0, D.useLayoutEffect)(() => {
		if (!f) return;
		let e = h.current;
		if (!e) return;
		let t = () => {
			let t = Array.from(e.querySelectorAll("[role=\"tab\"]")).find((e) => e.dataset.tabsValue === o)?.parentElement;
			if (!t) return;
			let n = Array.from(e.querySelectorAll("[role=\"tab\"] > [data-tabs-icon]")), r = n.map((e) => [e.style.width, e.style.marginRight]);
			for (let e of n) {
				let n = e.parentElement?.parentElement === t;
				e.style.width = n ? "auto" : "0px", e.style.marginRight = n ? `${$f}px` : "0px";
			}
			let i = {
				x: t.offsetLeft,
				y: t.offsetTop,
				width: t.getBoundingClientRect().width,
				height: t.offsetHeight
			};
			n.forEach((e, t) => {
				[e.style.width, e.style.marginRight] = r[t];
			});
			let a = d || c.width.get() === 0;
			for (let e of [
				"x",
				"y",
				"width",
				"height"
			]) a ? c[e].jump(i[e]) : c[e].set(i[e]);
			i.width > 0 && u(!0);
		};
		t();
		let n = new ResizeObserver(t);
		for (let t of e.querySelectorAll("[role=\"tab\"]")) t.parentElement && n.observe(t.parentElement);
		return () => n.disconnect();
	}, [
		f,
		o,
		e,
		d,
		c,
		u
	]), (0, D.useLayoutEffect)(() => {
		if (a === "underline") return;
		let e = h.current;
		if (!e) return;
		let t = Array.from(e.querySelectorAll("[data-tabs-label]")), n = e.querySelector("[data-tabs-indicator]"), r = e.querySelector("[role=\"tab\"][aria-selected=\"true\"]");
		if (!n || !r || r.dataset.tabsValue !== o) {
			for (let e of t) e.style.clipPath = "inset(0 100% 0 0)";
			return;
		}
		let i = 0, s = 0, c, l = () => {
			let e = (d ? r : n).getBoundingClientRect(), a = t.map((t) => {
				let n = t.getBoundingClientRect(), r = Math.max(0, Math.min(n.width, e.left - n.left)), i = Math.max(0, Math.min(n.width, n.right - e.right));
				return r + i >= n.width ? "inset(0 100% 0 0)" : `inset(0 ${i}px 0 ${r}px)`;
			});
			t.forEach((e, t) => {
				e.style.clipPath !== a[t] && (e.style.clipPath = a[t]);
			}), i += 1, s = c && Math.abs(e.left - c.left) < .01 && Math.abs(e.right - c.right) < .01 ? s + 1 : 0, c = {
				left: e.left,
				right: e.right
			}, (d || i > 2 && s >= 2) && un(l);
		};
		I.postRender(l, !0);
		let u = new ResizeObserver(() => {
			i = 0, s = 0, c = void 0, un(l), I.postRender(l, !0);
		});
		return u.observe(e), () => {
			u.disconnect(), un(l);
		};
	}, [
		o,
		e,
		a,
		d,
		l
	]);
	let x = (e) => {
		if (r?.(e), e.defaultPrevented) return;
		let t = h.current;
		if (!t || !(e.target instanceof HTMLElement)) return;
		let n = Array.from(t.querySelectorAll("[role=\"tab\"]")).filter((e) => !e.disabled && e.closest("[role=\"tablist\"]") === t), i = n.indexOf(e.target);
		if (i < 0) return;
		let a = getComputedStyle(t).direction === "rtl", o = a ? "ArrowLeft" : "ArrowRight", s = a ? "ArrowRight" : "ArrowLeft", c = e.key === o ? n[(i + 1) % n.length] : e.key === s ? n[(i - 1 + n.length) % n.length] : e.key === "Home" ? n[0] : e.key === "End" ? n[n.length - 1] : null;
		c && (e.preventDefault(), c.focus(), c.click());
	}, S = (e) => {
		let t = m.current;
		t && t.scrollBy({
			left: e * t.clientWidth * .8,
			behavior: d ? "instant" : "smooth"
		});
	}, C = "absolute inset-y-0 z-20 inline-flex w-9 items-center justify-center text-foreground transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-0", w = a === "pill" ? "rounded-full bg-card" : a === "segment" ? "rounded-lg bg-card" : "";
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		ref: p,
		className: Kf("relative isolate flex w-full max-w-full min-w-0 items-center", _.overflow && w, n),
		children: [
			_.overflow && /* @__PURE__ */ (0, V.jsx)("button", {
				type: "button",
				"aria-label": "Scroll tabs left",
				"aria-controls": g,
				disabled: !_.left,
				onClick: () => S(-1),
				className: Kf(C, "left-0 rounded-l-full"),
				children: /* @__PURE__ */ (0, V.jsx)(oe, {
					size: 20,
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, V.jsx)(vd.div, {
				ref: m,
				id: g,
				layoutScroll: !0,
				className: Kf("w-full min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", _.overflow && "[border-radius:inherit]"),
				style: _.overflow ? { maskImage: `linear-gradient(to right, ${_.left ? "transparent, black 40px" : "black, black 0px"}, ${_.right ? "black calc(100% - 40px), transparent" : "black 100%"})` } : void 0,
				onFocusCapture: (e) => {
					e.target instanceof HTMLElement && e.target.getAttribute("role") === "tab" && b(e.target);
				},
				children: /* @__PURE__ */ (0, V.jsx)("div", {
					...i,
					ref: h,
					role: "tablist",
					onKeyDown: x,
					className: Kf(Zf[a], "w-max", f && "relative", t),
					children: e
				})
			}),
			_.overflow && _.left && /* @__PURE__ */ (0, V.jsx)("span", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 rounded-l-[inherit] backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)]"
			}),
			_.overflow && _.right && /* @__PURE__ */ (0, V.jsx)("span", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-[inherit] backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)]"
			}),
			_.overflow && /* @__PURE__ */ (0, V.jsx)("button", {
				type: "button",
				"aria-label": "Scroll tabs right",
				"aria-controls": g,
				disabled: !_.right,
				onClick: () => S(1),
				className: Kf(C, "right-0 rounded-r-full"),
				children: /* @__PURE__ */ (0, V.jsx)(O, {
					size: 20,
					"aria-hidden": "true"
				})
			})
		]
	});
}
var $f = 6;
function ep({ icon: e, active: t }) {
	let { icons: n } = Jf(), r = _d();
	return n === "always" ? /* @__PURE__ */ (0, V.jsx)("span", {
		"aria-hidden": "true",
		className: "mr-1.5 inline-flex shrink-0 items-center",
		children: e
	}) : /* @__PURE__ */ (0, V.jsx)(vd.span, {
		"aria-hidden": "true",
		"data-tabs-icon": "",
		initial: !1,
		animate: {
			width: t ? "auto" : 0,
			marginRight: t ? $f : 0,
			opacity: +!!t,
			scale: t ? 1 : .6
		},
		transition: r ? { duration: 0 } : yd,
		className: "inline-flex shrink-0 items-center justify-center overflow-hidden",
		children: e
	});
}
function $({ value: e, icon: t, children: n, className: r, indicatorClassName: i, onClick: a, ...o }) {
	let { value: s, setValue: c, layoutId: l, variant: u, icons: d, track: f, placed: p, tabStop: m, registerTab: h, unregisterTab: g, panels: _, tabId: v, panelId: y } = Jf(), b = s === e, x = !!o.disabled;
	(0, D.useLayoutEffect)(() => {
		h(e, x);
	}, [
		h,
		e,
		x
	]), (0, D.useLayoutEffect)(() => () => g(e), [g, e]);
	let S = {
		id: v(e),
		"aria-controls": _.has(e) ? y(e) : void 0,
		tabIndex: !x && (m === null || m === e) ? 0 : -1
	}, C = t ? /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)(ep, {
		icon: t,
		active: b
	}), n] }) : n, [w] = (0, D.useState)(() => b ? "inset(0)" : "inset(0 100% 0 0)");
	if (u === "underline") return /* @__PURE__ */ (0, V.jsxs)("button", {
		...S,
		...o,
		type: "button",
		role: "tab",
		"aria-selected": b,
		onClick: (t) => {
			a?.(t), t.defaultPrevented || c(e);
		},
		className: Kf("relative isolate px-3 pb-2.5 pt-1 -mb-px text-sm font-medium transition-colors min-h-[44px] inline-flex items-center whitespace-nowrap shrink-0", b ? "text-foreground" : "text-muted-foreground hover:text-foreground", r),
		children: [C, b ? /* @__PURE__ */ (0, V.jsx)(vd.span, {
			layoutId: l,
			layout: !0,
			className: Kf("absolute bottom-0 left-0 right-0 h-px bg-primary", i)
		}) : null]
	});
	let T = u === "pill" ? "rounded-full" : "rounded-md", ee = d === "selected" && p;
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: Kf("shrink-0", !ee && "relative"),
		children: [b && ee ? /* @__PURE__ */ (0, V.jsx)(vd.span, {
			"data-tabs-indicator": "",
			style: {
				...f,
				borderRadius: u === "pill" ? 9999 : 8
			},
			className: Kf("absolute top-0 left-0 bg-primary", T, i)
		}, "tracked") : b ? /* @__PURE__ */ (0, V.jsx)(vd.span, {
			"data-tabs-indicator": "",
			layoutId: l,
			layout: !0,
			style: { borderRadius: u === "pill" ? 9999 : 8 },
			className: Kf("absolute inset-0 bg-primary", T, i)
		}, "layout") : null, /* @__PURE__ */ (0, V.jsxs)("button", {
			...S,
			...o,
			type: "button",
			role: "tab",
			"aria-selected": b,
			"data-tabs-value": e,
			onClick: (t) => {
				a?.(t), t.defaultPrevented || c(e);
			},
			className: Kf("relative z-10 inline-flex items-center justify-center whitespace-nowrap bg-transparent px-3.5 py-1.5 text-sm font-medium outline-none", "text-muted-foreground hover:text-foreground", T, r),
			children: [C, /* @__PURE__ */ (0, V.jsx)("span", {
				"data-tabs-label": "",
				"aria-hidden": "true",
				inert: !0,
				className: "pointer-events-none absolute inset-0 inline-flex items-center justify-center text-primary-foreground [gap:inherit] [padding:inherit]",
				style: { clipPath: w },
				children: C
			})]
		})]
	});
}
// src/lc/nav.tsx
var tp = [
	{
		value: "index.html",
		label: "Home & Court"
	},
	{
		value: "challenge.html",
		label: "Challenge & OTA"
	},
	{
		value: "roadmap.html",
		label: "Roadmap"
	},
	{
		value: "screens.html",
		label: "Screens"
	},
	{
		value: "audit.html",
		label: "PR77 audit"
	},
	{
		value: "status.html",
		label: "Status & docs"
	}
];
function np({ current: e }) {
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: "flex w-full min-w-0 items-center justify-between gap-4 border-b bg-background/90 px-4 py-2 backdrop-blur",
		children: [/* @__PURE__ */ (0, V.jsx)("a", {
			href: "/command",
			className: "shrink-0 text-sm text-muted-foreground hover:text-foreground",
			children: "← JAW"
		}), /* @__PURE__ */ (0, V.jsx)(Xf, {
			variant: "underline",
			className: "min-w-0",
			value: e,
			onValueChange: (t) => {
				t !== e && (window.location.href = t);
			},
			children: /* @__PURE__ */ (0, V.jsx)(Qf, {
				"aria-label": "LocalCheck pages",
				wrapperClassName: "max-w-full",
				children: tp.map((e) => /* @__PURE__ */ (0, V.jsx)($, {
					value: e.value,
					children: e.label
				}, e.value))
			})
		})]
	});
}
// src/nav-entry.tsx
var rp = class extends HTMLElement {
	connectedCallback() {
		if (this.shadowRoot) return;
		let e = this.attachShadow({ mode: "open" }), t = document.createElement("style");
		t.textContent = `${_}\n:host{display:block;position:sticky;top:0;z-index:50}`;
		let n = document.createElement("div");
		e.append(t, n), (0, g.createRoot)(n).render(/* @__PURE__ */ (0, V.jsx)(np, { current: this.getAttribute("current") ?? "index.html" }));
	}
};
customElements.get("lc-nav") || customElements.define("lc-nav", rp);
