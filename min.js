!function o(i,s,p){function f(t,e){if(!s[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(c)return c(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var a=s[t]={exports:{}};i[t][0].call(a.exports,function(e){return f(i[t][1][e]||e)},a,a.exports,o,i,s,p)}return s[t].exports}for(var c="function"==typeof require&&require,e=0;e<p.length;e++)f(p[e]);return f}({1:[function(a,t,e){(function(r){var e=function(){"use strict";a("onpushstate");var n=a("path-to-regexp"),e=t.prototype;function s(e,t){return"string"!=typeof e&&(e=(e=e.toString()).slice(1,e.lastIndexOf("/"))),n(e,t)}function u(e,t){for(var n,r={},a=1,o=e.length;a<o;a++)(n=e[a])&&(r[t[a-1].name]=n);return r}function o(){this.parentNode.removeChild(this)}function t(){this._params={},this._paths={},r.addEventListener("popstate",this,!1),r.addEventListener("pushstate",this,!1)}return e.get=function(e){for(var t=[],n=s(e,t),r=this._paths[n]||(this._paths[n]={keys:t,cb:[],re:n}),a=1,o=arguments.length;a<o;a++)r.cb.push(arguments[a]);return this},e.delete=function(e){for(var t=s(e,[]),n=this._paths[t],r=1,a=arguments.length;r<a;r++){var o=arguments[r],i=n?n.cb.lastIndexOf(o):-1;-1<i&&n.cb.splice(i,1)}return this},e.use=function(e,t){"function"==typeof e&&(t=e,e="(.*)");for(var n=[].concat(e),r=0,a=n.length;r<a;r++)this.get(n[r],t);return this},e.param=function(e,t){for(var n=[].concat(e),r=0,a=n.length;r<a;r++)this._params[n[r]]=t;return this},e.navigate=function(e,t){switch(!0){case!!t:switch(!0){case!!t.replace:case!!t.replaceState:history.replaceState(history.state,document.title,e)}break;case e===location.pathname+location.search:this.handleEvent({type:"samestate"});break;default:var n=document,r=n.documentElement,a=n.createElement("a");a.href=e,a.onclick=o,r.insertBefore(a,r.firstChild),a.click()}return this},e.handleEvent=function(e){var t=this._paths;for(var n in t)if(t.hasOwnProperty(n)){var r=t[n],a=r.re.exec(location.pathname);if(a){var o=[],i=[],s=this._params,p={params:u(a,r.keys),type:e.type},f=0,c=r.cb.length;for(n in p.params)s.hasOwnProperty(n)&&i.push(n);return void function e(){i.length?(n=i.shift(),s[n](p,e,p.params[n])):function e(){if(f<c){var t=r.cb[f++];o.lastIndexOf(t)<0?(o.push(t),t(p,e)):e()}}()}()}}},function(){return new t}}();t.exports=(r.hyperHTML||{}).app=e}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{onpushstate:2,"path-to-regexp":3}],2:[function(e,t,n){
/*! (C) 2017 Andrea Giammarchi - @WebReflection - ISC License */
document.addEventListener("click",function(e){var t=((s=e.target.shadowRoot?e.path[0]:e.target).closest||function(e){for(;s&&s.nodeName!==e;)s=s.parentNode;return s}).call(s,"A");if(t&&/^(?:_self)?$/i.test(t.target)&&!t.hasAttribute("download")&&"external"!==t.getAttribute("rel")&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){var n=new URL(t.href),r=location;if(n.origin===r.origin){var a=n.pathname+n.search,o=n.hash,i=!0;if(e.preventDefault(),a===r.pathname+r.search){var s;if(/^#[a-z][a-z0-9.:_-]+$/i.test(o))(s=document.querySelector(o+',[name="'+o.slice(1)+'"]'))&&(e.preventDefault=function(){i=!1},setTimeout(function(){i&&s.scrollIntoView(!0)}));history.replaceState(history.state,document.title,a+o)}else{var p=new CustomEvent("pushstate");p.state=r.href,setTimeout(function(){dispatchEvent(p),window.onpushstate&&onpushstate(p)}),history.pushState(p.state,document.title,a+o)}}}},!0)},{}],3:[function(e,t,n){t.exports=i,t.exports.parse=r,t.exports.compile=function(e,t){return a(r(e,t))},t.exports.tokensToFunction=a,t.exports.tokensToRegExp=o;var $="/",k=new RegExp(["(\\\\.)","(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"),"g");function r(e,t){for(var n,r,a=[],o=0,i=0,s="",p=t&&t.delimiter||$,f=t&&t.whitelist||void 0,c=!1;null!==(n=k.exec(e));){var u=n[0],l=n[1],h=n.index;if(s+=e.slice(i,h),i=h+u.length,l)s+=l[1],c=!0;else{var d="",v=n[2],g=n[3],m=n[4],y=n[5];if(!c&&s.length){var x=s.length-1,w=s[x];(!f||-1<f.indexOf(w))&&(d=w,s=s.slice(0,x))}s&&(a.push(s),s="",c=!1);var E="+"===y||"*"===y,b="?"===y||"*"===y,_=g||m,T=d||p;a.push({name:v||o++,prefix:d,delimiter:T,optional:b,repeat:E,pattern:_?(r=_,r.replace(/([=!:$/()])/g,"\\$1")):"[^"+O(T===p?T:T+p)+"]+?"})}}return(s||i<e.length)&&a.push(s+e.substr(i)),a}function a(f){for(var c=new Array(f.length),e=0;e<f.length;e++)"object"==typeof f[e]&&(c[e]=new RegExp("^(?:"+f[e].pattern+")$"));return function(e,t){for(var n="",r=t&&t.encode||encodeURIComponent,a=0;a<f.length;a++){var o=f[a];if("string"!=typeof o){var i,s=e?e[o.name]:void 0;if(Array.isArray(s)){if(!o.repeat)throw new TypeError('Expected "'+o.name+'" to not repeat, but got array');if(0===s.length){if(o.optional)continue;throw new TypeError('Expected "'+o.name+'" to not be empty')}for(var p=0;p<s.length;p++){if(i=r(s[p],o),!c[a].test(i))throw new TypeError('Expected all "'+o.name+'" to match "'+o.pattern+'"');n+=(0===p?o.prefix:o.delimiter)+i}}else if("string"!=typeof s&&"number"!=typeof s&&"boolean"!=typeof s){if(!o.optional)throw new TypeError('Expected "'+o.name+'" to be '+(o.repeat?"an array":"a string"))}else{if(i=r(String(s),o),!c[a].test(i))throw new TypeError('Expected "'+o.name+'" to match "'+o.pattern+'", but got "'+i+'"');n+=o.prefix+i}}else n+=o}return n}}function O(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function d(e){return e&&e.sensitive?"":"i"}function o(e,t,n){for(var r=(n=n||{}).strict,a=!1!==n.start,o=!1!==n.end,i=n.delimiter||$,s=[].concat(n.endsWith||[]).map(O).concat("$").join("|"),p=a?"^":"",f=0;f<e.length;f++){var c=e[f];if("string"==typeof c)p+=O(c);else{var u=c.repeat?"(?:"+c.pattern+")(?:"+O(c.delimiter)+"(?:"+c.pattern+"))*":c.pattern;t&&t.push(c),c.optional?c.prefix?p+="(?:"+O(c.prefix)+"("+u+"))?":p+="("+u+")?":p+=O(c.prefix)+"("+u+")"}}if(o)r||(p+="(?:"+O(i)+")?"),p+="$"===s?"$":"(?="+s+")";else{var l=e[e.length-1],h="string"==typeof l?l[l.length-1]===i:void 0===l;r||(p+="(?:"+O(i)+"(?="+s+"))?"),h||(p+="(?="+O(i)+"|"+s+")")}return new RegExp(p,d(n))}function i(e,t,n){return e instanceof RegExp?function(e,t){if(!t)return e;var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return e}(e,t):Array.isArray(e)?function(e,t,n){for(var r=[],a=0;a<e.length;a++)r.push(i(e[a],t,n).source);return new RegExp("(?:"+r.join("|")+")",d(n))}(e,t,n):function(e,t,n){return o(r(e,n),t,n)}(e,t,n)}},{}]},{},[1]);