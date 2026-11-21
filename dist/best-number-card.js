const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,_?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,S=w.trustedTypes,k=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+N,M=`<${E}>`,T=document,H=()=>T.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,L="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,V=/>/g,U=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,O=/"/g,R=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),I=j(1),W=j(2),G=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),K=new WeakMap,X=T.createTreeWalker(T,129);function Y(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=z;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===z?"!--"===l[1]?r=D:void 0!==l[1]?r=V:void 0!==l[2]?(R.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=U):void 0!==l[3]&&(r=U):r===U?">"===l[0]?(r=o??z,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?U:'"'===l[3]?O:P):r===O||r===P?r=U:r===D||r===V?r=z:(r=U,o=void 0);const d=r===U&&t[e+1].startsWith("/>")?" ":"";n+=r===z?i+M:c>=0?(s.push(a),i.slice(0,c)+A+i.slice(c)+N+d):i+N+(-2===c?e:d)}return[Y(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=q.createElement(l,i),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[n++],i=s.getAttribute(t).split(N),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(N)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(R.test(s.tagName)){const t=s.textContent.split(N),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),X.nextNode(),a.push({type:2,index:++o});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(N,t+1));)a.push({type:7,index:o}),t+=N.length-1}o++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===G)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=C(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);X.currentNode=s;let o=X.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=X.nextNode(),n++)}return X.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),C(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=q.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new q(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=J(this,t,e,0),n=!C(t)||t!==this._$AH&&t!==G,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=J(this,s[i+r],e,r),a===G&&(a=this._$AH[r]),n||=!C(a)||a!==this._$AH[r],a===B?t=B:t!==B&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??B)===G)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(q,tt),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(H(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");var ht="0.9.0";function dt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}const pt=new Map;let ut;function mt(t,e){let i=t.trim();const s=/^var\(\s*(--[^,)\s]+)\s*(?:,\s*([^)]+))?\)$/.exec(i);if(s){return i=(e?getComputedStyle(e).getPropertyValue(s[1]).trim():"")||s[2]?.trim()||"#000",mt(i)}const o=pt.get(i);if(o)return o;let n=ft(i);return n||"undefined"==typeof document||(ut??=document.createElement("canvas").getContext("2d"),ut&&(ut.fillStyle="#000",ut.fillStyle=i,n=ft(String(ut.fillStyle)))),n??=[0,0,0,1],pt.set(i,n),n}function ft(t){let e=/^#([0-9a-f]{3,8})$/i.exec(t);if(e){let t=e[1];if(3!==t.length&&4!==t.length||(t=[...t].map(t=>t+t).join("")),6!==t.length&&8!==t.length)return null;const i=e=>parseInt(t.slice(e,e+2),16);return[i(0),i(2),i(4),8===t.length?i(6)/255:1]}if(e=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(t),e){let t=1;return void 0!==e[4]&&(t=e[4].endsWith("%")?parseFloat(e[4])/100:parseFloat(e[4])),[+e[1],+e[2],+e[3],t]}return null}function _t([t,e,i,s]){const o=t=>Math.round(t);return s>=1?`rgb(${o(t)},${o(e)},${o(i)})`:`rgba(${o(t)},${o(e)},${o(i)},${+s.toFixed(3)})`}function gt(t){return t.filter(t=>t&&Number.isFinite(Number(t.value))&&t.color).map((t,e)=>({s:{value:Number(t.value),color:String(t.color)},i:e})).sort((t,e)=>t.s.value-e.s.value||t.i-e.i).map(t=>t.s)}function bt(t,e,i,s){const o=t.length;if(!o||!Number.isFinite(i))return s(t[0]?.color??"#000");if(i<t[0].value)return s(t[0].color);let n=0;for(;n+1<o&&t[n+1].value<=i;)n++;if("step"===e||n===o-1)return s(t[n].color);const r=t[n],a=t[n+1],l=(i-r.value)/(a.value-r.value);return function(t,e,i){return[t[0]+(e[0]-t[0])*i,t[1]+(e[1]-t[1])*i,t[2]+(e[2]-t[2])*i,t[3]+(e[3]-t[3])*i]}(s(r.color),s(a.color),l)}function vt(t,e,i,s,o){const n=s-i;if(!(t.length&&n>0)){const s=_t(bt(t,e,i,o));return[{offset:0,color:s},{offset:1,color:s}]}const r=t=>(t-i)/n,a=[{offset:0,color:_t(bt(t,e,i,o))}];let l=bt(t,e,i,o);for(const n of t){if(n.value<=i||n.value>=s)continue;const t=r(n.value);"step"===e?(a.push({offset:t,color:_t(l)}),l=o(n.color),a.push({offset:t,color:_t(l)})):a.push({offset:t,color:_t(o(n.color))})}return a.push({offset:1,color:_t(bt(t,e,s,o))}),a}function xt(t,e,i,s){const o=Math.min(i,s),n=Math.max(i,s);if(o===n)return!1;if("step"===e)return t.some(t=>t.value>o&&t.value<=n);for(let e=0;e+1<t.length;e++)if(t[e].value===t[e+1].value&&t[e].value>o&&t[e].value<=n)return!0;return!1}const yt={"5minute":3e5,hour:36e5,day:864e5},wt=(()=>{try{return"1"===globalThis.localStorage?.getItem("best-number-card-debug")}catch{return!1}})(),$t=(...t)=>wt&&console.info("[best-number-card]",...t);class St{constructor(){this.statT=[],this.statV=[],this.statLo=[],this.statHi=[],this.statsEnd=NaN,this.rawT=[],this.rawV=[],this.rawFrom=NaN,this.rawUntil=NaN,this.statsLoaded=!1,this.preferRaw=!1,this.rawLoaded=!1,this.version=0,this.lastUsed=0,this.subscribers=new Set,this.live=!1}stopLive(t){this.live=!1,void 0!==this.pendingFrom?this.rawUntil=this.pendingFrom:Number.isFinite(this.rawUntil)||(this.rawUntil=t),this.pendingFrom=void 0}appendRaw(t,e){const i=this.rawT.length;return i&&t<=this.rawT[i-1]?t===this.rawT[i-1]&&!Object.is(e,this.rawV[i-1])&&(this.rawV[i-1]=e,this.version++,!0):(!i||!Object.is(e,this.rawV[i-1]))&&(this.rawT.push(t),this.rawV.push(e),this.version++,!0)}prune(t){const e=(e,i)=>{const s=Nt(e,t)-1;s>0&&(e.splice(0,s),i.splice(0,s),this.version++)},i=Nt(this.statT,t)-1;i>0&&(this.statLo.splice(0,i),this.statHi.splice(0,i)),e(this.statT,this.statV),e(this.rawT,this.rawV)}series(){if(this.memo?.version===this.version)return this.memo.data;let t;if(this.preferRaw)t=this.rawLoaded&&this.rawT.length||!this.statT.length?{t:this.rawT,v:this.rawV}:{t:this.statT,v:this.statV,lo:this.statLo,hi:this.statHi};else if(this.statT.length)if(this.rawT.length){const e=Number.isFinite(this.rawFrom)?Nt(this.statT,this.rawFrom):this.statT.length,i=e?Nt(this.rawT,Number.isFinite(this.rawFrom)?this.rawFrom:this.statT[e-1]+1):0,s=this.rawV.slice(i);t={t:this.statT.slice(0,e).concat(this.rawT.slice(i)),v:this.statV.slice(0,e).concat(s),lo:this.statLo.slice(0,e).concat(s),hi:this.statHi.slice(0,e).concat(s)}}else t={t:this.statT,v:this.statV,lo:this.statLo,hi:this.statHi};else t={t:this.rawT,v:this.rawV};return this.memo={version:this.version,data:t},t}notifySubscribers(){for(const t of this.subscribers)t.notify()}}const kt=new Map;function At(t){let e=kt.get(t);if(!e&&(e=new St,kt.set(t,e),kt.size>60)){const t=[...kt.entries()].filter(([,t])=>!t.subscribers.size),e=t.sort((t,e)=>t[1].lastUsed-e[1].lastUsed)[0];e&&kt.delete(e[0])}return e.lastUsed=Date.now(),e}function Nt(t,e){let i=0,s=t.length;for(;i<s;){const o=i+s>>>1;t[o]<e?i=o+1:s=o}return i}const Et=t=>{if("number"==typeof t)return t;if("string"!=typeof t||""===t)return NaN;const e=Number(t);return Number.isFinite(e)?e:NaN},Mt=t=>"number"==typeof t?t<1e11?1e3*t:t:Date.parse(String(t)),Tt=t=>6e4*Math.floor(t/6e4),Ht=t=>t.split("::")[0],Ct=t=>t.split("::")[1];class Ft{constructor(t,e){var i,s;this.hass=t,this.opts=e,this.stores=new Map,this.subs=[],this.timers=[],this.disposed=!1,this.changeScheduled=!1,this.wasDisconnected=!1,this.onDisconnected=()=>{this.wasDisconnected=!0;const t=Date.now();for(const e of this.stores.values())e.owner===this&&e.stopLive(t);this.subs=[]},this.onReady=()=>{this.wasDisconnected&&!this.disposed&&(this.wasDisconnected=!1,this.subscribeGrouped(this.entities.filter(t=>this.stores.get(t).owner===this&&!this.stores.get(t).live)))},this.entities=[...new Set(e.entities)],this.useStatistics=e.hoursToShow>e.statisticsThreshold,this.period=(i=e.hoursToShow,"5minute"===(s=e.statisticsPeriod)||"hour"===s||"day"===s?s:i<=72?"5minute":i<=1440?"hour":"day"),this.detail=new Set(e.detail??[]);for(const t of this.entities){const i=this.statsFor(t)?this.period:this.previewFor(t)?"detail":"raw",s=At(`${t}|${e.hoursToShow}|${i}`);s.preferRaw="detail"===i,this.stores.set(t,s)}}statsFor(t){return this.useStatistics&&!Ct(t)&&!this.detail.has(t)}previewFor(t){return this.useStatistics&&!Ct(t)&&this.detail.has(t)}get windowStart(){return Date.now()-36e5*this.opts.hoursToShow}get loaded(){for(const[t,e]of this.stores){if(this.statsFor(t)&&!e.statsLoaded)return!1;if(!e.rawLoaded)return!1}return!0}setHass(t){this.hass=t}series(t){return this.stores.get(t)?.series()}errors(){const t=[];for(const[e,i]of this.stores)i.error&&t.push(`${e}: ${i.error}`);return t}async start(){const t=this.windowStart;for(const e of this.stores.values())e.subscribers.add(this),e.prune(t);this.listenToConnection();const e=this.entities.filter(t=>{const e=this.stores.get(t);return this.previewFor(t)&&!e.statsLoaded&&!e.statsLoading&&!e.rawLoaded});if(e.length){const i=this.loadStatistics(e,t).then(()=>{for(const t of e)this.stores.get(t).notifySubscribers()});for(const t of e)this.stores.get(t).statsLoading=i}if(this.useStatistics){const e=[],i=[];for(const t of this.entities){const s=this.stores.get(t);this.statsFor(t)&&!s.statsLoaded&&(s.statsLoading?e.push(s.statsLoading):i.push(t))}if(i.length){const s=this.loadStatistics(i,t);for(const t of i)this.stores.get(t).statsLoading=s;e.push(s)}if(e.length&&(await Promise.all(e),this.disposed))return}const i=this.entities.filter(t=>{const e=this.stores.get(t);return!(e.owner&&e.owner!==this&&!e.owner.isDisposed)&&((e.owner!==this||!e.live)&&(e.owner=this,!0))});if(this.subscribeGrouped(i,t),this.timers.push(window.setInterval(()=>this.maintain(),6e5)),this.useStatistics){const t=Math.max(yt[this.period],9e5);this.timers.push(window.setInterval(()=>this.compact(),t))}this.notify()}subscribeGrouped(t,e=this.windowStart){const i=new Map;for(const s of t){const t=this.stores.get(s);let o;t.rawT.length||Number.isFinite(t.rawUntil)?o=Number.isFinite(t.rawUntil)?t.rawUntil:t.rawT[t.rawT.length-1]:(o=Number.isFinite(t.statsEnd)&&!t.preferRaw?t.statsEnd:e,t.rawFrom=o),o=Tt(Math.max(o,e));const n=`${o}|${Ct(s)?"a":"s"}`,r=i.get(n)??[];r.push(s),i.set(n,r)}for(const[t,e]of i)this.subscribe(Number(t.split("|")[0]),e,t.endsWith("|a"))}subscribe(t,e,i=!1){const s={entities:e};this.subs.push(s);let o=!0;for(const i of e){const e=this.stores.get(i);e.rawUntil=NaN,e.pendingFrom=t,e.live=!0,e.rawLoaded=e.rawLoaded&&e.rawT.length>0}const n={entities:e,from:new Date(t).toISOString(),attributes:i};$t("subscribe history/stream",n);const r=()=>{if(o){o=!1;for(const t of e){const e=this.stores.get(t);e.pendingFrom=void 0,e.rawLoaded=!0,e.version++,e.notifySubscribers()}}};this.hass.connection.subscribeMessage(t=>{if(wt){const e=Object.fromEntries(Object.entries(t?.states??{}).map(([t,e])=>[t,e.length]));$t(o?"history (initial)":"history (update)",e,n)}r(),this.onStream(t,e)},i?{type:"history/stream",entity_ids:[...new Set(e.map(Ht))],start_time:new Date(t).toISOString(),minimal_response:!1,no_attributes:!1,significant_changes_only:!1}:{type:"history/stream",entity_ids:e,start_time:new Date(t).toISOString(),minimal_response:!0,no_attributes:!0,significant_changes_only:!0},{resubscribe:!1}).then(t=>{for(const t of e)this.stores.get(t).error=void 0;this.disposed||!this.subs.includes(s)?t().catch(()=>{}):s.unsub=t},t=>{const i=t?.message??t?.code??String(t);console.warn("best-number-card: history subscription failed",n,t);for(const t of e){const e=this.stores.get(t);e.live=!1,e.error=String(i)}r()})}onStream(t,e){if(t?.states)for(const i of e){const e=t.states[Ht(i)],s=this.stores.get(i);if(!e||!s)continue;const o=Ct(i);let n=!1;for(const t of e){const e=Mt(t.lu??t.lc);if(!Number.isFinite(e))continue;if(o&&!t.a)continue;const i=Et(o?t.a[o]:t.s);n=s.appendRaw(e,i)||n}n&&s.notifySubscribers()}}listenToConnection(){const t=this.hass.connection;"function"==typeof t?.addEventListener&&(this.conn=t,t.addEventListener("disconnected",this.onDisconnected),t.addEventListener("ready",this.onReady))}adopt(t){const e=this.stores.get(t);this.disposed||!e||e.owner&&!e.owner.isDisposed||(e.owner=this,this.subscribeGrouped([t]))}async fetchStatistics(t,e){return this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(e).toISOString(),statistic_ids:t,period:this.period,types:["mean","min","max","state"]})}async loadStatistics(t,e){const i=Math.floor(e/yt[this.period])*yt[this.period];let s={};try{s=await this.fetchStatistics(t,i)??{}}catch(t){console.warn("best-number-card: statistics unavailable, using history",t)}$t("statistics",this.period,Object.fromEntries(t.map(t=>[t,s[t]?.length??0])));for(const e of t){const t=this.stores.get(e);this.applyStats(t,s[e]),t.statsLoaded=!0,t.statsLoading=void 0}}applyStats(t,e){if(!e?.length)return;const i=yt[this.period];for(const s of e){const e=Mt(s.start);if(!Number.isFinite(e)||t.statT.length&&e<=t.statT[t.statT.length-1])continue;t.statT.length&&Number.isFinite(t.statsEnd)&&e>t.statsEnd&&(t.statT.push(t.statsEnd),t.statV.push(NaN),t.statLo.push(NaN),t.statHi.push(NaN));const o=Et(s.mean??s.state??NaN);t.statT.push(e),t.statV.push(o),t.statLo.push(null!=s.min?Et(s.min):o),t.statHi.push(null!=s.max?Et(s.max):o);const n=void 0!==s.end?Mt(s.end):e+i;t.statsEnd=Number.isFinite(n)?n:e+i}t.version++}async compact(){const t=this.entities.filter(t=>{const e=this.stores.get(t);return e.owner===this&&this.statsFor(t)&&Number.isFinite(e.statsEnd)});if(!t.length||"hidden"===document.visibilityState)return;const e=Math.min(...t.map(t=>this.stores.get(t).statsEnd));let i;try{i=await this.fetchStatistics(t,e)??{}}catch{return}if(!this.disposed)for(const e of t){const t=this.stores.get(e);this.applyStats(t,i[e]);const s=Nt(t.rawT,t.statsEnd)-1;s>0&&(t.rawT.splice(0,s),t.rawV.splice(0,s)),t.rawFrom=t.statsEnd,t.prune(this.windowStart),t.version++,t.notifySubscribers()}}maintain(){const t=this.windowStart;for(const e of this.stores.values())e.owner===this&&e.prune(t)}notify(){this.changeScheduled||this.disposed||(this.changeScheduled=!0,queueMicrotask(()=>{this.changeScheduled=!1,this.disposed||this.opts.onChange()}))}dispose(){if(this.disposed)return;this.disposed=!0;for(const t of this.timers)clearInterval(t);this.timers=[],this.conn?.removeEventListener&&(this.conn.removeEventListener("disconnected",this.onDisconnected),this.conn.removeEventListener("ready",this.onReady));const t=Date.now(),e=[];for(const[i,s]of this.stores)s.subscribers.delete(this),s.owner===this&&(s.owner=void 0,s.stopLive(t),s.subscribers.size&&e.push([i,s]));for(const t of this.subs)t.unsub?.().catch(()=>{});this.subs=[],e.length&&queueMicrotask(()=>{for(const[t,i]of e)i.owner||[...i.subscribers][0]?.adopt(t)})}get isDisposed(){return this.disposed}}function Lt(t,e,i,s){const o=new Float64Array(s).fill(NaN),n=new Float64Array(s).fill(NaN),r=new Float64Array(s).fill(NaN),a=new Uint8Array(s),l=new Float64Array(s).fill(NaN),c=new Float64Array(s).fill(NaN),{t:h,v:d}=t,p=t.lo??d,u=t.hi??d,m=h.length,f=(i-e)/s;let _=Nt(h,e),g=_>0?d[_-1]:NaN,b=_>0?p[_-1]:NaN,v=_>0?u[_-1]:NaN;for(let t=0;t<s;t++){const x=e+t*f,y=t===s-1?i:x+f;let w=x,$=0,S=0,k=1/0,A=-1/0,N=0,E=0,M=1/0,T=-1/0,H=0;const C=(e,i,s,o,n)=>{if(n<=x&&t>0)return;if(!Number.isFinite(e))return void(H+=Math.max(0,n-o));i<M&&(M=i),s>T&&(T=s);const r=n-o;r>0&&($+=e*r,S+=r),e<k&&(k=e,N=o),e>A&&(A=e,E=o)};for(;_<m&&h[_]<y;)C(g,b,v,w,h[_]),g=d[_],b=p[_],v=u[_],w=Math.max(h[_],x),_++;C(g,b,v,w,y),k!==1/0&&2*H<y-x&&(o[t]=S>0?$/S:(k+A)/2,n[t]=k,r[t]=A,a[t]=N<=E?1:0,l[t]=Math.min(M,k),c[t]=Math.max(T,A))}return{start:e,end:i,mean:o,min:n,max:r,minFirst:a,bandLo:l,bandHi:c}}function zt(t,e,i,s){const o=t.mean.length,n=[];let r=[];const a=o>1?i/(o-1):0;for(let l=0;l<o;l++){const c=o>1?l*a:i;if(Number.isNaN(t.mean[l]))r.length&&n.push(r),r=[];else if(2===e&&t.max[l]-t.min[l]>0){const e=a/4,o=t.minFirst[l]?t.min[l]:t.max[l],n=t.minFirst[l]?t.max[l]:t.min[l];r.push([Math.max(0,c-e),s(o)],[Math.min(i,c+e),s(n)])}else r.push([c,s(t.mean[l])])}return r.length&&n.push(r),n}const Dt=t=>Math.round(10*t)/10;function Vt(t,e){if(!t.length)return"";if(1===t.length)return`M${Dt(t[0][0])},${Dt(t[0][1])}h0.01`;let i=`M${Dt(t[0][0])},${Dt(t[0][1])}`;if(!e||t.length<3){for(let e=1;e<t.length;e++)i+=`L${Dt(t[e][0])},${Dt(t[e][1])}`;return i}for(let e=1;e<t.length-1;e++){const[s,o]=t[e],n=(s+t[e+1][0])/2,r=(o+t[e+1][1])/2;i+=`Q${Dt(s)},${Dt(o)} ${Dt(n)},${Dt(r)}`}const s=t[t.length-1];return i+=`L${Dt(s[0])},${Dt(s[1])}`,i}function Ut(t,e,i){const s=t.mean.length;if(!s)return NaN;const o=Math.min(s-1,Math.max(0,Math.round(e/i*(s-1))));return t.mean[o]}function Pt(t){let e=1/0,i=-1/0;for(const s of t)for(let t=0;t<s.min.length;t++)s.min[t]<e&&(e=s.min[t]),s.max[t]>i&&(i=s.max[t]);return[e,i]}const Ot=[.25,.5,1,2,3,6,12,24,48,72,168,336,720,2160];const Rt={"card.no_entities":"No entities configured","card.not_found":"Entity not available","card.all_hidden":"All entities hidden","card.loading":"Loading history…","card.no_data":"No data in this time range","card.min":"Minimum","card.max":"Maximum","card.avg":"Average","card.toggle_series":"Show/hide line","card.now":"now","editor.section.compact":"Compact mode","field.compact_icon":"Show card icon","field.compact_names":"Show names","field.compact_graph":"Graph in the background (loads the history)","field.compact_animation":"Animate switching","field.compact_font_size":"Font size of the values","field.compact_name_size":"Font size of the name","field.text_color":"Text colour (names)","field.unavailable_text":"Text when unavailable (e.g. –)","card.load_error":"History could not be loaded","field.font_size":"Font size of the value","field.raw_history":"Load all details (every peak, more load)","opt.tri_inherit":"Like the card","opt.tri_on":"On","opt.tri_off":"Off","field.x_axis":"Time labels","field.band":"Min/max band","field.attribute":"Attribute (instead of the state)","editor.warn_attribute":"Attributes have no long-term statistics: the history incl. attributes is loaded for the whole time range, which puts more load on the system.","editor.section.advanced":"Advanced","editor.section.alert":"Alert","editor.alert_hint":"The whole card glows while a value reaches its alert threshold. Set thresholds per entity under “Alert”.","editor.custom_color":"Custom color","editor.theme_colors":"Theme colors","editor.line_color":"Line color","editor.preset":"Apply preset…","editor.jump":"Hard jump","editor.jump_help":"Color below / above this value","editor.below":"below","editor.above":"above","editor.drag":"Drag to reorder","editor.hidden_now":"currently hidden","editor.warn_no_statistics":"This sensor has no long-term statistics (no state_class). For time ranges above the statistics threshold, the raw history is loaded instead, which puts more load on the system.","editor.warn_min_max":"Minimum must be lower than maximum.","editor.warn_hide_range":"With these values the entity is always hidden.","editor.warn_hours":"Hours to show must be greater than 0.","preset.temperature":"Room temperature","preset.outdoor":"Outdoor temperature (jump at 0)","preset.heating":"Heating (jump at 95)","preset.humidity":"Humidity","preset.co2":"CO₂","preset.battery":"Battery","field.y_axis":"Y-axis labels","field.show_thresholds":"Lines at color jumps","field.show_extrema":"Show min / avg / max","field.legend_toggle":"Tap legend to hide lines","field.remember_compact":"Remember compact mode on this device","field.alert_above":"Alert at or above","field.alert_below":"Alert at or below","field.alert_style":"Alert effect","field.alert_color":"Alert color","editor.section.general":"General","editor.section.graph":"Graph","editor.section.data":"Data loading","editor.section.entities":"Entities","editor.section.interactions":"Interactions","editor.add_entity":"Add entity","editor.remove":"Remove","editor.move_up":"Move up","editor.move_down":"Move down","editor.color_scale":"Color scale","editor.color_scale_help":"Colors blend smoothly between the stops. Use the jump button on a stop to switch abruptly at that value (separate colors below / above).","editor.color_scale_help_step":"Each color applies from its value upwards; the first color also applies below.","editor.add_stop":"Add color stop","editor.visibility":"Visibility","field.name":"Name","field.icon":"Icon","field.graph":"Graph type","field.detail":"Detail","field.hours_to_show":"Hours to show","field.height":"Graph height (px, empty = automatic)","field.smoothing":"Smooth line","field.value_display":"Values in header","field.legend_icon":"Marker next to values","field.end_labels":"Labels at the end of the line","field.tooltip":"Tooltip on hover","field.compact":"Start in compact mode","field.statistics_threshold":"Use long-term statistics above (hours)","field.statistics_period":"Statistics resolution","field.limits_min":"Minimum (all scales)","field.limits_max":"Maximum (all scales)","field.theme":"Theme","field.tap_action":"Tap action","field.hold_action":"Hold action","field.double_tap_action":"Double tap action","field.entity":"Entity","field.unit":"Unit","field.decimals":"Decimals","field.color":"Line color (without color scale)","field.color_scale_mode":"Color scale mode","field.scale":"Scale group (same name = shared y-axis)","field.min":"Minimum","field.max":"Maximum","field.fill":"Fill area","field.fill_gradient":"Fill coloring (with color scale)","field.line_width":"Line width","field.show_value":"Show value","field.show_graph":"Show in graph","field.hide_below":"Hide while below","field.hide_above":"Hide while above","field.hide_unavailable":"Hide while unavailable","field.value":"Value","opt.line":"Line","opt.none":"None","opt.detail_1":"Low (smooth average)","opt.detail_2":"High (keeps every peak)","opt.primary":"First entity only (like sensor card)","opt.all":"All entities","opt.dot":"Colored dot","opt.icon":"Icon","opt.value":"Current value","opt.icon_value":"Icon and value","opt.auto":"Automatic","opt.5minute":"5 minutes","opt.hour":"Hour","opt.day":"Day","opt.gradient":"Gradient","opt.step":"Steps","opt.fill_value":"By value (horizontal color bands)","opt.hover":"On hover","opt.glow":"Pulsing glow","opt.blink":"Blinking","opt.static":"Steady glow","opt.always":"Always","opt.fill_time":"Along time (vertical color bands)"},jt={en:Rt,de:{"card.no_entities":"Keine Entitäten konfiguriert","card.not_found":"Entität nicht verfügbar","card.all_hidden":"Alle Entitäten ausgeblendet","card.loading":"Verlauf wird geladen …","card.no_data":"Keine Daten in diesem Zeitraum","card.min":"Minimum","card.max":"Maximum","card.avg":"Durchschnitt","card.toggle_series":"Linie ein-/ausblenden","card.now":"jetzt","editor.section.compact":"Kompaktmodus","field.compact_icon":"Kartensymbol anzeigen","field.compact_names":"Namen anzeigen","field.compact_graph":"Verlauf im Hintergrund (lädt die History)","field.compact_animation":"Umschalten animieren","field.compact_font_size":"Schriftgröße der Werte","field.compact_name_size":"Schriftgröße des Namens","field.text_color":"Textfarbe (Namen)","field.unavailable_text":"Text bei Nichtverfügbarkeit (z. B. –)","card.load_error":"Verlauf konnte nicht geladen werden","field.font_size":"Schriftgröße des Werts","field.raw_history":"Alle Detaildaten laden (jede Spitze, mehr Last)","opt.tri_inherit":"Wie Karte","opt.tri_on":"An","opt.tri_off":"Aus","field.x_axis":"Zeitachse","field.band":"Min/Max-Band","field.attribute":"Attribut (statt des Zustands)","editor.warn_attribute":"Attribute haben keine Langzeitstatistik: Für den ganzen Zeitraum wird die History inklusive Attribute geladen – das belastet das System stärker.","editor.section.advanced":"Erweitert","editor.section.alert":"Alarm","editor.alert_hint":"Die ganze Karte leuchtet, solange ein Wert seinen Alarm-Schwellwert erreicht. Schwellwerte legst du pro Entität unter „Alarm“ fest.","editor.custom_color":"Eigene Farbe","editor.theme_colors":"Design-Farben","editor.line_color":"Linienfarbe","editor.preset":"Vorlage anwenden …","editor.jump":"Harter Sprung","editor.jump_help":"Farbe unter / über diesem Wert","editor.below":"unter","editor.above":"über","editor.drag":"Zum Sortieren ziehen","editor.hidden_now":"gerade ausgeblendet","editor.warn_no_statistics":"Dieser Sensor hat keine Langzeitstatistik (keine state_class). Bei Zeiträumen über der Statistik-Schwelle wird stattdessen die Roh-History geladen – das belastet das System stärker.","editor.warn_min_max":"Das Minimum muss kleiner als das Maximum sein.","editor.warn_hide_range":"Mit diesen Werten ist die Entität immer ausgeblendet.","editor.warn_hours":"Die angezeigten Stunden müssen größer als 0 sein.","preset.temperature":"Raumtemperatur","preset.outdoor":"Außentemperatur (Sprung bei 0)","preset.heating":"Heizung (Sprung bei 95)","preset.humidity":"Luftfeuchte","preset.co2":"CO₂","preset.battery":"Akku","field.y_axis":"Y-Achsen-Beschriftung","field.show_thresholds":"Linien an Farbsprüngen","field.show_extrema":"Min / Ø / Max anzeigen","field.legend_toggle":"Legende antippen blendet Linien aus","field.remember_compact":"Kompaktmodus auf diesem Gerät merken","field.alert_above":"Alarm ab (größer/gleich)","field.alert_below":"Alarm bis (kleiner/gleich)","field.alert_style":"Alarm-Effekt","field.alert_color":"Alarmfarbe","editor.section.general":"Allgemein","editor.section.graph":"Diagramm","editor.section.data":"Datenabfrage","editor.section.entities":"Entitäten","editor.section.interactions":"Interaktionen","editor.add_entity":"Entität hinzufügen","editor.remove":"Entfernen","editor.move_up":"Nach oben","editor.move_down":"Nach unten","editor.color_scale":"Farbskala","editor.color_scale_help":"Zwischen den Stufen gehen die Farben fließend ineinander über. Mit dem Sprung-Knopf an einer Stufe wechselt die Farbe bei diesem Wert hart (getrennte Farben darunter / darüber).","editor.color_scale_help_step":"Jede Farbe gilt ab ihrem Wert aufwärts; die erste Farbe gilt auch darunter.","editor.add_stop":"Farbstufe hinzufügen","editor.visibility":"Sichtbarkeit","field.name":"Name","field.icon":"Symbol","field.graph":"Diagrammtyp","field.detail":"Detailgrad","field.hours_to_show":"Angezeigte Stunden","field.height":"Diagrammhöhe (px, leer = automatisch)","field.smoothing":"Linie glätten","field.value_display":"Werte in der Kopfzeile","field.legend_icon":"Markierung neben den Werten","field.end_labels":"Beschriftung am Linienende","field.tooltip":"Tooltip beim Überfahren","field.compact":"Im Kompaktmodus starten","field.statistics_threshold":"Langzeitstatistik verwenden ab (Stunden)","field.statistics_period":"Auflösung der Statistik","field.limits_min":"Minimum (alle Skalen)","field.limits_max":"Maximum (alle Skalen)","field.theme":"Design","field.tap_action":"Aktion beim Tippen","field.hold_action":"Aktion beim Halten","field.double_tap_action":"Aktion bei Doppeltippen","field.entity":"Entität","field.unit":"Einheit","field.decimals":"Nachkommastellen","field.color":"Linienfarbe (ohne Farbskala)","field.color_scale_mode":"Art der Farbskala","field.scale":"Skalengruppe (gleicher Name = gemeinsame Y-Achse)","field.min":"Minimum","field.max":"Maximum","field.fill":"Fläche füllen","field.fill_gradient":"Färbung der Füllung (mit Farbskala)","field.line_width":"Linienstärke","field.show_value":"Wert anzeigen","field.show_graph":"Im Diagramm anzeigen","field.hide_below":"Ausblenden, solange unter","field.hide_above":"Ausblenden, solange über","field.hide_unavailable":"Ausblenden, solange nicht verfügbar","field.value":"Wert","opt.line":"Linie","opt.none":"Keine","opt.detail_1":"Niedrig (geglätteter Mittelwert)","opt.detail_2":"Hoch (alle Spitzen bleiben erhalten)","opt.primary":"Nur erste Entität (wie Sensorkarte)","opt.all":"Alle Entitäten","opt.dot":"Farbiger Punkt","opt.icon":"Symbol","opt.value":"Aktueller Wert","opt.icon_value":"Symbol und Wert","opt.auto":"Automatisch","opt.5minute":"5 Minuten","opt.hour":"Stunde","opt.day":"Tag","opt.gradient":"Verlauf","opt.step":"Stufen","opt.fill_value":"Nach Wert (horizontale Farbbänder)","opt.hover":"Beim Überfahren","opt.glow":"Pulsierendes Leuchten","opt.blink":"Blinken","opt.static":"Dauerhaftes Leuchten","opt.always":"Immer","opt.fill_time":"Entlang der Zeit (vertikale Farbbänder)"}};function It(t,e){const i=(t?.locale?.language??t?.language??"en").split("-")[0];return jt[i]?.[e]??Rt[e]??e}const Wt=new Map;function Gt(t,e,i){if(!Number.isFinite(e))return"–";const s=function(t){const e=t?.locale?.language??t?.language??"en";switch(t?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de-DE";case"space_comma":return"fr-FR";case"system":return;default:return e}}(t),o="none"===t?.locale?.number_format,n=`${s}|${i}|${o}`;let r=Wt.get(n);return r||(r=new Intl.NumberFormat(s,{useGrouping:!o,...void 0!==i?{minimumFractionDigits:i,maximumFractionDigits:i}:{maximumFractionDigits:2}}),Wt.set(n,r)),r.format(e)}const Bt=new Map;const Kt=[{id:"temperature",stops:[{value:0,color:"#2196f3"},{value:18,color:"#4caf50"},{value:24,color:"#ff9800"},{value:30,color:"#f44336"}]},{id:"outdoor",stops:[{value:0,color:"#2196f3"},{value:0,color:"#4caf50"},{value:25,color:"#ff9800"},{value:35,color:"#f44336"}]},{id:"heating",stops:[{value:20,color:"#2196f3"},{value:95,color:"#ff9800"},{value:95,color:"#8b0000"}]},{id:"humidity",mode:"step",stops:[{value:0,color:"#ff9800"},{value:40,color:"#4caf50"},{value:60,color:"#2196f3"},{value:70,color:"#3f51b5"}]},{id:"co2",stops:[{value:400,color:"#4caf50"},{value:800,color:"#4caf50"},{value:1200,color:"#ffc107"},{value:1600,color:"#ff9800"},{value:2e3,color:"#f44336"}]},{id:"battery",stops:[{value:15,color:"#f44336"},{value:15,color:"#ff9800"},{value:40,color:"#ffc107"},{value:60,color:"#4caf50"}]}];function Xt(t,e="gradient"){if(!t?.length)return[];const i=[];if("step"===e)for(let e=1;e<t.length;e++)t[e].color!==t[e-1].color&&i.push(Number(t[e].value));else for(let e=0;e+1<t.length;e++)Number(t[e].value)===Number(t[e+1].value)&&t[e].color!==t[e+1].color&&i.push(Number(t[e].value));return[...new Set(i)]}const Yt=["#44739e","#984ea3","#00d2d5","#ff7f00","#af8d00","#7f80cd","#b3e900","#c42e60","#a65628","#f781bf","#8dd3c7","#bebada"];function Zt(t){return t<=0?"var(--accent-color)":`var(--graph-color-${t+1}, ${Yt[(t-1)%Yt.length]})`}const qt={number:{mode:"box",step:"any"}},Jt=[["red","#f44336"],["pink","#e91e63"],["purple","#926bc7"],["deep-purple","#6e41ab"],["indigo","#3f51b5"],["blue","#2196f3"],["light-blue","#03a9f4"],["cyan","#00bcd4"],["teal","#009688"],["green","#4caf50"],["light-green","#8bc34a"],["lime","#cddc39"],["yellow","#ffeb3b"],["amber","#ffc107"],["orange","#ff9800"],["deep-orange","#ff6f22"],["brown","#795548"],["grey","#9e9e9e"],["blue-grey","#607d8b"],["black","#000000"]],Qt=t=>null!=t&&""!==t;function te(t,e,i="opt."){return{select:{mode:"dropdown",options:e.map(e=>({value:String(e),label:It(t,`${i}${e}`)}))}}}function ee(t){const e={};for(const[i,s]of Object.entries(t))null!=s&&""!==s&&(e[i]=s);return e}class ie extends lt{constructor(){super(...arguments),this._expanded=-1,this._picker=null,this._resolve=t=>mt(t,this),this._l=t=>It(this.hass,t),this._computeLabel=t=>this._l(`field.${t.name}`)}setConfig(t){const e=(t.entities??[]).map(t=>"string"==typeof t?{entity:t}:t);this._config={...t,entities:e}}connectedCallback(){super.connectedCallback();const t=t=>customElements.get(t)?.getConfigElement?.();customElements.get("ha-form")||t("hui-button-card"),customElements.get("ha-entity-picker")||t("hui-entities-card")}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}get _hours(){return Number(this._config?.hours_to_show??24)}get _usesStatistics(){return this._hours>Number(this._config?.statistics_threshold??6)}_defaults(){return{graph:"line",detail:1,hours_to_show:24,smoothing:!0,tooltip:!0,compact:!1,remember_compact:!0,statistics_threshold:6,statistics_period:"auto",end_labels:"none",legend_icon:"dot",fill_gradient:"value",y_axis:"hover",x_axis:"hover",band:!1,show_thresholds:!1,show_extrema:!1,legend_toggle:!0,compact_icon:!1,compact_names:!1,compact_graph:!1,compact_animation:!0,value_display:1===this._config.entities.length?"primary":"all"}}_cardSchema(){const t=this.hass,e=this._config,i=this._cardData(),s="none"!==i.graph,o=e.entities.some(t=>t.color_scale?.length),n=e.entities.length>1,r="toggle-compact"===e.tap_action?.action,a=t=>({type:"grid",name:"",schema:t});return[{type:"expandable",flatten:!0,expanded:!0,title:this._l("editor.section.general"),schema:[a([{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]),a([{name:"value_display",selector:te(t,["all","primary","none"])},..."all"===i.value_display||n?[{name:"legend_icon",selector:te(t,["dot","icon","none"])}]:[]]),a([...s?[{name:"show_extrema",selector:{boolean:{}}}]:[],{name:"font_size",selector:{number:{mode:"box",min:8,max:96,step:1,unit_of_measurement:"px"}}}]),{name:"unavailable_text",selector:{text:{}}},{name:"compact",selector:{boolean:{}}}]},{type:"expandable",flatten:!0,expanded:!0,title:this._l("editor.section.graph"),schema:[a([{name:"graph",selector:te(t,["line","none"])},...s?[{name:"hours_to_show",selector:{number:{mode:"box",min:.1,step:"any"}}}]:[]]),...s?[a([{name:"detail",selector:te(t,["1","2"],"opt.detail_")},{name:"y_axis",selector:te(t,["hover","always","none"])},{name:"x_axis",selector:te(t,["hover","always","none"])},{name:"band",selector:{boolean:{}}}]),{name:"end_labels",selector:te(t,["none","value","icon","icon_value"])},...o?[{name:"fill_gradient",selector:te(t,["value","time"],"opt.fill_")},{name:"show_thresholds",selector:{boolean:{}}}]:[],a([{name:"tooltip",selector:{boolean:{}}},...n?[{name:"legend_toggle",selector:{boolean:{}}}]:[]])]:[]]},...e.compact||r?[{type:"expandable",flatten:!0,expanded:!0,title:this._l("editor.section.compact"),schema:[a([{name:"compact_icon",selector:{boolean:{}}},{name:"compact_names",selector:{boolean:{}}}]),a([{name:"compact_font_size",selector:{number:{mode:"box",min:8,max:72,step:1,unit_of_measurement:"px"}}},{name:"compact_name_size",selector:{number:{mode:"box",min:8,max:72,step:1,unit_of_measurement:"px"}}}]),a([...s?[{name:"compact_graph",selector:{boolean:{}}}]:[],...r?[{name:"compact_animation",selector:{boolean:{}}}]:[]])]}]:[],{type:"expandable",flatten:!0,title:this._l("editor.section.interactions"),schema:[{name:"compact_on_tap",selector:{boolean:{}}},...r||e.compact?[{name:"remember_compact",selector:{boolean:{}}}]:[],...r?[]:[{name:"tap_action",selector:{ui_action:{}}}],{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",flatten:!0,title:this._l("editor.section.advanced"),schema:[...s?[a([{name:"height",selector:{number:{mode:"box",min:20,step:1}}},{name:"smoothing",selector:{boolean:{}}},{name:"limits_min",selector:qt},{name:"limits_max",selector:qt},{name:"statistics_threshold",selector:{number:{mode:"box",min:0,step:"any"}}},...this._usesStatistics?[{name:"statistics_period",selector:te(t,["auto","5minute","hour","day"])}]:[]])]:[],{name:"theme",selector:{theme:{}}}]}]}_cardData(){const t=this._config;return{...this._defaults(),...t,detail:String(t.detail??1),limits_min:t.limits?.min,limits_max:t.limits?.max,compact_on_tap:"toggle-compact"===t.tap_action?.action}}_cardChanged(t){t.stopPropagation();const{limits_min:e,limits_max:i,compact_on_tap:s,entities:o,...n}=t.detail.value,r={...n,entities:this._config.entities},a=ee({min:e,max:i});Object.keys(a).length?r.limits=a:delete r.limits,s?r.tap_action={action:"toggle-compact"}:"toggle-compact"===r.tap_action?.action&&delete r.tap_action,void 0!==r.detail&&(r.detail=Number(r.detail));for(const[t,e]of Object.entries(this._defaults()))r[t]!==e||t in this._config||delete r[t];this._emit(ee(r))}_cardWarnings(){const t=this._config,e=[];return!Qt(t.hours_to_show)||Number(t.hours_to_show)>0||e.push(this._l("editor.warn_hours")),Qt(t.limits?.min)&&Qt(t.limits?.max)&&Number(t.limits.min)>=Number(t.limits.max)&&e.push(this._l("editor.warn_min_max")),e}_entitySchema(t){const e=this.hass,i=t=>({type:"grid",name:"",schema:t}),s=!!t.color_scale?.length,o="none"!==this._config.graph&&!1!==t.show_graph;return[{name:"entity",selector:{entity:{}}},{name:"attribute",selector:{attribute:{entity_id:t.entity}}},i([{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"font_size",selector:{number:{mode:"box",min:8,max:96,step:1,unit_of_measurement:"px"}}},...o?[{name:"show_extrema",selector:te(e,["inherit","on","off"],"opt.tri_")},{name:"band",selector:te(e,["inherit","on","off"],"opt.tri_")}]:[]]),...o&&!t.attribute?[{name:"raw_history",selector:{boolean:{}}}]:[],{type:"expandable",flatten:!0,title:this._l("editor.visibility"),expanded:Qt(t.hide_below)||Qt(t.hide_above)||!!t.hide_unavailable,schema:[i([{name:"hide_below",selector:qt},{name:"hide_above",selector:qt}]),{name:"hide_unavailable",selector:{boolean:{}}}]},{type:"expandable",flatten:!0,title:this._l("editor.section.alert"),expanded:Qt(t.alert_above)||Qt(t.alert_below),schema:[i([{name:"alert_above",selector:qt},{name:"alert_below",selector:qt}])]},{type:"expandable",flatten:!0,title:this._l("editor.section.advanced"),schema:[i([{name:"unit",selector:{text:{}}},{name:"decimals",selector:{number:{mode:"box",min:0,max:6,step:1}}},{name:"unavailable_text",selector:{text:{}}},...o?[{name:"line_width",selector:{number:{mode:"box",min:.5,max:12,step:.5}}},{name:"scale",selector:{text:{}}},{name:"min",selector:qt},{name:"max",selector:qt}]:[]]),i([{name:"show_value",selector:{boolean:{}}},{name:"show_graph",selector:{boolean:{}}},...o?[{name:"fill",selector:{boolean:{}}}]:[]]),...o&&s&&!1!==t.fill?[{name:"fill_gradient",selector:te(e,["value","time"],"opt.fill_")}]:[]]}]}_entityWarnings(t){const e=[];Qt(t.min)&&Qt(t.max)&&Number(t.min)>=Number(t.max)&&e.push(this._l("editor.warn_min_max")),Qt(t.hide_below)&&Qt(t.hide_above)&&Number(t.hide_below)>=Number(t.hide_above)&&e.push(this._l("editor.warn_hide_range"));const i=this.hass?.states[t.entity],s=this._usesStatistics&&"none"!==this._config.graph&&!1!==t.show_graph;return i&&s&&t.attribute?e.push(this._l("editor.warn_attribute")):i&&s&&t.entity.startsWith("sensor.")&&!i.attributes.state_class&&e.push(this._l("editor.warn_no_statistics")),e}_updateEntity(t,e){const i=[...this._config.entities];null===e?i.splice(t,1):i[t]=ee(e),this._expanded>=i.length&&(this._expanded=-1),this._emit({...this._config,entities:i})}_move(t,e){const i=[...this._config.entities];if(e<0||e>=i.length||t===e)return;const s=this._expanded>=0?i[this._expanded]:void 0,[o]=i.splice(t,1);i.splice(e,0,o),this._expanded=s?i.indexOf(s):-1,this._emit({...this._config,entities:i})}_addEntity(t){t.stopPropagation();const e=t.detail.value?.entity;if(!e)return;const i=[...this._config.entities,{entity:e}];this._expanded=i.length-1,this._emit({...this._config,entities:i}),t.target.data={}}_dragStart(t,e){if(0!==t.button)return;t.preventDefault(),t.currentTarget.setPointerCapture?.(t.pointerId);const i=[...this.renderRoot.querySelectorAll(".entity-row")];this._drag={from:e,to:e,startY:t.clientY,dy:0,rects:i.map(t=>t.getBoundingClientRect())}}_dragMove(t){const e=this._drag;if(!e)return;const i=t.clientY-e.startY,s=e.rects[e.from],o=s.top+s.height/2+i,n=e.rects.filter((t,i)=>i!==e.from&&t.top+t.height/2<o).length;this._drag={...e,dy:i,to:n}}_dragEnd(){const t=this._drag;this._drag=void 0,t&&t.from!==t.to&&this._move(t.from,t.to)}_dragKey(t,e){let i;if("ArrowUp"===t.key)i=e-1;else{if("ArrowDown"!==t.key)return;i=e+1}t.preventDefault(),this._move(e,i),this.updateComplete.then(()=>{const t=this.renderRoot.querySelectorAll(".handle");t[Math.max(0,Math.min(t.length-1,i))]?.focus()})}_rowStyle(t){const e=this._drag;if(!e)return"";if(t===e.from)return`transform:translateY(${e.dy}px);z-index:2;position:relative;transition:none`;const i=e.rects[e.from].height+8;return e.from<e.to&&t>e.from&&t<=e.to?`transform:translateY(${-i}px)`:e.to<e.from&&t>=e.to&&t<e.from?`transform:translateY(${i}px)`:""}_setScale(t,e,i){const s={...this._config.entities[t]};e.length?s.color_scale=e:delete s.color_scale,null===i||"gradient"===i?delete s.color_scale_mode:i&&(s.color_scale_mode=i),this._updateEntity(t,s)}_applyPreset(t,e){const i=Kt.find(t=>t.id===e);i&&this._setScale(t,i.stops.map(t=>({...t})),i.mode??null)}_renderPreview(t,e,i=!1){const s=gt(t);if(!s.length)return B;const o=s[0].value,n=s[s.length-1].value,r=.12*(n-o)||5,a=o-r,l=n+r,c=`linear-gradient(to right, ${vt(s,e,a,l,this._resolve).map(t=>`${t.color} ${(100*t.offset).toFixed(2)}%`).join(", ")})`;if(i)return I`<span class="mini-scale" style="background:${c}"></span>`;const h=[...new Set(s.map(t=>t.value))];return I`<div class="preview">
      <div class="preview-bar" style="background:${c}"></div>
      <div class="preview-ticks">
        ${h.map(t=>I`<span style="left:${((t-a)/(l-a)*100).toFixed(2)}%">${Gt(this.hass,t)}</span>`)}
      </div>
    </div>`}_renderColorField(t,e,i,s,o=""){const n=this._picker===t,r=t=>{this._picker=null,i(t)};return I`<div class="cf ${n?"open":""}">
      <div class="cf-row">
        <button
          class="cf-swatch"
          type="button"
          style="background:${e||o||"transparent"}"
          aria-label=${s}
          aria-expanded=${n?"true":"false"}
          title=${s}
          @click=${()=>this._picker=n?null:t}
        ></button>
        <input
          class="text"
          type="text"
          aria-label=${s}
          placeholder=${o}
          .value=${e??""}
          @change=${t=>r(t.target.value.trim()||void 0)}
        />
      </div>
      ${n?I`<div class="cf-pop" @keydown=${t=>"Escape"===t.key&&(this._picker=null)}>
            <div class="cf-label">${this._l("editor.theme_colors")}</div>
            <div class="cf-grid">
              ${Jt.map(([t,i])=>{const s=`var(--${t}-color, ${i})`;return I`<button
                  type="button"
                  class="cf-chip ${e===s?"sel":""}"
                  style="background:${s}"
                  title=${t}
                  aria-label=${t}
                  @click=${()=>r(s)}
                ></button>`})}
            </div>
            <label class="cf-custom">
              <input
                type="color"
                .value=${ne(e||o||"#ff0000",this)}
                @change=${t=>r(t.target.value)}
              />
              ${this._l("editor.custom_color")}
            </label>
          </div>`:B}
    </div>`}_renderStops(t,e){const i=e.color_scale??[],s=e.color_scale_mode??"gradient",o=function(t){const e=[];for(let i=0;i<t.length;i++){const s=t[i],o=t[i+1];o&&Number(o.value)===Number(s.value)?(e.push({value:Number(s.value),below:s.color,color:o.color}),i++):e.push({value:Number(s.value),color:s.color})}return e}(i),n=e=>this._setScale(t,function(t){return t.flatMap(t=>void 0!==t.below?[{value:t.value,color:t.below},{value:t.value,color:t.color}]:[{value:t.value,color:t.color}])}(e)),r=(t,e)=>n(o.map((i,s)=>s===t?{...i,...e}:i)),a=t=>{const e=o[t];if(void 0!==e.below){const{below:i,...s}=e;n(o.map((e,i)=>i===t?s:e))}else{const s=1e-9*Math.max(1,Math.abs(e.value)),o=_t(bt(gt(i),"gradient",e.value-s,this._resolve));r(t,{below:ne(o,this)})}};return I`<div class="stops">
      <div class="stops-head">
        <span class="stops-title">${this._l("editor.color_scale")}</span>
        ${i.length?I`<select
              class="native"
              aria-label=${this._l("field.color_scale_mode")}
              @change=${e=>this._setScale(t,i,e.target.value)}
            >
              <option value="gradient" ?selected=${"gradient"===s}>${this._l("opt.gradient")}</option>
              <option value="step" ?selected=${"step"===s}>${this._l("opt.step")}</option>
            </select>`:B}
        <select
          class="native"
          aria-label=${this._l("editor.preset")}
          @change=${e=>{const i=e.target;this._applyPreset(t,i.value),i.value=""}}
        >
          <option value="" selected>${this._l("editor.preset")}</option>
          ${Kt.map(t=>I`<option value=${t.id}>${this._l(`preset.${t.id}`)}</option>`)}
        </select>
      </div>
      ${this._renderPreview(i,s)}
      ${o.map((e,i)=>I`<div class="stop">
          <input
            class="num"
            type="number"
            step="any"
            aria-label=${this._l("field.value")}
            .value=${String(e.value)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&r(i,{value:e})}}
          />
          <div class="stop-colors">
            ${void 0!==e.below?I`${this._renderColorField(`s${t}-${i}-b`,e.below,t=>r(i,{below:t??e.below}),this._l("editor.below"))}
                  <span class="arrow">→</span>`:B}
            ${this._renderColorField(`s${t}-${i}`,e.color,t=>r(i,{color:t??e.color}),this._l("editor.above"))}
          </div>
          ${"gradient"===s?I`<ha-icon-button
                class="jump ${void 0!==e.below?"on":""}"
                .label=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                title=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                .path=${"M3,17H9V7H15V17H21V19H13V9H11V19H3V17Z"}
                @click=${()=>a(i)}
              ></ha-icon-button>`:B}
          <ha-icon-button
            .label=${this._l("editor.remove")}
            .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
            @click=${()=>n(o.filter((t,e)=>e!==i))}
          ></ha-icon-button>
        </div>`)}
      <button
        class="text-button"
        @click=${()=>{const t=o[o.length-1];n([...o,{value:t?t.value+10:0,color:t?.color??"#ff0000"}])}}
      >
        + ${this._l("editor.add_stop")}
      </button>
      ${i.length?I`<div class="help">${this._l("step"===s?"editor.color_scale_help_step":"editor.color_scale_help")}</div>`:B}
    </div>`}_rawValue(t){const e=this.hass?.states[t.entity];if(!e)return;if(!t.attribute)return e.state;const i=e.attributes[t.attribute];return null==i?"":String(i)}_isHiddenNow(t){const e=this._rawValue(t),i=e?Number(e):NaN,s=Number.isFinite(i);return!(!t.hide_unavailable||s)||(!!(s&&Qt(t.hide_below)&&i<Number(t.hide_below))||!!(s&&Qt(t.hide_above)&&i>Number(t.hide_above)))}_renderEntity(t,e){const i=this.hass?.states[t.entity],s=(t.name||i?.attributes.friendly_name||t.entity)+(t.attribute&&!t.name?` · ${t.attribute}`:""),o=t.unit??(t.attribute?"":i?.attributes.unit_of_measurement??""),n=this._rawValue(t)??"",r=""!==n&&Number.isFinite(Number(n))?Gt(this.hass,Number(n)):n,a=this._entityWarnings(t),l=this._isHiddenNow(t);return I`<div class="entity-row ${this._drag?.from===e?"dragging":""}" style=${this._rowStyle(e)}>
      <div
        class="handle"
        tabindex="0"
        role="button"
        aria-label=${this._l("editor.drag")}
        title=${this._l("editor.drag")}
        @pointerdown=${t=>this._dragStart(t,e)}
        @pointermove=${t=>this._dragMove(t)}
        @pointerup=${()=>this._dragEnd()}
        @pointercancel=${()=>this._dragEnd()}
        @keydown=${t=>this._dragKey(t,e)}
      >
        <svg viewBox="0 0 24 24"><path d=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></path></svg>
      </div>
      <ha-expansion-panel
        outlined
        .expanded=${this._expanded===e}
        @expanded-changed=${t=>{t.detail.expanded?this._expanded=e:this._expanded===e&&(this._expanded=-1)}}
      >
        <div slot="header" class="panel-header">
          <ha-state-icon .hass=${this.hass} .stateObj=${i} .icon=${t.icon}></ha-state-icon>
          <span class="panel-title">${s}</span>
          ${l?I`<span class="badge">${this._l("editor.hidden_now")}</span>`:B}
          ${a.length?I`<span class="badge warn-badge">⚠</span>`:B}
          <span class="panel-value">${r} ${o}</span>
          ${t.color_scale?.length?this._renderPreview(t.color_scale,t.color_scale_mode??"gradient",!0):I`<span class="swatch" style="background:${t.color??Zt(e)}"></span>`}
        </div>
        <div class="panel-body">
          ${a.map(t=>I`<div class="warning">⚠ ${t}</div>`)}
          <ha-form
            .hass=${this.hass}
            .data=${{show_value:!0,show_graph:!0,...t,band:se(t.band),show_extrema:se(t.show_extrema)}}
            .schema=${this._entitySchema(t)}
            .computeLabel=${this._computeLabel}
            @value-changed=${i=>{i.stopPropagation();const s={...i.detail.value,band:oe(i.detail.value.band),show_extrema:oe(i.detail.value.show_extrema)};!0===s.show_value&&void 0===t.show_value&&delete s.show_value,!0===s.show_graph&&void 0===t.show_graph&&delete s.show_graph,s.color_scale=t.color_scale,s.color_scale_mode=t.color_scale_mode,this._updateEntity(e,s)}}
          ></ha-form>
          ${t.color_scale?.length?B:I`<div class="field-row">
                <span class="field-label">${this._l("editor.line_color")}</span>
                ${this._renderColorField(`l${e}`,t.color,i=>this._updateEntity(e,{...t,color:i}),this._l("editor.line_color"),Zt(e))}
              </div>`}
          ${this._renderStops(e,t)}
          <div class="panel-actions">
            <button class="text-button danger" @click=${()=>this._updateEntity(e,null)}>${this._l("editor.remove")}</button>
          </div>
        </div>
      </ha-expansion-panel>
    </div>`}_renderAlertSection(){const t=this._config,e=t.entities.some(t=>Qt(t.alert_above)||Qt(t.alert_below)),i=e=>this._emit(ee({...t,...e}));return I`<div class="section-title">${this._l("editor.section.alert")}</div>
      <div class="help">${this._l("editor.alert_hint")}</div>
      ${e?I`<ha-form
              .hass=${this.hass}
              .data=${{alert_style:t.alert_style??"glow"}}
              .schema=${[{name:"alert_style",selector:te(this.hass,["glow","blink","static"])}]}
              .computeLabel=${this._computeLabel}
              @value-changed=${t=>{t.stopPropagation();const e=t.detail.value.alert_style;i({alert_style:"glow"===e?void 0:e})}}
            ></ha-form>
            <div class="field-row">
              <span class="field-label">${this._l("field.alert_color")}</span>
              ${this._renderColorField("alert",t.alert_color,t=>i({alert_color:t}),this._l("field.alert_color"),"var(--error-color, #db4437)")}
            </div>`:B}`}render(){if(!this.hass||!this._config)return B;const t=this._cardWarnings();return I`
      ${t.map(t=>I`<div class="warning">⚠ ${t}</div>`)}
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <div class="field-row">
        <span class="field-label">${this._l("field.text_color")}</span>
        ${this._renderColorField("text-color",this._config.text_color??this._config.compact_text_color,t=>{const{compact_text_color:e,...i}=this._config;this._emit(ee({...i,text_color:t}))},this._l("field.text_color"),"var(--secondary-text-color)")}
      </div>
      ${this._renderAlertSection()}
      <div class="section-title">${this._l("editor.section.entities")}</div>
      <div class="entities ${this._drag?"is-dragging":""}">
        ${this._config.entities.map((t,e)=>this._renderEntity(t,e))}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{name:"entity",selector:{entity:{}}}]}
          .computeLabel=${()=>this._l("editor.add_entity")}
          @value-changed=${this._addEntity}
        ></ha-form>
      </div>
    `}}ie.properties={hass:{attribute:!1},_config:{state:!0},_expanded:{state:!0},_drag:{state:!0},_picker:{state:!0}},ie.styles=n`
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
    .entity-row {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      transition: transform 0.15s ease;
    }
    .entities.is-dragging .entity-row {
      user-select: none;
    }
    .entity-row.dragging ha-expansion-panel {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      background: var(--card-background-color);
      border-radius: 12px;
    }
    .entity-row ha-expansion-panel {
      flex: 1;
      min-width: 0;
    }
    .handle {
      flex: none;
      width: 32px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      touch-action: none;
      color: var(--secondary-text-color);
      border-radius: 8px;
    }
    .handle:active {
      cursor: grabbing;
    }
    .handle:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .handle svg,
    .add svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .add {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      color: var(--secondary-text-color);
    }
    .add svg {
      width: 32px;
      flex: none;
    }
    .add ha-form {
      flex: 1;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      width: 100%;
      --mdc-icon-size: 20px;
    }
    .panel-header ha-state-icon {
      color: var(--state-icon-color, var(--secondary-text-color));
      flex: none;
    }
    .panel-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .panel-value {
      margin-left: auto;
      color: var(--secondary-text-color);
      white-space: nowrap;
      font-size: 14px;
    }
    .badge {
      flex: none;
      font-size: 11px;
      line-height: 16px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .warn-badge {
      color: var(--warning-color, #ff9800);
    }
    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex: none;
    }
    .mini-scale {
      width: 40px;
      height: 8px;
      border-radius: 4px;
      flex: none;
    }
    .panel-body {
      padding: 0 4px 12px;
    }
    .panel-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .warning {
      margin: 8px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 18px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 15%, transparent);
      border-left: 3px solid var(--warning-color, #ff9800);
    }
    .stops {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .stops-head {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .stops-title {
      font-weight: 500;
      margin-right: auto;
    }
    .preview {
      margin: 4px 0 12px;
    }
    .preview-bar {
      height: 14px;
      border-radius: 7px;
    }
    .preview-ticks {
      position: relative;
      height: 16px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .preview-ticks span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .preview-ticks span::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -6px;
      height: 5px;
      border-left: 1px solid var(--secondary-text-color);
    }
    .help {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 4px;
    }
    .stop {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .stop-colors {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 160px;
    }
    .arrow {
      color: var(--secondary-text-color);
    }
    input.num,
    input.text,
    select.native {
      height: 36px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      padding: 0 8px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    input.num {
      width: 84px;
    }
    .cf {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }
    .cf-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cf-row input.text {
      flex: 1;
      min-width: 60px;
      width: 0;
    }
    .cf-swatch {
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #fff);
      box-shadow: 0 0 0 1px var(--divider-color, #ccc);
      cursor: pointer;
      padding: 0;
    }
    .cf.open .cf-swatch {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .cf-pop {
      padding: 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 10px;
      background: var(--card-background-color, #fff);
    }
    .cf-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .cf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(26px, 1fr));
      gap: 6px;
    }
    .cf-chip {
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #fff);
      box-shadow: 0 0 0 1px var(--divider-color, #ccc);
      cursor: pointer;
      padding: 0;
    }
    .cf-chip.sel {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .cf-custom {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .cf-custom input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
    }
    .field-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 8px;
    }
    .field-label {
      flex: none;
      width: 120px;
      line-height: 36px;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .color-input {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .color-input input.text {
      flex: 1;
      min-width: 60px;
      width: 0;
    }
    .color-input input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      flex: none;
    }
    ha-icon-button.jump {
      color: var(--secondary-text-color);
      opacity: 0.6;
    }
    ha-icon-button.jump.on {
      color: var(--primary-color);
      opacity: 1;
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
    .text-button.danger {
      color: var(--error-color, #db4437);
    }
  `;const se=t=>void 0===t?"inherit":t?"on":"off",oe=t=>"on"===t||"off"!==t&&void 0;function ne(t,e){if(/^#[0-9a-f]{6}$/i.test(t))return t;const[i,s,o]=mt(t,e),n=t=>Math.round(t).toString(16).padStart(2,"0");return`#${n(i)}${n(s)}${n(o)}`}customElements.get("best-number-card-editor")||customElements.define("best-number-card-editor",ie);const re=ht,ae=24,le="line",ce=6,he=!0,de="none",pe="dot",ue="hover",me="hover";let fe=0;const _e=t=>null!=t&&""!==t;class ge extends lt{constructor(){super(...arguments),this._compact=!1,this._width=0,this._graphH=0,this._hoverX=null,this._tick=0,this._off=new Set,this._uid="bnc"+ ++fe,this._cfgVersion=0,this._dsKey="",this._dsStarted=0,this._lastTick=0,this._held=!1,this._suppressClick=!1,this._animating=!1,this._storageKey="",this._colorCache=new Map,this._resolve=t=>{let e=this._colorCache.get(t);return e||(e=mt(t,this),this._colorCache.set(t,e)),e},this._themeVars=[],this._onVisibility=()=>{"visible"===document.visibilityState&&this._ds&&this._scheduleTick()},this._onPointerDown=t=>{this._held=!1,this._down={x:t.clientX,y:t.clientY},this._config?.hold_action&&"none"!==this._config.hold_action.action&&(clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._held=!0,this._doAction("hold",t)},500))},this._onPointerUp=()=>clearTimeout(this._holdTimer),this._onKeyDown=t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._doAction("tap",t))},this._onClick=t=>{if(clearTimeout(this._holdTimer),this._suppressClick)return void(this._suppressClick=!1);if(this._held)return void(this._held=!1);if(this._down&&Math.hypot(t.clientX-this._down.x,t.clientY-this._down.y)>10)return;const e=this._fromEvent(t,"toggle");if(e&&!1!==this._config?.legend_toggle)return void this._toggleSeries(e);const i=this._config?.double_tap_action;if(i&&"none"!==i.action)return this._clickTimer?(clearTimeout(this._clickTimer),this._clickTimer=void 0,void this._doAction("double_tap",t)):void(this._clickTimer=window.setTimeout(()=>{this._clickTimer=void 0,this._doAction("tap",t)},250));this._doAction("tap",t)},this._onGraphDown=t=>{"mouse"!==t.pointerType&&(this._scrub={x:t.clientX,y:t.clientY,active:!1})},this._onMove=t=>{if(!1===this._config?.tooltip)return;if("mouse"===t.pointerType)return void this._setHoverFromEvent(t);const e=this._scrub;if(e){if(!e.active){const i=Math.abs(t.clientX-e.x),s=Math.abs(t.clientY-e.y);if(i<8||i<s)return;e.active=!0,clearTimeout(this._holdTimer),clearTimeout(this._hideTimer)}this._setHoverFromEvent(t)}},this._onGraphUp=t=>{"mouse"!==t.pointerType&&(this._scrub?.active&&(this._suppressClick=!0,setTimeout(()=>this._suppressClick=!1,400),clearTimeout(this._hideTimer),this._hideTimer=window.setTimeout(()=>this._hoverX=null,2e3)),this._scrub=void 0)},this._onLeave=t=>{"mouse"===t.pointerType&&(this._hoverX=null)}}static getConfigElement(){return document.createElement("best-number-card-editor")}static getStubConfig(t){return{entities:Object.keys(t.states).filter(e=>xe(t,e)).slice(0,2).map(t=>({entity:t}))}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=(Array.isArray(t.entities)?t.entities:t.entity?[t.entity]:[]).map(t=>"string"==typeof t?{entity:t}:{...t}).filter(t=>t&&"string"==typeof t.entity);if(!e.length)throw new Error("Please define at least one entity");for(const t of e)t.color_scale&&(t.color_scale=gt(t.color_scale));const i=this._config;if(this._cfgVersion++,this._config={...t,entities:e},this._storageKey=`best-number-card:compact:${function(t){let e=5381;for(let i=0;i<t.length;i++)e=(e<<5)+e+t.charCodeAt(i)|0;return(e>>>0).toString(36)}(JSON.stringify([t.name,e.map(t=>t.entity)]))}`,(!i||i.compact!==t.compact)&&(this._compact=!!t.compact,!1!==t.remember_compact)){const e=function(t){try{const e=window.localStorage?.getItem(t);return e?JSON.parse(e):void 0}catch{return}}(this._storageKey);e&&e.d===!!t.compact&&(this._compact=!!e.v)}}getCardSize(){return this._compact?1:3}getGridOptions(){return{columns:6,min_columns:3,min_rows:1}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibility),this._syncDataSource()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibility),this._disposeDataSource(),this._ro?.disconnect(),this._ro=void 0,this._graphEl=void 0,clearTimeout(this._hideTimer)}shouldUpdate(t){if(!this._config)return!1;if(t.size>1||!t.has("hass"))return!0;const e=t.get("hass");return!e||!this.hass||(e.themes!==this.hass.themes||e.locale!==this.hass.locale||e.language!==this.hass.language||this._config.entities.some(t=>e.states[t.entity]!==this.hass.states[t.entity]))}willUpdate(t){(t.has("hass")||t.has("_config")||t.has("_compact"))&&this._syncDataSource();const e=t.get("hass");(t.has("_config")||!e||e.themes!==this.hass?.themes)&&(this._applyTheme(),this._colorCache.clear(),this._model=void 0)}updated(){this._updateAlert();const t=this.renderRoot.querySelector(".graph");t!==this._graphEl&&(this._ro?.disconnect(),this._graphEl=t??void 0,t&&(this._ro??=new ResizeObserver(t=>{const e=Math.round(t[0].contentRect.width),i=Math.round(t[0].contentRect.height);e&&e!==this._width&&(this._width=e),i&&i!==this._graphH&&!this._animating&&(this._graphH=i)}),this._ro.observe(t)))}_visible(){return this._config.entities.filter(t=>!this._isHidden(t))}_isHidden(t){const e=this._current(t),i=Number.isFinite(e);return!(!t.hide_unavailable||i)||(!!(i&&_e(t.hide_below)&&e<Number(t.hide_below))||!!(i&&_e(t.hide_above)&&e>Number(t.hide_above)))}get _hours(){const t=Number(this._config?.hours_to_show??ae);return t>0?t:ae}_graphEntities(){return this._visible().filter(t=>!1!==t.show_graph)}_syncDataSource(){const t=this._config;if(!t||!this.hass||!this.isConnected)return;const e=!(this._compact&&!t.compact_graph||"none"===(t.graph??le)),i=e?[...new Set(this._graphEntities().map(t=>this._sid(t)))]:[],s=Number(t.statistics_threshold??ce),o=e?this._graphEntities().filter(t=>t.raw_history).map(t=>this._sid(t)):[],n=i.length?JSON.stringify([i,o,this._hours,s,t.statistics_period??"auto"]):"";if(n===this._dsKey)return void this._ds?.setHass(this.hass);if(this._disposeDataSource(),this._dsKey=n,!n)return;this._ds=new Ft(this.hass,{entities:i,hoursToShow:this._hours,statisticsThreshold:s,statisticsPeriod:t.statistics_period,detail:o,onChange:()=>this._scheduleTick()}),this._dsStarted=Date.now(),this._ds.start().catch(t=>console.warn("best-number-card:",t));const r=36e5*this._hours/Math.max(this._width||400,100);this._ticker=window.setInterval(()=>this._scheduleTick(),Math.min(Math.max(2*r,5e3),3e5))}_disposeDataSource(){this._ds?.dispose(),this._ds=void 0,this._dsKey="",clearInterval(this._ticker),clearTimeout(this._tickTimer),this._tickTimer=void 0}_scheduleTick(){if(void 0!==this._tickTimer||"hidden"===document.visibilityState)return;const t=Date.now(),e=36e5*this._hours/Math.max(this._width||400,100),i=t-this._dsStarted<5e3?100:Math.min(Math.max(e,1e3),3e4),s=Math.max(0,this._lastTick+i-t);this._tickTimer=window.setTimeout(()=>{this._tickTimer=void 0,this._lastTick=Date.now(),this._tick++},s)}_state(t){return this.hass?.states[t.entity]}_sid(t){return e=t.entity,(i=t.attribute)?`${e}::${i}`:e;var e,i}_raw(t){const e=this._state(t);if(!e)return;if(!t.attribute)return e.state;const i=e.attributes[t.attribute];return null==i?"":String(i)}_name(t){if(t.name)return t.name;const e=this._state(t),i=e?.attributes.friendly_name??t.entity;if(!t.attribute)return i;return`${i} · ${(e?this.hass?.formatEntityAttributeName?.(e,t.attribute):void 0)??t.attribute}`}_unit(t){return void 0!==t.unit?t.unit:t.attribute?/temp/i.test(t.attribute)?this.hass?.config?.unit_system?.temperature??"":"":this._state(t)?.attributes.unit_of_measurement??""}_decimals(t,e){if(_e(t.decimals))return Number(t.decimals);const i=t.attribute?void 0:this.hass?.entities?.[t.entity]?.display_precision;if("number"==typeof i)return i;if(void 0!==e){const t=/\.(\d+)$/.exec(e);return t?Math.min(t[1].length,4):0}}_formatState(t){const e=this._state(t),i=t.unavailable_text??this._config?.unavailable_text;if(!e)return i??It(this.hass,"card.not_found");const s=this._raw(t)??"",o=Number(s);return""!==s&&Number.isFinite(o)?Gt(this.hass,o,this._decimals(t,s)):void 0!==i?i:t.attribute?s||"–":this.hass?.formatEntityState?.(e)??e.state}_valueUnit(t){return Number.isFinite(this._current(t))?this._unit(t):""}_formatValue(t,e){const i=this._decimals(t,this._raw(t));return Gt(this.hass,e,void 0===i?1:i)}_baseColor(t){return t.color?t.color:Zt(this._config.entities.indexOf(t))}_colorFor(t,e){return t.color_scale?.length&&Number.isFinite(e)?_t(bt(t.color_scale,t.color_scale_mode??"gradient",e,this._resolve)):this._baseColor(t)}_current(t){const e=this._raw(t);return void 0!==e&&""!==e?Number(e):NaN}_applyTheme(){for(const t of this._themeVars)this.style.removeProperty(t);this._themeVars=[];const t=this.hass?.themes,e=this._config?.theme?t?.themes?.[this._config.theme]:void 0;if(!e)return;const i=e.modes?.[t?.darkMode?"dark":"light"]??{};for(const[t,s]of Object.entries({...e,...i})){if("string"!=typeof s)continue;const e=`--${t}`;this.style.setProperty(e,s),this._themeVars.push(e)}}_alertActive(){return this._config.entities.some(t=>{const e=this._current(t);return!!Number.isFinite(e)&&(_e(t.alert_above)&&e>=Number(t.alert_above)||_e(t.alert_below)&&e<=Number(t.alert_below))})}_updateAlert(){const t=!!this._config&&this._alertActive();this.toggleAttribute("alert",t),t&&(this.setAttribute("alert-style",this._config.alert_style??"glow"),this._config.alert_color?this.style.setProperty("--bnc-alert-color",this._config.alert_color):this.style.removeProperty("--bnc-alert-color"))}_bandOn(t){return t.band??this._config?.band??!1}_setCompact(t){const e=this.renderRoot.querySelector("ha-card"),i=!1!==this._config?.compact_animation&&!!e&&"function"==typeof e.animate&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,s=i?e.getBoundingClientRect().height:0;this._compact=t,this._hoverX=null,!1!==this._config?.remember_compact&&function(t,e){try{window.localStorage?.setItem(t,JSON.stringify(e))}catch{}}(this._storageKey,{v:t,d:!!this._config?.compact}),i&&this.updateComplete.then(()=>this._animateHeight(e,s))}async _animateHeight(t,e){const i=t.getBoundingClientRect().height,s=this.renderRoot.querySelector(".graph"),o=s?Math.round(s.getBoundingClientRect().height):0;if(o&&o!==this._graphH&&(this._graphH=o,await this.updateComplete),Math.abs(i-e)<2)return;this._animating=!0;const n=t.animate([{height:`${e}px`},{height:`${i}px`}],{duration:280,easing:"cubic-bezier(0.2, 0, 0, 1)"}),r=()=>{this._animating=!1;const t=this.renderRoot.querySelector(".graph"),e=t?Math.round(t.getBoundingClientRect().height):0;e&&e!==this._graphH&&(this._graphH=e)};n.onfinish=r,n.oncancel=r}_toggleSeries(t){const e=new Set(this._off);e.has(t)?e.delete(t):e.add(t),this._off=e}_baseGraphHeight(){const t=Number(this._config?.height);return t>0?t:Math.round(Math.min(Math.max((this._width||400)/5,56),140))}_graphHeight(){return Number(this._config?.height)>0?Number(this._config.height):this._graphH>0?this._graphH:this._baseGraphHeight()}_labelMargin(t){const e=this._config?.end_labels??de;if("none"===e||this._compact)return 0;let i=0;for(const s of t){let t=8;if("icon"!==e&&"icon_value"!==e||(t+=20),"value"===e||"icon_value"===e){t+=7*`${this._formatState(s)} ${this._valueUnit(s)}`.length+4}i=Math.max(i,t)}return i}_buildModel(){const t=this._config;if(!this._ds||!this._width)return;const e=this._graphEntities(),i=this._graphHeight(),s=Math.max(20,this._width-this._labelMargin(e.filter(t=>!this._off.has(this._sid(t))))),o=2===Number(t.detail)?2:1,n=JSON.stringify([this._tick,this._cfgVersion,this._dsKey,this._width,i,s,o,[...this._off],this._ds.loaded,this._compact]);if(this._model?.key===n)return this._model;const r=Date.now(),a=r-36e5*this._hours,l=Math.max(2,Math.round(s/(2===o?2:8))),c=e.filter(t=>!this._off.has(this._sid(t))),h=c.length>1,d=t=>t.raw_history?Math.max(2,Math.round(s/2)):l,p=t=>t.raw_history?2:o,u=e.map(t=>({e:t,b:Lt(this._ds.series(this._sid(t))??{t:[],v:[]},a,r,d(t))})),m=new Map;for(const{e:t,b:e}of u){const i=t.scale||"default",s=m.get(i)??{lo:1/0,hi:-1/0},o=this._off.has(this._sid(t));if(!o||!m.has(i)){const[i,n]=this._bandOn(t)?be(e):Pt([e]);o||(s.lo=Math.min(s.lo,i),s.hi=Math.max(s.hi,n),s.first??=t)}m.set(i,s)}for(const[i,s]of m){const o=e.filter(t=>(t.scale||"default")===i),n=o.map(t=>t.min).filter(_e).map(Number),r=o.map(t=>t.max).filter(_e).map(Number),a=n.length?Math.min(...n):t.limits?.min,l=r.length?Math.max(...r):t.limits?.max;_e(a)&&(s.lo=Number(a)),_e(l)&&(s.hi=Number(l)),Number.isFinite(s.lo)&&Number.isFinite(s.hi)||(s.lo=0,s.hi=1),s.hi<=s.lo&&(s.hi=s.lo+1,s.lo-=1)}let f=!1;const _=u.map(({e:e,b:o},n)=>{const{lo:r,hi:a}=m.get(e.scale||"default"),l=Number(e.line_width)>0?Number(e.line_width):h?3:4,c=this._compact?8:2,d=l/2+c,u=i-l/2-c,_=t=>{const e=Math.min(Math.max(t,r),a);return u-(e-r)/(a-r)*(u-d)};let g=0,b=0;for(const t of o.mean)Number.isFinite(t)&&(g+=t,b++);const[v,x]=be(o);b&&(f=!0);const y={cfg:e,index:n,buckets:o,segs:zt(o,p(e),s,_),lo:r,hi:a,y:_,color:this._baseColor(e),lineWidth:l,fill:e.fill??!h,off:this._off.has(this._sid(e)),ext:{min:v,max:x,avg:b?g/b:NaN},band:this._bandOn(e),smooth:(t.smoothing??he)&&1===p(e)};if(e.color_scale?.length){y.gradId=`${this._uid}-g${n}`;const i=e.color_scale_mode??"gradient";y.grad=vt(e.color_scale,i,r,a,this._resolve),y.fill&&"time"===(e.fill_gradient??t.fill_gradient)&&(y.fillGradId=`${this._uid}-f${n}`,y.fillGrad=function(t,e,i,s){const o=i.length,n=i=>_t(bt(t,e,i,s)),r=[];let a=NaN,l=0;for(let s=0;s<o;s++){const c=i[s];if(!Number.isFinite(c))continue;const h=o>1?s/(o-1):0;if(Number.isFinite(a)&&xt(t,e,a,c)){const t=(l+h)/2;r.push({offset:t,color:n(a)},{offset:t,color:n(c)})}r.push({offset:h,color:n(c)}),a=c,l=h}if(!r.length){const t=n(NaN);return[{offset:0,color:t},{offset:1,color:t}]}return r.filter((t,e)=>0===e||e===r.length-1||t.color!==r[e-1].color||t.color!==r[e+1].color)}(e.color_scale,i,o.mean,this._resolve))}return y}),g=[];for(const t of m.values())t.first&&g.push({lo:t.lo,hi:t.hi,entity:t.first,colored:ve(m)>1});const b=[];if(t.show_thresholds&&!this._compact){const t=new Set;for(const e of _)if(!e.off)for(const i of Xt(e.cfg.color_scale,e.cfg.color_scale_mode)){if(i<=e.lo||i>=e.hi)continue;const s=Math.round(e.y(i));t.has(s)||(t.add(s),b.push({y:s,value:i,entity:e.cfg,color:this._colorFor(e.cfg,i)}))}}const v=this._compact?[]:function(t,e){const i=Math.max(1,Math.floor(e/90)),s=Ot.find(e=>e>=t/i)??t,o=[];for(let i=1;i*s<t-1e-9;i++){const n=e*(1-i*s/t);n>=70&&o.push({x:Math.round(n),hours:i*s})}return o.reverse(),o.push({x:e,hours:0}),o}(this._hours,s);return this._model={key:n,width:this._width,plotW:s,height:i,start:a,end:r,series:_,axes:g,thresholds:b,hasData:f,ticks:v},this._model}_fromEvent(t,e){for(const i of t.composedPath()){const t=i?.dataset?.[e];if(t)return t}}_doAction(t,e){const i=this._config,s=i[`${t}_action`]??("tap"===t?{action:"more-info"}:void 0);if(!s||!this.hass)return;if("toggle-compact"===s.action)return void this._setCompact(!this._compact);let o=this._visible()[0]?.entity??i.entities[0].entity;"more-info"!==s.action||s.entity||(o=this._fromEvent(e,"entity")??o),function(t,e,i,s){if(!i||"none"===i.action)return!0;const o=i;switch(i.action){case"more-info":{const e=o.entity??s;return e&&dt(t,"hass-more-info",{entityId:e}),!0}case"toggle":return s&&e.callService("homeassistant","toggle",{entity_id:s}),!0;case"navigate":return o.navigation_path&&(history.pushState(null,"",o.navigation_path),dt(window,"location-changed",{replace:!1})),!0;case"url":return o.url_path&&window.open(o.url_path,!1===o.new_tab?"_self":"_blank"),!0;case"perform-action":case"call-service":{const t=o.perform_action??o.service;if(!t)return!0;const[i,s]=t.split(".",2);return e.callService(i,s,o.data??o.service_data,o.target),!0}default:;}}(this,this.hass,s,o)}_setHoverFromEvent(t){if(!this._model)return;const e=t.currentTarget.getBoundingClientRect(),i=t.clientX-e.left;this._hoverX=i>=0&&i<=this._model.plotW?i:null}render(){const t=this._config;if(!t||!this.hass)return B;const e=this._visible(),i="none"!==(t.graph??le),s=!this._compact&&i,o=this._compact&&i&&!!t.compact_graph,n=s||o?this._buildModel():void 0,r=t.text_color??t.compact_text_color;return I`
      <ha-card
        class=${this._compact?"compact":""}
        style=${r?`--bnc-cnc:${r}`:""}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
        tabindex="0"
        role="button"
        aria-label=${t.name??this._name(e[0]??t.entities[0])}
      >
        ${o&&e.length?I`<div class="graph bg" aria-hidden="true">${n?this._renderSvg(n,!this._ds?.loaded):B}</div>`:B}
        ${this._compact?this._renderCompact(e):this._renderHeader(e,n)}
        ${s&&e.length?this._renderGraph(n):B}
      </ha-card>
    `}_renderIcon(t,e){const i=t?this._state(t):void 0;return I`<ha-state-icon .hass=${this.hass} .stateObj=${i} .icon=${e??t?.icon}></ha-state-icon>`}_renderMarker(t){const e=this._config.legend_icon??pe;if("none"===e)return B;const i=this._colorFor(t,this._current(t));return"icon"===e?I`<span class="marker icon" style="color:${i}">${this._renderIcon(t)}</span>`:I`<span class="marker dot" style="background:${i}"></span>`}_sizeStyle(t){const e=Number(t?.font_size??this._config.font_size);return e>0?`--bnc-fs:${e}px`:""}_valueStyle(t){return t.color_scale?.length?`color:${this._colorFor(t,this._current(t))}`:""}_renderExtrema(t,e){if(!(t.show_extrema??this._config.show_extrema)||!e)return B;const i=e.series.find(e=>e.cfg===t);if(!i||!Number.isFinite(i.ext.min))return B;const s=t=>It(this.hass,t);return I`<div class="extrema">
      <span title=${s("card.min")}>↓ ${this._formatValue(t,i.ext.min)}</span>
      <span title=${s("card.avg")}>Ø ${this._formatValue(t,i.ext.avg)}</span>
      <span title=${s("card.max")}>↑ ${this._formatValue(t,i.ext.max)}</span>
    </div>`}_renderHeader(t,e){const i=this._config,s=1===i.entities.length,o=t[0]??i.entities[0],n=i.value_display??(s?"primary":"all"),r=i.name??(s||"primary"===n?this._name(o):void 0),a=i.icon??(s||"primary"===n?void 0:null),l=void 0===r&&null!==a&&"all"===n,c=(void 0!==r||null!==a)&&!l,h=c?I`<div class="header ${"all"!==n||s?"":"tight"}">
          <div class="name">${r??""}</div>
          ${null!==a?I`<div class="icon">${this._renderIcon(o,a)}</div>`:B}
        </div>`:B;if(!t.length)return I`${h}<div class="info empty">${It(this.hass,"card.all_hidden")}</div>`;if("none"===n)return I`${h}`;if("primary"===n)return I`${h}
        <div class="info fade" data-entity=${o.entity} style=${this._sizeStyle(o)}>
          <span class="value" style=${this._valueStyle(o)}>${this._formatState(o)}</span>
          <span class="measurement">${this._valueUnit(o)}</span>
          ${this._renderExtrema(o,e)}
        </div>`;const d=t.filter(t=>!1!==t.show_value),p=d.length>1,u=p&&!1!==i.legend_toggle&&"none"!==i.graph;return I`${h}
      <div class="values fade ${p?"multi":""} ${c?"":"noheader"}">
        ${d.map(t=>{const i=this._off.has(this._sid(t));return I`<div class="item ${i?"off":""}" data-entity=${t.entity} style=${this._sizeStyle(t)}>
            ${p?I`<div
                  class="item-name ${u?"toggle":""}"
                  data-toggle=${u?this._sid(t):""}
                  title=${u?It(this.hass,"card.toggle_series"):""}
                >
                  ${this._renderMarker(t)}<span>${this._name(t)}</span>
                </div>`:B}
            <div class="item-value">
              <span class="value" style=${this._valueStyle(t)}>${this._formatState(t)}</span>
              <span class="measurement">${this._valueUnit(t)}</span>
            </div>
            ${this._renderExtrema(t,e)}
          </div>`})}
        ${l?I`<div class="icon corner-icon">${this._renderIcon(o,a??void 0)}</div>`:B}
      </div>`}_renderCompact(t){const e=this._config,i=t.filter(t=>!1!==t.show_value),s=t[0]??e.entities[0],o=[Number(e.compact_font_size)>0?`--bnc-cfs:${Number(e.compact_font_size)}px`:"",Number(e.compact_name_size)>0?`--bnc-cns:${Number(e.compact_name_size)}px`:""].filter(Boolean).join(";");return I`<div class="compact-row fade ${e.compact_graph&&"none"!==e.graph?"over-graph":""}" style=${o}>
      ${e.compact_icon?I`<span class="icon compact-icon">${this._renderIcon(s,e.icon)}</span>`:B}
      ${e.name?I`<span class="compact-name">${e.name}</span>`:B}
      <div class="compact-values">
        ${i.length?i.map(t=>I`<span class="compact-item" data-entity=${t.entity} title=${this._name(t)}>
                ${i.length>1||"icon"===e.legend_icon?this._renderMarker(t):B}
                <span class="compact-text">
                  ${e.compact_names?I`<span class="compact-label">${this._name(t)}</span>`:B}
                  <span class="vm">
                    <span class="value" style=${this._valueStyle(t)}>${this._formatState(t)}</span>
                    <span class="measurement">${this._valueUnit(t)}</span>
                  </span>
                </span>
              </span>`):I`<span class="empty">${It(this.hass,"card.all_hidden")}</span>`}
      </div>
    </div>`}_renderGraph(t){const e=this._graphHeight(),i=!this._ds?.loaded,s=this._config.y_axis??ue,o=this._config.x_axis??me;return I`<div
      class="graph fade ${null!==this._hoverX?"active":""} ${"always"===o?"xa-always":""}"
      style=${Number(this._config.height)>0?`height:${e}px;flex:none`:`flex:1 1 ${this._baseGraphHeight()}px;min-height:${Math.min(40,this._baseGraphHeight())}px`}
      @pointerdown=${this._onGraphDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onGraphUp}
      @pointercancel=${this._onGraphUp}
      @pointerleave=${this._onLeave}
    >
      ${t?I`${this._renderSvg(t,i)} ${this._renderEndLabels(t)}
          ${i?I`<span class="sr-only" role="status">${It(this.hass,"card.loading")}</span>`:B}
          ${t.hasData||i?B:I`<div class="nodata">
                ${this._ds?.errors().length?I`${It(this.hass,"card.load_error")}<small>${this._ds.errors().join(" · ")}</small>`:It(this.hass,"card.no_data")}
              </div>`}
          ${"none"!==s&&t.hasData?this._renderAxes(t,s):B}
          ${"none"!==o&&t.hasData?this._renderTimeAxis(t,o):B}
          ${this._renderTooltip(t)}`:B}
    </div>`}_renderAxes(t,e){const i=(t,e)=>`${this._formatValue(t,e)} ${this._unit(t)}`.trim();return I`<div class="axes ${"hover"===e?"hover":""}">
      ${t.axes.map(t=>{const e=e=>t.colored?`color:${this._colorFor(t.entity,e)}`:"";return I`<div class="axis">
          <span style=${e(t.hi)}>${i(t.entity,t.hi)}</span><span style=${e(t.lo)}>${i(t.entity,t.lo)}</span>
        </div>`})}
    </div>`}_renderTimeAxis(t,e){const i=t=>It(this.hass,t);return I`<div class="xaxis ${"hover"===e?"hover":""}">
      ${t.ticks.map(t=>I`<span class=${0===t.hours?"now":""} style="left:${t.x}px">${(t=>0===t?i("card.now"):t<1?`−${Math.round(60*t)} min`:t<48?`−${+t.toFixed(1)} h`:`−${+(t/24).toFixed(1)} d`)(t.hours)}</span>`)}
    </div>`}_renderSvg(t,e=!1){const i=this._hoverX,s=t.series.filter(t=>!t.off),o=e=>t.height-e.lineWidth/2-2,n=e=>t.hasData?e.segs.map(t=>Vt(t,e.smooth)):[`M0,${o(e)}L${t.plotW},${o(e)}`],r=Math.max(60,.35*t.plotW);return I`<svg width=${t.width} height=${t.height} viewBox="0 0 ${t.width} ${t.height}">
      <defs>
        ${e?W`<linearGradient id=${`${this._uid}-glow`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0"></stop>
                <stop offset="0.5" stop-color="#fff" stop-opacity="0.9"></stop>
                <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <mask id=${`${this._uid}-glowmask`}>
                ${s.map(t=>n(t).map(e=>W`<path d=${e} fill="none" stroke="#fff" stroke-width=${t.lineWidth+3} stroke-linecap="round"></path>`))}
              </mask>`:B}
        ${s.map(t=>t.gradId?W`<linearGradient id=${t.gradId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${t.y(t.lo)} y2=${t.y(t.hi)}>
                ${t.grad.map(t=>W`<stop offset=${t.offset} stop-color=${t.color}></stop>`)}
              </linearGradient>`:B)}
        ${s.map(e=>e.fillGradId?W`<linearGradient id=${e.fillGradId} gradientUnits="userSpaceOnUse" x1="0" x2=${t.plotW} y1="0" y2="0">
                ${e.fillGrad.map(t=>W`<stop offset=${t.offset} stop-color=${t.color}></stop>`)}
              </linearGradient>`:B)}
      </defs>
      ${t.thresholds.map(e=>W`<line class="threshold" x1="0" x2=${t.plotW} y1=${e.y} y2=${e.y} style="stroke:${e.color}"></line>`)}
      ${t.ticks.map(e=>0===e.hours?B:W`<line class="tick" x1=${e.x} x2=${e.x} y1="0" y2=${t.height}></line>`)}
      ${s.map(e=>{const i=e.gradId?`url(#${e.gradId})`:e.color,s=e.fillGradId?`url(#${e.fillGradId})`:i;return W`<g>
          ${e.band?W`<path class="band" d=${function(t,e,i){const s=t.mean.length,o=s>1?e/(s-1):0;let n="",r=[];const a=()=>{if(r.length>1){const e=r.map(e=>`${Dt(e*o)},${Dt(i(t.bandHi[e]))}`),s=r.map(e=>`${Dt(e*o)},${Dt(i(t.bandLo[e]))}`).reverse();n+=`M${e.join("L")}L${s.join("L")}Z`}r=[]};for(let e=0;e<s;e++)Number.isFinite(t.bandLo[e])&&Number.isFinite(t.bandHi[e])?r.push(e):a();return a(),n}(e.buckets,t.plotW,e.y)} style="fill:${i}"></path>`:B}
          ${e.fill?e.segs.map(i=>W`<path class="fill" d=${function(t,e,i){return t.length<2?"":`${Vt(t,e)}L${Dt(t[t.length-1][0])},${i}L${Dt(t[0][0])},${i}Z`}(i,e.smooth,t.height)} style="fill:${s}"></path>`):B}
          ${e.segs.map(t=>W`<path class="line" d=${Vt(t,e.smooth)} style="stroke:${i};stroke-width:${e.lineWidth}px"></path>`)}
        </g>`})}
      ${!t.hasData&&e?s.map(t=>W`<path class="line placeholder" d=${n(t)[0]} style="stroke:${t.color};stroke-width:${t.lineWidth}px"></path>`):B}
      ${e?W`<g mask=${`url(#${this._uid}-glowmask)`}>
            <rect class="glow" x=${-r} y="0" width=${r} height=${t.height} fill=${`url(#${this._uid}-glow)`}
              style=${`--sweep:${t.plotW+r}px`}></rect>
          </g>`:B}
      ${null!==i?W`<line class="cursor" x1=${i} x2=${i} y1="0" y2=${t.height}></line>
          ${s.map(e=>{const s=Ut(e.buckets,i,t.plotW);return Number.isFinite(s)?W`<circle class="dot" cx=${i} cy=${e.y(s)} r="4" style="fill:${this._colorFor(e.cfg,s)}"></circle>`:B})}`:B}
    </svg>
    ${t.thresholds.map(e=>I`<div class="threshold-label" style="top:${e.y}px;right:${t.width-t.plotW+4}px;color:${e.color}">
        ${this._formatValue(e.entity,e.value)}
      </div>`)}`}_renderEndLabels(t){const e=this._config.end_labels??de;if("none"===e)return B;const i=t.series.filter(t=>!t.off).map(e=>{const i=this._current(e.cfg),s=function(t){for(let e=t.length-1;e>=0;e--)if(Number.isFinite(t[e]))return t[e];return NaN}(e.buckets.mean),o=e.y(Number.isFinite(i)?i:s);return{s:e,v:i,y:Number.isFinite(o)?o:t.height/2}}).sort((t,e)=>t.y-e.y);for(let t=1;t<i.length;t++)i[t].y=Math.max(i[t].y,i[t-1].y+18);const s=i.length?i[i.length-1].y-(t.height-9-12):0;if(s>0)for(const t of i)t.y-=s;for(const t of i)t.y=Math.max(t.y,9);return I`${i.map(({s:i,v:s,y:o})=>{const n=this._colorFor(i.cfg,s);return I`<div class="end-label" data-entity=${i.cfg.entity} style="left:${t.plotW+4}px;top:${o}px;color:${n}">
        ${"icon"===e||"icon_value"===e?this._renderIcon(i.cfg):B}
        ${"value"===e||"icon_value"===e?I`<span>${this._formatState(i.cfg)}<small>${this._valueUnit(i.cfg)?` ${this._valueUnit(i.cfg)}`:""}</small></span>`:B}
      </div>`})}`}_renderTooltip(t){const e=this._hoverX;if(null===e)return B;const i=t.start+e/t.plotW*(t.end-t.start),s=t.series.filter(t=>!t.off).map(i=>({s:i,v:Ut(i.buckets,e,t.plotW)})),o=e>t.width/2;return I`<div class="tooltip" style="${o?`right:${t.width-e+10}px`:`left:${e+10}px`}">
      <div class="tt-time">${function(t,e,i){const s=t?.locale?.language??t?.language??"en",o=t?.locale?.time_format,n=`${s}|${o}|${i}`;let r=Bt.get(n);if(!r){const t="12"===o||"24"!==o&&void 0;r=new Intl.DateTimeFormat(s,{...i?{day:"2-digit",month:"2-digit"}:{},hour:"2-digit",minute:"2-digit",hour12:t}),Bt.set(n,r)}return r.format(e)}(this.hass,i,this._hours>24)}</div>
      ${s.map(({s:t,v:e})=>I`<div class="tt-row">
          <span class="marker dot" style="background:${this._colorFor(t.cfg,e)}"></span>
          ${s.length>1?I`<span class="tt-name">${this._name(t.cfg)}</span>`:B}
          <span class="tt-value">${Number.isFinite(e)?this._formatValue(t.cfg,e):"–"} ${this._unit(t.cfg)}</span>
        </div>`)}
    </div>`}}function be(t){let e=1/0,i=-1/0;for(let s=0;s<t.bandLo.length;s++)t.bandLo[s]<e&&(e=t.bandLo[s]),t.bandHi[s]>i&&(i=t.bandHi[s]);return[e,i]}function ve(t){let e=0;for(const i of t.values())i.first&&e++;return e}function xe(t,e){const i=e.split(".")[0];if(!["sensor","number","input_number"].includes(i))return!1;const s=t.states[e];if(!s)return!1;const o=s.attributes;return!("sensor"===i&&!o.unit_of_measurement&&!o.state_class)&&("unavailable"===s.state||"unknown"===s.state||Number.isFinite(Number(s.state)))}ge.properties={hass:{attribute:!1},_config:{state:!0},_compact:{state:!0},_width:{state:!0},_graphH:{state:!0},_hoverX:{state:!0},_tick:{state:!0},_off:{state:!0}},ge.styles=n`
    :host {
      display: block;
      position: relative;
    }
    :host([alert])::after {
      --c: var(--bnc-alert-color, var(--error-color, #db4437));
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow:
        0 0 0 2px var(--c),
        0 0 18px 4px color-mix(in srgb, var(--c) 55%, transparent),
        inset 0 0 28px color-mix(in srgb, var(--c) 28%, transparent);
      animation: bnc-glow 2s ease-in-out infinite;
    }
    :host([alert-style="blink"])::after {
      animation: bnc-blink 1s steps(1, end) infinite;
    }
    :host([alert-style="static"])::after {
      animation: none;
    }
    @keyframes bnc-glow {
      0%,
      100% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
    }
    @keyframes bnc-blink {
      50% {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host([alert])::after {
        animation: none;
      }
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
    ha-card:focus-visible {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .fade {
      animation: bnc-in 0.2s ease-out;
    }
    @keyframes bnc-in {
      from {
        opacity: 0;
        transform: translateY(3px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade {
        animation: none;
      }
    }
    .header {
      display: flex;
      padding: 8px 16px 0;
      justify-content: space-between;
    }
    .header.tight {
      padding-top: 6px;
    }
    .header.tight .name,
    .header.tight .icon {
      line-height: 34px;
    }
    .name {
      color: var(--bnc-cnc, var(--secondary-text-color));
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
      line-height: max(28px, calc(var(--bnc-fs, 28px) * 1.1));
    }
    .info.empty {
      color: var(--secondary-text-color);
      padding-top: 12px;
    }
    .value {
      font-size: var(--bnc-fs, 28px);
      margin-right: 4px;
      margin-inline-end: 4px;
    }
    .measurement {
      font-size: calc(var(--bnc-fs, 28px) * 0.64);
      color: var(--secondary-text-color);
    }
    .extrema {
      display: flex;
      gap: 10px;
      font-size: 12px;
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .values {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      padding: 0 16px 16px;
      margin-top: -4px;
    }
    .values.noheader {
      padding-top: 12px;
      margin-top: 0;
    }
    .corner-icon {
      margin-left: auto;
      align-self: flex-start;
      line-height: 24px;
    }
    .values.multi .value {
      font-size: var(--bnc-fs, 24px);
    }
    .values.multi .measurement {
      font-size: calc(var(--bnc-fs, 24px) * 0.62);
    }
    .item {
      min-width: 0;
      transition: opacity 0.2s;
    }
    .item.off {
      opacity: 0.45;
    }
    .item.off .item-name span {
      text-decoration: line-through;
    }
    .item-value {
      line-height: max(28px, calc(var(--bnc-fs, 24px) * 1.15));
      white-space: nowrap;
    }
    .item-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      line-height: 16px;
      color: var(--bnc-cnc, var(--secondary-text-color));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-name.toggle {
      border-radius: 4px;
    }
    @media (hover: hover) {
      .item-name.toggle:hover {
        color: var(--primary-text-color);
      }
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
      width: 100%;
      touch-action: pan-y;
    }
    /* the svg must not influence the layout – its size follows the measured area */
    .graph svg {
      position: absolute;
      left: 0;
      top: 0;
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
    .band {
      opacity: 0.16;
      stroke: none;
    }
    .tick {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .graph:hover .tick,
    .graph.active .tick,
    .graph.xa-always .tick {
      opacity: 1;
    }
    .xaxis {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1px;
      height: 12px;
      pointer-events: none;
      transition: opacity 0.2s;
      font-size: 10px;
      line-height: 12px;
      color: var(--secondary-text-color);
    }
    .xaxis.hover {
      opacity: 0;
    }
    .graph:hover .xaxis.hover,
    .graph.active .xaxis.hover {
      opacity: 1;
    }
    .xaxis span {
      position: absolute;
      bottom: 0;
      transform: translateX(-50%);
      white-space: nowrap;
      padding: 0 2px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
    }
    .xaxis span.now {
      transform: translateX(-100%);
    }
    .threshold {
      stroke-width: 1;
      stroke-dasharray: 4 4;
      opacity: 0.7;
    }
    .threshold-label {
      position: absolute;
      transform: translateY(-100%);
      font-size: 10px;
      line-height: 12px;
      padding-bottom: 1px;
      pointer-events: none;
      opacity: 0.9;
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
    .axes {
      position: absolute;
      inset: 0 auto 0 0;
      display: flex;
      gap: 6px;
      padding: 2px 6px;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .axes.hover {
      opacity: 0;
    }
    .graph:hover .axes.hover,
    .graph.active .axes.hover {
      opacity: 1;
    }
    .axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 10px;
      line-height: 12px;
      color: var(--secondary-text-color);
    }
    .axis span {
      background: color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      border-radius: 3px;
      padding: 0 2px;
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
    .placeholder {
      opacity: 0.35;
    }
    .glow {
      animation: bnc-sweep 1.6s ease-in-out infinite;
    }
    @keyframes bnc-sweep {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(var(--sweep));
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .glow {
        animation: none;
        opacity: 0;
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .nodata {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 0 16px;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--secondary-text-color);
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
    .graph.bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.28;
      overflow: hidden;
      border-radius: inherit;
    }
    .compact-icon {
      flex: none;
      line-height: 0;
    }
    /* text above the background graph: a soft halo in the card colour keeps it readable */
    .compact-row.over-graph {
      --bnc-halo: var(--ha-card-background, var(--card-background-color, #fff));
      text-shadow:
        0 0 2px var(--bnc-halo),
        0 0 4px var(--bnc-halo),
        0 0 8px var(--bnc-halo),
        0 0 12px var(--bnc-halo);
    }
    .compact-row.over-graph ha-state-icon,
    .compact-row.over-graph .marker.dot {
      filter: drop-shadow(0 0 3px var(--bnc-halo)) drop-shadow(0 0 6px var(--bnc-halo));
    }
    .compact-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .compact-label {
      color: var(--bnc-cnc, var(--secondary-text-color));
      font-size: max(11px, calc(var(--bnc-cfs, 20px) * 0.55));
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 12em;
    }
    .compact-row {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      min-height: 40px;
      box-sizing: border-box;
    }
    .compact-name {
      min-width: 3em;
      color: var(--bnc-cnc, var(--secondary-text-color));
      font-size: var(--bnc-cns, inherit);
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
      line-height: max(24px, calc(var(--bnc-cfs, 20px) * 1.2));
    }
    .compact-item .value {
      font-size: var(--bnc-cfs, 20px);
      margin: 0;
    }
    .compact-item .measurement {
      font-size: calc(var(--bnc-cfs, 20px) * 0.7);
    }
    .empty {
      color: var(--secondary-text-color);
    }
  `,customElements.get("best-number-card")||(customElements.define("best-number-card",ge),console.info(`%c BEST-NUMBER-CARD %c v${re} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4")),window.customCards=window.customCards||[],window.customCards.some(t=>"best-number-card"===t.type)||window.customCards.push({type:"best-number-card",name:"Best Number Card",description:"Sensor card for multiple entities with color scales and efficient history loading.",preview:!0,documentationURL:"https://github.com/zitroaen/bestnumbercard",getEntitySuggestion:(t,e)=>xe(t,e)?{config:{type:"custom:best-number-card",entities:[{entity:e}]}}:null});export{ge as BestNumberCard,re as VERSION,xe as isNumericSensor};
