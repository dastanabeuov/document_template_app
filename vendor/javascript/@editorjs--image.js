(function(){try{if(typeof document<"u"){var n=document.createElement("style");n.appendChild(document.createTextNode('.image-tool{--bg-color: #cdd1e0;--front-color: #388ae5;--border-color: #e8e8eb}.image-tool__image{border-radius:3px;overflow:hidden;margin-bottom:10px}.image-tool__image-picture{max-width:100%;vertical-align:bottom;display:block}.image-tool__image-preloader{width:50px;height:50px;border-radius:50%;background-size:cover;margin:auto;position:relative;background-color:var(--bg-color);background-position:center center}.image-tool__image-preloader:after{content:"";position:absolute;z-index:3;width:60px;height:60px;border-radius:50%;border:2px solid var(--bg-color);border-top-color:var(--front-color);left:50%;top:50%;margin-top:-30px;margin-left:-30px;animation:image-preloader-spin 2s infinite linear;box-sizing:border-box}.image-tool__caption[contentEditable=true][data-placeholder]:before{position:absolute!important;content:attr(data-placeholder);color:#707684;font-weight:400;display:none}.image-tool__caption[contentEditable=true][data-placeholder]:empty:before{display:block}.image-tool__caption[contentEditable=true][data-placeholder]:empty:focus:before{display:none}.image-tool--empty .image-tool__image,.image-tool--empty .image-tool__caption,.image-tool--loading .image-tool__caption{display:none}.image-tool .cdx-button{display:flex;align-items:center;justify-content:center}.image-tool .cdx-button svg{height:auto;margin:0 6px 0 0}.image-tool--filled .cdx-button,.image-tool--filled .image-tool__image-preloader{display:none}.image-tool--loading .image-tool__image{min-height:200px;display:flex;border:1px solid var(--border-color);background-color:#fff}.image-tool--loading .image-tool__image-picture,.image-tool--loading .cdx-button{display:none}.image-tool--withBorder .image-tool__image{border:1px solid var(--border-color)}.image-tool--withBackground .image-tool__image{padding:15px;background:var(--bg-color)}.image-tool--withBackground .image-tool__image-picture{max-width:60%;margin:0 auto}.image-tool--stretched .image-tool__image-picture{width:100%}@keyframes image-preloader-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}')),document.head.appendChild(n)}}catch(n){console.error("vite-plugin-css-injected-by-js",n)}})();const n='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19V19C9.13623 19 8.20435 19 7.46927 18.6955C6.48915 18.2895 5.71046 17.5108 5.30448 16.5307C5 15.7956 5 14.8638 5 13V12C5 9.19108 5 7.78661 5.67412 6.77772C5.96596 6.34096 6.34096 5.96596 6.77772 5.67412C7.78661 5 9.19108 5 12 5H13.5C14.8956 5 15.5933 5 16.1611 5.17224C17.4395 5.56004 18.44 6.56046 18.8278 7.83886C19 8.40666 19 9.10444 19 10.5V10.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 13V16M16 19V16M19 16H16M16 16H13"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 17.5L17.5 6.5"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.9919 10.5H19.0015"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.9919 19H11.0015"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13L13 5"/></svg>',a='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.9919 9.5H19.0015"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 5H14.5096"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.625 5H15C17.2091 5 19 6.79086 19 9V9.375"/><path stroke="currentColor" stroke-width="2" d="M9.375 5L9 5C6.79086 5 5 6.79086 5 9V9.375"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.3725 5H9.38207"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9.5H5.00957"/><path stroke="currentColor" stroke-width="2" d="M9.375 19H9C6.79086 19 5 17.2091 5 15V14.625"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.3725 19H9.38207"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14.55H5.00957"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 13V16M16 19V16M19 16H16M16 16H13"/></svg>',s='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.7778 9.33331H13.7867"/></svg>',c='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L20 12L17 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 12H20"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L4 12L7 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12H10"/></svg>';function S(n,a=null,s={}){const c=document.createElement(n);Array.isArray(a)?c.classList.add(...a):a&&c.classList.add(a);for(const n in s)s.hasOwnProperty(n)&&(c[n]=s[n]);return c}var k=(n=>(n.Empty="empty",n.Uploading="uploading",n.Filled="filled",n))(k||{});class x{
/**
   * @param {object} ui - image tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {ImageConfig} ui.config - user config
   * @param {Function} ui.onSelectFile - callback for clicks on Select file button
   * @param {boolean} ui.readOnly - read-only mode flag
   */
constructor({api:n,config:a,onSelectFile:s,readOnly:c}){this.api=n,this.config=a,this.onSelectFile=s,this.readOnly=c,this.nodes={wrapper:S("div",[this.CSS.baseClass,this.CSS.wrapper]),imageContainer:S("div",[this.CSS.imageContainer]),fileButton:this.createFileButton(),imageEl:void 0,imagePreloader:S("div",this.CSS.imagePreloader),caption:S("div",[this.CSS.input,this.CSS.caption],{contentEditable:!this.readOnly})},this.nodes.caption.dataset.placeholder=this.config.captionPlaceholder,this.nodes.imageContainer.appendChild(this.nodes.imagePreloader),this.nodes.wrapper.appendChild(this.nodes.imageContainer),this.nodes.wrapper.appendChild(this.nodes.caption),this.nodes.wrapper.appendChild(this.nodes.fileButton)
/**
   * CSS classes
   *
   * @returns {object}
   */}get CSS(){return{baseClass:this.api.styles.block,loading:this.api.styles.loader,input:this.api.styles.input,button:this.api.styles.button,wrapper:"image-tool",imageContainer:"image-tool__image",imagePreloader:"image-tool__image-preloader",imageEl:"image-tool__image-picture",caption:"image-tool__caption"}}
/**
   * Renders tool UI
   *
   * @param {ImageToolData} toolData - saved tool data
   * @returns {Element}
   */render(n){return n.file&&Object.keys(n.file).length!==0?this.toggleStatus("uploading"):this.toggleStatus("empty"),this.nodes.wrapper
/**
   * Creates upload-file button
   *
   * @returns {Element}
   */}createFileButton(){const n=S("div",[this.CSS.button]);return n.innerHTML=this.config.buttonContent||`${s} ${this.api.i18n.t("Select an Image")}`,n.addEventListener("click",(()=>{this.onSelectFile()})),n
/**
   * Shows uploading preloader
   *
   * @param {string} src - preview source
   * @returns {void}
   */}showPreloader(n){this.nodes.imagePreloader.style.backgroundImage=`url(${n})`,this.toggleStatus("uploading")
/**
   * Hide uploading preloader
   *
   * @returns {void}
   */}hidePreloader(){this.nodes.imagePreloader.style.backgroundImage="",this.toggleStatus("empty")
/**
   * Shows an image
   *
   * @param {string} url - image source
   * @returns {void}
   */}fillImage(n){const a=/\.mp4$/.test(n)?"VIDEO":"IMG",s={src:n};let c="load";a==="VIDEO"&&(s.autoplay=!0,s.loop=!0,s.muted=!0,s.playsinline=!0,c="loadeddata"),this.nodes.imageEl=S(a,this.CSS.imageEl,s),this.nodes.imageEl.addEventListener(c,(()=>{this.toggleStatus("filled"),this.nodes.imagePreloader&&(this.nodes.imagePreloader.style.backgroundImage="")})),this.nodes.imageContainer.appendChild(this.nodes.imageEl)
/**
   * Shows caption input
   *
   * @param {string} text - caption text
   * @returns {void}
   */}fillCaption(n){this.nodes.caption&&(this.nodes.caption.innerHTML=n)}
/**
   * Changes UI status
   *
   * @param {string} status - see {@link Ui.status} constants
   * @returns {void}
   */toggleStatus(n){for(const a in k)Object.prototype.hasOwnProperty.call(k,a)&&this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${k[a]}`,n===k[a])}
/**
   * Apply visual representation of activated tune
   *
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   * @returns {void}
   */applyTune(n,a){this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${n}`,a)}}function D(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var _={exports:{}};(function(n,a){(function(a,s){n.exports=s()})(window,(function(){return function(n){var a={};function i(s){if(a[s])return a[s].exports;var c=a[s]={i:s,l:!1,exports:{}};return n[s].call(c.exports,c,c.exports,i),c.l=!0,c.exports}return i.m=n,i.c=a,i.d=function(n,a,s){i.o(n,a)||Object.defineProperty(n,a,{enumerable:!0,get:s})},i.r=function(n){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},i.t=function(n,a){if(1&a&&(n=i(n)),8&a||4&a&&typeof n=="object"&&n&&n.__esModule)return n;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:n}),2&a&&typeof n!="string")for(var c in n)i.d(s,c,function(a){return n[a]}.bind(null,c));return s},i.n=function(n){var a=n&&n.__esModule?function(){return n.default}:function(){return n};return i.d(a,"a",a),a},i.o=function(n,a){return Object.prototype.hasOwnProperty.call(n,a)},i.p="",i(i.s=3)}([function(n,a){var s;s=function(){return this}();try{s=s||new Function("return this")()}catch{typeof window=="object"&&(s=window)}n.exports=s},function(n,a,s){(function(n){var c=s(2),k=setTimeout;function b(){}function u(n){if(!(this instanceof u))throw new TypeError("Promises must be constructed via new");if(typeof n!="function")throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],t(n,this)}function f(n,a){for(;n._state===3;)n=n._value;n._state!==0?(n._handled=!0,u._immediateFn((function(){var s=n._state===1?a.onFulfilled:a.onRejected;if(s!==null){var c;try{c=s(n._value)}catch(n){return void y(a.promise,n)}p(a.promise,c)}else(n._state===1?p:y)(a.promise,n._value)}))):n._deferreds.push(a)}function p(n,a){try{if(a===n)throw new TypeError("A promise cannot be resolved with itself.");if(a&&(typeof a=="object"||typeof a=="function")){var s=a.then;if(a instanceof u)return n._state=3,n._value=a,void w(n);if(typeof s=="function")return void t((c=s,k=a,function(){c.apply(k,arguments)}),n)}n._state=1,n._value=a,w(n)}catch(a){y(n,a)}var c,k}function y(n,a){n._state=2,n._value=a,w(n)}function w(n){n._state===2&&n._deferreds.length===0&&u._immediateFn((function(){n._handled||u._unhandledRejectionFn(n._value)}));for(var a=0,s=n._deferreds.length;a<s;a++)f(n,n._deferreds[a]);n._deferreds=null}function v(n,a,s){this.onFulfilled=typeof n=="function"?n:null,this.onRejected=typeof a=="function"?a:null,this.promise=s}function t(n,a){var s=!1;try{n((function(n){s||(s=!0,p(a,n))}),(function(n){s||(s=!0,y(a,n))}))}catch(n){if(s)return;s=!0,y(a,n)}}u.prototype.catch=function(n){return this.then(null,n)},u.prototype.then=function(n,a){var s=new this.constructor(b);return f(this,new v(n,a,s)),s},u.prototype.finally=c.a,u.all=function(n){return new u((function(a,s){if(!n||n.length===void 0)throw new TypeError("Promise.all accepts an array");var c=Array.prototype.slice.call(n);if(c.length===0)return a([]);var k=c.length;function h(n,_){try{if(_&&(typeof _=="object"||typeof _=="function")){var C=_.then;if(typeof C=="function")return void C.call(_,(function(a){h(n,a)}),s)}c[n]=_,--k==0&&a(c)}catch(n){s(n)}}for(var _=0;_<c.length;_++)h(_,c[_])}))},u.resolve=function(n){return n&&typeof n=="object"&&n.constructor===u?n:new u((function(a){a(n)}))},u.reject=function(n){return new u((function(a,s){s(n)}))},u.race=function(n){return new u((function(a,s){for(var c=0,k=n.length;c<k;c++)n[c].then(a,s)}))},u._immediateFn=typeof n=="function"&&function(a){n(a)}||function(n){k(n,0)},u._unhandledRejectionFn=function(n){typeof console<"u"&&console&&console.warn("Possible Unhandled Promise Rejection:",n)},a.a=u}).call(this,s(5).setImmediate)},function(n,a,s){a.a=function(n){var a=this.constructor;return this.then((function(s){return a.resolve(n()).then((function(){return s}))}),(function(s){return a.resolve(n()).then((function(){return a.reject(s)}))}))}},function(n,a,s){function o(n){return(o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}s(4);var c,k,_,C,E,T,j,F=s(8),M=(k=function(n){return new Promise((function(a,s){n=C(n),(n=E(n)).beforeSend&&n.beforeSend();var c=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP");c.open(n.method,n.url),c.setRequestHeader("X-Requested-With","XMLHttpRequest"),Object.keys(n.headers).forEach((function(a){var s=n.headers[a];c.setRequestHeader(a,s)}));var k=n.ratio;c.upload.addEventListener("progress",(function(a){var s=Math.round(a.loaded/a.total*100),c=Math.ceil(s*k/100);n.progress(Math.min(c,100))}),!1),c.addEventListener("progress",(function(a){var s=Math.round(a.loaded/a.total*100),c=Math.ceil(s*(100-k)/100)+k;n.progress(Math.min(c,100))}),!1),c.onreadystatechange=function(){if(c.readyState===4){var n=c.response;try{n=JSON.parse(n)}catch{}var k=F.parseHeaders(c.getAllResponseHeaders()),_={body:n,code:c.status,headers:k};j(c.status)?a(_):s(_)}},c.send(n.data)}))},_=function(n){return n.method="POST",k(n)},C=function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(n.url&&typeof n.url!="string")throw new Error("Url must be a string");if(n.url=n.url||"",n.method&&typeof n.method!="string")throw new Error("`method` must be a string or null");if(n.method=n.method?n.method.toUpperCase():"GET",n.headers&&o(n.headers)!=="object")throw new Error("`headers` must be an object or null");if(n.headers=n.headers||{},n.type&&(typeof n.type!="string"||!Object.values(c).includes(n.type)))throw new Error("`type` must be taken from module's «contentType» library");if(n.progress&&typeof n.progress!="function")throw new Error("`progress` must be a function or null");if(n.progress=n.progress||function(n){},n.beforeSend=n.beforeSend||function(n){},n.ratio&&typeof n.ratio!="number")throw new Error("`ratio` must be a number");if(n.ratio<0||n.ratio>100)throw new Error("`ratio` must be in a 0-100 interval");if(n.ratio=n.ratio||90,n.accept&&typeof n.accept!="string")throw new Error("`accept` must be a string with a list of allowed mime-types");if(n.accept=n.accept||"*/*",n.multiple&&typeof n.multiple!="boolean")throw new Error("`multiple` must be a true or false");if(n.multiple=n.multiple||!1,n.fieldName&&typeof n.fieldName!="string")throw new Error("`fieldName` must be a string");return n.fieldName=n.fieldName||"files",n},E=function(n){switch(n.method){case"GET":var a=T(n.data,c.URLENCODED);delete n.data,n.url=/\?/.test(n.url)?n.url+"&"+a:n.url+"?"+a;break;case"POST":case"PUT":case"DELETE":case"UPDATE":var s=function(){return(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).type||c.JSON}(n);(F.isFormData(n.data)||F.isFormElement(n.data))&&(s=c.FORM),n.data=T(n.data,s),s!==M.contentType.FORM&&(n.headers["content-type"]=s)}return n},T=function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};switch(arguments.length>1?arguments[1]:void 0){case c.URLENCODED:return F.urlEncode(n);case c.JSON:return F.jsonEncode(n);case c.FORM:return F.formEncode(n);default:return n}},j=function(n){return n>=200&&n<300},{contentType:c={URLENCODED:"application/x-www-form-urlencoded; charset=utf-8",FORM:"multipart/form-data",JSON:"application/json; charset=utf-8"},request:k,get:function(n){return n.method="GET",k(n)},post:_,transport:function(n){return n=C(n),F.selectFiles(n).then((function(a){for(var s=new FormData,c=0;c<a.length;c++)s.append(n.fieldName,a[c],a[c].name);F.isObject(n.data)&&Object.keys(n.data).forEach((function(a){var c=n.data[a];s.append(a,c)}));var k=n.beforeSend;return n.beforeSend=function(){return k(a)},n.data=s,_(n)}))},selectFiles:function(n){return delete(n=C(n)).beforeSend,F.selectFiles(n)}});n.exports=M},function(n,a,s){s.r(a);var c=s(1);window.Promise=window.Promise||c.a},function(n,a,s){(function(n){var c=n!==void 0&&n||typeof self<"u"&&self||window,k=Function.prototype.apply;function b(n,a){this._id=n,this._clearFn=a}a.setTimeout=function(){return new b(k.call(setTimeout,c,arguments),clearTimeout)},a.setInterval=function(){return new b(k.call(setInterval,c,arguments),clearInterval)},a.clearTimeout=a.clearInterval=function(n){n&&n.close()},b.prototype.unref=b.prototype.ref=function(){},b.prototype.close=function(){this._clearFn.call(c,this._id)},a.enroll=function(n,a){clearTimeout(n._idleTimeoutId),n._idleTimeout=a},a.unenroll=function(n){clearTimeout(n._idleTimeoutId),n._idleTimeout=-1},a._unrefActive=a.active=function(n){clearTimeout(n._idleTimeoutId);var a=n._idleTimeout;a>=0&&(n._idleTimeoutId=setTimeout((function(){n._onTimeout&&n._onTimeout()}),a))},s(6),a.setImmediate=typeof self<"u"&&self.setImmediate||n!==void 0&&n.setImmediate||this&&this.setImmediate,a.clearImmediate=typeof self<"u"&&self.clearImmediate||n!==void 0&&n.clearImmediate||this&&this.clearImmediate}).call(this,s(0))},function(n,a,s){(function(n,a){(function(n,s){if(!n.setImmediate){var c,k,_,C,E,T=1,j={},F=!1,M=n.document,L=Object.getPrototypeOf&&Object.getPrototypeOf(n);L=L&&L.setTimeout?L:n,{}.toString.call(n.process)==="[object process]"?c=function(n){a.nextTick((function(){m(n)}))}:function(){if(n.postMessage&&!n.importScripts){var a=!0,s=n.onmessage;return n.onmessage=function(){a=!1},n.postMessage("","*"),n.onmessage=s,a}}()?(C="setImmediate$"+Math.random()+"$",E=function(a){a.source===n&&typeof a.data=="string"&&a.data.indexOf(C)===0&&m(+a.data.slice(C.length))},n.addEventListener?n.addEventListener("message",E,!1):n.attachEvent("onmessage",E),c=function(a){n.postMessage(C+a,"*")}):n.MessageChannel?((_=new MessageChannel).port1.onmessage=function(n){m(n.data)},c=function(n){_.port2.postMessage(n)}):M&&"onreadystatechange"in M.createElement("script")?(k=M.documentElement,c=function(n){var a=M.createElement("script");a.onreadystatechange=function(){m(n),a.onreadystatechange=null,k.removeChild(a),a=null},k.appendChild(a)}):c=function(n){setTimeout(m,0,n)},L.setImmediate=function(n){typeof n!="function"&&(n=new Function(""+n));for(var a=new Array(arguments.length-1),s=0;s<a.length;s++)a[s]=arguments[s+1];var k={callback:n,args:a};return j[T]=k,c(T),T++},L.clearImmediate=g}function g(n){delete j[n]}function m(n){if(F)setTimeout(m,0,n);else{var a=j[n];if(a){F=!0;try{(function(n){var a=n.callback,c=n.args;switch(c.length){case 0:a();break;case 1:a(c[0]);break;case 2:a(c[0],c[1]);break;case 3:a(c[0],c[1],c[2]);break;default:a.apply(s,c)}})(a)}finally{g(n),F=!1}}}}})(typeof self>"u"?n===void 0?this:n:self)}).call(this,s(0),s(7))},function(n,a){var s,c,k=n.exports={};function d(){throw new Error("setTimeout has not been defined")}function b(){throw new Error("clearTimeout has not been defined")}function u(n){if(s===setTimeout)return setTimeout(n,0);if((s===d||!s)&&setTimeout)return s=setTimeout,setTimeout(n,0);try{return s(n,0)}catch{try{return s.call(null,n,0)}catch{return s.call(this,n,0)}}}(function(){try{s=typeof setTimeout=="function"?setTimeout:d}catch{s=d}try{c=typeof clearTimeout=="function"?clearTimeout:b}catch{c=b}})();var _,C=[],E=!1,T=-1;function v(){E&&_&&(E=!1,_.length?C=_.concat(C):T=-1,C.length&&t())}function t(){if(!E){var n=u(v);E=!0;for(var a=C.length;a;){for(_=C,C=[];++T<a;)_&&_[T].run();T=-1,a=C.length}_=null,E=!1,function(n){if(c===clearTimeout)return clearTimeout(n);if((c===b||!c)&&clearTimeout)return c=clearTimeout,clearTimeout(n);try{c(n)}catch{try{return c.call(null,n)}catch{return c.call(this,n)}}}(n)}}function e(n,a){this.fun=n,this.array=a}function l(){}k.nextTick=function(n){var a=new Array(arguments.length-1);if(arguments.length>1)for(var s=1;s<arguments.length;s++)a[s-1]=arguments[s];C.push(new e(n,a)),C.length!==1||E||u(t)},e.prototype.run=function(){this.fun.apply(null,this.array)},k.title="browser",k.browser=!0,k.env={},k.argv=[],k.version="",k.versions={},k.on=l,k.addListener=l,k.once=l,k.off=l,k.removeListener=l,k.removeAllListeners=l,k.emit=l,k.prependListener=l,k.prependOnceListener=l,k.listeners=function(n){return[]},k.binding=function(n){throw new Error("process.binding is not supported")},k.cwd=function(){return"/"},k.chdir=function(n){throw new Error("process.chdir is not supported")},k.umask=function(){return 0}},function(n,a,s){function o(n,a){for(var s=0;s<a.length;s++){var c=a[s];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(n,c.key,c)}}var c=s(9);n.exports=function(){function d(){(function(n,a){if(!(n instanceof a))throw new TypeError("Cannot call a class as a function")})(this,d)}var n,a,s;return n=d,s=[{key:"urlEncode",value:function(n){return c(n)}},{key:"jsonEncode",value:function(n){return JSON.stringify(n)}},{key:"formEncode",value:function(n){if(this.isFormData(n))return n;if(this.isFormElement(n))return new FormData(n);if(this.isObject(n)){var a=new FormData;return Object.keys(n).forEach((function(s){var c=n[s];a.append(s,c)})),a}throw new Error("`data` must be an instance of Object, FormData or <FORM> HTMLElement")}},{key:"isObject",value:function(n){return Object.prototype.toString.call(n)==="[object Object]"}},{key:"isFormData",value:function(n){return n instanceof FormData}},{key:"isFormElement",value:function(n){return n instanceof HTMLFormElement}},{key:"selectFiles",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return new Promise((function(a,s){var c=document.createElement("INPUT");c.type="file",n.multiple&&c.setAttribute("multiple","multiple"),n.accept&&c.setAttribute("accept",n.accept),c.style.display="none",document.body.appendChild(c),c.addEventListener("change",(function(n){var s=n.target.files;a(s),document.body.removeChild(c)}),!1),c.click()}))}},{key:"parseHeaders",value:function(n){var a=n.trim().split(/[\r\n]+/),s={};return a.forEach((function(n){var a=n.split(": "),c=a.shift(),k=a.join(": ");c&&(s[c]=k)})),s}}],(a=null)&&o(n.prototype,a),s&&o(n,s),d}()},function(n,a){var i=function(n){return encodeURIComponent(n).replace(/[!'()*]/g,escape).replace(/%20/g,"+")},o=function(n,a,s,c){return a=a||null,s=s||"&",c=c||null,n?function(n){for(var a=new Array,s=0;s<n.length;s++)n[s]&&a.push(n[s]);return a}(Object.keys(n).map((function(k){var _,C,E=k;if(c&&(E=c+"["+E+"]"),typeof n[k]=="object"&&n[k]!==null)_=o(n[k],null,s,E);else{a&&(C=E,E=!isNaN(parseFloat(C))&&isFinite(C)?a+Number(E):E);var T=n[k];T=(T=(T=(T=T===!0?"1":T)===!1?"0":T)===0?"0":T)||"",_=i(E)+"="+i(T)}return _}))).join(s).replace(/[!'()*]/g,""):""};n.exports=o}])}))})(_);var C=_.exports;const E=D(C);function O(n){return n&&typeof n.then=="function"}class q{
/**
   * @param {object} params - uploader module params
   * @param {ImageConfig} params.config - image tool config
   * @param {Function} params.onUpload - one callback for all uploading (file, url, d-n-d, pasting)
   * @param {Function} params.onError - callback for uploading errors
   */
constructor({config:n,onUpload:a,onError:s}){this.config=n,this.onUpload=a,this.onError=s
/**
   * Handle clicks on the upload file button
   * Fires ajax.transport()
   *
   * @param {Function} onPreview - callback fired when preview is ready
   */}uploadSelectedFile({onPreview:n}){const r=function(a){const s=new FileReader;s.readAsDataURL(a),s.onload=a=>{n(a.target.result)}};let a;if(this.config.uploader&&typeof this.config.uploader.uploadByFile=="function"){const n=this.config.uploader.uploadByFile;a=E.selectFiles({accept:this.config.types||"image/*"}).then((a=>{r(a[0]);const s=n(a[0]);return O(s)||console.warn("Custom uploader method uploadByFile should return a Promise"),s}))}else a=E.transport({url:this.config.endpoints.byFile,data:this.config.additionalRequestData,accept:this.config.types,headers:new Headers(this.config.additionalRequestHeaders),beforeSend:n=>{r(n[0])},fieldName:this.config.field}).then((n=>n.body));a.then((n=>{this.onUpload(n)})).catch((n=>{this.onError(n)}))}
/**
   * Handle clicks on the upload file button
   * Fires ajax.post()
   *
   * @param {string} url - image source url
   */uploadByUrl(n){let a;this.config.uploader&&typeof this.config.uploader.uploadByUrl=="function"?(a=this.config.uploader.uploadByUrl(n),O(a)||console.warn("Custom uploader method uploadByUrl should return a Promise")):a=E.post({url:this.config.endpoints.byUrl,data:Object.assign({url:n},this.config.additionalRequestData),type:E.contentType.JSON,headers:new Headers(this.config.additionalRequestHeaders)}).then((n=>n.body)),a.then((n=>{this.onUpload(n)})).catch((n=>{this.onError(n)}))
/**
   * Handle clicks on the upload file button
   * Fires ajax.post()
   *
   * @param {File} file - file pasted by drag-n-drop
   * @param {Function} onPreview - file pasted by drag-n-drop
   */}uploadByFile(n,{onPreview:a}){const s=new FileReader;s.readAsDataURL(n),s.onload=n=>{a(n.target.result)};let c;if(this.config.uploader&&typeof this.config.uploader.uploadByFile=="function")c=this.config.uploader.uploadByFile(n),O(c)||console.warn("Custom uploader method uploadByFile should return a Promise");else{const a=new FormData;a.append(this.config.field||"image",n),this.config.additionalRequestData&&Object.keys(this.config.additionalRequestData).length&&Object.entries(this.config.additionalRequestData).forEach((([n,s])=>{a.append(n,s)})),c=E.post({url:this.config.endpoints.byFile,data:a,type:E.contentType.JSON,headers:new Headers(this.config.additionalRequestHeaders)}).then((n=>n.body))}c.then((n=>{this.onUpload(n)})).catch((n=>{this.onError(n)}))}}
/**
 * Image Tool for the Editor.js
 *
 * @author CodeX <team@codex.so>
 * @license MIT
 * @see {@link https://github.com/editor-js/image}
 *
 * To developers.
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.ts — main Tool's interface, public API and methods for working with data
 *  2) uploader.ts — module that has methods for sending files via AJAX: from device, by URL or File pasting
 *  3) ui.ts — module for UI manipulations: render, showing preloader, etc
 *  4) tunes.js — working with Block Tunes: render buttons, handle clicks
 *
 * For debug purposes there is a testing server
 * that can save uploaded files and return a Response {@link UploadResponseFormat}
 *
 *       $ node dev/server.js
 *
 * It will expose 8008 port, so you can pass http://localhost:8008 with the Tools config:
 *
 * image: {
 *   class: ImageTool,
 *   config: {
 *     endpoints: {
 *       byFile: 'http://localhost:8008/uploadFile',
 *       byUrl: 'http://localhost:8008/fetchUrl',
 *     }
 *   },
 * },
 */class P{
/**
   * @param {object} tool - tool properties got from editor.js
   * @param {ImageToolData} tool.data - previously saved data
   * @param {ImageConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   * @param {boolean} tool.readOnly - read-only mode flag
   * @param {BlockAPI|{}} tool.block - current Block API
   */
constructor({data:n,config:a,api:s,readOnly:c,block:k}){this.api=s,this.readOnly=c,this.block=k,this.config={endpoints:a.endpoints,additionalRequestData:a.additionalRequestData,additionalRequestHeaders:a.additionalRequestHeaders,field:a.field,types:a.types,captionPlaceholder:this.api.i18n.t(a.captionPlaceholder?a.captionPlaceholder:"Caption"),buttonContent:a.buttonContent,uploader:a.uploader,actions:a.actions},this.uploader=new q({config:this.config,onUpload:n=>this.onUpload(n),onError:n=>this.uploadingFailed(n)}),this.ui=new x({api:s,config:this.config,onSelectFile:()=>{this.uploader.uploadSelectedFile({onPreview:n=>{this.ui.showPreloader(n)}})},readOnly:c}),this._data={caption:"",withBorder:!1,withBackground:!1,stretched:!1,file:{url:""}},this.data=n
/**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */}static get isReadOnlySupported(){return!0}
/**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */static get toolbox(){return{icon:s,title:"Image"}}
/**
   * Available image tools
   *
   * @returns {Array}
   */static get tunes(){return[{name:"withBorder",icon:a,title:"With border",toggle:!0},{name:"stretched",icon:c,title:"Stretch image",toggle:!0},{name:"withBackground",icon:n,title:"With background",toggle:!0}]}
/**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */render(){return this.ui.render(this.data)}
/**
   * Validate data: check if Image exists
   *
   * @param {ImageToolData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */validate(n){return!!n.file.url}
/**
   * Return Block data
   *
   * @public
   *
   * @returns {ImageToolData}
   */save(){const n=this.ui.nodes.caption;return this._data.caption=n.innerHTML,this.data
/**
   * Returns configuration for block tunes: add background, add border, stretch image
   *
   * @public
   *
   * @returns TunesMenuConfig
   */}renderSettings(){return P.tunes.concat(this.config.actions||[]).map((n=>({icon:n.icon,label:this.api.i18n.t(n.title),name:n.name,toggle:n.toggle,isActive:this.data[n.name],onActivate:()=>{typeof n.action!="function"?this.tuneToggled(n.name):n.action(n.name)}})))}appendCallback(){this.ui.nodes.fileButton.click()}
/**
   * Specify paste substitutes
   *
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @returns {{tags: string[], patterns: object<string, RegExp>, files: {extensions: string[], mimeTypes: string[]}}}
   */static get pasteConfig(){return{tags:[{img:{src:!0}}],patterns:{image:/https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?[a-z0-9=]*)?$/i},files:{mimeTypes:["image/*"]}}}
/**
   * Specify paste handlers
   *
   * @public
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param {CustomEvent} event - editor.js custom paste event
   *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   * @returns {void}
   */async onPaste(n){switch(n.type){case"tag":{const a=n.detail.data;if(/^blob:/.test(a.src)){const n=await(await fetch(a.src)).blob();this.uploadFile(n);break}this.uploadUrl(a.src);break}case"pattern":{const a=n.detail.data;this.uploadUrl(a);break}case"file":{const a=n.detail.file;this.uploadFile(a);break}}}
/**
   * Stores all Tool's data
   *
   * @private
   *
   * @param {ImageToolData} data - data in Image Tool format
   */set data(n){this.image=n.file,this._data.caption=n.caption||"",this.ui.fillCaption(this._data.caption),P.tunes.forEach((({name:a})=>{const s=typeof n[a]<"u"&&(n[a]===!0||n[a]==="true");this.setTune(a,s)}))
/**
   * Return Tool data
   *
   * @private
   *
   * @returns {ImageToolData}
   */}get data(){return this._data}
/**
   * Set new image file
   *
   * @private
   *
   * @param {object} file - uploaded file data
   */set image(n){this._data.file=n||{url:""},n&&n.url&&this.ui.fillImage(n.url)
/**
   * File uploading callback
   *
   * @private
   *
   * @param {UploadResponseFormat} response - uploading server response
   * @returns {void}
   */}onUpload(n){n.success&&n.file?this.image=n.file:this.uploadingFailed("incorrect response: "+JSON.stringify(n))}
/**
   * Handle uploader errors
   *
   * @private
   * @param {string} errorText - uploading error text
   * @returns {void}
   */uploadingFailed(n){console.log("Image Tool: uploading failed because of",n),this.api.notifier.show({message:this.api.i18n.t("Couldn’t upload image. Please try another."),style:"error"}),this.ui.hidePreloader()
/**
   * Callback fired when Block Tune is activated
   *
   * @private
   *
   * @param {string} tuneName - tune that has been clicked
   * @returns {void}
   */}tuneToggled(n){this.setTune(n,!this._data[n])}
/**
   * Set one tune
   *
   * @param {string} tuneName - {@link Tunes.tunes}
   * @param {boolean} value - tune state
   * @returns {void}
   */setTune(n,a){this._data[n]=a,this.ui.applyTune(n,a),n==="stretched"&&Promise.resolve().then((()=>{this.block.stretched=a})).catch((n=>{console.error(n)}))
/**
   * Show preloader and upload image file
   *
   * @param {File} file - file that is currently uploading (from paste)
   * @returns {void}
   */}uploadFile(n){this.uploader.uploadByFile(n,{onPreview:n=>{this.ui.showPreloader(n)}})}
/**
   * Show preloader and upload image by target url
   *
   * @param {string} url - url pasted
   * @returns {void}
   */uploadUrl(n){this.ui.showPreloader(n),this.uploader.uploadByUrl(n)}}export{P as default};

