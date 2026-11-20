const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!r(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,_?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+N,M=`<${k}>`,T=document,C=()=>T.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,P="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,D=/>/g,O=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,I=/"/g,R=/^(?:script|style|textarea|title)$/i,V=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),j=V(1),W=V(2),B=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),K=new WeakMap,X=T.createTreeWalker(T,129);function q(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=H;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===H?"!--"===l[1]?a=L:void 0!==l[1]?a=D:void 0!==l[2]?(R.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=O):void 0!==l[3]&&(a=O):a===O?">"===l[0]?(a=n??H,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?O:'"'===l[3]?I:z):a===I||a===z?a=O:a===L||a===D?a=H:(a=O,n=void 0);const d=a===O&&t[e+1].startsWith("/>")?" ":"";o+=a===H?i+M:c>=0?(s.push(r),i.slice(0,c)+E+i.slice(c)+N+d):i+N+(-2===c?e:d)}return[q(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[l,c]=Z(t,e);if(this.el=J.createElement(l,i),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[o++],i=s.getAttribute(t).split(N),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?it:"?"===a[1]?st:"@"===a[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(N)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(R.test(s.tagName)){const t=s.textContent.split(N),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),X.nextNode(),r.push({type:2,index:++n});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===k)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(N,t+1));)r.push({type:7,index:n}),t+=N.length-1}n++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===B)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=F(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);X.currentNode=s;let n=X.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new tt(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new ot(n,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(n=X.nextNode(),o++)}return X.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),F(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new J(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new tt(this.O(C()),this.O(C()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=Y(this,t,e,0),o=!F(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=Y(this,s[i+a],e,a),r===B&&(r=this._$AH[a]),o||=!F(r)||r!==this._$AH[a],r===G?t=G:t!==G&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class nt extends et{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??G)===B)return;const i=this._$AH,s=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(J,tt),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class lt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(C(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}lt._$litElement$=!0,lt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:lt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:lt}),(rt.litElementVersions??=[]).push("4.2.2");var ht="0.1.0";function dt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}const pt=new Map;let ut;function mt(t,e){let i=t.trim();const s=/^var\(\s*(--[^,)\s]+)\s*(?:,\s*([^)]+))?\)$/.exec(i);if(s){return i=(e?getComputedStyle(e).getPropertyValue(s[1]).trim():"")||s[2]?.trim()||"#000",mt(i)}const n=pt.get(i);if(n)return n;let o=ft(i);return o||"undefined"==typeof document||(ut??=document.createElement("canvas").getContext("2d"),ut&&(ut.fillStyle="#000",ut.fillStyle=i,o=ft(String(ut.fillStyle)))),o??=[0,0,0,1],pt.set(i,o),o}function ft(t){let e=/^#([0-9a-f]{3,8})$/i.exec(t);if(e){let t=e[1];if(3!==t.length&&4!==t.length||(t=[...t].map(t=>t+t).join("")),6!==t.length&&8!==t.length)return null;const i=e=>parseInt(t.slice(e,e+2),16);return[i(0),i(2),i(4),8===t.length?i(6)/255:1]}if(e=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(t),e){let t=1;return void 0!==e[4]&&(t=e[4].endsWith("%")?parseFloat(e[4])/100:parseFloat(e[4])),[+e[1],+e[2],+e[3],t]}return null}function _t([t,e,i,s]){const n=t=>Math.round(t);return s>=1?`rgb(${n(t)},${n(e)},${n(i)})`:`rgba(${n(t)},${n(e)},${n(i)},${+s.toFixed(3)})`}function gt(t){return t.filter(t=>t&&Number.isFinite(Number(t.value))&&t.color).map((t,e)=>({s:{value:Number(t.value),color:String(t.color)},i:e})).sort((t,e)=>t.s.value-e.s.value||t.i-e.i).map(t=>t.s)}function vt(t,e,i,s){const n=t.length;if(!n||!Number.isFinite(i))return s(t[0]?.color??"#000");if(i<t[0].value)return s(t[0].color);let o=0;for(;o+1<n&&t[o+1].value<=i;)o++;if("step"===e||o===n-1)return s(t[o].color);const a=t[o],r=t[o+1],l=(i-a.value)/(r.value-a.value);return function(t,e,i){return[t[0]+(e[0]-t[0])*i,t[1]+(e[1]-t[1])*i,t[2]+(e[2]-t[2])*i,t[3]+(e[3]-t[3])*i]}(s(a.color),s(r.color),l)}function $t(t,e,i,s){const n=Math.min(i,s),o=Math.max(i,s);if(n===o)return!1;if("step"===e)return t.some(t=>t.value>n&&t.value<=o);for(let e=0;e+1<t.length;e++)if(t[e].value===t[e+1].value&&t[e].value>n&&t[e].value<=o)return!0;return!1}const bt={"5minute":3e5,hour:36e5,day:864e5};class yt{constructor(){this.statT=[],this.statV=[],this.statsEnd=NaN,this.rawT=[],this.rawV=[],this.rawFrom=NaN,this.rawUntil=NaN,this.statsLoaded=!1,this.version=0}appendRaw(t,e){const i=this.rawT.length;return i&&t<=this.rawT[i-1]?t===this.rawT[i-1]&&!Object.is(e,this.rawV[i-1])&&(this.rawV[i-1]=e,this.version++,!0):(!i||!Object.is(e,this.rawV[i-1]))&&(this.rawT.push(t),this.rawV.push(e),this.version++,!0)}prune(t){const e=(e,i)=>{let s=St(e,t)-1;s>0&&(e.splice(0,s),i.splice(0,s),this.version++)};e(this.statT,this.statV),e(this.rawT,this.rawV)}series(){if(this.memo?.version===this.version)return this.memo.data;let t;if(this.statT.length)if(this.rawT.length){const e=Number.isFinite(this.rawFrom)?St(this.statT,this.rawFrom):this.statT.length,i=St(this.rawT,e?this.statT[e-1]+1:-1/0);t={t:this.statT.slice(0,e).concat(this.rawT.slice(i)),v:this.statV.slice(0,e).concat(this.rawV.slice(i))}}else t={t:this.statT,v:this.statV};else t={t:this.rawT,v:this.rawV};return this.memo={version:this.version,data:t},t}}const wt=new Map;function xt(t){let e=wt.get(t);if(!e&&(e=new yt,wt.set(t,e),wt.size>60)){const t=[...wt.entries()].sort((t,e)=>(t[1].lastUsed??0)-(e[1].lastUsed??0))[0];wt.delete(t[0])}return e.lastUsed=Date.now(),e}function St(t,e){let i=0,s=t.length;for(;i<s;){const n=i+s>>>1;t[n]<e?i=n+1:s=n}return i}const At=t=>{if("number"==typeof t)return t;if("string"!=typeof t||""===t)return NaN;const e=Number(t);return Number.isFinite(e)?e:NaN},Et=t=>"number"==typeof t?t<1e11?1e3*t:t:Date.parse(String(t));class Nt{constructor(t,e){var i,s;this.hass=t,this.opts=e,this.stores=new Map,this.unsubs=[],this.disposed=!1,this.changeScheduled=!1,this.entities=[...new Set(e.entities)],this.useStatistics=e.hoursToShow>e.statisticsThreshold,this.period=(i=e.hoursToShow,"5minute"===(s=e.statisticsPeriod)||"hour"===s||"day"===s?s:i<=72?"5minute":i<=1440?"hour":"day");const n=this.useStatistics?this.period:"raw";for(const t of this.entities)this.stores.set(t,xt(`${t}|${e.hoursToShow}|${n}`))}get windowStart(){return Date.now()-36e5*this.opts.hoursToShow}setHass(t){this.hass=t}series(t){return this.stores.get(t)?.series()}version(){let t=0;for(const e of this.stores.values())t+=e.version;return t}async start(){const t=this.windowStart;for(const e of this.stores.values())e.prune(t);if(this.useStatistics){const e=this.entities.filter(t=>!this.stores.get(t).statsLoaded);if(e.length&&(await this.loadStatistics(e,t),this.disposed))return}const e=new Map;for(const i of this.entities){const s=this.stores.get(i);let n;s.rawT.length||Number.isFinite(s.rawUntil)?n=Number.isFinite(s.rawUntil)?s.rawUntil:s.rawT[s.rawT.length-1]:(n=Number.isFinite(s.statsEnd)?s.statsEnd:t,s.rawFrom=n),n=Math.max(n,t),n=6e4*Math.floor(n/6e4);const o=e.get(n)??[];o.push(i),e.set(n,o)}for(const[t,i]of e)this.subscribe(t,i);if(this.useStatistics){const t=Math.max(bt[this.period],9e5);this.timer=window.setInterval(()=>this.compact(),t)}this.notify()}subscribe(t,e){this.hass.connection.subscribeMessage(t=>this.onStream(t),{type:"history/stream",entity_ids:e,start_time:new Date(t).toISOString(),minimal_response:!0,no_attributes:!0,significant_changes_only:!1}).then(t=>{this.disposed?t().catch(()=>{}):this.unsubs.push(t)},t=>console.warn("best-number-card: history subscription failed",t));for(const t of e)this.stores.get(t).rawUntil=NaN}onStream(t){if(!t?.states)return;let e=!1;for(const[i,s]of Object.entries(t.states)){const t=this.stores.get(i);if(t)for(const i of s){const s=Et(i.lu??i.lc);Number.isFinite(s)&&(e=t.appendRaw(s,At(i.s))||e)}}e&&this.notify()}async fetchStatistics(t,e){return this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(e).toISOString(),statistic_ids:t,period:this.period,types:["mean","state"]})}async loadStatistics(t,e){const i=Math.floor(e/bt[this.period])*bt[this.period];let s={};try{s=await this.fetchStatistics(t,i)}catch(t){console.warn("best-number-card: statistics unavailable, using history",t)}for(const e of t)this.applyStats(e,s[e]),this.stores.get(e).statsLoaded=!0}applyStats(t,e){const i=this.stores.get(t);if(!i||!e?.length)return;const s=bt[this.period];for(const t of e){const e=Et(t.start);if(!Number.isFinite(e)||i.statT.length&&e<=i.statT[i.statT.length-1])continue;const n=At(t.mean??t.state??NaN);i.statT.push(e),i.statV.push(n);const o=void 0!==t.end?Et(t.end):e+s;i.statsEnd=Number.isFinite(o)?o:e+s}i.version++}async compact(){const t=this.entities.filter(t=>Number.isFinite(this.stores.get(t).statsEnd));if(!t.length||"hidden"===document.visibilityState)return;const e=Math.min(...t.map(t=>this.stores.get(t).statsEnd));let i;try{i=await this.fetchStatistics(t,e)}catch{return}if(!this.disposed){for(const e of t){const t=this.stores.get(e);this.applyStats(e,i[e]);const s=St(t.rawT,t.statsEnd)-1;s>0&&(t.rawT.splice(0,s),t.rawV.splice(0,s)),t.rawFrom=t.statsEnd,t.prune(this.windowStart),t.version++}this.notify()}}notify(){this.changeScheduled||this.disposed||(this.changeScheduled=!0,queueMicrotask(()=>{this.changeScheduled=!1,this.disposed||this.opts.onChange()}))}dispose(){if(this.disposed)return;this.disposed=!0,this.timer&&clearInterval(this.timer);const t=Date.now();for(const e of this.stores.values())Number.isFinite(e.rawUntil)||(e.rawUntil=t);for(const t of this.unsubs)t().catch(()=>{});this.unsubs=[]}}function kt(t,e,i,s){const n=new Float64Array(s).fill(NaN),o=new Float64Array(s).fill(NaN),a=new Float64Array(s).fill(NaN),r=new Uint8Array(s),{t:l,v:c}=t,h=l.length,d=(i-e)/s;let p=St(l,e),u=p>0?c[p-1]:NaN;for(let t=0;t<s;t++){const m=e+t*d,f=t===s-1?i:m+d;let _=m,g=0,v=0,$=1/0,b=-1/0,y=0,w=0;const x=(t,e,i)=>{if(!Number.isFinite(t))return;const s=i-e;s>0&&(g+=t*s,v+=s),t<$&&($=t,y=e),t>b&&(b=t,w=e)};for(;p<h&&l[p]<f;)x(u,_,l[p]),u=c[p],_=Math.max(l[p],m),p++;x(u,_,f),$!==1/0&&(n[t]=v>0?g/v:($+b)/2,o[t]=$,a[t]=b,r[t]=y<=w?1:0)}return{start:e,end:i,mean:n,min:o,max:a,minFirst:r}}function Mt(t,e,i,s){const n=t.mean.length,o=[];let a=[];const r=n>1?i/(n-1):0;for(let l=0;l<n;l++){const c=n>1?l*r:i;if(Number.isNaN(t.mean[l]))a.length&&o.push(a),a=[];else if(2===e&&t.max[l]-t.min[l]>0){const e=r/4,n=t.minFirst[l]?t.min[l]:t.max[l],o=t.minFirst[l]?t.max[l]:t.min[l];a.push([Math.max(0,c-e),s(n)],[Math.min(i,c+e),s(o)])}else a.push([c,s(t.mean[l])])}return a.length&&o.push(a),o}const Tt=t=>Math.round(10*t)/10;function Ct(t,e){if(!t.length)return"";if(1===t.length)return`M${Tt(t[0][0])},${Tt(t[0][1])}h0.01`;let i=`M${Tt(t[0][0])},${Tt(t[0][1])}`;if(!e||t.length<3){for(let e=1;e<t.length;e++)i+=`L${Tt(t[e][0])},${Tt(t[e][1])}`;return i}for(let e=1;e<t.length-1;e++){const[s,n]=t[e],o=(s+t[e+1][0])/2,a=(n+t[e+1][1])/2;i+=`Q${Tt(s)},${Tt(n)} ${Tt(o)},${Tt(a)}`}const s=t[t.length-1];return i+=`L${Tt(s[0])},${Tt(s[1])}`,i}function Ft(t,e,i){const s=t.mean.length;if(!s)return NaN;const n=Math.min(s-1,Math.max(0,Math.round(e/i*(s-1))));return t.mean[n]}function Ut(t){let e=1/0,i=-1/0;for(const s of t)for(let t=0;t<s.min.length;t++)s.min[t]<e&&(e=s.min[t]),s.max[t]>i&&(i=s.max[t]);return[e,i]}const Pt={"card.no_entities":"No entities configured","card.not_found":"Entity not available","card.all_hidden":"All entities hidden","editor.section.general":"General","editor.section.graph":"Graph","editor.section.data":"Data loading","editor.section.entities":"Entities","editor.section.interactions":"Interactions","editor.add_entity":"Add entity","editor.remove":"Remove","editor.move_up":"Move up","editor.move_down":"Move down","editor.color_scale":"Color scale","editor.color_scale_help":"Stops are sorted by value. Two stops with the same value create a hard jump (e.g. 95 orange + 95 dark red).","editor.add_stop":"Add color stop","editor.visibility":"Visibility","field.name":"Name","field.icon":"Icon","field.graph":"Graph type","field.detail":"Detail","field.hours_to_show":"Hours to show","field.height":"Graph height (px, empty = automatic)","field.smoothing":"Smooth line","field.value_display":"Values in header","field.legend_icon":"Marker next to values","field.end_labels":"Labels at the end of the line","field.tooltip":"Tooltip on hover","field.compact":"Start in compact mode","field.statistics_threshold":"Use long-term statistics above (hours)","field.statistics_period":"Statistics resolution","field.limits_min":"Minimum (all scales)","field.limits_max":"Maximum (all scales)","field.theme":"Theme","field.tap_action":"Tap action","field.hold_action":"Hold action","field.double_tap_action":"Double tap action","field.entity":"Entity","field.unit":"Unit","field.decimals":"Decimals","field.color":"Line color (without color scale)","field.color_scale_mode":"Color scale mode","field.scale":"Scale group (same name = shared y-axis)","field.min":"Minimum","field.max":"Maximum","field.fill":"Fill area","field.fill_gradient":"Fill coloring (with color scale)","field.line_width":"Line width","field.show_value":"Show value","field.show_graph":"Show in graph","field.hide_below":"Hide while below","field.hide_above":"Hide while above","field.hide_unavailable":"Hide while unavailable","field.value":"Value","opt.line":"Line","opt.none":"None","opt.detail_1":"Low (smooth average)","opt.detail_2":"High (keeps every peak)","opt.primary":"First entity only (like sensor card)","opt.all":"All entities","opt.dot":"Colored dot","opt.icon":"Icon","opt.value":"Current value","opt.icon_value":"Icon and value","opt.auto":"Automatic","opt.5minute":"5 minutes","opt.hour":"Hour","opt.day":"Day","opt.gradient":"Gradient","opt.step":"Steps","opt.fill_value":"By value (horizontal color bands)","opt.fill_time":"Along time (vertical color bands)"},Ht={en:Pt,de:{"card.no_entities":"Keine Entitäten konfiguriert","card.not_found":"Entität nicht verfügbar","card.all_hidden":"Alle Entitäten ausgeblendet","editor.section.general":"Allgemein","editor.section.graph":"Diagramm","editor.section.data":"Datenabfrage","editor.section.entities":"Entitäten","editor.section.interactions":"Interaktionen","editor.add_entity":"Entität hinzufügen","editor.remove":"Entfernen","editor.move_up":"Nach oben","editor.move_down":"Nach unten","editor.color_scale":"Farbskala","editor.color_scale_help":"Die Stufen werden nach Wert sortiert. Zwei Stufen mit gleichem Wert erzeugen einen harten Sprung (z. B. 95 orange + 95 dunkelrot).","editor.add_stop":"Farbstufe hinzufügen","editor.visibility":"Sichtbarkeit","field.name":"Name","field.icon":"Symbol","field.graph":"Diagrammtyp","field.detail":"Detailgrad","field.hours_to_show":"Angezeigte Stunden","field.height":"Diagrammhöhe (px, leer = automatisch)","field.smoothing":"Linie glätten","field.value_display":"Werte in der Kopfzeile","field.legend_icon":"Markierung neben den Werten","field.end_labels":"Beschriftung am Linienende","field.tooltip":"Tooltip beim Überfahren","field.compact":"Im Kompaktmodus starten","field.statistics_threshold":"Langzeitstatistik verwenden ab (Stunden)","field.statistics_period":"Auflösung der Statistik","field.limits_min":"Minimum (alle Skalen)","field.limits_max":"Maximum (alle Skalen)","field.theme":"Design","field.tap_action":"Aktion beim Tippen","field.hold_action":"Aktion beim Halten","field.double_tap_action":"Aktion bei Doppeltippen","field.entity":"Entität","field.unit":"Einheit","field.decimals":"Nachkommastellen","field.color":"Linienfarbe (ohne Farbskala)","field.color_scale_mode":"Art der Farbskala","field.scale":"Skalengruppe (gleicher Name = gemeinsame Y-Achse)","field.min":"Minimum","field.max":"Maximum","field.fill":"Fläche füllen","field.fill_gradient":"Färbung der Füllung (mit Farbskala)","field.line_width":"Linienstärke","field.show_value":"Wert anzeigen","field.show_graph":"Im Diagramm anzeigen","field.hide_below":"Ausblenden, solange unter","field.hide_above":"Ausblenden, solange über","field.hide_unavailable":"Ausblenden, solange nicht verfügbar","field.value":"Wert","opt.line":"Linie","opt.none":"Keine","opt.detail_1":"Niedrig (geglätteter Mittelwert)","opt.detail_2":"Hoch (alle Spitzen bleiben erhalten)","opt.primary":"Nur erste Entität (wie Sensorkarte)","opt.all":"Alle Entitäten","opt.dot":"Farbiger Punkt","opt.icon":"Symbol","opt.value":"Aktueller Wert","opt.icon_value":"Symbol und Wert","opt.auto":"Automatisch","opt.5minute":"5 Minuten","opt.hour":"Stunde","opt.day":"Tag","opt.gradient":"Verlauf","opt.step":"Stufen","opt.fill_value":"Nach Wert (horizontale Farbbänder)","opt.fill_time":"Entlang der Zeit (vertikale Farbbänder)"}};function Lt(t,e){const i=(t?.locale?.language??t?.language??"en").split("-")[0];return Ht[i]?.[e]??Pt[e]??e}const Dt=new Map;function Ot(t,e,i){if(!Number.isFinite(e))return"–";const s=function(t){const e=t?.locale?.language??t?.language??"en";switch(t?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de-DE";case"space_comma":return"fr-FR";case"system":return;default:return e}}(t),n="none"===t?.locale?.number_format,o=`${s}|${i}|${n}`;let a=Dt.get(o);return a||(a=new Intl.NumberFormat(s,{useGrouping:!n,...void 0!==i?{minimumFractionDigits:i,maximumFractionDigits:i}:{maximumFractionDigits:2}}),Dt.set(o,a)),a.format(e)}const zt="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",It={number:{mode:"box",step:"any"}};function Rt(t,e,i="opt."){return{select:{mode:"dropdown",options:e.map(e=>({value:e,label:Lt(t,`${i}${e}`)}))}}}function Vt(t){const e={};for(const[i,s]of Object.entries(t))null!=s&&""!==s&&(e[i]=s);return e}class jt extends lt{constructor(){super(...arguments),this._expanded=-1,this._l=t=>Lt(this.hass,t),this._computeLabel=t=>this._l(`field.${t.name}`)}setConfig(t){const e=(t.entities??[]).map(t=>"string"==typeof t?{entity:t}:t);this._config={...t,entities:e}}connectedCallback(){super.connectedCallback();const t=t=>customElements.get(t)?.getConfigElement?.();customElements.get("ha-form")||t("hui-button-card"),customElements.get("ha-entity-picker")||t("hui-entities-card")}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_cardSchema(){const t=this.hass,e="toggle-compact"===this._config?.tap_action?.action;return[{type:"expandable",flatten:!0,expanded:!0,title:this._l("editor.section.general"),schema:[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"value_display",selector:Rt(t,["all","primary","none"])},{name:"legend_icon",selector:Rt(t,["dot","icon","none"])},{name:"compact",selector:{boolean:{}}},{name:"theme",selector:{theme:{}}}]},{type:"expandable",flatten:!0,title:this._l("editor.section.graph"),schema:[{type:"grid",name:"",schema:[{name:"graph",selector:Rt(t,["line","none"])},{name:"detail",selector:Rt(t,["1","2"],"opt.detail_")},{name:"hours_to_show",selector:{number:{mode:"box",min:.1,step:"any"}}},{name:"height",selector:{number:{mode:"box",min:20,step:1}}},{name:"limits_min",selector:It},{name:"limits_max",selector:It}]},{name:"end_labels",selector:Rt(t,["none","value","icon","icon_value"])},{name:"fill_gradient",selector:Rt(t,["value","time"],"opt.fill_")},{type:"grid",name:"",schema:[{name:"smoothing",selector:{boolean:{}}},{name:"tooltip",selector:{boolean:{}}}]}]},{type:"expandable",flatten:!0,title:this._l("editor.section.data"),schema:[{type:"grid",name:"",schema:[{name:"statistics_threshold",selector:{number:{mode:"box",min:0,step:"any"}}},{name:"statistics_period",selector:Rt(t,["auto","5minute","hour","day"])}]}]},{type:"expandable",flatten:!0,title:this._l("editor.section.interactions"),schema:[{name:"compact_on_tap",selector:{boolean:{}}},...e?[]:[{name:"tap_action",selector:{ui_action:{}}}],{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}]}_defaults(){return{graph:"line",detail:1,hours_to_show:24,smoothing:!0,tooltip:!0,compact:!1,statistics_threshold:6,statistics_period:"auto",end_labels:"none",legend_icon:"dot",fill_gradient:"value",value_display:1===this._config.entities.length?"primary":"all"}}_cardData(){const t=this._config;return{...this._defaults(),...t,detail:String(t.detail??1),limits_min:t.limits?.min,limits_max:t.limits?.max,compact_on_tap:"toggle-compact"===t.tap_action?.action}}_cardChanged(t){t.stopPropagation();const{limits_min:e,limits_max:i,compact_on_tap:s,entities:n,...o}=t.detail.value,a={...o,entities:this._config.entities},r=Vt({min:e,max:i});Object.keys(r).length?a.limits=r:delete a.limits,s?a.tap_action={action:"toggle-compact"}:"toggle-compact"===a.tap_action?.action&&delete a.tap_action,void 0!==a.detail&&(a.detail=Number(a.detail));for(const[t,e]of Object.entries(this._defaults()))a[t]!==e||t in this._config||delete a[t];this._emit(Vt(a))}_entitySchema(t){const e=this.hass;return[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"unit",selector:{text:{}}},{name:"decimals",selector:{number:{mode:"box",min:0,max:6,step:1}}},{name:"color",selector:{text:{}}},{name:"line_width",selector:{number:{mode:"box",min:.5,max:12,step:.5}}},{name:"scale",selector:{text:{}}},{name:"color_scale_mode",selector:Rt(e,["gradient","step"])},{name:"fill_gradient",selector:Rt(e,["value","time"],"opt.fill_")},{name:"min",selector:It},{name:"max",selector:It}]},{type:"grid",name:"",schema:[{name:"show_value",selector:{boolean:{}}},{name:"show_graph",selector:{boolean:{}}},{name:"fill",selector:{boolean:{}}}]},{type:"expandable",flatten:!0,title:this._l("editor.visibility"),expanded:void 0!==t.hide_below||void 0!==t.hide_above||!!t.hide_unavailable,schema:[{type:"grid",name:"",schema:[{name:"hide_below",selector:It},{name:"hide_above",selector:It}]},{name:"hide_unavailable",selector:{boolean:{}}}]}]}_updateEntity(t,e){const i=[...this._config.entities];null===e?i.splice(t,1):i[t]=Vt(e),this._emit({...this._config,entities:i})}_move(t,e){const i=[...this._config.entities],s=t+e;s<0||s>=i.length||([i[t],i[s]]=[i[s],i[t]],this._expanded=s,this._emit({...this._config,entities:i}))}_addEntity(t){t.stopPropagation();const e=t.detail.value?.entity;if(!e)return;const i=[...this._config.entities,{entity:e}];this._expanded=i.length-1,this._emit({...this._config,entities:i}),t.target.data={}}_setStops(t,e){const i={...this._config.entities[t]};e.length?i.color_scale=e:delete i.color_scale,this._updateEntity(t,i)}_renderStops(t,e){const i=e.color_scale??[],s=(e,s)=>{const n=i.map((t,i)=>i===e?{...t,...s}:t);this._setStops(t,n)};return j`<div class="stops">
      <div class="stops-title">${this._l("editor.color_scale")}</div>
      <div class="help">${this._l("editor.color_scale_help")}</div>
      ${i.map((e,n)=>j`<div class="stop">
          <input
            type="color"
            .value=${function(t){if(/^#[0-9a-f]{6}$/i.test(t))return t;if(/^#[0-9a-f]{3}$/i.test(t))return"#"+[...t.slice(1)].map(t=>t+t).join("");try{const e=document.createElement("canvas").getContext("2d");e.fillStyle="#000",e.fillStyle=t;const i=String(e.fillStyle);if(i.startsWith("#"))return i}catch{}return"#000000"}(e.color)}
            @change=${t=>s(n,{color:t.target.value})}
          />
          <ha-form
            .hass=${this.hass}
            .data=${{value:e.value,color:e.color}}
            .schema=${[{type:"grid",name:"",schema:[{name:"value",selector:It},{name:"color",selector:{text:{}}}]}]}
            .computeLabel=${this._computeLabel}
            @value-changed=${t=>{t.stopPropagation(),s(n,{value:Number(t.detail.value.value??0),color:t.detail.value.color??""})}}
          ></ha-form>
          <ha-icon-button
            .label=${this._l("editor.remove")}
            .path=${zt}
            @click=${()=>this._setStops(t,i.filter((t,e)=>e!==n))}
          ></ha-icon-button>
        </div>`)}
      <div class="stop-actions">
        <button
          class="text-button"
          @click=${()=>{const e=i[i.length-1];this._setStops(t,[...i,{value:e?Number(e.value)+10:0,color:e?.color??"#ff0000"}])}}
        >
          + ${this._l("editor.add_stop")}
        </button>
        ${i.length>1?j`<button class="text-button" @click=${()=>this._setStops(t,gt(i))}>↕ sort</button>`:G}
      </div>
    </div>`}_renderEntity(t,e){const i=this._config.entities.length,s=t.name||this.hass?.states[t.entity]?.attributes.friendly_name||t.entity;return j`<ha-expansion-panel
      outlined
      .expanded=${this._expanded===e}
      @expanded-changed=${t=>{t.detail.expanded?this._expanded=e:this._expanded===e&&(this._expanded=-1)}}
    >
      <div slot="header" class="panel-header">
        <span class="swatch" style="background:${t.color_scale?.[0]?.color??t.color??"var(--accent-color)"}"></span>
        <span class="panel-title">${s}</span>
      </div>
      <div class="panel-body">
        <div class="row-actions">
          <ha-icon-button .label=${this._l("editor.move_up")} .path=${"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"} .disabled=${0===e} @click=${()=>this._move(e,-1)}></ha-icon-button>
          <ha-icon-button .label=${this._l("editor.move_down")} .path=${"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"} .disabled=${e===i-1} @click=${()=>this._move(e,1)}></ha-icon-button>
          <ha-icon-button .label=${this._l("editor.remove")} .path=${zt} @click=${()=>this._updateEntity(e,null)}></ha-icon-button>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${{show_value:!0,show_graph:!0,color_scale_mode:"gradient",...t}}
          .schema=${this._entitySchema(t)}
          .computeLabel=${this._computeLabel}
          @value-changed=${i=>{i.stopPropagation();const s={...i.detail.value};"gradient"!==s.color_scale_mode||t.color_scale_mode||delete s.color_scale_mode,!0===s.show_value&&void 0===t.show_value&&delete s.show_value,!0===s.show_graph&&void 0===t.show_graph&&delete s.show_graph,s.color_scale&&(s.color_scale=t.color_scale),this._updateEntity(e,s)}}
        ></ha-form>
        ${this._renderStops(e,t)}
      </div>
    </ha-expansion-panel>`}render(){return this.hass&&this._config?j`
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <div class="section-title">${this._l("editor.section.entities")}</div>
      <div class="entities">${this._config.entities.map((t,e)=>this._renderEntity(t,e))}</div>
      <ha-form
        class="add"
        .hass=${this.hass}
        .data=${{}}
        .schema=${[{name:"entity",selector:{entity:{}}}]}
        .computeLabel=${()=>this._l("editor.add_entity")}
        @value-changed=${this._addEntity}
      ></ha-form>
    `:G}}jt.properties={hass:{attribute:!1},_config:{state:!0},_expanded:{state:!0}},jt.styles=o`
    :host {
      display: block;
    }
    .section-title {
      margin: 24px 0 8px;
      font-weight: 500;
      font-size: 16px;
    }
    .entities {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .add {
      display: block;
      margin-top: 12px;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .panel-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex: none;
    }
    .panel-body {
      padding: 0 4px 12px;
    }
    .row-actions {
      display: flex;
      justify-content: flex-end;
    }
    .stops {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .stops-title {
      font-weight: 500;
    }
    .help {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin: 4px 0 8px;
    }
    .stop {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .stop ha-form {
      flex: 1;
    }
    .stop input[type="color"] {
      width: 36px;
      height: 36px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      flex: none;
    }
    .stop-actions {
      display: flex;
      gap: 8px;
    }
    .text-button {
      background: none;
      border: none;
      color: var(--primary-color);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      padding: 8px 4px;
    }
  `,customElements.get("best-number-card-editor")||customElements.define("best-number-card-editor",jt);const Wt=ht,Bt=["#44739e","#984ea3","#00d2d5","#ff7f00","#af8d00","#7f80cd","#b3e900","#c42e60","#a65628","#f781bf","#8dd3c7","#bebada"],Gt=24,Kt="line",Xt=6,qt=!0,Zt="none",Jt="dot";let Yt=0;class Qt extends lt{constructor(){super(...arguments),this._compact=!1,this._width=0,this._hoverX=null,this._tick=0,this._uid="bnc"+ ++Yt,this._cfgVersion=0,this._dsKey="",this._dsStarted=0,this._lastTick=0,this._held=!1,this._resolve=t=>mt(t,this),this._onPointerDown=t=>{this._held=!1,this._down={x:t.clientX,y:t.clientY},this._config?.hold_action&&"none"!==this._config.hold_action.action&&(clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._held=!0,this._doAction("hold",t)},500))},this._onPointerUp=()=>clearTimeout(this._holdTimer),this._onClick=t=>{if(clearTimeout(this._holdTimer),this._held)return void(this._held=!1);if(this._down&&Math.hypot(t.clientX-this._down.x,t.clientY-this._down.y)>10)return;const e=this._config?.double_tap_action;if(e&&"none"!==e.action)return this._clickTimer?(clearTimeout(this._clickTimer),this._clickTimer=void 0,void this._doAction("double_tap",t)):void(this._clickTimer=window.setTimeout(()=>{this._clickTimer=void 0,this._doAction("tap",t)},250));this._doAction("tap",t)},this._onMove=t=>{if(!1===this._config?.tooltip||!this._model)return;const e=t.currentTarget.getBoundingClientRect(),i=t.clientX-e.left;this._hoverX=i>=0&&i<=this._model.plotW?i:null},this._onLeave=()=>{this._hoverX=null}}static getConfigElement(){return document.createElement("best-number-card-editor")}static getStubConfig(t){return{entities:Object.keys(t.states).filter(e=>e.startsWith("sensor.")&&t.states[e].attributes.unit_of_measurement&&!isNaN(Number(t.states[e].state))).slice(0,2).map(t=>({entity:t}))}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=(Array.isArray(t.entities)?t.entities:t.entity?[t.entity]:[]).map(t=>"string"==typeof t?{entity:t}:{...t}).filter(t=>t&&"string"==typeof t.entity);if(!e.length)throw new Error("Please define at least one entity");for(const t of e)t.color_scale&&(t.color_scale=gt(t.color_scale));const i=this._config;this._cfgVersion++,this._config={...t,entities:e},i&&i.compact===t.compact||(this._compact=!!t.compact)}getCardSize(){return this._compact?1:3}getGridOptions(){return{columns:6,min_columns:3,min_rows:1}}connectedCallback(){super.connectedCallback(),this._syncDataSource()}disconnectedCallback(){super.disconnectedCallback(),this._disposeDataSource(),this._ro?.disconnect(),this._ro=void 0,this._graphEl=void 0}shouldUpdate(t){if(!this._config)return!1;if(t.size>1||!t.has("hass"))return!0;const e=t.get("hass");return!e||!this.hass||(e.themes!==this.hass.themes||e.locale!==this.hass.locale||e.language!==this.hass.language||this._config.entities.some(t=>e.states[t.entity]!==this.hass.states[t.entity]))}willUpdate(t){(t.has("hass")||t.has("_config")||t.has("_compact"))&&this._syncDataSource(),this.hass&&this._config?.theme&&(t.has("_config")||t.has("hass"))&&this._applyTheme()}updated(){const t=this.renderRoot.querySelector(".graph");t!==this._graphEl&&(this._ro?.disconnect(),this._graphEl=t??void 0,t&&(this._ro??=new ResizeObserver(t=>{const e=Math.round(t[0].contentRect.width);e&&e!==this._width&&(this._width=e)}),this._ro.observe(t)))}_visible(){return this._config.entities.filter(t=>!this._isHidden(t))}_isHidden(t){const e=this.hass?.states[t.entity],i=e?Number(e.state):NaN,s=void 0!==e&&""!==e.state&&Number.isFinite(i);return!(!t.hide_unavailable||s)||(!!(s&&void 0!==t.hide_below&&null!==t.hide_below&&i<Number(t.hide_below))||!!(s&&void 0!==t.hide_above&&null!==t.hide_above&&i>Number(t.hide_above)))}get _hours(){const t=Number(this._config?.hours_to_show??Gt);return t>0?t:Gt}_graphEntities(){return this._visible().filter(t=>!1!==t.show_graph)}_syncDataSource(){const t=this._config;if(!t||!this.hass||!this.isConnected)return;const e=!this._compact&&"none"!==(t.graph??Kt)?this._graphEntities().map(t=>t.entity):[],i=Number(t.statistics_threshold??Xt),s=e.length?JSON.stringify([e,this._hours,i,t.statistics_period??"auto"]):"";if(s===this._dsKey)return void this._ds?.setHass(this.hass);if(this._disposeDataSource(),this._dsKey=s,!s)return;this._ds=new Nt(this.hass,{entities:e,hoursToShow:this._hours,statisticsThreshold:i,statisticsPeriod:t.statistics_period,onChange:()=>this._scheduleTick()}),this._dsStarted=Date.now(),this._ds.start().catch(t=>console.warn("best-number-card:",t));const n=36e5*this._hours/Math.max(this._width||400,100);this._ticker=window.setInterval(()=>this._scheduleTick(),Math.min(Math.max(2*n,5e3),3e5))}_disposeDataSource(){this._ds?.dispose(),this._ds=void 0,this._dsKey="",clearInterval(this._ticker),clearTimeout(this._tickTimer),this._tickTimer=void 0}_scheduleTick(){if(void 0!==this._tickTimer)return;const t=Date.now(),e=36e5*this._hours/Math.max(this._width||400,100),i=t-this._dsStarted<5e3?100:Math.min(Math.max(e,1e3),3e4),s=Math.max(0,this._lastTick+i-t);this._tickTimer=window.setTimeout(()=>{this._tickTimer=void 0,this._lastTick=Date.now(),this._tick++},s)}_state(t){return this.hass?.states[t.entity]}_name(t){const e=this._state(t);return t.name??e?.attributes.friendly_name??t.entity}_unit(t){return t.unit??this._state(t)?.attributes.unit_of_measurement??""}_decimals(t,e){if(void 0!==t.decimals&&null!==t.decimals&&""!==t.decimals)return Number(t.decimals);const i=this.hass?.entities?.[t.entity]?.display_precision;if("number"==typeof i)return i;if(void 0!==e){const t=/\.(\d+)$/.exec(e);return t?Math.min(t[1].length,4):0}}_formatState(t){const e=this._state(t);if(!e)return Lt(this.hass,"card.not_found");const i=Number(e.state);return""!==e.state&&Number.isFinite(i)?Ot(this.hass,i,this._decimals(t,e.state)):this.hass?.formatEntityState?.(e)??e.state}_formatValue(t,e){const i=this._decimals(t,this._state(t)?.state);return Ot(this.hass,e,void 0===i?1:i)}_baseColor(t){if(t.color)return t.color;const e=this._config.entities.indexOf(t);if(e<=0)return"var(--accent-color)";return`var(--graph-color-${e+1}, ${Bt[(e-1)%Bt.length]})`}_colorFor(t,e){return t.color_scale?.length&&Number.isFinite(e)?_t(vt(t.color_scale,t.color_scale_mode??"gradient",e,this._resolve)):this._baseColor(t)}_current(t){const e=this._state(t);return e&&""!==e.state?Number(e.state):NaN}_applyTheme(){const t=this.hass?.themes?.themes?.[this._config.theme];if(t)for(const[e,i]of Object.entries(t))"string"==typeof i&&this.style.setProperty(`--${e}`,i)}_graphHeight(){const t=Number(this._config?.height);return t>0?t:Math.round(Math.min(Math.max((this._width||400)/5,56),140))}_labelMargin(t){const e=this._config?.end_labels??Zt;if("none"===e)return 0;let i=0;for(const s of t){let t=8;if("icon"!==e&&"icon_value"!==e||(t+=20),"value"===e||"icon_value"===e){t+=7*`${this._formatState(s)} ${this._unit(s)}`.length+4}i=Math.max(i,t)}return i}_buildModel(){const t=this._config;if(!this._ds||!this._width)return;const e=this._graphEntities(),i=this._graphHeight(),s=Math.max(20,this._width-this._labelMargin(e)),n=2===Number(t.detail)?2:1,o=JSON.stringify([this._tick,this._cfgVersion,this._dsKey,this._width,i,s,n]);if(this._model?.key===o)return this._model;const a=Date.now(),r=a-36e5*this._hours,l=Math.max(2,Math.round(s/(2===n?2:8))),c=e.length>1,h=e.map(t=>({e:t,b:kt(this._ds.series(t.entity)??{t:[],v:[]},r,a,l)})),d=new Map;for(const{e:t,b:e}of h){const i=t.scale||"default",[s,n]=Ut([e]),o=d.get(i)??{lo:1/0,hi:-1/0};o.lo=Math.min(o.lo,s),o.hi=Math.max(o.hi,n),d.set(i,o)}for(const[i,s]of d){const n=e.filter(t=>(t.scale||"default")===i),o=n.map(t=>t.min).filter(t=>null!=t&&""!==t),a=n.map(t=>t.max).filter(t=>null!=t&&""!==t),r=o.length?Math.min(...o.map(Number)):t.limits?.min,l=a.length?Math.max(...a.map(Number)):t.limits?.max;null!=r&&(s.lo=Number(r)),null!=l&&(s.hi=Number(l)),Number.isFinite(s.lo)&&Number.isFinite(s.hi)||(s.lo=0,s.hi=1),s.hi<=s.lo&&(s.hi=s.lo+1,s.lo-=1)}const p=h.map(({e:e,b:o},a)=>{const{lo:r,hi:l}=d.get(e.scale||"default"),h=Number(e.line_width)>0?Number(e.line_width):c?3:4,p=h/2+2,u=i-h/2-2,m=t=>{const e=Math.min(Math.max(t,r),l);return u-(e-r)/(l-r)*(u-p)},f={cfg:e,index:a,buckets:o,segs:Mt(o,n,s,m),lo:r,hi:l,y:m,color:this._baseColor(e),lineWidth:h,fill:e.fill??!c};if(e.color_scale?.length){f.gradId=`${this._uid}-g${a}`;const i=e.color_scale_mode??"gradient";f.grad=function(t,e,i,s,n){const o=s-i;if(!(t.length&&o>0)){const s=_t(vt(t,e,i,n));return[{offset:0,color:s},{offset:1,color:s}]}const a=t=>(t-i)/o,r=[{offset:0,color:_t(vt(t,e,i,n))}];let l=vt(t,e,i,n);for(const o of t){if(o.value<=i||o.value>=s)continue;const t=a(o.value);"step"===e?(r.push({offset:t,color:_t(l)}),l=n(o.color),r.push({offset:t,color:_t(l)})):r.push({offset:t,color:_t(n(o.color))})}return r.push({offset:1,color:_t(vt(t,e,s,n))}),r}(e.color_scale,i,r,l,this._resolve),f.fill&&"time"===(e.fill_gradient??t.fill_gradient)&&(f.fillGradId=`${this._uid}-f${a}`,f.fillGrad=function(t,e,i,s){const n=i.length,o=i=>_t(vt(t,e,i,s)),a=[];let r=NaN,l=0;for(let s=0;s<n;s++){const c=i[s];if(!Number.isFinite(c))continue;const h=n>1?s/(n-1):0;if(Number.isFinite(r)&&$t(t,e,r,c)){const t=(l+h)/2;a.push({offset:t,color:o(r)},{offset:t,color:o(c)})}a.push({offset:h,color:o(c)}),r=c,l=h}if(!a.length){const t=o(NaN);return[{offset:0,color:t},{offset:1,color:t}]}return a.filter((t,e)=>0===e||e===a.length-1||t.color!==a[e-1].color||t.color!==a[e+1].color)}(e.color_scale,i,o.mean,this._resolve))}return f});return this._model={key:o,width:this._width,plotW:s,height:i,start:r,end:a,series:p},this._model}_entityFromEvent(t){for(const e of t.composedPath()){const t=e?.dataset?.entity;if(t)return t}}_doAction(t,e){const i=this._config,s=i[`${t}_action`]??("tap"===t?{action:"more-info"}:void 0);if(!s||!this.hass)return;if("toggle-compact"===s.action)return void(this._compact=!this._compact);let n=this._visible()[0]?.entity??i.entities[0].entity;"more-info"!==s.action||s.entity||(n=this._entityFromEvent(e)??n),function(t,e,i,s){if(!i||"none"===i.action)return!0;const n=i;switch(i.action){case"more-info":{const e=n.entity??s;return e&&dt(t,"hass-more-info",{entityId:e}),!0}case"toggle":return s&&e.callService("homeassistant","toggle",{entity_id:s}),!0;case"navigate":return n.navigation_path&&(history.pushState(null,"",n.navigation_path),dt(window,"location-changed",{replace:!1})),!0;case"url":return n.url_path&&window.open(n.url_path,!1===n.new_tab?"_self":"_blank"),!0;case"perform-action":case"call-service":{const t=n.perform_action??n.service;if(!t)return!0;const[i,s]=t.split(".",2);return e.callService(i,s,n.data??n.service_data,n.target),!0}default:;}}(this,this.hass,s,n)}render(){const t=this._config;if(!t||!this.hass)return G;const e=this._visible(),i=!this._compact&&"none"!==(t.graph??Kt);return j`
      <ha-card
        class=${this._compact?"compact":""}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onClick}
        tabindex="0"
      >
        ${this._compact?this._renderCompact(e):this._renderHeader(e)}
        ${i&&e.length?this._renderGraph():G}
      </ha-card>
    `}_renderIcon(t,e){const i=t?this._state(t):void 0;return j`<ha-state-icon .hass=${this.hass} .stateObj=${i} .icon=${e??t?.icon}></ha-state-icon>`}_renderMarker(t){const e=this._config.legend_icon??Jt;if("none"===e)return G;const i=this._colorFor(t,this._current(t));return"icon"===e?j`<span class="marker icon" style="color:${i}">${this._renderIcon(t)}</span>`:j`<span class="marker dot" style="background:${i}"></span>`}_valueStyle(t){return t.color_scale?.length?`color:${this._colorFor(t,this._current(t))}`:""}_renderHeader(t){const e=this._config,i=1===e.entities.length,s=t[0]??e.entities[0],n=e.value_display??(i?"primary":"all"),o=e.name??(i||"primary"===n?this._name(s):void 0),a=e.icon??(i||"primary"===n?void 0:null),r=void 0!==o||null!==a,l=r?j`<div class="header">
          <div class="name">${o??""}</div>
          ${null!==a?j`<div class="icon">${this._renderIcon(s,a)}</div>`:G}
        </div>`:G;if(!t.length)return j`${l}<div class="info empty">${Lt(this.hass,"card.all_hidden")}</div>`;if("none"===n)return j`${l}`;if("primary"===n)return j`${l}
        <div class="info" data-entity=${s.entity}>
          <span class="value" style=${this._valueStyle(s)}>${this._formatState(s)}</span>
          <span class="measurement">${this._unit(s)}</span>
        </div>`;const c=t.filter(t=>!1!==t.show_value),h=c.length>1;return j`${l}
      <div class="values ${h?"multi":""} ${r?"":"noheader"}">
        ${c.map(t=>j`<div class="item" data-entity=${t.entity}>
            ${h?j`<div class="item-name">${this._renderMarker(t)}<span>${this._name(t)}</span></div>`:G}
            <div class="item-value">
              <span class="value" style=${this._valueStyle(t)}>${this._formatState(t)}</span>
              <span class="measurement">${this._unit(t)}</span>
            </div>
          </div>`)}
      </div>`}_renderCompact(t){const e=this._config,i=t.filter(t=>!1!==t.show_value);return j`<div class="compact-row">
      ${e.name?j`<span class="compact-name">${e.name}</span>`:G}
      <div class="compact-values">
        ${i.length?i.map(t=>j`<span class="compact-item" data-entity=${t.entity} title=${this._name(t)}>
                ${i.length>1||"icon"===e.legend_icon?this._renderMarker(t):G}
                <span class="vm">
                  <span class="value" style=${this._valueStyle(t)}>${this._formatState(t)}</span>
                  <span class="measurement">${this._unit(t)}</span>
                </span>
              </span>`):j`<span class="empty">${Lt(this.hass,"card.all_hidden")}</span>`}
      </div>
    </div>`}_renderGraph(){const t=this._buildModel(),e=this._graphHeight();return j`<div
      class="graph"
      style="height:${e}px"
      @pointermove=${this._onMove}
      @pointerleave=${this._onLeave}
    >
      ${t?this._renderSvg(t):G} ${t?this._renderEndLabels(t):G}
      ${t?this._renderTooltip(t):G}
    </div>`}_renderSvg(t){const e=this._config.smoothing??qt,i=this._hoverX;return j`<svg width=${t.width} height=${t.height} viewBox="0 0 ${t.width} ${t.height}">
      <defs>
        ${t.series.map(t=>t.gradId?W`<linearGradient id=${t.gradId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${t.y(t.lo)} y2=${t.y(t.hi)}>
                ${t.grad.map(t=>W`<stop offset=${t.offset} stop-color=${t.color}></stop>`)}
              </linearGradient>`:G)}
        ${t.series.map(e=>e.fillGradId?W`<linearGradient id=${e.fillGradId} gradientUnits="userSpaceOnUse" x1="0" x2=${t.plotW} y1="0" y2="0">
                ${e.fillGrad.map(t=>W`<stop offset=${t.offset} stop-color=${t.color}></stop>`)}
              </linearGradient>`:G)}
      </defs>
      ${t.series.map(i=>{const s=i.gradId?`url(#${i.gradId})`:i.color,n=i.fillGradId?`url(#${i.fillGradId})`:s;return W`<g>
          ${i.fill?i.segs.map(i=>W`<path class="fill" d=${function(t,e,i){return t.length<2?"":`${Ct(t,e)}L${Tt(t[t.length-1][0])},${i}L${Tt(t[0][0])},${i}Z`}(i,e,t.height)} style="fill:${n}"></path>`):G}
          ${i.segs.map(t=>W`<path class="line" d=${Ct(t,e)} style="stroke:${s};stroke-width:${i.lineWidth}px"></path>`)}
        </g>`})}
      ${null!==i?W`<line class="cursor" x1=${i} x2=${i} y1="0" y2=${t.height}></line>
          ${t.series.map(e=>{const s=Ft(e.buckets,i,t.plotW);return Number.isFinite(s)?W`<circle class="dot" cx=${i} cy=${e.y(s)} r="4" style="fill:${this._colorFor(e.cfg,s)}"></circle>`:G})}`:G}
    </svg>`}_renderEndLabels(t){const e=this._config.end_labels??Zt;if("none"===e)return G;const i=t.series.map(e=>{const i=this._current(e.cfg),s=function(t){for(let e=t.length-1;e>=0;e--)if(Number.isFinite(t[e]))return t[e];return NaN}(e.buckets.mean),n=e.y(Number.isFinite(i)?i:s);return{s:e,v:i,y:Number.isFinite(n)?n:t.height/2}}).sort((t,e)=>t.y-e.y);for(let t=1;t<i.length;t++)i[t].y=Math.max(i[t].y,i[t-1].y+18);const s=i.length?i[i.length-1].y-(t.height-9):0;if(s>0)for(const t of i)t.y-=s;for(const t of i)t.y=Math.max(t.y,9);return j`${i.map(({s:i,v:s,y:n})=>{const o=this._colorFor(i.cfg,s);return j`<div class="end-label" data-entity=${i.cfg.entity} style="left:${t.plotW+4}px;top:${n}px;color:${o}">
        ${"icon"===e||"icon_value"===e?this._renderIcon(i.cfg):G}
        ${"value"===e||"icon_value"===e?j`<span>${this._formatState(i.cfg)}<small>${this._unit(i.cfg)?` ${this._unit(i.cfg)}`:""}</small></span>`:G}
      </div>`})}`}_renderTooltip(t){const e=this._hoverX;if(null===e)return G;const i=t.start+e/t.plotW*(t.end-t.start),s=t.series.map(i=>({s:i,v:Ft(i.buckets,e,t.plotW)})),n=e>t.width/2;return j`<div class="tooltip" style="${n?`right:${t.width-e+10}px`:`left:${e+10}px`}">
      <div class="tt-time">${function(t,e,i){const s=t?.locale?.language??t?.language??"en",n=t?.locale?.time_format,o="12"===n||"24"!==n&&void 0;return new Intl.DateTimeFormat(s,{...i?{day:"2-digit",month:"2-digit"}:{},hour:"2-digit",minute:"2-digit",hour12:o}).format(e)}(this.hass,i,this._hours>24)}</div>
      ${s.map(({s:e,v:i})=>j`<div class="tt-row">
          <span class="marker dot" style="background:${this._colorFor(e.cfg,i)}"></span>
          ${t.series.length>1?j`<span class="tt-name">${this._name(e.cfg)}</span>`:G}
          <span class="tt-value">${Number.isFinite(i)?this._formatValue(e.cfg,i):"–"} ${this._unit(e.cfg)}</span>
        </div>`)}
    </div>`}}Qt.properties={hass:{attribute:!1},_config:{state:!0},_compact:{state:!0},_width:{state:!0},_hoverX:{state:!0},_tick:{state:!0}},Qt.styles=o`
    :host {
      display: block;
    }
    ha-card {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      padding: 8px 16px 0;
      justify-content: space-between;
    }
    .name {
      color: var(--secondary-text-color);
      line-height: 40px;
      font-weight: 500;
      font-size: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon {
      color: var(--state-icon-color, var(--paper-item-icon-color));
      line-height: 40px;
    }
    .info {
      padding: 0 16px 16px;
      margin-top: -4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 28px;
    }
    .info.empty {
      color: var(--secondary-text-color);
      padding-top: 12px;
    }
    .value {
      font-size: 28px;
      margin-right: 4px;
      margin-inline-end: 4px;
    }
    .measurement {
      font-size: 18px;
      color: var(--secondary-text-color);
    }
    .values {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      padding: 0 16px 16px;
      margin-top: -4px;
    }
    .values.noheader {
      padding-top: 16px;
      margin-top: 0;
    }
    .values.multi .value {
      font-size: 24px;
    }
    .values.multi .measurement {
      font-size: 15px;
    }
    .item {
      min-width: 0;
    }
    .item-value {
      line-height: 28px;
      white-space: nowrap;
    }
    .item-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .marker.dot {
      display: inline-block;
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .marker.icon {
      --mdc-icon-size: 18px;
      display: inline-flex;
      align-items: center;
      line-height: 0;
    }
    .marker.icon ha-state-icon {
      display: flex;
    }
    .graph {
      position: relative;
      margin-top: auto;
      width: 100%;
      flex: none;
      touch-action: pan-y;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .fill {
      opacity: 0.15;
      stroke: none;
    }
    .cursor {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.7;
    }
    .dot {
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
    .end-label {
      position: absolute;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
      white-space: nowrap;
      pointer-events: auto;
      --mdc-icon-size: 18px;
    }
    .end-label small {
      font-size: 11px;
      opacity: 0.8;
    }
    .tooltip {
      position: absolute;
      top: 4px;
      z-index: 1;
      pointer-events: none;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      line-height: 18px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
    }
    .tt-time {
      color: var(--secondary-text-color);
    }
    .tt-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tt-value {
      margin-left: auto;
      font-weight: 500;
    }
    .compact-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      min-height: 40px;
      box-sizing: border-box;
    }
    .compact-name {
      color: var(--secondary-text-color);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 0 1 auto;
    }
    .compact-values {
      display: flex;
      flex-wrap: wrap;
      gap: 2px 16px;
      margin-left: auto;
      justify-content: flex-end;
    }
    .compact-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .compact-item .vm {
      display: inline-flex;
      align-items: baseline;
      gap: 3px;
      line-height: 24px;
    }
    .compact-item .value {
      font-size: 20px;
      margin: 0;
    }
    .compact-item .measurement {
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color);
    }
  `,customElements.get("best-number-card")||(customElements.define("best-number-card",Qt),console.info(`%c BEST-NUMBER-CARD %c v${Wt} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4")),window.customCards=window.customCards||[],window.customCards.some(t=>"best-number-card"===t.type)||window.customCards.push({type:"best-number-card",name:"Best Number Card",description:"Sensor card for multiple entities with color scales and efficient history loading.",preview:!0,documentationURL:"https://github.com/zitroaen/bestnumbercard"});export{Qt as BestNumberCard,Wt as VERSION};
