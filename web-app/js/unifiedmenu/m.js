/*
 * Version:    2.0-RC1
 * Build:      DEV
 * Date:       Tue Aug 09 11:59:46 IST 2016
 */
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/* Copyright 2014 Ellucian Company L.P. and its affiliates. */

/* Copyright 2012-2014 Ellucian Company L.P. and its affiliates. */

/* Copyright 2012-214 Ellucian Company L.P. and its affiliates. */

(function(e,t){typeof define=="function"&&define.amd?define(t):e.M=t()})(this,function(){var requirejs,require,define;return function(e){function c(e,t){return f.call(e,t)}function h(e,t){var n,r,i,s,o,a,f,l,c,h,p=t&&t.split("/"),d=u.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(l=0;l<e.length;l+=1){h=e[l];if(h===".")e.splice(l,1),l-=1;else if(h===".."){if(l===1&&(e[2]===".."||e[0]===".."))break;l>0&&(e.splice(l-1,2),l-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(l=n.length;l>0;l-=1){r=n.slice(0,l).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=l;break}}}if(s)break;!a&&v&&v[r]&&(a=v[r],f=l)}!s&&a&&(s=a,o=f),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function p(t,r){return function(){return n.apply(e,l.call(arguments,0).concat([t,r]))}}function d(e){return function(t){return h(t,e)}}function v(e){return function(t){s[e]=t}}function m(n){if(c(o,n)){var r=o[n];delete o[n],a[n]=!0,t.apply(e,r)}if(!c(s,n)&&!c(a,n))throw new Error("No "+n);return s[n]}function g(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function y(e){return function(){return u&&u.config&&u.config[e]||{}}}var t,n,r,i,s={},o={},u={},a={},f=Object.prototype.hasOwnProperty,l=[].slice;r=function(e,t){var n,r=g(e),i=r[0];return e=r[1],i&&(i=h(i,t),n=m(i)),i?n&&n.normalize?e=n.normalize(e,d(t)):e=h(e,t):(e=h(e,t),r=g(e),i=r[0],e=r[1],i&&(n=m(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},i={require:function(e){return p(e)},exports:function(e){var t=s[e];return typeof t!="undefined"?t:s[e]={}},module:function(e){return{id:e,uri:"",exports:s[e],config:y(e)}}},t=function(t,n,u,f){var l,h,d,g,y,b=[],w;f=f||t;if(typeof u=="function"){n=!n.length&&u.length?["require","exports","module"]:n;for(y=0;y<n.length;y+=1){g=r(n[y],f),h=g.f;if(h==="require")b[y]=i.require(t);else if(h==="exports")b[y]=i.exports(t),w=!0;else if(h==="module")l=b[y]=i.module(t);else if(c(s,h)||c(o,h)||c(a,h))b[y]=m(h);else{if(!g.p)throw new Error(t+" missing "+h);g.p.load(g.n,p(f,!0),v(h),{}),b[y]=s[h]}}d=u.apply(s[t],b);if(t)if(l&&l.exports!==e&&l.exports!==s[t])s[t]=l.exports;else if(d!==e||!w)s[t]=d}else t&&(s[t]=u)},requirejs=require=n=function(s,o,a,f,l){return typeof s=="string"?i[s]?i[s](o):m(r(s,o).f):(s.splice||(u=s,o.splice?(s=o,o=a,a=null):s=e),o=o||function(){},typeof a=="function"&&(a=f,f=l),f?t(e,s,o,a):setTimeout(function(){t(e,s,o,a)},4),n)},n.config=function(e){return u=e,u.deps&&n(u.deps,u.callback),n},define=function(e,t,n){t.splice||(n=t,t=[]),!c(s,e)&&!c(o,e)&&(o[e]=[e,t,n])},define.amd={jQuery:!0}}(),define("almond",function(){}),function(){var e=Array.prototype,t=Object.prototype,n=e.forEach,r=t.hasOwnProperty,i={};define("magellan/each",[],function(){var e=function(e,t,s){if(e==null)return;if(n&&e.forEach===n)e.forEach(t,s);else if(e.length===+e.length){for(var o=0,u=e.length;o<u;o++)if(t.call(s,e[o],o,e)===i)return}else for(var a in e)if(r.call(e,a)&&t.call(s,e[a],a,e)===i)return};return e})}.call(null),function(){var e=Array.prototype,t=e.slice;define("magellan/extend",["magellan/each"],function(e){var n=function(n){return e(t.call(arguments,1),function(e){if(e)for(var t in e)n[t]=e[t]}),n};return n})}.call(null),function(){var e=Array.isArray,t=Object.prototype,n=Object.prototype.toString;define("magellan/is",["magellan/each"],function(t){var r=new Object;return r.array=e||function(e){return n.call(e)=="[object Array]"},r.object=function(e){return e===Object(e)},t(["Arguments","String","Number","Date","RegExp"],function(e){r[e.toLowerCase()]=function(t){return n.call(t)=="[object "+e+"]"}}),r.func=function(e){return n.call(e)=="[object Function]"},r.boolean=function(e){return e===!0||e===!1||n.call(e)=="[object Boolean]"},r.nullValue=function(e){return e===null},r.undefined=function(e){return e===void 0},r})}.call(null),function(){var e=Array.filter;define("magellan/filter",["magellan/each"],function(t){var n=function(n,r,i){var s=[];return n==null?s:e&&n.filter===e?n.filter(r,i):(t(n,function(e,t,n){r.call(i,e,t,n)&&(s[s.length]=e)}),s)};return n})}.call(null),function(e){var t={};define("magellan/emitter",["magellan/each","magellan/filter","magellan/is"],function(e,n,r){var i={emit:function(n,r){e(t[n],function(e){e(r)})},off:function(e,i){r.undefined(i)?delete t[e]:t[e]=n(t[e],function(e){return e!=i})},on:function(e,n){r.object(e)&&(e=e.type,call=e.callback),r.string(e)&&(r.undefined(t[e])?t[e]=[n]:r.array(t[e])&&t[e].push(n))},once:function(e,t){var n=this,r=function(i){t(i),n.off(e,r)};n.on(e,r)}};return i.once.bind(i),i})}.call(null,window),function(e,t){t("magellan/events",[],function(){return{navigate:"navigate",bringToFront:"bringToFront",addFooterApp:"addFooterApp",closeApp:"closeApp",requestHelp:"requestHelp",displayHelp:"displayHelp",menuLoaded:"menuLoaded",broadcast:"broadcast",send:"send",error:"error",addOpenItem:"addOpenItem",addRecentItem:"addRecentItem",removeOpenItem:"removeOpenItem",showSpecificMenu:"showSpecificMenu",appStatus:"appStatus",spin:"spin",stopSpin:"stopStpin",checkDataStates:"checkDataStates",searching:"searching",searchComplete:"searchComplete",open:"open",addCapability:"addCapability",removeCapability:"removeCapability",localActivityFound:"localActivityFound",keepAlive:"keepAlive",heartbeat:"heartbeat",addTimeoutCapability:"addTimeoutCapability",removeTimeoutCapability:"removeTimeoutCapability",addAlreadyOpen:"addAlreadyOpen",removeAlreadyOpen:"removeAlreadyOpen",displayLandingPage:"displayLandingPage",lastPageClosed:"lastPageClosed",clearSearchResult:"clearSearchResult",preventDefaultStopPropagation:"preventDefaultStopPropagation",closeKeyBoardShortCut:"closeKeyBoardShortCut",logout:"logout",scrollToTop:"scrollToTop",landingSearchInitFocus:"landingSearchInitFocus",loadMenu:"loadMenu"}})}.call(null,window,define),function(e,t,n){var r=e.location.hostname;_cookieMarker="magellan_",_homeCookieName=_cookieMarker+"home",n("magellan/cookies",["magellan/store"],function(e){return{set:function(e,n,i,s){var e=_cookieMarker+e,o=s?s:7200,u=new Date;u.setTime(u.getTime()+o*60*1e3);var a="expires="+u.toGMTString();t.cookie=e+"="+n+"; "+a+"; path=/; domain="+r},setSession:function(e,n){var e=_cookieMarker+e;t.cookie=e+"="+n+"; "},removeSession:function(e){var e=_cookieMarker+e;t.cookie=e+"=; expires=-1; path=/; domain="+r},get:function(e){var e=_cookieMarker+e+"=",n=t.cookie.split(";");for(var r=0;r<n.length;r++){var i=" "+n[r];while(i.charAt(0)==" "){i=i.substring(1,i.length);if(i.indexOf(e)==0)return i.substring(e.length,i.length)}}return undefined},remove:function(e,n){t.cookie=e+"=; expires=-1; path=/; domain="+r}}})}.call(null,window,document,define),function(window){define("magellan/json2",["magellan/is"],function(is){var JSON;return JSON||(JSON={}),function(){function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),is.undefined(window.JSON)?JSON:window.JSON})}.call(null,window),function(e,t){var n={};t("magellan/store",["magellan/is","magellan/cookies","magellan/json2"],function(t,r,i){function u(){try{return e.localStorage.setItem(mod,"mod"),e.localStorage.removeItem(mod),!0}catch(t){return!1}}var s=function(n,s){s=t.object(s)?i.stringify(s):s,u()&&!t.undefined(e.localStorage)?e.localStorage[n]=s:r.set(n,s)},o=function(s){if(!t.undefined(n[s]))return n[s];if(u()&&!t.undefined(e.localStorage)&&!t.undefined(e.localStorage[s])){var o=e.localStorage[s];return o=o[0]=="{"?i.parse(o):o,o}return r.get(s)};return function(e,t,r){return t&&(n[e]=t),r&&s(e,t),o(e)}})}.call(null,window,define),function(e,t){t("magellan/messages",["magellan/is","magellan/each","magellan/extend","magellan/store"],function(e,t,n,r){return{localActivity:!1,heartbeat:-1,createFocusMessage:function(){return{type:"focus"}},createRequestMessage:function(e){return{type:"request",request:e}},createActionMessage:function(e){return{type:"request",request:"action",action:e}},createContextMessage:function(e){return e=e||{},n(e,{values:r("globalVariables")||{}}),{type:"context",context:e}},createNameValuePairMessage:function(e){return{type:"values",values:e||{}}},createHelpMessageByURL:function(e){return{type:"help",help:{url:e}}},createNavigationMessageByLocation:function(e){return{type:"navigate",navigate:{location:e}}},createApplicationPageNavigationMessage:function(e,t){var n={type:"navigate",page:e,values:t||{}};return n},createStatusMessage:function(e){return{type:"status",status:e}},createDataStateMessage:function(e){return{type:"dataState",state:e}},createErrorMessage:function(n){var r={type:"error",errors:[]};return e.string(n)?r.errors.push({message:n}):e.array(n)&&t(n,function(t){e.string(t)?r.errors.push({message:t}):r.errors.push({code:t.code,message:t.message})}),r},createConfirmationMessage:function(t,r,i){var s={};return e.object(t)?n(s,t):(s.title=t,s.message=r,s.responses=i),{type:"confirmation",confirmation:s}},createCapabilityMessage:function(e){return{type:"capability",capability:e}},createKeepAliveMessage:function(e){return{type:"keepAlive",keepAlive:e}},createHeartbeatMessage:function(e){return{type:"heartbeat",heartbeat:e}},createTimeoutCapabilityMessage:function(e){return{type:"timeoutCapability",timeoutCapability:e}},pollLocalActivity:function(){setInterval(function(){M.localActivity&&(M.localActivity=!1,M.send(M.createKeepAliveMessage(!0)))},M.heartbeat*1e3)},initializePollActivity:function(){M.heartbeat<0?M.send(M.createHeartbeatMessage(0)):M.pollLocalActivity()},createAlreadyOpenMessage:function(e){return{type:"alreadyOpen",alreadyOpen:e}},createLastPageClosedMessage:function(e){return{type:"lastPageClosed",action:e}}}})}.call(null,window,define),function(e){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";e("magellan/encoder",["magellan/is","magellan/json2"],function(e,n){var r=function(r){e.string(r)||(r=n.stringify(r));var i="",s,o,u,a,f,l,c="",h=0;do s=r.charCodeAt(h++),o=r.charCodeAt(h++),u=r.charCodeAt(h++),a=s>>2,f=(s&3)<<4|o>>4,l=(o&15)<<2|u>>6,c=u&63,isNaN(o)?l=c=64:isNaN(u)&&(c=64),i=i+t.charAt(a)+t.charAt(f)+t.charAt(l)+t.charAt(c),s=o=u="",a=f=l=c="";while(h<r.length);return i},i=function(e){var n="",r,i,s,o,u,a,f="",l=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");do o=t.indexOf(e.charAt(l++)),u=t.indexOf(e.charAt(l++)),a=t.indexOf(e.charAt(l++)),f=t.indexOf(e.charAt(l++)),r=o<<2|u>>4,i=(u&15)<<4|a>>2,s=(a&3)<<6|f,n+=String.fromCharCode(r),a!=64&&(n+=String.fromCharCode(i)),f!=64&&(n+=String.fromCharCode(s)),r=i=s="",o=u=a=f="";while(l<e.length);return n};return{encode:r,decode:i}})}.call(null,define),function(e,t){t("magellan/configuration",[],function(){return e.appconfig})}.call(null,window,define),function(e){define("magellan/i18n",["magellan/is","magellan/configuration"],function(e,t){return function(n){return!n||e.undefined(t.strings)?!1:e.undefined(t.strings[n])?n:t.strings[n]}})}.call(null,window),function(e,t){var n="*";t("magellan/xdm",["magellan/is","magellan/emitter","magellan/events","magellan/encoder","magellan/i18n","magellan/json2"],function(t,r,i,s,o,u){return{listen:function(t){e.postMessage?e.addEventListener?e.addEventListener("message",t,!1):e.attachEvent("onmessage",t,!1):r.emit(i.error,o("error-xdm"))},postMessage:function(a,f,l){f=f||e,l=l||n,f.postMessage?(t.object(a)&&(a=u.stringify(a)),a=s.encode(a),f.postMessage(a,l)):r.emit(i.error,o("error-xdm"))}}})}.call(null,window,define),function(){var e=Array.prototype,t=e.push;define("magellan/wrap",[],function(){var e=function(e,n){return function(){var r=[e];return t.apply(r,arguments),n.apply(this,r)}};return e})}.call(null),function(e){define("magellan/messenger",["magellan/is","magellan/emitter","magellan/events","magellan/messages","magellan/encoder","magellan/xdm","magellan/store","magellan/wrap","magellan/extend","magellan/json2"],function(e,t,n,r,i,s,o,u,a,f){function l(e){var t=o("magellanApplicationConfig")||{};a(t,{context:e}),o("magellanApplicationConfig",t)}return{origin:"*",messageHandler:null,start:function(t){var n=this;e.func(t)&&(t=u(t,function(e,t){t.type==="context"&&l(t.context),e(t)}),n.messageHandler=t),s.listen(function(e){n.handleCrossDomainMessage.call(n,e)}),n.send(n.createRequestMessage("context"))},handleCrossDomainMessage:function(r){var s=this;if(e.func(s.messageHandler)){var o=r.data;e.string(o)&&(o=r.data.match(/[A-Za-z0-9+/=]/)!=null?i.decode(o):o,o=f.parse(o)),s.messageHandler(o)}else t.emit(n.error,"handleCrossDomainMessage: no messageHandler established!")},getApplicationId:function(){var t=o("magellanApplicationConfig");return e.undefined(t)||e.undefined(t.context)||e.undefined(t.context.appid)?void 0:t.context.appid},send:function(e){e.origin=this.getApplicationId(),s.postMessage(e,parent)}}})}.call(null,window),function(){define("magellan/m",["magellan/extend","magellan/messenger","magellan/encoder","magellan/messages","magellan/store","magellan/json2"],function(e,t,n,r,i,s){var o=new Object;return o.store=i,o.json=s,e(o,t,n,r),o})}.call(null),require("magellan/m")});