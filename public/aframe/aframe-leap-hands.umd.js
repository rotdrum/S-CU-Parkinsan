! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.aframeLeapHands = {}) }(this, function(t) {! function(t, e, n) {
        function i(n, o) { if (!e[n]) { if (!t[n]) { var s = "function" == typeof require && require; if (!o && s) return s(n, !0); if (r) return r(n, !0); throw new Error("Cannot find module '" + n + "'") } var a = e[n] = { exports: {} };
                t[n][0].call(a.exports, function(e) { var r = t[n][1][e]; return i(r || e) }, a, a.exports) } return e[n].exports } for (var r = "function" == typeof require && require, o = 0; o < n.length; o++) i(n[o]) }({ 1: [function(t, e, n) { t("./pointable"); var i = t("gl-matrix"),
                r = i.vec3,
                o = i.mat3,
                s = i.mat4,
                a = (t("underscore"), e.exports = function(t, e) { this.finger = t, this._center = null, this._matrix = null, this.type = e.type, this.prevJoint = e.prevJoint, this.nextJoint = e.nextJoint, this.width = e.width; var n = new Array(3);
                    r.sub(n, e.nextJoint, e.prevJoint), this.length = r.length(n), this.basis = e.basis });
            a.prototype.left = function() { return this._left ? this._left : (this._left = o.determinant(this.basis[0].concat(this.basis[1]).concat(this.basis[2])) < 0, this._left) }, a.prototype.matrix = function() { if (this._matrix) return this._matrix; var t = this.basis,
                    e = this._matrix = s.create(); return e[0] = t[0][0], e[1] = t[0][1], e[2] = t[0][2], e[4] = t[1][0], e[5] = t[1][1], e[6] = t[1][2], e[8] = t[2][0], e[9] = t[2][1], e[10] = t[2][2], e[3] = this.center()[0], e[7] = this.center()[1], e[11] = this.center()[2], this.left() && (e[0] *= -1, e[1] *= -1, e[2] *= -1), this._matrix }, a.prototype.lerp = function(t, e) { r.lerp(t, this.prevJoint, this.nextJoint, e) }, a.prototype.center = function() { if (this._center) return this._center; var t = r.create(); return this.lerp(t, .5), this._center = t, t }, a.prototype.direction = function() { return [-1 * this.basis[2][0], -1 * this.basis[2][1], -1 * this.basis[2][2]] } }, { "./pointable": 14, "gl-matrix": 23, underscore: 24 }], 2: [function(t, e, n) { var i = e.exports = function(t) { this.pos = 0, this._buf = [], this.size = t };
            i.prototype.get = function(t) { if (void 0 == t && (t = 0), !(t >= this.size || t >= this._buf.length)) return this._buf[(this.pos - t - 1) % this.size] }, i.prototype.push = function(t) { return this._buf[this.pos % this.size] = t, this.pos++ } }, {}], 3: [function(t, e, n) { var i = t("../protocol").chooseProtocol,
                r = t("events").EventEmitter,
                o = t("underscore"),
                s = e.exports = function(t) { this.opts = o.defaults(t || {}, { host: "127.0.0.1", enableGestures: !1, scheme: this.getScheme(), port: this.getPort(), background: !1, optimizeHMD: !1, requestProtocolVersion: s.defaultProtocolVersion }), this.host = this.opts.host, this.port = this.opts.port, this.scheme = this.opts.scheme, this.protocolVersionVerified = !1, this.background = null, this.optimizeHMD = null, this.on("ready", function() { this.enableGestures(this.opts.enableGestures), this.setBackground(this.opts.background), this.setOptimizeHMD(this.opts.optimizeHMD), this.opts.optimizeHMD ? console.log("Optimized for head mounted display usage.") : console.log("Optimized for desktop usage.") }) };
            s.defaultProtocolVersion = 6, s.prototype.getUrl = function() { return this.scheme + "//" + this.host + ":" + this.port + "/v" + this.opts.requestProtocolVersion + ".json" }, s.prototype.getScheme = function() { return "ws:" }, s.prototype.getPort = function() { return 6437 }, s.prototype.setBackground = function(t) { this.opts.background = t, this.protocol && this.protocol.sendBackground && this.background !== this.opts.background && (this.background = this.opts.background, this.protocol.sendBackground(this, this.opts.background)) }, s.prototype.setOptimizeHMD = function(t) { this.opts.optimizeHMD = t, this.protocol && this.protocol.sendOptimizeHMD && this.optimizeHMD !== this.opts.optimizeHMD && (this.optimizeHMD = this.opts.optimizeHMD, this.protocol.sendOptimizeHMD(this, this.opts.optimizeHMD)) }, s.prototype.handleOpen = function() { this.connected || (this.connected = !0, this.emit("connect")) }, s.prototype.enableGestures = function(t) { this.gesturesEnabled = !!t, this.send(this.protocol.encode({ enableGestures: this.gesturesEnabled })) }, s.prototype.handleClose = function(t, e) { this.connected && (this.disconnect(), 1001 === t && this.opts.requestProtocolVersion > 1 && (this.protocolVersionVerified ? this.protocolVersionVerified = !1 : this.opts.requestProtocolVersion--), this.startReconnection()) }, s.prototype.startReconnection = function() { var t = this;
                this.reconnectionTimer || (this.reconnectionTimer = setInterval(function() { t.reconnect() }, 500)) }, s.prototype.stopReconnection = function() { this.reconnectionTimer = clearInterval(this.reconnectionTimer) }, s.prototype.disconnect = function(t) { if (t || this.stopReconnection(), this.socket) return this.socket.close(), delete this.socket, delete this.protocol, delete this.background, delete this.optimizeHMD, delete this.focusedState, this.connected && (this.connected = !1, this.emit("disconnect")), !0 }, s.prototype.reconnect = function() { this.connected ? this.stopReconnection() : (this.disconnect(!0), this.connect()) }, s.prototype.handleData = function(t) { var e, n = JSON.parse(t);
                void 0 === this.protocol ? (e = this.protocol = i(n), this.protocolVersionVerified = !0, this.emit("ready")) : e = this.protocol(n), this.emit(e.type, e) }, s.prototype.connect = function() { if (!this.socket) return this.socket = this.setupSocket(), !0 }, s.prototype.send = function(t) { this.socket.send(t) }, s.prototype.reportFocus = function(t) { this.connected && this.focusedState !== t && (this.focusedState = t, this.emit(this.focusedState ? "focus" : "blur"), this.protocol && this.protocol.sendFocused && this.protocol.sendFocused(this, this.focusedState)) }, o.extend(s.prototype, r.prototype) }, { "../protocol": 15, events: 21, underscore: 24 }], 4: [function(t, e, n) { var i = e.exports = t("./base"),
                r = t("underscore"),
                o = e.exports = function(t) { i.call(this, t); var e = this;
                    this.on("ready", function() { e.startFocusLoop() }), this.on("disconnect", function() { e.stopFocusLoop() }) };
            r.extend(o.prototype, i.prototype), o.__proto__ = i, o.prototype.useSecure = function() { return "https:" === location.protocol }, o.prototype.getScheme = function() { return this.useSecure() ? "wss:" : "ws:" }, o.prototype.getPort = function() { return this.useSecure() ? 6436 : 6437 }, o.prototype.setupSocket = function() { var t = this,
                    e = new WebSocket(this.getUrl()); return e.onopen = function() { t.handleOpen() }, e.onclose = function(e) { t.handleClose(e.code, e.reason) }, e.onmessage = function(e) { t.handleData(e.data) }, e.onerror = function(e) { t.useSecure() && "wss:" === t.scheme && (t.scheme = "ws:", t.port = 6437, t.disconnect(), t.connect()) }, e }, o.prototype.startFocusLoop = function() { if (!this.focusDetectorTimer) { var t = this,
                        e = null;
                    e = void 0 !== document.hidden ? "hidden" : void 0 !== document.mozHidden ? "mozHidden" : void 0 !== document.msHidden ? "msHidden" : void 0 !== document.webkitHidden ? "webkitHidden" : void 0, void 0 === t.windowVisible && (t.windowVisible = void 0 === e || !1 === document[e]); var n = window.addEventListener("focus", function(e) { t.windowVisible = !0, r() }),
                        i = window.addEventListener("blur", function(e) { t.windowVisible = !1, r() });
                    this.on("disconnect", function() { window.removeEventListener("focus", n), window.removeEventListener("blur", i) }); var r = function() { var n = void 0 === e || !1 === document[e];
                        t.reportFocus(n && t.windowVisible) };
                    r(), this.focusDetectorTimer = setInterval(r, 100) } }, o.prototype.stopFocusLoop = function() { this.focusDetectorTimer && (clearTimeout(this.focusDetectorTimer), delete this.focusDetectorTimer) } }, { "./base": 3, underscore: 24 }], 5: [function(t, e, n) { var i = t("__browserify_process"),
                r = t("./frame"),
                o = t("./hand"),
                s = t("./pointable"),
                a = t("./finger"),
                c = t("./circular_buffer"),
                u = t("./pipeline"),
                h = t("events").EventEmitter,
                l = t("./gesture").gestureListener,
                p = t("./dialog"),
                d = t("underscore"),
                f = e.exports = function(e) { var n = this;
                    e = d.defaults(e || {}, { inNode: void 0 !== i && i.versions && i.versions.node }), this.inNode = e.inNode, e = d.defaults(e || {}, { frameEventName: this.useAnimationLoop() ? "animationFrame" : "deviceFrame", suppressAnimationLoop: !this.useAnimationLoop(), loopWhileDisconnected: !0, useAllPlugins: !1, checkVersion: !0 }), this.animationFrameRequested = !1, this.onAnimationFrame = function(t) { n.lastConnectionFrame.valid && n.emit("animationFrame", n.lastConnectionFrame), n.emit("frameEnd", t), n.loopWhileDisconnected && (!1 !== n.connection.focusedState || n.connection.opts.background) ? window.requestAnimationFrame(n.onAnimationFrame) : n.animationFrameRequested = !1 }, this.suppressAnimationLoop = e.suppressAnimationLoop, this.loopWhileDisconnected = e.loopWhileDisconnected, this.frameEventName = e.frameEventName, this.useAllPlugins = e.useAllPlugins, this.history = new c(200), this.lastFrame = r.Invalid, this.lastValidFrame = r.Invalid, this.lastConnectionFrame = r.Invalid, this.accumulatedGestures = [], this.checkVersion = e.checkVersion, this.connectionType = void 0 === e.connectionType ? this.inBrowser() ? t("./connection/browser") : t("./connection/node") : e.connectionType, this.connection = new this.connectionType(e), this.streamingCount = 0, this.devices = {}, this.plugins = {}, this._pluginPipelineSteps = {}, this._pluginExtendedMethods = {}, e.useAllPlugins && this.useRegisteredPlugins(), this.setupFrameEvents(e), this.setupConnectionEvents(), this.startAnimationLoop() };
            f.prototype.gesture = function(t, e) { var n = l(this, t); return void 0 !== e && n.stop(e), n }, f.prototype.setBackground = function(t) { return this.connection.setBackground(t), this }, f.prototype.setOptimizeHMD = function(t) { return this.connection.setOptimizeHMD(t), this }, f.prototype.inBrowser = function() { return !this.inNode }, f.prototype.useAnimationLoop = function() { return this.inBrowser() && !this.inBackgroundPage() }, f.prototype.inBackgroundPage = function() { return "undefined" != typeof chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window }, f.prototype.connect = function() { return this.connection.connect(), this }, f.prototype.streaming = function() { return this.streamingCount > 0 }, f.prototype.connected = function() { return !!this.connection.connected }, f.prototype.startAnimationLoop = function() { this.suppressAnimationLoop || this.animationFrameRequested || (this.animationFrameRequested = !0, window.requestAnimationFrame(this.onAnimationFrame)) }, f.prototype.disconnect = function() { return this.connection.disconnect(), this }, f.prototype.frame = function(t) { return this.history.get(t) || r.Invalid }, f.prototype.loop = function(t) { return t && ("function" == typeof t ? this.on(this.frameEventName, t) : this.setupFrameEvents(t)), this.connect() }, f.prototype.addStep = function(t) { this.pipeline || (this.pipeline = new u(this)), this.pipeline.addStep(t) }, f.prototype.processFrame = function(t) { t.gestures && (this.accumulatedGestures = this.accumulatedGestures.concat(t.gestures)), this.lastConnectionFrame = t, this.startAnimationLoop(), this.emit("deviceFrame", t) }, f.prototype.processFinishedFrame = function(t) { if (this.lastFrame = t, t.valid && (this.lastValidFrame = t), t.controller = this, t.historyIdx = this.history.push(t), t.gestures) { t.gestures = this.accumulatedGestures, this.accumulatedGestures = []; for (var e = 0; e != t.gestures.length; e++) this.emit("gesture", t.gestures[e], t) }
                this.pipeline && ((t = this.pipeline.run(t)) || (t = r.Invalid)), this.emit("frame", t), this.emitHandEvents(t) }, f.prototype.emitHandEvents = function(t) { for (var e = 0; e < t.hands.length; e++) this.emit("hand", t.hands[e]) }, f.prototype.setupFrameEvents = function(t) { t.frame && this.on("frame", t.frame), t.hand && this.on("hand", t.hand) }, f.prototype.setupConnectionEvents = function() { var t = this;
                this.connection.on("frame", function(e) { t.processFrame(e) }), this.on(this.frameEventName, function(e) { t.processFinishedFrame(e) }); var e = function() { if (t.connection.opts.requestProtocolVersion < 5 && 0 == t.streamingCount) { t.streamingCount = 1; var n = { attached: !0, streaming: !0, type: "unknown", id: "Lx00000000000" };
                            t.devices[n.id] = n, t.emit("deviceAttached", n), t.emit("deviceStreaming", n), t.emit("streamingStarted", n), t.connection.removeListener("frame", e) } },
                    n = function() { if (t.streamingCount > 0) { for (var e in t.devices) t.emit("deviceStopped", t.devices[e]), t.emit("deviceRemoved", t.devices[e]); for (var e in t.emit("streamingStopped", t.devices[e]), t.streamingCount = 0, t.devices) delete t.devices[e] } };
                this.connection.on("focus", function() { t.loopWhileDisconnected && t.startAnimationLoop(), t.emit("focus") }), this.connection.on("blur", function() { t.emit("blur") }), this.connection.on("protocol", function(e) { e.on("beforeFrameCreated", function(e) { t.emit("beforeFrameCreated", e) }), e.on("afterFrameCreated", function(e, n) { t.emit("afterFrameCreated", e, n) }), t.emit("protocol", e) }), this.connection.on("ready", function() { t.checkVersion && !t.inNode && t.checkOutOfDate(), t.emit("ready") }), this.connection.on("connect", function() { t.emit("connect"), t.connection.removeListener("frame", e), t.connection.on("frame", e) }), this.connection.on("disconnect", function() { t.emit("disconnect"), n() }), this.connection.on("deviceConnect", function(i) { i.state ? (t.emit("deviceConnected"), t.connection.removeListener("frame", e), t.connection.on("frame", e)) : (t.emit("deviceDisconnected"), n()) }), this.connection.on("deviceEvent", function(e) { var n = e.state,
                        i = t.devices[n.id],
                        r = {}; for (var o in n) i && i.hasOwnProperty(o) && i[o] == n[o] || (r[o] = !0);
                    t.devices[n.id] = n, r.attached && t.emit(n.attached ? "deviceAttached" : "deviceRemoved", n), r.streaming && (n.streaming ? (t.streamingCount++, t.emit("deviceStreaming", n), 1 == t.streamingCount && t.emit("streamingStarted", n), r.attached || t.emit("deviceConnected")) : r.attached && n.attached || (t.streamingCount--, t.emit("deviceStopped", n), 0 == t.streamingCount && t.emit("streamingStopped", n), t.emit("deviceDisconnected"))) }), this.on("newListener", function(t, e) { "deviceConnected" != t && "deviceDisconnected" != t || console.warn(t + " events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead") }) }, f.prototype.checkOutOfDate = function() { console.assert(this.connection && this.connection.protocol); var t = this.connection.protocol.serviceVersion,
                    e = this.connection.protocol.version,
                    n = this.connectionType.defaultProtocolVersion; return n > e && (console.warn("Your Protocol Version is v" + e + ", this app was designed for v" + n), p.warnOutOfDate({ sV: t, pV: e }), !0) }, f._pluginFactories = {}, f.plugin = function(t, e) { return this._pluginFactories[t] && console.warn('Plugin "' + t + '" already registered'), this._pluginFactories[t] = e }, f.plugins = function() { return d.keys(this._pluginFactories) }; var m = function(t, e, n) {-1 != ["beforeFrameCreated", "afterFrameCreated"].indexOf(e) ? this.on(e, n) : (this.pipeline || (this.pipeline = new u(this)), this._pluginPipelineSteps[t] || (this._pluginPipelineSteps[t] = []), this._pluginPipelineSteps[t].push(this.pipeline.addWrappedStep(e, n))) },
                v = function(t, e, n) { var i; switch (this._pluginExtendedMethods[t] || (this._pluginExtendedMethods[t] = []), e) {
                        case "frame":
                            i = r; break;
                        case "hand":
                            i = o; break;
                        case "pointable":
                            i = s, d.extend(a.prototype, n), d.extend(a.Invalid, n); break;
                        case "finger":
                            i = a; break;
                        default:
                            throw t + ' specifies invalid object type "' + e + '" for prototypical extension' }
                    d.extend(i.prototype, n), d.extend(i.Invalid, n), this._pluginExtendedMethods[t].push([i, n]) };
            f.prototype.use = function(t, e) { var n, i, r, o; if (!(i = "function" == typeof t ? t : f._pluginFactories[t])) throw "Leap Plugin " + t + " not found."; if (e || (e = {}), this.plugins[t]) return d.extend(this.plugins[t], e), this; for (r in this.plugins[t] = e, o = i.call(this, e)) "function" == typeof(n = o[r]) ? m.call(this, t, r, n) : v.call(this, t, r, n); return this }, f.prototype.stopUsing = function(t) { var e, n = this._pluginPipelineSteps[t],
                    i = this._pluginExtendedMethods[t],
                    r = 0; if (this.plugins[t]) { if (n)
                        for (r = 0; r < n.length; r++) this.pipeline.removeStep(n[r]); if (i)
                        for (r = 0; r < i.length; r++)
                            for (var o in e = i[r][0], i[r][1]) delete e.prototype[o], delete e.Invalid[o]; return delete this.plugins[t], this } }, f.prototype.useRegisteredPlugins = function() { for (var t in f._pluginFactories) this.use(t) }, d.extend(f.prototype, h.prototype) }, { "./circular_buffer": 2, "./connection/browser": 4, "./connection/node": 20, "./dialog": 6, "./finger": 7, "./frame": 8, "./gesture": 9, "./hand": 10, "./pipeline": 13, "./pointable": 14, __browserify_process: 22, events: 21, underscore: 24 }], 6: [function(t, e, n) { var i = t("__browserify_process"),
                r = e.exports = function(t, e) { this.options = e || {}, this.message = t, this.createElement() };
            r.prototype.createElement = function() { this.element = document.createElement("div"), this.element.className = "leapjs-dialog", this.element.style.position = "fixed", this.element.style.top = "8px", this.element.style.left = 0, this.element.style.right = 0, this.element.style.textAlign = "center", this.element.style.zIndex = 1e3; var t = document.createElement("div");
                this.element.appendChild(t), t.style.className = "leapjs-dialog", t.style.display = "inline-block", t.style.margin = "auto", t.style.padding = "8px", t.style.color = "#222", t.style.background = "#eee", t.style.borderRadius = "4px", t.style.border = "1px solid #999", t.style.textAlign = "left", t.style.cursor = "pointer", t.style.whiteSpace = "nowrap", t.style.transition = "box-shadow 1s linear", t.innerHTML = this.message, this.options.onclick && t.addEventListener("click", this.options.onclick), this.options.onmouseover && t.addEventListener("mouseover", this.options.onmouseover), this.options.onmouseout && t.addEventListener("mouseout", this.options.onmouseout), this.options.onmousemove && t.addEventListener("mousemove", this.options.onmousemove) }, r.prototype.show = function() { return document.body.appendChild(this.element), this }, r.prototype.hide = function() { return document.body.removeChild(this.element), this }, r.warnOutOfDate = function(t) { t || (t = {}); var e = "http://developer.leapmotion.com?"; for (var n in t.returnTo = window.location.href, t) e += n + "=" + encodeURIComponent(t[n]) + "&"; var i; return (i = new r("This site requires Leap Motion Tracking V2.<button id='leapjs-accept-upgrade'  style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 16px;'>Upgrade</button><button id='leapjs-decline-upgrade' style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 8px; '>Not Now</button>", { onclick: function(t) { if ("leapjs-decline-upgrade" != t.target.id) { var n = window.open(e, "_blank", "height=800,width=1000,location=1,menubar=1,resizable=1,status=1,toolbar=1,scrollbars=1");
                            window.focus && n.focus() } return i.hide(), !0 }, onmousemove: function(t) { t.target == document.getElementById("leapjs-decline-upgrade") ? (document.getElementById("leapjs-decline-upgrade").style.color = "#000", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none") : (document.getElementById("leapjs-accept-upgrade").style.color = "#000", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none") }, onmouseout: function() { document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none" } })).show() }, r.hasWarnedBones = !1, r.warnBones = function() { this.hasWarnedBones || (this.hasWarnedBones = !0, console.warn("Your Leap Service is out of date"), void 0 !== i && i.versions && i.versions.node || this.warnOutOfDate({ reason: "bones" })) } }, { __browserify_process: 22 }], 7: [function(t, e, n) { var i = t("./pointable"),
                r = t("./bone"),
                o = t("./dialog"),
                s = t("underscore"),
                a = e.exports = function(t) { i.call(this, t), this.dipPosition = t.dipPosition, this.pipPosition = t.pipPosition, this.mcpPosition = t.mcpPosition, this.carpPosition = t.carpPosition, this.extended = t.extended, this.type = t.type, this.finger = !0, this.positions = [this.carpPosition, this.mcpPosition, this.pipPosition, this.dipPosition, this.tipPosition], t.bases ? this.addBones(t) : o.warnBones() };
            s.extend(a.prototype, i.prototype), a.prototype.addBones = function(t) { this.metacarpal = new r(this, { type: 0, width: this.width, prevJoint: this.carpPosition, nextJoint: this.mcpPosition, basis: t.bases[0] }), this.proximal = new r(this, { type: 1, width: this.width, prevJoint: this.mcpPosition, nextJoint: this.pipPosition, basis: t.bases[1] }), this.medial = new r(this, { type: 2, width: this.width, prevJoint: this.pipPosition, nextJoint: this.dipPosition, basis: t.bases[2] }), this.distal = new r(this, { type: 3, width: this.width, prevJoint: this.dipPosition, nextJoint: t.btipPosition, basis: t.bases[3] }), this.bones = [this.metacarpal, this.proximal, this.medial, this.distal] }, a.prototype.toString = function() { return "Finger [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]" }, a.Invalid = { valid: !1 } }, { "./bone": 1, "./dialog": 6, "./pointable": 14, underscore: 24 }], 8: [function(t, e, n) { var i = t("./hand"),
                r = t("./pointable"),
                o = t("./gesture").createGesture,
                s = t("gl-matrix"),
                a = s.mat3,
                c = s.vec3,
                u = t("./interaction_box"),
                h = t("./finger"),
                l = t("underscore"),
                p = e.exports = function(t) { if (this.valid = !0, this.id = t.id, this.timestamp = t.timestamp, this.hands = [], this.handsMap = {}, this.pointables = [], this.tools = [], this.fingers = [], t.interactionBox && (this.interactionBox = new u(t.interactionBox)), this.gestures = [], this.pointablesMap = {}, this._translation = t.t, this._rotation = l.flatten(t.r), this._scaleFactor = t.s, this.data = t, this.type = "frame", this.currentFrameRate = t.currentFrameRate, t.gestures)
                        for (var e = 0, n = t.gestures.length; e != n; e++) this.gestures.push(o(t.gestures[e]));
                    this.postprocessData(t) };
            p.prototype.postprocessData = function(t) { t || (t = this.data); for (var e = 0, n = t.hands.length; e != n; e++) { var o = new i(t.hands[e]);
                    o.frame = this, this.hands.push(o), this.handsMap[o.id] = o }
                t.pointables = l.sortBy(t.pointables, function(t) { return t.id }); for (var s = 0, a = t.pointables.length; s != a; s++) { var c = t.pointables[s],
                        u = c.dipPosition ? new h(c) : new r(c);
                    u.frame = this, this.addPointable(u) } }, p.prototype.addPointable = function(t) { if (this.pointables.push(t), this.pointablesMap[t.id] = t, (t.tool ? this.tools : this.fingers).push(t), void 0 !== t.handId && this.handsMap.hasOwnProperty(t.handId)) { var e = this.handsMap[t.handId]; switch (e.pointables.push(t), (t.tool ? e.tools : e.fingers).push(t), t.type) {
                        case 0:
                            e.thumb = t; break;
                        case 1:
                            e.indexFinger = t; break;
                        case 2:
                            e.middleFinger = t; break;
                        case 3:
                            e.ringFinger = t; break;
                        case 4:
                            e.pinky = t } } }, p.prototype.tool = function(t) { var e = this.pointable(t); return e.tool ? e : r.Invalid }, p.prototype.pointable = function(t) { return this.pointablesMap[t] || r.Invalid }, p.prototype.finger = function(t) { var e = this.pointable(t); return e.tool ? r.Invalid : e }, p.prototype.hand = function(t) { return this.handsMap[t] || i.Invalid }, p.prototype.rotationAngle = function(t, e) { if (!this.valid || !t.valid) return 0; var n = this.rotationMatrix(t),
                    i = Math.acos(.5 * (n[0] + n[4] + n[8] - 1)); if (i = isNaN(i) ? 0 : i, void 0 !== e) { var r = this.rotationAxis(t);
                    i *= c.dot(r, c.normalize(c.create(), e)) } return i }, p.prototype.rotationAxis = function(t) { return this.valid && t.valid ? c.normalize(c.create(), [this._rotation[7] - t._rotation[5], this._rotation[2] - t._rotation[6], this._rotation[3] - t._rotation[1]]) : c.create() }, p.prototype.rotationMatrix = function(t) { if (!this.valid || !t.valid) return a.create(); var e = a.transpose(a.create(), this._rotation); return a.multiply(a.create(), t._rotation, e) }, p.prototype.scaleFactor = function(t) { return this.valid && t.valid ? Math.exp(this._scaleFactor - t._scaleFactor) : 1 }, p.prototype.translation = function(t) { return this.valid && t.valid ? c.subtract(c.create(), this._translation, t._translation) : c.create() }, p.prototype.toString = function() { var t = "Frame [ id:" + this.id + " | timestamp:" + this.timestamp + " | Hand count:(" + this.hands.length + ") | Pointable count:(" + this.pointables.length + ")"; return this.gestures && (t += " | Gesture count:(" + this.gestures.length + ")"), t += " ]" }, p.prototype.dump = function() { var t = "";
                t += "Frame Info:<br/>", t += this.toString(), t += "<br/><br/>Hands:<br/>"; for (var e = 0, n = this.hands.length; e != n; e++) t += "  " + this.hands[e].toString() + "<br/>";
                t += "<br/><br/>Pointables:<br/>"; for (var i = 0, r = this.pointables.length; i != r; i++) t += "  " + this.pointables[i].toString() + "<br/>"; if (this.gestures) { t += "<br/><br/>Gestures:<br/>"; for (var o = 0, s = this.gestures.length; o != s; o++) t += "  " + this.gestures[o].toString() + "<br/>" } return t += "<br/><br/>Raw JSON:<br/>", t += JSON.stringify(this.data) }, p.Invalid = { valid: !1, hands: [], fingers: [], tools: [], gestures: [], pointables: [], pointable: function() { return r.Invalid }, finger: function() { return r.Invalid }, hand: function() { return i.Invalid }, toString: function() { return "invalid frame" }, dump: function() { return this.toString() }, rotationAngle: function() { return 0 }, rotationMatrix: function() { return a.create() }, rotationAxis: function() { return c.create() }, scaleFactor: function() { return 1 }, translation: function() { return c.create() } } }, { "./finger": 7, "./gesture": 9, "./hand": 10, "./interaction_box": 12, "./pointable": 14, "gl-matrix": 23, underscore: 24 }], 9: [function(t, e, n) { var i = t("gl-matrix").vec3,
                r = t("events").EventEmitter,
                o = t("underscore"),
                s = (n.createGesture = function(t) { var e; switch (t.type) {
                        case "circle":
                            e = new a(t); break;
                        case "swipe":
                            e = new c(t); break;
                        case "screenTap":
                            e = new u(t); break;
                        case "keyTap":
                            e = new h(t); break;
                        default:
                            throw "unknown gesture type" } return e.id = t.id, e.handIds = t.handIds.slice(), e.pointableIds = t.pointableIds.slice(), e.duration = t.duration, e.state = t.state, e.type = t.type, e }, n.gestureListener = function(t, e) { var n = {},
                        i = {};
                    t.on("gesture", function(t, r) { if (t.type == e) { if (("start" == t.state || "stop" == t.state) && void 0 === i[t.id]) { var a = new s(t, r);
                                i[t.id] = a, o.each(n, function(t, e) { a.on(e, t) }) }
                            i[t.id].update(t, r), "stop" == t.state && delete i[t.id] } }); var r = { start: function(t) { return n.start = t, r }, stop: function(t) { return n.stop = t, r }, complete: function(t) { return n.stop = t, r }, update: function(t) { return n.update = t, r } }; return r }, n.Gesture = function(t, e) { this.gestures = [t], this.frames = [e] });
            s.prototype.update = function(t, e) { this.lastGesture = t, this.lastFrame = e, this.gestures.push(t), this.frames.push(e), this.emit(t.state, this) }, s.prototype.translation = function() { return i.subtract(i.create(), this.lastGesture.startPosition, this.lastGesture.position) }, o.extend(s.prototype, r.prototype); var a = function(t) { this.center = t.center, this.normal = t.normal, this.progress = t.progress, this.radius = t.radius };
            a.prototype.toString = function() { return "CircleGesture [" + JSON.stringify(this) + "]" }; var c = function(t) { this.startPosition = t.startPosition, this.position = t.position, this.direction = t.direction, this.speed = t.speed };
            c.prototype.toString = function() { return "SwipeGesture [" + JSON.stringify(this) + "]" }; var u = function(t) { this.position = t.position, this.direction = t.direction, this.progress = t.progress };
            u.prototype.toString = function() { return "ScreenTapGesture [" + JSON.stringify(this) + "]" }; var h = function(t) { this.position = t.position, this.direction = t.direction, this.progress = t.progress };
            h.prototype.toString = function() { return "KeyTapGesture [" + JSON.stringify(this) + "]" } }, { events: 21, "gl-matrix": 23, underscore: 24 }], 10: [function(t, e, n) { var i = t("./pointable"),
                r = t("./bone"),
                o = t("gl-matrix"),
                s = o.mat3,
                a = o.vec3,
                c = t("underscore"),
                u = e.exports = function(t) { this.id = t.id, this.palmPosition = t.palmPosition, this.direction = t.direction, this.palmVelocity = t.palmVelocity, this.palmNormal = t.palmNormal, this.sphereCenter = t.sphereCenter, this.sphereRadius = t.sphereRadius, this.valid = !0, this.pointables = [], this.fingers = [], this.arm = t.armBasis ? new r(this, { type: 4, width: t.armWidth, prevJoint: t.elbow, nextJoint: t.wrist, basis: t.armBasis }) : null, this.tools = [], this._translation = t.t, this._rotation = c.flatten(t.r), this._scaleFactor = t.s, this.timeVisible = t.timeVisible, this.stabilizedPalmPosition = t.stabilizedPalmPosition, this.type = t.type, this.grabStrength = t.grabStrength, this.pinchStrength = t.pinchStrength, this.confidence = t.confidence };
            u.prototype.finger = function(t) { var e = this.frame.finger(t); return e && e.handId == this.id ? e : i.Invalid }, u.prototype.rotationAngle = function(t, e) { if (!this.valid || !t.valid) return 0; if (!t.hand(this.id).valid) return 0; var n = this.rotationMatrix(t),
                    i = Math.acos(.5 * (n[0] + n[4] + n[8] - 1)); if (i = isNaN(i) ? 0 : i, void 0 !== e) { var r = this.rotationAxis(t);
                    i *= a.dot(r, a.normalize(a.create(), e)) } return i }, u.prototype.rotationAxis = function(t) { if (!this.valid || !t.valid) return a.create(); var e = t.hand(this.id); return e.valid ? a.normalize(a.create(), [this._rotation[7] - e._rotation[5], this._rotation[2] - e._rotation[6], this._rotation[3] - e._rotation[1]]) : a.create() }, u.prototype.rotationMatrix = function(t) { if (!this.valid || !t.valid) return s.create(); var e = t.hand(this.id); if (!e.valid) return s.create(); var n = s.transpose(s.create(), this._rotation); return s.multiply(s.create(), e._rotation, n) }, u.prototype.scaleFactor = function(t) { if (!this.valid || !t.valid) return 1; var e = t.hand(this.id); return e.valid ? Math.exp(this._scaleFactor - e._scaleFactor) : 1 }, u.prototype.translation = function(t) { if (!this.valid || !t.valid) return a.create(); var e = t.hand(this.id); return e.valid ? [this._translation[0] - e._translation[0], this._translation[1] - e._translation[1], this._translation[2] - e._translation[2]] : a.create() }, u.prototype.toString = function() { return "Hand (" + this.type + ") [ id: " + this.id + " | palm velocity:" + this.palmVelocity + " | sphere center:" + this.sphereCenter + " ] " }, u.prototype.pitch = function() { return Math.atan2(this.direction[1], -this.direction[2]) }, u.prototype.yaw = function() { return Math.atan2(this.direction[0], -this.direction[2]) }, u.prototype.roll = function() { return Math.atan2(this.palmNormal[0], -this.palmNormal[1]) }, u.Invalid = { valid: !1, fingers: [], tools: [], pointables: [], left: !1, pointable: function() { return i.Invalid }, finger: function() { return i.Invalid }, toString: function() { return "invalid frame" }, dump: function() { return this.toString() }, rotationAngle: function() { return 0 }, rotationMatrix: function() { return s.create() }, rotationAxis: function() { return a.create() }, scaleFactor: function() { return 1 }, translation: function() { return a.create() } } }, { "./bone": 1, "./pointable": 14, "gl-matrix": 23, underscore: 24 }], 11: [function(t, e, n) { e.exports = { Controller: t("./controller"), Frame: t("./frame"), Gesture: t("./gesture"), Hand: t("./hand"), Pointable: t("./pointable"), Finger: t("./finger"), InteractionBox: t("./interaction_box"), CircularBuffer: t("./circular_buffer"), UI: t("./ui"), JSONProtocol: t("./protocol").JSONProtocol, glMatrix: t("gl-matrix"), mat3: t("gl-matrix").mat3, vec3: t("gl-matrix").vec3, loopController: void 0, version: t("./version.js"), _: t("underscore"), EventEmitter: t("events").EventEmitter, loop: function(t, e) { return t && void 0 === e && "[object Function]" === {}.toString.call(t) && (e = t, t = {}), this.loopController ? t && this.loopController.setupFrameEvents(t) : this.loopController = new this.Controller(t), this.loopController.loop(e), this.loopController }, plugin: function(t, e) { this.Controller.plugin(t, e) } } }, { "./circular_buffer": 2, "./controller": 5, "./finger": 7, "./frame": 8, "./gesture": 9, "./hand": 10, "./interaction_box": 12, "./pointable": 14, "./protocol": 15, "./ui": 16, "./version.js": 19, events: 21, "gl-matrix": 23, underscore: 24 }], 12: [function(t, e, n) { var i = t("gl-matrix").vec3,
                r = e.exports = function(t) { this.valid = !0, this.center = t.center, this.size = t.size, this.width = t.size[0], this.height = t.size[1], this.depth = t.size[2] };
            r.prototype.denormalizePoint = function(t) { return i.fromValues((t[0] - .5) * this.size[0] + this.center[0], (t[1] - .5) * this.size[1] + this.center[1], (t[2] - .5) * this.size[2] + this.center[2]) }, r.prototype.normalizePoint = function(t, e) { var n = i.fromValues((t[0] - this.center[0]) / this.size[0] + .5, (t[1] - this.center[1]) / this.size[1] + .5, (t[2] - this.center[2]) / this.size[2] + .5); return e && (n[0] = Math.min(Math.max(n[0], 0), 1), n[1] = Math.min(Math.max(n[1], 0), 1), n[2] = Math.min(Math.max(n[2], 0), 1)), n }, r.prototype.toString = function() { return "InteractionBox [ width:" + this.width + " | height:" + this.height + " | depth:" + this.depth + " ]" }, r.Invalid = { valid: !1 } }, { "gl-matrix": 23 }], 13: [function(t, e, n) { var i = e.exports = function(t) { this.steps = [], this.controller = t };
            i.prototype.addStep = function(t) { this.steps.push(t) }, i.prototype.run = function(t) { for (var e = this.steps.length, n = 0; n != e && t; n++) t = this.steps[n](t); return t }, i.prototype.removeStep = function(t) { var e = this.steps.indexOf(t); if (-1 === e) throw "Step not found in pipeline";
                this.steps.splice(e, 1) }, i.prototype.addWrappedStep = function(t, e) { var n = this.controller,
                    i = function(i) { var r, o, s; for (o = 0, s = (r = "frame" == t ? [i] : i[t + "s"] || []).length; o < s; o++) e.call(n, r[o]); return i }; return this.addStep(i), i } }, {}], 14: [function(t, e, n) { t("gl-matrix"); var i = e.exports = function(t) { this.valid = !0, this.id = t.id, this.handId = t.handId, this.length = t.length, this.tool = t.tool, this.width = t.width, this.direction = t.direction, this.stabilizedTipPosition = t.stabilizedTipPosition, this.tipPosition = t.tipPosition, this.tipVelocity = t.tipVelocity, this.touchZone = t.touchZone, this.touchDistance = t.touchDistance, this.timeVisible = t.timeVisible };
            i.prototype.toString = function() { return "Pointable [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]" }, i.prototype.hand = function() { return this.frame.hand(this.handId) }, i.Invalid = { valid: !1 } }, { "gl-matrix": 23 }], 15: [function(t, e, n) { var i = t("./frame"),
                r = (t("./hand"), t("./pointable"), t("./finger"), t("underscore")),
                o = t("events").EventEmitter;
            n.chooseProtocol = function(t) { var e; switch (t.version) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        (e = s(t)).sendBackground = function(t, n) { t.send(e.encode({ background: n })) }, e.sendFocused = function(t, n) { t.send(e.encode({ focused: n })) }, e.sendOptimizeHMD = function(t, n) { t.send(e.encode({ optimizeHMD: n })) }; break;
                    default:
                        throw "unrecognized version" } return e }; var s = n.JSONProtocol = function(t) { var e = function(t) { if (t.event) return new function(t) { this.type = t.type, this.state = t.state }(t.event);
                    e.emit("beforeFrameCreated", t); var n = new i(t); return e.emit("afterFrameCreated", n, t), n }; return e.encode = function(t) { return JSON.stringify(t) }, e.version = t.version, e.serviceVersion = t.serviceVersion, e.versionLong = "Version " + t.version, e.type = "protocol", r.extend(e, o.prototype), e } }, { "./finger": 7, "./frame": 8, "./hand": 10, "./pointable": 14, events: 21, underscore: 24 }], 16: [function(t, e, n) { n.UI = { Region: t("./ui/region"), Cursor: t("./ui/cursor") } }, { "./ui/cursor": 17, "./ui/region": 18 }], 17: [function(t, e, n) { e.exports = function() { return function(t) { var e = t.pointables.sort(function(t, e) { return t.z - e.z })[0]; return e && e.valid && (t.cursorPosition = e.tipPosition), t } } }, {}], 18: [function(t, e, n) { var i = t("events").EventEmitter,
                r = t("underscore"),
                o = e.exports = function(t, e) { this.start = new Vector(t), this.end = new Vector(e), this.enteredFrame = null };
            o.prototype.hasPointables = function(t) { for (var e = 0; e != t.pointables.length; e++) { var n = t.pointables[e].tipPosition; if (n.x >= this.start.x && n.x <= this.end.x && n.y >= this.start.y && n.y <= this.end.y && n.z >= this.start.z && n.z <= this.end.z) return !0 } return !1 }, o.prototype.listener = function(t) { var e = this; return t && t.nearThreshold && this.setupNearRegion(t.nearThreshold),
                    function(t) { return e.updatePosition(t) } }, o.prototype.clipper = function() { var t = this; return function(e) { return t.updatePosition(e), t.enteredFrame ? e : null } }, o.prototype.setupNearRegion = function(t) { var e = this.nearRegion = new o([this.start.x - t, this.start.y - t, this.start.z - t], [this.end.x + t, this.end.y + t, this.end.z + t]),
                    n = this;
                e.on("enter", function(t) { n.emit("near", t) }), e.on("exit", function(t) { n.emit("far", t) }), n.on("exit", function(t) { n.emit("near", t) }) }, o.prototype.updatePosition = function(t) { return this.nearRegion && this.nearRegion.updatePosition(t), this.hasPointables(t) && null == this.enteredFrame ? (this.enteredFrame = t, this.emit("enter", this.enteredFrame)) : this.hasPointables(t) || null == this.enteredFrame || (this.enteredFrame = null, this.emit("exit", this.enteredFrame)), t }, o.prototype.normalize = function(t) { return new Vector([(t.x - this.start.x) / (this.end.x - this.start.x), (t.y - this.start.y) / (this.end.y - this.start.y), (t.z - this.start.z) / (this.end.z - this.start.z)]) }, o.prototype.mapToXY = function(t, e, n) { var i = this.normalize(t),
                    r = i.x,
                    o = i.y; return r > 1 ? r = 1 : r < -1 && (r = -1), o > 1 ? o = 1 : o < -1 && (o = -1), [(r + 1) / 2 * e, (1 - o) / 2 * n, i.z] }, r.extend(o.prototype, i.prototype) }, { events: 21, underscore: 24 }], 19: [function(t, e, n) { e.exports = { full: "0.6.4", major: 0, minor: 6, dot: 4 } }, {}], 20: [function(t, e, n) {}, {}], 21: [function(t, e, n) { var i = t("__browserify_process");
            i.EventEmitter || (i.EventEmitter = function() {}); var r = n.EventEmitter = i.EventEmitter,
                o = "function" == typeof Array.isArray ? Array.isArray : function(t) { return "[object Array]" === Object.prototype.toString.call(t) };
            r.prototype.setMaxListeners = function(t) { this._events || (this._events = {}), this._events.maxListeners = t }, r.prototype.emit = function(t) { if ("error" === t && (!this._events || !this._events.error || o(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event."); if (!this._events) return !1; var e = this._events[t]; if (!e) return !1; if ("function" == typeof e) { switch (arguments.length) {
                        case 1:
                            e.call(this); break;
                        case 2:
                            e.call(this, arguments[1]); break;
                        case 3:
                            e.call(this, arguments[1], arguments[2]); break;
                        default:
                            var n = Array.prototype.slice.call(arguments, 1);
                            e.apply(this, n) } return !0 } if (o(e)) { n = Array.prototype.slice.call(arguments, 1); for (var i = e.slice(), r = 0, s = i.length; r < s; r++) i[r].apply(this, n); return !0 } return !1 }, r.prototype.addListener = function(t, e) { if ("function" != typeof e) throw new Error("addListener only takes instances of Function"); if (this._events || (this._events = {}), this.emit("newListener", t, e), this._events[t])
                    if (o(this._events[t])) { var n; if (!this._events[t].warned)(n = void 0 !== this._events.maxListeners ? this._events.maxListeners : 10) && n > 0 && this._events[t].length > n && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), console.trace());
                        this._events[t].push(e) } else this._events[t] = [this._events[t], e];
                else this._events[t] = e; return this }, r.prototype.on = r.prototype.addListener, r.prototype.once = function(t, e) { var n = this; return n.on(t, function i() { n.removeListener(t, i), e.apply(this, arguments) }), this }, r.prototype.removeListener = function(t, e) { if ("function" != typeof e) throw new Error("removeListener only takes instances of Function"); if (!this._events || !this._events[t]) return this; var n = this._events[t]; if (o(n)) { var i = function(t, e) { if (t.indexOf) return t.indexOf(e); for (var n = 0; n < t.length; n++)
                            if (e === t[n]) return n;
                        return -1 }(n, e); if (i < 0) return this;
                    n.splice(i, 1), 0 == n.length && delete this._events[t] } else this._events[t] === e && delete this._events[t]; return this }, r.prototype.removeAllListeners = function(t) { return 0 === arguments.length ? (this._events = {}, this) : (t && this._events && this._events[t] && (this._events[t] = null), this) }, r.prototype.listeners = function(t) { return this._events || (this._events = {}), this._events[t] || (this._events[t] = []), o(this._events[t]) || (this._events[t] = [this._events[t]]), this._events[t] }, r.listenerCount = function(t, e) { return t._events && t._events[e] ? "function" == typeof t._events[e] ? 1 : t._events[e].length : 0 } }, { __browserify_process: 22 }], 22: [function(t, e, n) { var i = e.exports = {};
            i.nextTick = function() { var t = "undefined" != typeof window && window.setImmediate,
                    e = "undefined" != typeof window && window.postMessage && window.addEventListener; if (t) return function(t) { return window.setImmediate(t) }; if (e) { var n = []; return window.addEventListener("message", function(t) { var e = t.source;
                            e !== window && null !== e || "process-tick" !== t.data || (t.stopPropagation(), n.length > 0 && n.shift()()) }, !0),
                        function(t) { n.push(t), window.postMessage("process-tick", "*") } } return function(t) { setTimeout(t, 0) } }(), i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.binding = function(t) { throw new Error("process.binding is not supported") }, i.cwd = function() { return "/" }, i.chdir = function(t) { throw new Error("process.chdir is not supported") } }, {}], 23: [function(t, e, n) { var i, r;
            i = this, r = {}, void 0 === n ? "function" == typeof define && "object" == typeof define.amd && define.amd ? (r.exports = {}, define(function() { return r.exports })) : r.exports = "undefined" != typeof window ? window : i : r.exports = n,
                function(t) { var e; if (!n) var n = "undefined" != typeof Float32Array ? Float32Array : Array; if (!i) var i = Math.random; var r = { setMatrixArrayType: function(t) { n = t } };
                    void 0 !== t && (t.glMatrix = r); var o = Math.PI / 180;
                    r.toRadian = function(t) { return t * o }; var s, a = { create: function() { var t = new n(2); return t[0] = 0, t[1] = 0, t }, clone: function(t) { var e = new n(2); return e[0] = t[0], e[1] = t[1], e }, fromValues: function(t, e) { var i = new n(2); return i[0] = t, i[1] = e, i }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t }, set: function(t, e, n) { return t[0] = e, t[1] = n, t }, add: function(t, e, n) { return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t }, subtract: function(t, e, n) { return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t } };
                    a.sub = a.subtract, a.multiply = function(t, e, n) { return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t }, a.mul = a.multiply, a.divide = function(t, e, n) { return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t }, a.div = a.divide, a.min = function(t, e, n) { return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t }, a.max = function(t, e, n) { return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t }, a.scale = function(t, e, n) { return t[0] = e[0] * n, t[1] = e[1] * n, t }, a.scaleAndAdd = function(t, e, n, i) { return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t }, a.distance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1]; return Math.sqrt(n * n + i * i) }, a.dist = a.distance, a.squaredDistance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1]; return n * n + i * i }, a.sqrDist = a.squaredDistance, a.length = function(t) { var e = t[0],
                            n = t[1]; return Math.sqrt(e * e + n * n) }, a.len = a.length, a.squaredLength = function(t) { var e = t[0],
                            n = t[1]; return e * e + n * n }, a.sqrLen = a.squaredLength, a.negate = function(t, e) { return t[0] = -e[0], t[1] = -e[1], t }, a.normalize = function(t, e) { var n = e[0],
                            i = e[1],
                            r = n * n + i * i; return r > 0 && (r = 1 / Math.sqrt(r), t[0] = e[0] * r, t[1] = e[1] * r), t }, a.dot = function(t, e) { return t[0] * e[0] + t[1] * e[1] }, a.cross = function(t, e, n) { var i = e[0] * n[1] - e[1] * n[0]; return t[0] = t[1] = 0, t[2] = i, t }, a.lerp = function(t, e, n, i) { var r = e[0],
                            o = e[1]; return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t }, a.random = function(t, e) { e = e || 1; var n = 2 * i() * Math.PI; return t[0] = Math.cos(n) * e, t[1] = Math.sin(n) * e, t }, a.transformMat2 = function(t, e, n) { var i = e[0],
                            r = e[1]; return t[0] = n[0] * i + n[2] * r, t[1] = n[1] * i + n[3] * r, t }, a.transformMat2d = function(t, e, n) { var i = e[0],
                            r = e[1]; return t[0] = n[0] * i + n[2] * r + n[4], t[1] = n[1] * i + n[3] * r + n[5], t }, a.transformMat3 = function(t, e, n) { var i = e[0],
                            r = e[1]; return t[0] = n[0] * i + n[3] * r + n[6], t[1] = n[1] * i + n[4] * r + n[7], t }, a.transformMat4 = function(t, e, n) { var i = e[0],
                            r = e[1]; return t[0] = n[0] * i + n[4] * r + n[12], t[1] = n[1] * i + n[5] * r + n[13], t }, a.forEach = (s = a.create(), function(t, e, n, i, r, o) { var a, c; for (e || (e = 2), n || (n = 0), c = i ? Math.min(i * e + n, t.length) : t.length, a = n; a < c; a += e) s[0] = t[a], s[1] = t[a + 1], r(s, s, o), t[a] = s[0], t[a + 1] = s[1]; return t }), a.str = function(t) { return "vec2(" + t[0] + ", " + t[1] + ")" }, void 0 !== t && (t.vec2 = a); var c = { create: function() { var t = new n(3); return t[0] = 0, t[1] = 0, t[2] = 0, t }, clone: function(t) { var e = new n(3); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e }, fromValues: function(t, e, i) { var r = new n(3); return r[0] = t, r[1] = e, r[2] = i, r }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t }, set: function(t, e, n, i) { return t[0] = e, t[1] = n, t[2] = i, t }, add: function(t, e, n) { return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t }, subtract: function(t, e, n) { return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t } };
                    c.sub = c.subtract, c.multiply = function(t, e, n) { return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t }, c.mul = c.multiply, c.divide = function(t, e, n) { return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t }, c.div = c.divide, c.min = function(t, e, n) { return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t }, c.max = function(t, e, n) { return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t }, c.scale = function(t, e, n) { return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t }, c.scaleAndAdd = function(t, e, n, i) { return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t }, c.distance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1],
                            r = e[2] - t[2]; return Math.sqrt(n * n + i * i + r * r) }, c.dist = c.distance, c.squaredDistance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1],
                            r = e[2] - t[2]; return n * n + i * i + r * r }, c.sqrDist = c.squaredDistance, c.length = function(t) { var e = t[0],
                            n = t[1],
                            i = t[2]; return Math.sqrt(e * e + n * n + i * i) }, c.len = c.length, c.squaredLength = function(t) { var e = t[0],
                            n = t[1],
                            i = t[2]; return e * e + n * n + i * i }, c.sqrLen = c.squaredLength, c.negate = function(t, e) { return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t }, c.normalize = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = n * n + i * i + r * r; return o > 0 && (o = 1 / Math.sqrt(o), t[0] = e[0] * o, t[1] = e[1] * o, t[2] = e[2] * o), t }, c.dot = function(t, e) { return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] }, c.cross = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = n[0],
                            a = n[1],
                            c = n[2]; return t[0] = r * c - o * a, t[1] = o * s - i * c, t[2] = i * a - r * s, t }, c.lerp = function(t, e, n, i) { var r = e[0],
                            o = e[1],
                            s = e[2]; return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t[2] = s + i * (n[2] - s), t }, c.random = function(t, e) { e = e || 1; var n = 2 * i() * Math.PI,
                            r = 2 * i() - 1,
                            o = Math.sqrt(1 - r * r) * e; return t[0] = Math.cos(n) * o, t[1] = Math.sin(n) * o, t[2] = r * e, t }, c.transformMat4 = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2]; return t[0] = n[0] * i + n[4] * r + n[8] * o + n[12], t[1] = n[1] * i + n[5] * r + n[9] * o + n[13], t[2] = n[2] * i + n[6] * r + n[10] * o + n[14], t }, c.transformMat3 = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2]; return t[0] = i * n[0] + r * n[3] + o * n[6], t[1] = i * n[1] + r * n[4] + o * n[7], t[2] = i * n[2] + r * n[5] + o * n[8], t }, c.transformQuat = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = n[0],
                            a = n[1],
                            c = n[2],
                            u = n[3],
                            h = u * i + a * o - c * r,
                            l = u * r + c * i - s * o,
                            p = u * o + s * r - a * i,
                            d = -s * i - a * r - c * o; return t[0] = h * u + d * -s + l * -c - p * -a, t[1] = l * u + d * -a + p * -s - h * -c, t[2] = p * u + d * -c + h * -a - l * -s, t }, c.rotateX = function(t, e, n, i) { var r = [],
                            o = []; return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[0], o[1] = r[1] * Math.cos(i) - r[2] * Math.sin(i), o[2] = r[1] * Math.sin(i) + r[2] * Math.cos(i), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t }, c.rotateY = function(t, e, n, i) { var r = [],
                            o = []; return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[2] * Math.sin(i) + r[0] * Math.cos(i), o[1] = r[1], o[2] = r[2] * Math.cos(i) - r[0] * Math.sin(i), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t }, c.rotateZ = function(t, e, n, i) { var r = [],
                            o = []; return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[0] * Math.cos(i) - r[1] * Math.sin(i), o[1] = r[0] * Math.sin(i) + r[1] * Math.cos(i), o[2] = r[2], t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t }, c.forEach = function() { var t = c.create(); return function(e, n, i, r, o, s) { var a, c; for (n || (n = 3), i || (i = 0), c = r ? Math.min(r * n + i, e.length) : e.length, a = i; a < c; a += n) t[0] = e[a], t[1] = e[a + 1], t[2] = e[a + 2], o(t, t, s), e[a] = t[0], e[a + 1] = t[1], e[a + 2] = t[2]; return e } }(), c.str = function(t) { return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")" }, void 0 !== t && (t.vec3 = c); var u = { create: function() { var t = new n(4); return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t }, clone: function(t) { var e = new n(4); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e }, fromValues: function(t, e, i, r) { var o = new n(4); return o[0] = t, o[1] = e, o[2] = i, o[3] = r, o }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t }, set: function(t, e, n, i, r) { return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t }, add: function(t, e, n) { return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t }, subtract: function(t, e, n) { return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t } };
                    u.sub = u.subtract, u.multiply = function(t, e, n) { return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t }, u.mul = u.multiply, u.divide = function(t, e, n) { return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t }, u.div = u.divide, u.min = function(t, e, n) { return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t }, u.max = function(t, e, n) { return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t }, u.scale = function(t, e, n) { return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t }, u.scaleAndAdd = function(t, e, n, i) { return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t }, u.distance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1],
                            r = e[2] - t[2],
                            o = e[3] - t[3]; return Math.sqrt(n * n + i * i + r * r + o * o) }, u.dist = u.distance, u.squaredDistance = function(t, e) { var n = e[0] - t[0],
                            i = e[1] - t[1],
                            r = e[2] - t[2],
                            o = e[3] - t[3]; return n * n + i * i + r * r + o * o }, u.sqrDist = u.squaredDistance, u.length = function(t) { var e = t[0],
                            n = t[1],
                            i = t[2],
                            r = t[3]; return Math.sqrt(e * e + n * n + i * i + r * r) }, u.len = u.length, u.squaredLength = function(t) { var e = t[0],
                            n = t[1],
                            i = t[2],
                            r = t[3]; return e * e + n * n + i * i + r * r }, u.sqrLen = u.squaredLength, u.negate = function(t, e) { return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t }, u.normalize = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = e[3],
                            s = n * n + i * i + r * r + o * o; return s > 0 && (s = 1 / Math.sqrt(s), t[0] = e[0] * s, t[1] = e[1] * s, t[2] = e[2] * s, t[3] = e[3] * s), t }, u.dot = function(t, e) { return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3] }, u.lerp = function(t, e, n, i) { var r = e[0],
                            o = e[1],
                            s = e[2],
                            a = e[3]; return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t[2] = s + i * (n[2] - s), t[3] = a + i * (n[3] - a), t }, u.random = function(t, e) { return e = e || 1, t[0] = i(), t[1] = i(), t[2] = i(), t[3] = i(), u.normalize(t, t), u.scale(t, t, e), t }, u.transformMat4 = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3]; return t[0] = n[0] * i + n[4] * r + n[8] * o + n[12] * s, t[1] = n[1] * i + n[5] * r + n[9] * o + n[13] * s, t[2] = n[2] * i + n[6] * r + n[10] * o + n[14] * s, t[3] = n[3] * i + n[7] * r + n[11] * o + n[15] * s, t }, u.transformQuat = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = n[0],
                            a = n[1],
                            c = n[2],
                            u = n[3],
                            h = u * i + a * o - c * r,
                            l = u * r + c * i - s * o,
                            p = u * o + s * r - a * i,
                            d = -s * i - a * r - c * o; return t[0] = h * u + d * -s + l * -c - p * -a, t[1] = l * u + d * -a + p * -s - h * -c, t[2] = p * u + d * -c + h * -a - l * -s, t }, u.forEach = function() { var t = u.create(); return function(e, n, i, r, o, s) { var a, c; for (n || (n = 4), i || (i = 0), c = r ? Math.min(r * n + i, e.length) : e.length, a = i; a < c; a += n) t[0] = e[a], t[1] = e[a + 1], t[2] = e[a + 2], t[3] = e[a + 3], o(t, t, s), e[a] = t[0], e[a + 1] = t[1], e[a + 2] = t[2], e[a + 3] = t[3]; return e } }(), u.str = function(t) { return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, void 0 !== t && (t.vec4 = u); var h = { create: function() { var t = new n(4); return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t }, clone: function(t) { var e = new n(4); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t }, identity: function(t) { return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t }, transpose: function(t, e) { if (t === e) { var n = e[1];
                                t[1] = e[2], t[2] = n } else t[0] = e[0], t[1] = e[2], t[2] = e[1], t[3] = e[3]; return t }, invert: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = n * o - r * i; return s ? (t[0] = o * (s = 1 / s), t[1] = -i * s, t[2] = -r * s, t[3] = n * s, t) : null }, adjoint: function(t, e) { var n = e[0]; return t[0] = e[3], t[1] = -e[1], t[2] = -e[2], t[3] = n, t }, determinant: function(t) { return t[0] * t[3] - t[2] * t[1] }, multiply: function(t, e, n) { var i = e[0],
                                r = e[1],
                                o = e[2],
                                s = e[3],
                                a = n[0],
                                c = n[1],
                                u = n[2],
                                h = n[3]; return t[0] = i * a + o * c, t[1] = r * a + s * c, t[2] = i * u + o * h, t[3] = r * u + s * h, t } };
                    h.mul = h.multiply, h.rotate = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = Math.sin(n),
                            c = Math.cos(n); return t[0] = i * c + o * a, t[1] = r * c + s * a, t[2] = i * -a + o * c, t[3] = r * -a + s * c, t }, h.scale = function(t, e, n) { var i = e[1],
                            r = e[2],
                            o = e[3],
                            s = n[0],
                            a = n[1]; return t[0] = e[0] * s, t[1] = i * s, t[2] = r * a, t[3] = o * a, t }, h.str = function(t) { return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, h.frob = function(t) { return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2)) }, h.LDU = function(t, e, n, i) { return t[2] = i[2] / i[0], n[0] = i[0], n[1] = i[1], n[3] = i[3] - t[2] * n[1], [t, e, n] }, void 0 !== t && (t.mat2 = h); var l = { create: function() { var t = new n(6); return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t }, clone: function(t) { var e = new n(6); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t }, identity: function(t) { return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t }, invert: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = e[4],
                                a = e[5],
                                c = n * o - i * r; return c ? (t[0] = o * (c = 1 / c), t[1] = -i * c, t[2] = -r * c, t[3] = n * c, t[4] = (r * a - o * s) * c, t[5] = (i * s - n * a) * c, t) : null }, determinant: function(t) { return t[0] * t[3] - t[1] * t[2] }, multiply: function(t, e, n) { var i = e[0],
                                r = e[1],
                                o = e[2],
                                s = e[3],
                                a = e[4],
                                c = e[5],
                                u = n[0],
                                h = n[1],
                                l = n[2],
                                p = n[3],
                                d = n[4],
                                f = n[5]; return t[0] = i * u + o * h, t[1] = r * u + s * h, t[2] = i * l + o * p, t[3] = r * l + s * p, t[4] = i * d + o * f + a, t[5] = r * d + s * f + c, t } };
                    l.mul = l.multiply, l.rotate = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = e[4],
                            c = e[5],
                            u = Math.sin(n),
                            h = Math.cos(n); return t[0] = i * h + o * u, t[1] = r * h + s * u, t[2] = i * -u + o * h, t[3] = r * -u + s * h, t[4] = a, t[5] = c, t }, l.scale = function(t, e, n) { var i = e[1],
                            r = e[2],
                            o = e[3],
                            s = e[4],
                            a = e[5],
                            c = n[0],
                            u = n[1]; return t[0] = e[0] * c, t[1] = i * c, t[2] = r * u, t[3] = o * u, t[4] = s, t[5] = a, t }, l.translate = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = e[4],
                            c = e[5],
                            u = n[0],
                            h = n[1]; return t[0] = i, t[1] = r, t[2] = o, t[3] = s, t[4] = i * u + o * h + a, t[5] = r * u + s * h + c, t }, l.str = function(t) { return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")" }, l.frob = function(t) { return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1) }, void 0 !== t && (t.mat2d = l); var p = { create: function() { var t = new n(9); return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, fromMat4: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t }, clone: function(t) { var e = new n(9); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t }, identity: function(t) { return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, transpose: function(t, e) { if (t === e) { var n = e[1],
                                    i = e[2],
                                    r = e[5];
                                t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = i, t[7] = r } else t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8]; return t }, invert: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = e[4],
                                a = e[5],
                                c = e[6],
                                u = e[7],
                                h = e[8],
                                l = h * s - a * u,
                                p = -h * o + a * c,
                                d = u * o - s * c,
                                f = n * l + i * p + r * d; return f ? (t[0] = l * (f = 1 / f), t[1] = (-h * i + r * u) * f, t[2] = (a * i - r * s) * f, t[3] = p * f, t[4] = (h * n - r * c) * f, t[5] = (-a * n + r * o) * f, t[6] = d * f, t[7] = (-u * n + i * c) * f, t[8] = (s * n - i * o) * f, t) : null }, adjoint: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = e[4],
                                a = e[5],
                                c = e[6],
                                u = e[7],
                                h = e[8]; return t[0] = s * h - a * u, t[1] = r * u - i * h, t[2] = i * a - r * s, t[3] = a * c - o * h, t[4] = n * h - r * c, t[5] = r * o - n * a, t[6] = o * u - s * c, t[7] = i * c - n * u, t[8] = n * s - i * o, t }, determinant: function(t) { var e = t[3],
                                n = t[4],
                                i = t[5],
                                r = t[6],
                                o = t[7],
                                s = t[8]; return t[0] * (s * n - i * o) + t[1] * (-s * e + i * r) + t[2] * (o * e - n * r) }, multiply: function(t, e, n) { var i = e[0],
                                r = e[1],
                                o = e[2],
                                s = e[3],
                                a = e[4],
                                c = e[5],
                                u = e[6],
                                h = e[7],
                                l = e[8],
                                p = n[0],
                                d = n[1],
                                f = n[2],
                                m = n[3],
                                v = n[4],
                                y = n[5],
                                g = n[6],
                                w = n[7],
                                b = n[8]; return t[0] = p * i + d * s + f * u, t[1] = p * r + d * a + f * h, t[2] = p * o + d * c + f * l, t[3] = m * i + v * s + y * u, t[4] = m * r + v * a + y * h, t[5] = m * o + v * c + y * l, t[6] = g * i + w * s + b * u, t[7] = g * r + w * a + b * h, t[8] = g * o + w * c + b * l, t } };
                    p.mul = p.multiply, p.translate = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = e[4],
                            c = e[5],
                            u = e[6],
                            h = e[7],
                            l = e[8],
                            p = n[0],
                            d = n[1]; return t[0] = i, t[1] = r, t[2] = o, t[3] = s, t[4] = a, t[5] = c, t[6] = p * i + d * s + u, t[7] = p * r + d * a + h, t[8] = p * o + d * c + l, t }, p.rotate = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = e[4],
                            c = e[5],
                            u = e[6],
                            h = e[7],
                            l = e[8],
                            p = Math.sin(n),
                            d = Math.cos(n); return t[0] = d * i + p * s, t[1] = d * r + p * a, t[2] = d * o + p * c, t[3] = d * s - p * i, t[4] = d * a - p * r, t[5] = d * c - p * o, t[6] = u, t[7] = h, t[8] = l, t }, p.scale = function(t, e, n) { var i = n[0],
                            r = n[1]; return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = r * e[3], t[4] = r * e[4], t[5] = r * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t }, p.fromMat2d = function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t }, p.fromQuat = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = e[3],
                            s = n + n,
                            a = i + i,
                            c = r + r,
                            u = n * s,
                            h = i * s,
                            l = i * a,
                            p = r * s,
                            d = r * a,
                            f = r * c,
                            m = o * s,
                            v = o * a,
                            y = o * c; return t[0] = 1 - l - f, t[3] = h - y, t[6] = p + v, t[1] = h + y, t[4] = 1 - u - f, t[7] = d - m, t[2] = p - v, t[5] = d + m, t[8] = 1 - u - l, t }, p.normalFromMat4 = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = e[3],
                            s = e[4],
                            a = e[5],
                            c = e[6],
                            u = e[7],
                            h = e[8],
                            l = e[9],
                            p = e[10],
                            d = e[11],
                            f = e[12],
                            m = e[13],
                            v = e[14],
                            y = e[15],
                            g = n * a - i * s,
                            w = n * c - r * s,
                            b = n * u - o * s,
                            M = i * c - r * a,
                            x = i * u - o * a,
                            E = r * u - o * c,
                            _ = h * m - l * f,
                            S = h * v - p * f,
                            P = h * y - d * f,
                            F = l * v - p * m,
                            A = l * y - d * m,
                            H = p * y - d * v,
                            B = g * H - w * A + b * F + M * P - x * S + E * _; return B ? (t[0] = (a * H - c * A + u * F) * (B = 1 / B), t[1] = (c * P - s * H - u * S) * B, t[2] = (s * A - a * P + u * _) * B, t[3] = (r * A - i * H - o * F) * B, t[4] = (n * H - r * P + o * S) * B, t[5] = (i * P - n * A - o * _) * B, t[6] = (m * E - v * x + y * M) * B, t[7] = (v * b - f * E - y * w) * B, t[8] = (f * x - m * b + y * g) * B, t) : null }, p.str = function(t) { return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")" }, p.frob = function(t) { return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2)) }, void 0 !== t && (t.mat3 = p); var d = { create: function() { var t = new n(16); return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t }, clone: function(t) { var e = new n(16); return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e }, copy: function(t, e) { return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t }, identity: function(t) { return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t }, transpose: function(t, e) { if (t === e) { var n = e[1],
                                    i = e[2],
                                    r = e[3],
                                    o = e[6],
                                    s = e[7],
                                    a = e[11];
                                t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = i, t[9] = o, t[11] = e[14], t[12] = r, t[13] = s, t[14] = a } else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15]; return t }, invert: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = e[4],
                                a = e[5],
                                c = e[6],
                                u = e[7],
                                h = e[8],
                                l = e[9],
                                p = e[10],
                                d = e[11],
                                f = e[12],
                                m = e[13],
                                v = e[14],
                                y = e[15],
                                g = n * a - i * s,
                                w = n * c - r * s,
                                b = n * u - o * s,
                                M = i * c - r * a,
                                x = i * u - o * a,
                                E = r * u - o * c,
                                _ = h * m - l * f,
                                S = h * v - p * f,
                                P = h * y - d * f,
                                F = l * v - p * m,
                                A = l * y - d * m,
                                H = p * y - d * v,
                                B = g * H - w * A + b * F + M * P - x * S + E * _; return B ? (t[0] = (a * H - c * A + u * F) * (B = 1 / B), t[1] = (r * A - i * H - o * F) * B, t[2] = (m * E - v * x + y * M) * B, t[3] = (p * x - l * E - d * M) * B, t[4] = (c * P - s * H - u * S) * B, t[5] = (n * H - r * P + o * S) * B, t[6] = (v * b - f * E - y * w) * B, t[7] = (h * E - p * b + d * w) * B, t[8] = (s * A - a * P + u * _) * B, t[9] = (i * P - n * A - o * _) * B, t[10] = (f * x - m * b + y * g) * B, t[11] = (l * b - h * x - d * g) * B, t[12] = (a * S - s * F - c * _) * B, t[13] = (n * F - i * S + r * _) * B, t[14] = (m * w - f * M - v * g) * B, t[15] = (h * M - l * w + p * g) * B, t) : null }, adjoint: function(t, e) { var n = e[0],
                                i = e[1],
                                r = e[2],
                                o = e[3],
                                s = e[4],
                                a = e[5],
                                c = e[6],
                                u = e[7],
                                h = e[8],
                                l = e[9],
                                p = e[10],
                                d = e[11],
                                f = e[12],
                                m = e[13],
                                v = e[14],
                                y = e[15]; return t[0] = a * (p * y - d * v) - l * (c * y - u * v) + m * (c * d - u * p), t[1] = -(i * (p * y - d * v) - l * (r * y - o * v) + m * (r * d - o * p)), t[2] = i * (c * y - u * v) - a * (r * y - o * v) + m * (r * u - o * c), t[3] = -(i * (c * d - u * p) - a * (r * d - o * p) + l * (r * u - o * c)), t[4] = -(s * (p * y - d * v) - h * (c * y - u * v) + f * (c * d - u * p)), t[5] = n * (p * y - d * v) - h * (r * y - o * v) + f * (r * d - o * p), t[6] = -(n * (c * y - u * v) - s * (r * y - o * v) + f * (r * u - o * c)), t[7] = n * (c * d - u * p) - s * (r * d - o * p) + h * (r * u - o * c), t[8] = s * (l * y - d * m) - h * (a * y - u * m) + f * (a * d - u * l), t[9] = -(n * (l * y - d * m) - h * (i * y - o * m) + f * (i * d - o * l)), t[10] = n * (a * y - u * m) - s * (i * y - o * m) + f * (i * u - o * a), t[11] = -(n * (a * d - u * l) - s * (i * d - o * l) + h * (i * u - o * a)), t[12] = -(s * (l * v - p * m) - h * (a * v - c * m) + f * (a * p - c * l)), t[13] = n * (l * v - p * m) - h * (i * v - r * m) + f * (i * p - r * l), t[14] = -(n * (a * v - c * m) - s * (i * v - r * m) + f * (i * c - r * a)), t[15] = n * (a * p - c * l) - s * (i * p - r * l) + h * (i * c - r * a), t }, determinant: function(t) { var e = t[0],
                                n = t[1],
                                i = t[2],
                                r = t[3],
                                o = t[4],
                                s = t[5],
                                a = t[6],
                                c = t[7],
                                u = t[8],
                                h = t[9],
                                l = t[10],
                                p = t[11],
                                d = t[12],
                                f = t[13],
                                m = t[14],
                                v = t[15]; return (e * s - n * o) * (l * v - p * m) - (e * a - i * o) * (h * v - p * f) + (e * c - r * o) * (h * m - l * f) + (n * a - i * s) * (u * v - p * d) - (n * c - r * s) * (u * m - l * d) + (i * c - r * a) * (u * f - h * d) }, multiply: function(t, e, n) { var i = e[0],
                                r = e[1],
                                o = e[2],
                                s = e[3],
                                a = e[4],
                                c = e[5],
                                u = e[6],
                                h = e[7],
                                l = e[8],
                                p = e[9],
                                d = e[10],
                                f = e[11],
                                m = e[12],
                                v = e[13],
                                y = e[14],
                                g = e[15],
                                w = n[0],
                                b = n[1],
                                M = n[2],
                                x = n[3]; return t[0] = w * i + b * a + M * l + x * m, t[1] = w * r + b * c + M * p + x * v, t[2] = w * o + b * u + M * d + x * y, t[3] = w * s + b * h + M * f + x * g, t[4] = (w = n[4]) * i + (b = n[5]) * a + (M = n[6]) * l + (x = n[7]) * m, t[5] = w * r + b * c + M * p + x * v, t[6] = w * o + b * u + M * d + x * y, t[7] = w * s + b * h + M * f + x * g, t[8] = (w = n[8]) * i + (b = n[9]) * a + (M = n[10]) * l + (x = n[11]) * m, t[9] = w * r + b * c + M * p + x * v, t[10] = w * o + b * u + M * d + x * y, t[11] = w * s + b * h + M * f + x * g, t[12] = (w = n[12]) * i + (b = n[13]) * a + (M = n[14]) * l + (x = n[15]) * m, t[13] = w * r + b * c + M * p + x * v, t[14] = w * o + b * u + M * d + x * y, t[15] = w * s + b * h + M * f + x * g, t } };
                    d.mul = d.multiply, d.translate = function(t, e, n) { var i, r, o, s, a, c, u, h, l, p, d, f, m = n[0],
                            v = n[1],
                            y = n[2]; return e === t ? (t[12] = e[0] * m + e[4] * v + e[8] * y + e[12], t[13] = e[1] * m + e[5] * v + e[9] * y + e[13], t[14] = e[2] * m + e[6] * v + e[10] * y + e[14], t[15] = e[3] * m + e[7] * v + e[11] * y + e[15]) : (r = e[1], o = e[2], s = e[3], a = e[4], c = e[5], u = e[6], h = e[7], l = e[8], p = e[9], d = e[10], f = e[11], t[0] = i = e[0], t[1] = r, t[2] = o, t[3] = s, t[4] = a, t[5] = c, t[6] = u, t[7] = h, t[8] = l, t[9] = p, t[10] = d, t[11] = f, t[12] = i * m + a * v + l * y + e[12], t[13] = r * m + c * v + p * y + e[13], t[14] = o * m + u * v + d * y + e[14], t[15] = s * m + h * v + f * y + e[15]), t }, d.scale = function(t, e, n) { var i = n[0],
                            r = n[1],
                            o = n[2]; return t[0] = e[0] * i, t[1] = e[1] * i, t[2] = e[2] * i, t[3] = e[3] * i, t[4] = e[4] * r, t[5] = e[5] * r, t[6] = e[6] * r, t[7] = e[7] * r, t[8] = e[8] * o, t[9] = e[9] * o, t[10] = e[10] * o, t[11] = e[11] * o, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t }, d.rotate = function(t, n, i, r) { var o, s, a, c, u, h, l, p, d, f, m, v, y, g, w, b, M, x, E, _, S, P, F, A, H = r[0],
                            B = r[1],
                            T = r[2],
                            k = Math.sqrt(H * H + B * B + T * T); return Math.abs(k) < e ? null : (H *= k = 1 / k, B *= k, T *= k, o = Math.sin(i), s = Math.cos(i), u = n[1], h = n[2], l = n[3], d = n[5], f = n[6], m = n[7], y = n[9], g = n[10], w = n[11], E = H * B * (a = 1 - s) - T * o, _ = B * B * a + s, S = T * B * a + H * o, P = H * T * a + B * o, F = B * T * a - H * o, A = T * T * a + s, t[0] = (c = n[0]) * (b = H * H * a + s) + (p = n[4]) * (M = B * H * a + T * o) + (v = n[8]) * (x = T * H * a - B * o), t[1] = u * b + d * M + y * x, t[2] = h * b + f * M + g * x, t[3] = l * b + m * M + w * x, t[4] = c * E + p * _ + v * S, t[5] = u * E + d * _ + y * S, t[6] = h * E + f * _ + g * S, t[7] = l * E + m * _ + w * S, t[8] = c * P + p * F + v * A, t[9] = u * P + d * F + y * A, t[10] = h * P + f * F + g * A, t[11] = l * P + m * F + w * A, n !== t && (t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15]), t) }, d.rotateX = function(t, e, n) { var i = Math.sin(n),
                            r = Math.cos(n),
                            o = e[4],
                            s = e[5],
                            a = e[6],
                            c = e[7],
                            u = e[8],
                            h = e[9],
                            l = e[10],
                            p = e[11]; return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = o * r + u * i, t[5] = s * r + h * i, t[6] = a * r + l * i, t[7] = c * r + p * i, t[8] = u * r - o * i, t[9] = h * r - s * i, t[10] = l * r - a * i, t[11] = p * r - c * i, t }, d.rotateY = function(t, e, n) { var i = Math.sin(n),
                            r = Math.cos(n),
                            o = e[0],
                            s = e[1],
                            a = e[2],
                            c = e[3],
                            u = e[8],
                            h = e[9],
                            l = e[10],
                            p = e[11]; return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * r - u * i, t[1] = s * r - h * i, t[2] = a * r - l * i, t[3] = c * r - p * i, t[8] = o * i + u * r, t[9] = s * i + h * r, t[10] = a * i + l * r, t[11] = c * i + p * r, t }, d.rotateZ = function(t, e, n) { var i = Math.sin(n),
                            r = Math.cos(n),
                            o = e[0],
                            s = e[1],
                            a = e[2],
                            c = e[3],
                            u = e[4],
                            h = e[5],
                            l = e[6],
                            p = e[7]; return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * r + u * i, t[1] = s * r + h * i, t[2] = a * r + l * i, t[3] = c * r + p * i, t[4] = u * r - o * i, t[5] = h * r - s * i, t[6] = l * r - a * i, t[7] = p * r - c * i, t }, d.fromRotationTranslation = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = i + i,
                            c = r + r,
                            u = o + o,
                            h = i * a,
                            l = i * c,
                            p = i * u,
                            d = r * c,
                            f = r * u,
                            m = o * u,
                            v = s * a,
                            y = s * c,
                            g = s * u; return t[0] = 1 - (d + m), t[1] = l + g, t[2] = p - y, t[3] = 0, t[4] = l - g, t[5] = 1 - (h + m), t[6] = f + v, t[7] = 0, t[8] = p + y, t[9] = f - v, t[10] = 1 - (h + d), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t }, d.fromQuat = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = e[3],
                            s = n + n,
                            a = i + i,
                            c = r + r,
                            u = n * s,
                            h = i * s,
                            l = i * a,
                            p = r * s,
                            d = r * a,
                            f = r * c,
                            m = o * s,
                            v = o * a,
                            y = o * c; return t[0] = 1 - l - f, t[1] = h + y, t[2] = p - v, t[3] = 0, t[4] = h - y, t[5] = 1 - u - f, t[6] = d + m, t[7] = 0, t[8] = p + v, t[9] = d - m, t[10] = 1 - u - l, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t }, d.frustum = function(t, e, n, i, r, o, s) { var a = 1 / (n - e),
                            c = 1 / (r - i),
                            u = 1 / (o - s); return t[0] = 2 * o * a, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * o * c, t[6] = 0, t[7] = 0, t[8] = (n + e) * a, t[9] = (r + i) * c, t[10] = (s + o) * u, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = s * o * 2 * u, t[15] = 0, t }, d.perspective = function(t, e, n, i, r) { var o = 1 / Math.tan(e / 2),
                            s = 1 / (i - r); return t[0] = o / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (r + i) * s, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * r * i * s, t[15] = 0, t }, d.ortho = function(t, e, n, i, r, o, s) { var a = 1 / (e - n),
                            c = 1 / (i - r),
                            u = 1 / (o - s); return t[0] = -2 * a, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * c, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * u, t[11] = 0, t[12] = (e + n) * a, t[13] = (r + i) * c, t[14] = (s + o) * u, t[15] = 1, t }, d.lookAt = function(t, n, i, r) { var o, s, a, c, u, h, l, p, f, m, v = n[0],
                            y = n[1],
                            g = n[2],
                            w = r[0],
                            b = r[1],
                            M = r[2],
                            x = i[0],
                            E = i[1],
                            _ = i[2]; return Math.abs(v - x) < e && Math.abs(y - E) < e && Math.abs(g - _) < e ? d.identity(t) : (l = v - x, p = y - E, f = g - _, o = b * (f *= m = 1 / Math.sqrt(l * l + p * p + f * f)) - M * (p *= m), s = M * (l *= m) - w * f, a = w * p - b * l, (m = Math.sqrt(o * o + s * s + a * a)) ? (o *= m = 1 / m, s *= m, a *= m) : (o = 0, s = 0, a = 0), c = p * a - f * s, u = f * o - l * a, h = l * s - p * o, (m = Math.sqrt(c * c + u * u + h * h)) ? (c *= m = 1 / m, u *= m, h *= m) : (c = 0, u = 0, h = 0), t[0] = o, t[1] = c, t[2] = l, t[3] = 0, t[4] = s, t[5] = u, t[6] = p, t[7] = 0, t[8] = a, t[9] = h, t[10] = f, t[11] = 0, t[12] = -(o * v + s * y + a * g), t[13] = -(c * v + u * y + h * g), t[14] = -(l * v + p * y + f * g), t[15] = 1, t) }, d.str = function(t) { return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")" }, d.frob = function(t) { return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2)) }, void 0 !== t && (t.mat4 = d); var f, m, v, y, g = { create: function() { var t = new n(4); return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t } };
                    g.rotationTo = (f = c.create(), m = c.fromValues(1, 0, 0), v = c.fromValues(0, 1, 0), function(t, e, n) { var i = c.dot(e, n); return i < -.999999 ? (c.cross(f, m, e), c.length(f) < 1e-6 && c.cross(f, v, e), c.normalize(f, f), g.setAxisAngle(t, f, Math.PI), t) : i > .999999 ? (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t) : (c.cross(f, e, n), t[0] = f[0], t[1] = f[1], t[2] = f[2], t[3] = 1 + i, g.normalize(t, t)) }), g.setAxes = (y = p.create(), function(t, e, n, i) { return y[0] = n[0], y[3] = n[1], y[6] = n[2], y[1] = i[0], y[4] = i[1], y[7] = i[2], y[2] = -e[0], y[5] = -e[1], y[8] = -e[2], g.normalize(t, g.fromMat3(t, y)) }), g.clone = u.clone, g.fromValues = u.fromValues, g.copy = u.copy, g.set = u.set, g.identity = function(t) { return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t }, g.setAxisAngle = function(t, e, n) { n *= .5; var i = Math.sin(n); return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = Math.cos(n), t }, g.add = u.add, g.multiply = function(t, e, n) { var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = n[0],
                            c = n[1],
                            u = n[2],
                            h = n[3]; return t[0] = i * h + s * a + r * u - o * c, t[1] = r * h + s * c + o * a - i * u, t[2] = o * h + s * u + i * c - r * a, t[3] = s * h - i * a - r * c - o * u, t }, g.mul = g.multiply, g.scale = u.scale, g.rotateX = function(t, e, n) { n *= .5; var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = Math.sin(n),
                            c = Math.cos(n); return t[0] = i * c + s * a, t[1] = r * c + o * a, t[2] = o * c - r * a, t[3] = s * c - i * a, t }, g.rotateY = function(t, e, n) { n *= .5; var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = Math.sin(n),
                            c = Math.cos(n); return t[0] = i * c - o * a, t[1] = r * c + s * a, t[2] = o * c + i * a, t[3] = s * c - r * a, t }, g.rotateZ = function(t, e, n) { n *= .5; var i = e[0],
                            r = e[1],
                            o = e[2],
                            s = e[3],
                            a = Math.sin(n),
                            c = Math.cos(n); return t[0] = i * c + r * a, t[1] = r * c - i * a, t[2] = o * c + s * a, t[3] = s * c - o * a, t }, g.calculateW = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2]; return t[0] = n, t[1] = i, t[2] = r, t[3] = -Math.sqrt(Math.abs(1 - n * n - i * i - r * r)), t }, g.dot = u.dot, g.lerp = u.lerp, g.slerp = function(t, e, n, i) { var r, o, s, a, c, u = e[0],
                            h = e[1],
                            l = e[2],
                            p = e[3],
                            d = n[0],
                            f = n[1],
                            m = n[2],
                            v = n[3]; return (o = u * d + h * f + l * m + p * v) < 0 && (o = -o, d = -d, f = -f, m = -m, v = -v), 1 - o > 1e-6 ? (r = Math.acos(o), s = Math.sin(r), a = Math.sin((1 - i) * r) / s, c = Math.sin(i * r) / s) : (a = 1 - i, c = i), t[0] = a * u + c * d, t[1] = a * h + c * f, t[2] = a * l + c * m, t[3] = a * p + c * v, t }, g.invert = function(t, e) { var n = e[0],
                            i = e[1],
                            r = e[2],
                            o = e[3],
                            s = n * n + i * i + r * r + o * o,
                            a = s ? 1 / s : 0; return t[0] = -n * a, t[1] = -i * a, t[2] = -r * a, t[3] = o * a, t }, g.conjugate = function(t, e) { return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t }, g.length = u.length, g.len = g.length, g.squaredLength = u.squaredLength, g.sqrLen = g.squaredLength, g.normalize = u.normalize, g.fromMat3 = function(t, e) { var n, i = e[0] + e[4] + e[8]; if (i > 0) n = Math.sqrt(i + 1), t[3] = .5 * n, t[0] = (e[7] - e[5]) * (n = .5 / n), t[1] = (e[2] - e[6]) * n, t[2] = (e[3] - e[1]) * n;
                        else { var r = 0;
                            e[4] > e[0] && (r = 1), e[8] > e[3 * r + r] && (r = 2); var o = (r + 1) % 3,
                                s = (r + 2) % 3;
                            n = Math.sqrt(e[3 * r + r] - e[3 * o + o] - e[3 * s + s] + 1), t[r] = .5 * n, t[3] = (e[3 * s + o] - e[3 * o + s]) * (n = .5 / n), t[o] = (e[3 * o + r] + e[3 * r + o]) * n, t[s] = (e[3 * s + r] + e[3 * r + s]) * n } return t }, g.str = function(t) { return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, void 0 !== t && (t.quat = g) }(r.exports) }, {}], 24: [function(t, e, n) {
            (function() { var t = this,
                    i = t._,
                    r = {},
                    o = Array.prototype,
                    s = Object.prototype,
                    a = Function.prototype,
                    c = o.push,
                    u = o.slice,
                    h = o.concat,
                    l = s.toString,
                    p = s.hasOwnProperty,
                    d = o.forEach,
                    f = o.map,
                    m = o.reduce,
                    v = o.reduceRight,
                    y = o.filter,
                    g = o.every,
                    w = o.some,
                    b = o.indexOf,
                    M = o.lastIndexOf,
                    x = Array.isArray,
                    E = Object.keys,
                    _ = a.bind,
                    S = function(t) { return t instanceof S ? t : this instanceof S ? void(this._wrapped = t) : new S(t) };
                void 0 !== n ? (void 0 !== e && e.exports && (n = e.exports = S), n._ = S) : t._ = S, S.VERSION = "1.4.4"; var P = S.each = S.forEach = function(t, e, n) { if (null != t)
                        if (d && t.forEach === d) t.forEach(e, n);
                        else if (t.length === +t.length) { for (var i = 0, o = t.length; i < o; i++)
                            if (e.call(n, t[i], i, t) === r) return } else
                        for (var s in t)
                            if (S.has(t, s) && e.call(n, t[s], s, t) === r) return };
                S.map = S.collect = function(t, e, n) { var i = []; return null == t ? i : f && t.map === f ? t.map(e, n) : (P(t, function(t, r, o) { i[i.length] = e.call(n, t, r, o) }), i) }; var F = "Reduce of empty array with no initial value";
                S.reduce = S.foldl = S.inject = function(t, e, n, i) { var r = arguments.length > 2; if (null == t && (t = []), m && t.reduce === m) return i && (e = S.bind(e, i)), r ? t.reduce(e, n) : t.reduce(e); if (P(t, function(t, o, s) { r ? n = e.call(i, n, t, o, s) : (n = t, r = !0) }), !r) throw new TypeError(F); return n }, S.reduceRight = S.foldr = function(t, e, n, i) { var r = arguments.length > 2; if (null == t && (t = []), v && t.reduceRight === v) return i && (e = S.bind(e, i)), r ? t.reduceRight(e, n) : t.reduceRight(e); var o = t.length; if (o !== +o) { var s = S.keys(t);
                        o = s.length } if (P(t, function(a, c, u) { c = s ? s[--o] : --o, r ? n = e.call(i, n, t[c], c, u) : (n = t[c], r = !0) }), !r) throw new TypeError(F); return n }, S.find = S.detect = function(t, e, n) { var i; return A(t, function(t, r, o) { if (e.call(n, t, r, o)) return i = t, !0 }), i }, S.filter = S.select = function(t, e, n) { var i = []; return null == t ? i : y && t.filter === y ? t.filter(e, n) : (P(t, function(t, r, o) { e.call(n, t, r, o) && (i[i.length] = t) }), i) }, S.reject = function(t, e, n) { return S.filter(t, function(t, i, r) { return !e.call(n, t, i, r) }, n) }, S.every = S.all = function(t, e, n) { e || (e = S.identity); var i = !0; return null == t ? i : g && t.every === g ? t.every(e, n) : (P(t, function(t, o, s) { if (!(i = i && e.call(n, t, o, s))) return r }), !!i) }; var A = S.some = S.any = function(t, e, n) { e || (e = S.identity); var i = !1; return null == t ? i : w && t.some === w ? t.some(e, n) : (P(t, function(t, o, s) { if (i || (i = e.call(n, t, o, s))) return r }), !!i) };
                S.contains = S.include = function(t, e) { return null != t && (b && t.indexOf === b ? -1 != t.indexOf(e) : A(t, function(t) { return t === e })) }, S.invoke = function(t, e) { var n = u.call(arguments, 2),
                        i = S.isFunction(e); return S.map(t, function(t) { return (i ? e : t[e]).apply(t, n) }) }, S.pluck = function(t, e) { return S.map(t, function(t) { return t[e] }) }, S.where = function(t, e, n) { return S.isEmpty(e) ? n ? null : [] : S[n ? "find" : "filter"](t, function(t) { for (var n in e)
                            if (e[n] !== t[n]) return !1;
                        return !0 }) }, S.findWhere = function(t, e) { return S.where(t, e, !0) }, S.max = function(t, e, n) { if (!e && S.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.max.apply(Math, t); if (!e && S.isEmpty(t)) return -Infinity; var i = { computed: -Infinity, value: -Infinity }; return P(t, function(t, r, o) { var s = e ? e.call(n, t, r, o) : t;
                        s >= i.computed && (i = { value: t, computed: s }) }), i.value }, S.min = function(t, e, n) { if (!e && S.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.min.apply(Math, t); if (!e && S.isEmpty(t)) return Infinity; var i = { computed: Infinity, value: Infinity }; return P(t, function(t, r, o) { var s = e ? e.call(n, t, r, o) : t;
                        s < i.computed && (i = { value: t, computed: s }) }), i.value }, S.shuffle = function(t) { var e, n = 0,
                        i = []; return P(t, function(t) { e = S.random(n++), i[n - 1] = i[e], i[e] = t }), i }; var H = function(t) { return S.isFunction(t) ? t : function(e) { return e[t] } };
                S.sortBy = function(t, e, n) { var i = H(e); return S.pluck(S.map(t, function(t, e, r) { return { value: t, index: e, criteria: i.call(n, t, e, r) } }).sort(function(t, e) { var n = t.criteria,
                            i = e.criteria; if (n !== i) { if (n > i || void 0 === n) return 1; if (n < i || void 0 === i) return -1 } return t.index < e.index ? -1 : 1 }), "value") }; var B = function(t, e, n, i) { var r = {},
                        o = H(e || S.identity); return P(t, function(e, s) { var a = o.call(n, e, s, t);
                        i(r, a, e) }), r };
                S.groupBy = function(t, e, n) { return B(t, e, n, function(t, e, n) {
                        (S.has(t, e) ? t[e] : t[e] = []).push(n) }) }, S.countBy = function(t, e, n) { return B(t, e, n, function(t, e) { S.has(t, e) || (t[e] = 0), t[e]++ }) }, S.sortedIndex = function(t, e, n, i) { for (var r = (n = null == n ? S.identity : H(n)).call(i, e), o = 0, s = t.length; o < s;) { var a = o + s >>> 1;
                        n.call(i, t[a]) < r ? o = a + 1 : s = a } return o }, S.toArray = function(t) { return t ? S.isArray(t) ? u.call(t) : t.length === +t.length ? S.map(t, S.identity) : S.values(t) : [] }, S.size = function(t) { return null == t ? 0 : t.length === +t.length ? t.length : S.keys(t).length }, S.first = S.head = S.take = function(t, e, n) { if (null != t) return null == e || n ? t[0] : u.call(t, 0, e) }, S.initial = function(t, e, n) { return u.call(t, 0, t.length - (null == e || n ? 1 : e)) }, S.last = function(t, e, n) { if (null != t) return null == e || n ? t[t.length - 1] : u.call(t, Math.max(t.length - e, 0)) }, S.rest = S.tail = S.drop = function(t, e, n) { return u.call(t, null == e || n ? 1 : e) }, S.compact = function(t) { return S.filter(t, S.identity) }; var T = function(t, e, n) { return P(t, function(t) { S.isArray(t) ? e ? c.apply(n, t) : T(t, e, n) : n.push(t) }), n };
                S.flatten = function(t, e) { return T(t, e, []) }, S.without = function(t) { return S.difference(t, u.call(arguments, 1)) }, S.uniq = S.unique = function(t, e, n, i) { S.isFunction(e) && (i = n, n = e, e = !1); var r = n ? S.map(t, n, i) : t,
                        o = [],
                        s = []; return P(r, function(n, i) {
                        (e ? i && s[s.length - 1] === n : S.contains(s, n)) || (s.push(n), o.push(t[i])) }), o }, S.union = function() { return S.uniq(h.apply(o, arguments)) }, S.intersection = function(t) { var e = u.call(arguments, 1); return S.filter(S.uniq(t), function(t) { return S.every(e, function(e) { return S.indexOf(e, t) >= 0 }) }) }, S.difference = function(t) { var e = h.apply(o, u.call(arguments, 1)); return S.filter(t, function(t) { return !S.contains(e, t) }) }, S.zip = function() { for (var t = u.call(arguments), e = S.max(S.pluck(t, "length")), n = new Array(e), i = 0; i < e; i++) n[i] = S.pluck(t, "" + i); return n }, S.object = function(t, e) { if (null == t) return {}; for (var n = {}, i = 0, r = t.length; i < r; i++) e ? n[t[i]] = e[i] : n[t[i][0]] = t[i][1]; return n }, S.indexOf = function(t, e, n) { if (null == t) return -1; var i = 0,
                        r = t.length; if (n) { if ("number" != typeof n) return t[i = S.sortedIndex(t, e)] === e ? i : -1;
                        i = n < 0 ? Math.max(0, r + n) : n } if (b && t.indexOf === b) return t.indexOf(e, n); for (; i < r; i++)
                        if (t[i] === e) return i;
                    return -1 }, S.lastIndexOf = function(t, e, n) { if (null == t) return -1; var i = null != n; if (M && t.lastIndexOf === M) return i ? t.lastIndexOf(e, n) : t.lastIndexOf(e); for (var r = i ? n : t.length; r--;)
                        if (t[r] === e) return r;
                    return -1 }, S.range = function(t, e, n) { arguments.length <= 1 && (e = t || 0, t = 0), n = arguments[2] || 1; for (var i = Math.max(Math.ceil((e - t) / n), 0), r = 0, o = new Array(i); r < i;) o[r++] = t, t += n; return o }, S.bind = function(t, e) { if (t.bind === _ && _) return _.apply(t, u.call(arguments, 1)); var n = u.call(arguments, 2); return function() { return t.apply(e, n.concat(u.call(arguments))) } }, S.partial = function(t) { var e = u.call(arguments, 1); return function() { return t.apply(this, e.concat(u.call(arguments))) } }, S.bindAll = function(t) { var e = u.call(arguments, 1); return 0 === e.length && (e = S.functions(t)), P(e, function(e) { t[e] = S.bind(t[e], t) }), t }, S.memoize = function(t, e) { var n = {}; return e || (e = S.identity),
                        function() { var i = e.apply(this, arguments); return S.has(n, i) ? n[i] : n[i] = t.apply(this, arguments) } }, S.delay = function(t, e) { var n = u.call(arguments, 2); return setTimeout(function() { return t.apply(null, n) }, e) }, S.defer = function(t) { return S.delay.apply(S, [t, 1].concat(u.call(arguments, 1))) }, S.throttle = function(t, e) { var n, i, r, o, s = 0,
                        a = function() { s = new Date, r = null, o = t.apply(n, i) }; return function() { var c = new Date,
                            u = e - (c - s); return n = this, i = arguments, u <= 0 ? (clearTimeout(r), r = null, s = c, o = t.apply(n, i)) : r || (r = setTimeout(a, u)), o } }, S.debounce = function(t, e, n) { var i, r; return function() { var o = this,
                            s = arguments,
                            a = n && !i; return clearTimeout(i), i = setTimeout(function() { i = null, n || (r = t.apply(o, s)) }, e), a && (r = t.apply(o, s)), r } }, S.once = function(t) { var e, n = !1; return function() { return n ? e : (n = !0, e = t.apply(this, arguments), t = null, e) } }, S.wrap = function(t, e) { return function() { var n = [t]; return c.apply(n, arguments), e.apply(this, n) } }, S.compose = function() { var t = arguments; return function() { for (var e = arguments, n = t.length - 1; n >= 0; n--) e = [t[n].apply(this, e)]; return e[0] } }, S.after = function(t, e) { return t <= 0 ? e() : function() { if (--t < 1) return e.apply(this, arguments) } }, S.keys = E || function(t) { if (t !== Object(t)) throw new TypeError("Invalid object"); var e = []; for (var n in t) S.has(t, n) && (e[e.length] = n); return e }, S.values = function(t) { var e = []; for (var n in t) S.has(t, n) && e.push(t[n]); return e }, S.pairs = function(t) { var e = []; for (var n in t) S.has(t, n) && e.push([n, t[n]]); return e }, S.invert = function(t) { var e = {}; for (var n in t) S.has(t, n) && (e[t[n]] = n); return e }, S.functions = S.methods = function(t) { var e = []; for (var n in t) S.isFunction(t[n]) && e.push(n); return e.sort() }, S.extend = function(t) { return P(u.call(arguments, 1), function(e) { if (e)
                            for (var n in e) t[n] = e[n] }), t }, S.pick = function(t) { var e = {},
                        n = h.apply(o, u.call(arguments, 1)); return P(n, function(n) { n in t && (e[n] = t[n]) }), e }, S.omit = function(t) { var e = {},
                        n = h.apply(o, u.call(arguments, 1)); for (var i in t) S.contains(n, i) || (e[i] = t[i]); return e }, S.defaults = function(t) { return P(u.call(arguments, 1), function(e) { if (e)
                            for (var n in e) null == t[n] && (t[n] = e[n]) }), t }, S.clone = function(t) { return S.isObject(t) ? S.isArray(t) ? t.slice() : S.extend({}, t) : t }, S.tap = function(t, e) { return e(t), t }; var k = function(t, e, n, i) { if (t === e) return 0 !== t || 1 / t == 1 / e; if (null == t || null == e) return t === e;
                    t instanceof S && (t = t._wrapped), e instanceof S && (e = e._wrapped); var r = l.call(t); if (r != l.call(e)) return !1; switch (r) {
                        case "[object String]":
                            return t == String(e);
                        case "[object Number]":
                            return t != +t ? e != +e : 0 == t ? 1 / t == 1 / e : t == +e;
                        case "[object Date]":
                        case "[object Boolean]":
                            return +t == +e;
                        case "[object RegExp]":
                            return t.source == e.source && t.global == e.global && t.multiline == e.multiline && t.ignoreCase == e.ignoreCase } if ("object" != typeof t || "object" != typeof e) return !1; for (var o = n.length; o--;)
                        if (n[o] == t) return i[o] == e;
                    n.push(t), i.push(e); var s = 0,
                        a = !0; if ("[object Array]" == r) { if (a = (s = t.length) == e.length)
                            for (; s-- && (a = k(t[s], e[s], n, i));); } else { var c = t.constructor,
                            u = e.constructor; if (c !== u && !(S.isFunction(c) && c instanceof c && S.isFunction(u) && u instanceof u)) return !1; for (var h in t)
                            if (S.has(t, h) && (s++, !(a = S.has(e, h) && k(t[h], e[h], n, i)))) break;
                        if (a) { for (h in e)
                                if (S.has(e, h) && !s--) break;
                            a = !s } } return n.pop(), i.pop(), a };
                S.isEqual = function(t, e) { return k(t, e, [], []) }, S.isEmpty = function(t) { if (null == t) return !0; if (S.isArray(t) || S.isString(t)) return 0 === t.length; for (var e in t)
                        if (S.has(t, e)) return !1;
                    return !0 }, S.isElement = function(t) { return !(!t || 1 !== t.nodeType) }, S.isArray = x || function(t) { return "[object Array]" == l.call(t) }, S.isObject = function(t) { return t === Object(t) }, P(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(t) { S["is" + t] = function(e) { return l.call(e) == "[object " + t + "]" } }), S.isArguments(arguments) || (S.isArguments = function(t) { return !(!t || !S.has(t, "callee")) }), S.isFunction = function(t) { return "function" == typeof t }, S.isFinite = function(t) { return isFinite(t) && !isNaN(parseFloat(t)) }, S.isNaN = function(t) { return S.isNumber(t) && t != +t }, S.isBoolean = function(t) { return !0 === t || !1 === t || "[object Boolean]" == l.call(t) }, S.isNull = function(t) { return null === t }, S.isUndefined = function(t) { return void 0 === t }, S.has = function(t, e) { return p.call(t, e) }, S.noConflict = function() { return t._ = i, this }, S.identity = function(t) { return t }, S.times = function(t, e, n) { for (var i = Array(t), r = 0; r < t; r++) i[r] = e.call(n, r); return i }, S.random = function(t, e) { return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1)) }; var j = { escape: { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;" } };
                j.unescape = S.invert(j.escape); var R = { escape: new RegExp("[" + S.keys(j.escape).join("") + "]", "g"), unescape: new RegExp("(" + S.keys(j.unescape).join("|") + ")", "g") };
                S.each(["escape", "unescape"], function(t) { S[t] = function(e) { return null == e ? "" : ("" + e).replace(R[t], function(e) { return j[t][e] }) } }), S.result = function(t, e) { if (null == t) return null; var n = t[e]; return S.isFunction(n) ? n.call(t) : n }, S.mixin = function(t) { P(S.functions(t), function(e) { var n = S[e] = t[e];
                        S.prototype[e] = function() { var t = [this._wrapped]; return c.apply(t, arguments), L.call(this, n.apply(S, t)) } }) }; var D = 0;
                S.uniqueId = function(t) { var e = ++D + ""; return t ? t + e : e }, S.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var z = /(.)^/,
                    q = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\t": "t", "\u2028": "u2028", "\u2029": "u2029" },
                    I = /\\|'|\r|\n|\t|\u2028|\u2029/g;
                S.template = function(t, e, n) { var i;
                    n = S.defaults({}, n, S.templateSettings); var r = new RegExp([(n.escape || z).source, (n.interpolate || z).source, (n.evaluate || z).source].join("|") + "|$", "g"),
                        o = 0,
                        s = "__p+='";
                    t.replace(r, function(e, n, i, r, a) { return s += t.slice(o, a).replace(I, function(t) { return "\\" + q[t] }), n && (s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), i && (s += "'+\n((__t=(" + i + "))==null?'':__t)+\n'"), r && (s += "';\n" + r + "\n__p+='"), o = a + e.length, e }), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n"; try { i = new Function(n.variable || "obj", "_", s) } catch (t) { throw t.source = s, t } if (e) return i(e, S); var a = function(t) { return i.call(this, t, S) }; return a.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", a }, S.chain = function(t) { return S(t).chain() }; var L = function(t) { return this._chain ? S(t).chain() : t };
                S.mixin(S), P(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) { var e = o[t];
                    S.prototype[t] = function() { var n = this._wrapped; return e.apply(n, arguments), "shift" != t && "splice" != t || 0 !== n.length || delete n[0], L.call(this, n) } }), P(["concat", "join", "slice"], function(t) { var e = o[t];
                    S.prototype[t] = function() { return L.call(this, e.apply(this._wrapped, arguments)) } }), S.extend(S.prototype, { chain: function() { return this._chain = !0, this }, value: function() { return this._wrapped } }) }).call(this) }, {}], 25: [function(t, e, n) { "undefined" != typeof window && "function" != typeof window.requestAnimationFrame && (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) { setTimeout(t, 1e3 / 60) }), Leap = t("../lib/index") }, { "../lib/index": 11 }] }, {}, [25]); var e = new THREE.Vector3,
        n = new THREE.Quaternion;
    Leap.Controller.plugin("transform", function(t) { var e, n, i, r, o, s; return t || (t = {}), e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], s = new THREE.Matrix4, !0 === t.vr && (this.setOptimizeHMD(!0), t.quaternion = (new THREE.Quaternion).setFromRotationMatrix((new THREE.Matrix4).set(-1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1)), t.scale = .001, t.position = new THREE.Vector3(0, 0, -.08)), "desktop" === t.vr && (t.scale = .001), t.getTransform = function(n) { var i; return t.matrix ? (i = "function" == typeof t.matrix ? t.matrix(n) : t.matrix, window.THREE && i instanceof THREE.Matrix4 ? i.elements : i) : t.position || t.quaternion || t.scale ? (s.set.apply(s, e), t.quaternion && s.makeRotationFromQuaternion("function" == typeof t.quaternion ? t.quaternion(n) : t.quaternion), t.position && s.setPosition("function" == typeof t.position ? t.position(n) : t.position), s.elements) : e }, t.getScale = function(e) { return isNaN(t.scale) || (t.scale = new THREE.Vector3(t.scale, t.scale, t.scale)), "function" == typeof t.scale ? t.scale(e) : t.scale }, r = function(t, e) { var n, i, r, o; for (o = [], i = 0, r = e.length; i < r; i++) o.push((n = e[i]) ? Leap.vec3.transformMat4(n, n, t) : void 0); return o }, i = function(t, e, n) { var i, r, o; return t[0] = n[0] * (i = e[0]) + n[4] * (r = e[1]) + n[8] * (o = e[2]), t[1] = n[1] * i + n[5] * r + n[9] * o, t[2] = n[2] * i + n[6] * r + n[10] * o, t }, n = function(t, e) { var n, r, o, s; for (s = [], r = 0, o = e.length; r < o; r++) s.push((n = e[r]) ? i(n, n, t) : void 0); return s }, o = function(t, e, i) { var o, s, a, c, u, h, l; for (n(e, [t.direction, t.palmNormal, t.palmVelocity, t.arm.basis[0], t.arm.basis[1], t.arm.basis[2]]), s = 0, c = (h = t.fingers).length; s < c; s++) n(e, [(o = h[s]).direction, o.metacarpal.basis[0], o.metacarpal.basis[1], o.metacarpal.basis[2], o.proximal.basis[0], o.proximal.basis[1], o.proximal.basis[2], o.medial.basis[0], o.medial.basis[1], o.medial.basis[2], o.distal.basis[0], o.distal.basis[1], o.distal.basis[2]]); for (Leap.glMatrix.mat4.scale(e, e, i), r(e, [t.palmPosition, t.stabilizedPalmPosition, t.sphereCenter, t.arm.nextJoint, t.arm.prevJoint]), a = 0, u = (l = t.fingers).length; a < u; a++) r(e, [(o = l[a]).carpPosition, o.mcpPosition, o.pipPosition, o.dipPosition, o.distal.nextJoint, o.tipPosition]); return t.arm.width *= (i[0] + i[1] + i[2]) / 3 }, { frame: function(e) { var n, i, r, s, a, c, u, h, l, p; if (e.valid && !e.data.transformed) { for (e.data.transformed = !0, p = [], s = 0, c = (h = e.hands).length; s < c; s++) { for (o(i = h[s], t.getTransform(i), (t.getScale(i) || new THREE.Vector3(1, 1, 1)).toArray()), t.effectiveParent && o(i, t.effectiveParent.matrixWorld.elements, t.effectiveParent.scale.toArray()), r = null, a = 0, u = (l = i.fingers).length; a < u; a++) n = l[a], r = Leap.vec3.create(), Leap.vec3.sub(r, n.mcpPosition, n.carpPosition), n.metacarpal.length = Leap.vec3.length(r), Leap.vec3.sub(r, n.pipPosition, n.mcpPosition), n.proximal.length = Leap.vec3.length(r), Leap.vec3.sub(r, n.dipPosition, n.pipPosition), n.medial.length = Leap.vec3.length(r), Leap.vec3.sub(r, n.tipPosition, n.dipPosition), n.distal.length = Leap.vec3.length(r);
                        Leap.vec3.sub(r, i.arm.prevJoint, i.arm.nextJoint), p.push(i.arm.length = Leap.vec3.length(r)) } return p } } } }); var i, r = AFRAME.registerSystem("leap", { schema: { vr: { default: !0 }, scale: { default: .001 }, position: { type: "vec3", default: { x: e.x, y: e.y, z: e.z } }, quaternion: { type: "vec4", default: { x: n.x, y: n.y, z: n.z, w: n.w } } }, init: function() { this.controller = Leap.loop().use("transform", this.data) }, getFrame: function() { return this.controller.frame() } }),
        o = { showArm: !0, opacity: 1, segments: 16, boneScale: 1 / 6, boneColor: 16777215, jointScale: .2, jointColor: null },
        s = [6138368, 10485825],
        a = (new THREE.Quaternion).setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
        c = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)),
        u = 0;

    function h(t) { this.options = t = Object.assign({}, o, t || {}), this.options.jointColor = this.options.jointColor || s[u % 2], this.object3D = new THREE.Object3D, this.material = isNaN(t.opacity) ? new THREE.MeshPhongMaterial({ fog: !1 }) : new THREE.MeshPhongMaterial({ fog: !1, transparent: !0, opacity: t.opacity }), this.createFingers(), this.createArm(), u++ }

    function l(t, e) { this.el = t, this.handComponent = e, this.system = this.el.sceneEl.systems.leap, this.physics = this.el.sceneEl.systems.physics, this.physics.addComponent(this), this.palmBody = null, this.fingerBodies = {} }

    function p() { this.arrowHelper = this.createArrowHelper(), this.raycaster = new THREE.Raycaster(new THREE.Vector3, new THREE.Vector3, 0, .2) }

    function d(t) { this._index = 0, this._size = t, this._array = [] }
    h.prototype.createFingers = function() { var t, e, n, i = this.options,
            r = 40 * i.boneScale,
            o = 40 * i.jointScale;
        this.fingerMeshes = []; for (var s = 0; s < 5; s++) { e = [], n = 0 === s ? 3 : 4; for (var a = 0; a < n; a++)(t = new THREE.Mesh(new THREE.SphereGeometry(o, i.segments, i.segments), this.material.clone())).name = "hand-bone-" + a, t.material.color.setHex(i.jointColor), this.object3D.add(t), e.push(t), (t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 40, i.segments), this.material.clone())).name = "hand-joint-" + a, t.material.color.setHex(i.boneColor), this.object3D.add(t), e.push(t);
            (t = new THREE.Mesh(new THREE.SphereGeometry(o, i.segments, i.segments), this.material.clone())).material.color.setHex(i.jointColor), this.object3D.add(t), e.push(t), this.fingerMeshes.push(e) } return this }, h.prototype.createArm = function() { if (this.options.showArm) { var t = this.options,
                e = 40 * t.boneScale,
                n = 40 * t.jointScale;
            this.armMesh = new THREE.Object3D, this.armBones = [], this.armSpheres = []; for (var i = 0; i <= 3; i++) this.armBones.push(new THREE.Mesh(new THREE.CylinderGeometry(e, e, i < 2 ? 1e3 : 100, t.segments), this.material.clone())), this.armBones[i].material.color.setHex(t.boneColor), this.armBones[i].castShadow = !0, this.armBones[i].name = "ArmBone" + i, i > 1 && this.armBones[i].quaternion.multiply(c), this.armMesh.add(this.armBones[i]); for (this.armSpheres = [], i = 0; i <= 3; i++) this.armSpheres.push(new THREE.Mesh(new THREE.SphereGeometry(n, t.segments, t.segments), this.material.clone())), this.armSpheres[i].material.color.setHex(t.jointColor), this.armSpheres[i].castShadow = !0, this.armSpheres[i].name = "ArmSphere" + i, this.armMesh.add(this.armSpheres[i]); return this.object3D.add(this.armMesh), this } }, h.prototype.traverse = function(t) { for (var e, n = 0; n < 5; n++)
            for (var i = 0, r = (e = this.fingerMeshes[n]).length; i < r; i++) t(e[i]); return this.armMesh && this.armMesh.traverse(t), this }, h.prototype.scaleTo = function(t) { var e, n, i, r, o, s, a, c, u, h, l, p; for (i = t.middleFinger.proximal.length / this.fingerMeshes[2][1].geometry.parameters.height, c = l = 0; l < 5; c = ++l)
            for (s = t.fingers[c], u = 0;;) { if (u === this.fingerMeshes[c].length - 1) {
                    (h = this.fingerMeshes[c][u]).scale.set(i, i, i); break }
                r = s.bones[3 - u / 2], (h = this.fingerMeshes[c][u]).scale.set(i, i, i), (h = this.fingerMeshes[c][++u]).scale.set(i, r.length / h.geometry.parameters.height, i), u++ }
        if (this.options.showArm) { for (e = t.arm.length / (this.armBones[0].geometry.parameters.height + this.armBones[0].geometry.parameters.radiusTop), n = t.arm.width / (this.armBones[2].geometry.parameters.height + this.armBones[2].geometry.parameters.radiusTop), c = p = 0; p <= 3; c = ++p) this.armBones[c].scale.set(i, c < 2 ? e : n, i), this.armSpheres[c].scale.set(i, i, i);
            a = t.arm.length / 2, this.armBones[0].position.setX(o = t.arm.width / 2 * .85), this.armBones[1].position.setX(-o), this.armBones[2].position.setY(a), this.armBones[3].position.setY(-a), this.armSpheres[0].position.set(-o, a, 0), this.armSpheres[1].position.set(o, a, 0), this.armSpheres[2].position.set(o, -a, 0), this.armSpheres[3].position.set(-o, -a, 0) } return this }, h.prototype.formTo = function(t) { var e, n, i, r, o, s; for (i = s = 0; s < 5; i = ++s)
            for (n = t.fingers[i], r = 0;;) { if (r === this.fingerMeshes[i].length - 1) {
                    (o = this.fingerMeshes[i][r]).position.fromArray(e.prevJoint); break }(o = this.fingerMeshes[i][r]).position.fromArray((e = n.bones[3 - r / 2]).nextJoint), (o = this.fingerMeshes[i][++r]).position.fromArray(e.center()), o.setRotationFromMatrix((new THREE.Matrix4).fromArray(e.matrix())), o.quaternion.multiply(a), ++r }
        return this.armMesh && (this.armMesh.position.fromArray(t.arm.center()), this.armMesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(t.arm.matrix())), this.armMesh.quaternion.multiply(a)), this }, h.prototype.setVisibility = function(t) { for (var e, n = 0; n < 5; n++)
            for (e = 0; this.fingerMeshes[n][e].visible = t, ++e !== this.fingerMeshes[n].length;); if (this.options.showArm)
            for (var i = 0; i <= 3; i++) this.armBones[i].visible = t, this.armSpheres[i].visible = t; return this }, h.prototype.show = function() { return this.setVisibility(!0), this }, h.prototype.hide = function() { return this.setVisibility(!1), this }, h.prototype.getMesh = function() { return this.object3D }, l.prototype.remove = function() { for (var t in this.system.removeComponent(this), this.fingerBodies) this.fingerBodies.hasOwnProperty(t) && this.physics.removeBody(this.fingerBodies[t]) }, l.prototype.beforeStep = function() { var t, e, n = this.handComponent.getHand(); if (n && n.valid) { this.syncPalmBody(n, this.palmBody || this.createPalmBody()); for (var i = 0; i < n.fingers.length; i++)(t = n.fingers[i]).valid && (e = this.fingerBodies[t.type] || this.createFingerBody(t), this.syncFingerBody(t, e)) } }, l.prototype.createFingerBody = function(t) { var e = new CANNON.Body({ shape: new CANNON.Sphere(t.distal.length / 2), material: this.physics.material, mass: 0, fixedRotation: !0 }); return e.el = this.el, this.physics.addBody(e), this.fingerBodies[t.type] = e, e }, l.prototype.syncFingerBody = (i = new THREE.Vector3, function(t, e) { this.el.object3D.localToWorld(i.fromArray(t.distal.center())), e.position.copy(i), e.shapes[0].radius = t.distal.length / 2 }), l.prototype.createPalmBody = function() { var t = new CANNON.Body({ shape: new CANNON.Sphere(.01), material: this.physics.material, mass: 0 }); return t.el = this.el, this.physics.addBody(t), this.palmBody = t, t }, l.prototype.syncPalmBody = function() { var t = new THREE.Vector3,
            e = new THREE.Quaternion,
            n = new THREE.Quaternion,
            i = new THREE.Euler,
            r = new THREE.Vector3,
            o = new THREE.Vector3; return function(s, a) { e.setFromEuler(i.set(s.pitch(), s.yaw(), s.roll())), this.el.object3D.matrixWorld.decompose(r, n, o), a.quaternion.copy(n.multiply(e)), this.el.object3D.localToWorld(t.fromArray(s.palmPosition)), a.position.copy(t) } }(), p.prototype.update = function(t, e, n, i) { this.holdDistance = t.holdDistance, this.debug = t.debug, this.raycaster.far = this.holdDistance, this.raycaster.ray.direction.fromArray(n.palmNormal), this.raycaster.ray.direction.x += n.direction[0] / 2, this.raycaster.ray.direction.y += n.direction[1] / 2, this.raycaster.ray.direction.z += n.direction[2] / 2, this.raycaster.ray.direction.normalize(), this.raycaster.ray.origin.fromArray(n.palmPosition), e.localToWorld(this.raycaster.ray.origin), this.debug ? (this.arrowHelper = this.arrowHelper || this.createArrowHelper(), this.arrowHelper.position.copy(this.raycaster.ray.origin), e.worldToLocal(this.arrowHelper.position), this.arrowHelper.setDirection(this.raycaster.ray.direction), this.arrowHelper.setLength(this.holdDistance), this.arrowHelper.setColor(i ? 16711680 : 65280)) : delete this.arrowHelper }, p.prototype.intersectObjects = function(t, e) { return this.raycaster.intersectObjects(t, e) }, p.prototype.createArrowHelper = function() { return new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3, this.holdDistance) }, p.prototype.getMesh = function() { return this.arrowHelper }, p.prototype.show = function() { return this.arrowHelper && (this.arrowHelper.visible = !0), this }, p.prototype.hide = function() { return this.arrowHelper && (this.arrowHelper.visible = !1), this }, d.prototype._incr = function() { this._index = ++this._index % this._size }, d.prototype.array = function() { return this._array }, d.prototype.push = function(t) { this._array[this._index] = t, this._incr() }; var f = 1,
        m = AFRAME.registerComponent("leap-hand", { schema: { hand: { default: "", oneOf: ["left", "right"], required: !0 }, enablePhysics: { default: !1 }, holdDistance: { default: .2 }, holdDebounce: { default: 100 }, holdSelector: { default: "[holdable]" }, holdSensitivity: { default: .95 }, releaseSensitivity: { default: .75 }, debug: { default: !1 } }, init: function() { this.system = this.el.sceneEl.systems.leap, this.handID = f++, this.hand = null, this.handBody = null, this.handMesh = new h, this.isVisible = !1, this.isHolding = !1; var t = Math.floor(this.data.holdDebounce / (1e3 / 120));
                this.grabStrength = 0, this.pinchStrength = 0, this.grabStrengthBuffer = new d(t), this.pinchStrengthBuffer = new d(t), this.intersector = new p, this.holdTarget = null, this.el.setObject3D("mesh", this.handMesh.getMesh()), this.handMesh.hide(), this.data.debug && this.el.object3D.add(this.intersector.getMesh()) }, update: function() { var t = this.data;
                t.enablePhysics && !this.handBody ? this.handBody = new l(this.el, this) : !t.enablePhysics && this.handBody && (this.handBody.remove(), this.handBody = null) }, remove: function() { this.handMesh && (this.el.removeObject3D("mesh"), this.handMesh = null), this.handBody && (this.handBody.remove(), this.handBody = null), this.intersector.getMesh() && (this.el.object3D.remove(this.intersector.getMesh()), this.intersector = null) }, tick: function() { var t = this.getHand(); if (t && t.valid) { this.handMesh.scaleTo(t), this.handMesh.formTo(t), this.grabStrengthBuffer.push(t.grabStrength), this.pinchStrengthBuffer.push(t.pinchStrength), this.grabStrength = v(this.grabStrengthBuffer), this.pinchStrength = v(this.pinchStrengthBuffer); var e = Math.max(this.grabStrength, this.pinchStrength) > (this.isHolding ? this.data.releaseSensitivity : this.data.holdSensitivity);
                    this.intersector.update(this.data, this.el.object3D, t, e), e && !this.isHolding && this.hold(t), !e && this.isHolding && this.release(t) } else this.isHolding && this.release(null);
                t && !this.isVisible && (this.handMesh.show(), this.intersector.show()), !t && this.isVisible && (this.handMesh.hide(), this.intersector.hide()), this.isVisible = !!t }, getHand: function() { var t = this.data,
                    e = this.system.getFrame(); return e.hands.length ? e.hands[e.hands[0].type === t.hand ? 0 : 1] : null }, hold: function(t) { var e, n, i = this.getEventDetail(t);
                this.el.emit("leap-holdstart", i), e = [].slice.call(this.el.sceneEl.querySelectorAll(this.data.holdSelector)).map(function(t) { return t.object3D }), n = this.intersector.intersectObjects(e, !0), this.holdTarget = n[0] && n[0].object && n[0].object.el, this.holdTarget && this.holdTarget.emit("leap-holdstart", i), this.isHolding = !0 }, release: function(t) { var e = this.getEventDetail(t);
                this.el.emit("leap-holdstop", e), this.holdTarget && (this.holdTarget.emit("leap-holdstop", e), this.holdTarget = null), this.isHolding = !1 }, getEventDetail: function(t) { return { hand: t, handID: this.handID, body: this.handBody ? this.handBody.palmBody : null } } });

    function v(t) { var e = 0;
        t = t.array(); for (var n = 0; n < t.length; n++) e += t[n]; return e / t.length }
    t.System = r, t.Component = m });
//# sourceMappingURL=aframe-leap-hands.umd.js.map