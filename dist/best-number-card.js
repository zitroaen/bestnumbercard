const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(s,e,i)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!a(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...c(e),...d(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(t)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=t.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const n=o.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const n=this.constructor;if(!1===s&&(o=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??b)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[g("elementProperties")]=new Map,w[g("finalized")]=new Map,_?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,x=e=>e,k=$.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+N,E=`<${M}>`,T=document,F=()=>T.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,H=Array.isArray,C="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,V=/>/g,U=RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,O=/"/g,W=/^(?:script|style|textarea|title)$/i,R=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),j=R(1),I=R(2),G=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),K=new WeakMap,Z=T.createTreeWalker(T,129);function X(e,t){if(!H(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const q=(e,t)=>{const i=e.length-1,s=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=D;for(let t=0;t<i;t++){const i=e[t];let a,l,h=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=L:void 0!==l[1]?r=V:void 0!==l[2]?(W.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=U):void 0!==l[3]&&(r=U):r===U?">"===l[0]?(r=o??D,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?U:'"'===l[3]?O:P):r===O||r===P?r=U:r===L||r===V?r=D:(r=U,o=void 0);const d=r===U&&e[t+1].startsWith("/>")?" ":"";n+=r===D?i+E:h>=0?(s.push(a),i.slice(0,h)+A+i.slice(h)+N+d):i+N+(-2===h?t:d)}return[X(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,h]=q(e,t);if(this.el=Y.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(A)){const t=h[n++],i=s.getAttribute(e).split(N),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?ie:"?"===r[1]?se:"@"===r[1]?oe:te}),s.removeAttribute(e)}else e.startsWith(N)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(W.test(s.tagName)){const e=s.textContent.split(N),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],F()),Z.nextNode(),a.push({type:2,index:++o});s.append(e[t],F())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(N,e+1));)a.push({type:7,index:o}),e+=N.length-1}o++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,s){if(t===G)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=z(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=J(e,o._$AS(e,t.values),o,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??T).importNode(t,!0);Z.currentNode=s;let o=Z.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new ee(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new ne(o,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(o=Z.nextNode(),n++)}return Z.currentNode=T,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),z(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>H(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new Y(e)),t}k(e){H(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new ee(this.O(F()),this.O(F()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(e,t=this,i,s){const o=this.strings;let n=!1;if(void 0===o)e=J(this,e,t,0),n=!z(e)||e!==this._$AH&&e!==G,n&&(this._$AH=e);else{const s=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=J(this,s[i+r],t,r),a===G&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===B?e=B:e!==B&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class se extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class oe extends te{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??B)===G)return;const i=this._$AH,s=e===B&&i!==B||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(Y,ee),($.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class le extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new ee(t.insertBefore(F(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}le._$litElement$=!0,le.finalized=!0,ae.litElementHydrateSupport?.({LitElement:le});const he=ae.litElementPolyfillSupport;he?.({LitElement:le}),(ae.litElementVersions??=[]).push("4.2.2");var ce="0.15.1";function de(e,t,i){e.dispatchEvent(new CustomEvent(t,{detail:i,bubbles:!0,composed:!0}))}const pe=new Map;let ue;function me(e,t){let i=e.trim();const s=/^var\(\s*(--[^,)\s]+)\s*(?:,\s*([^)]+))?\)$/.exec(i);if(s){return i=(t?getComputedStyle(t).getPropertyValue(s[1]).trim():"")||s[2]?.trim()||"#000",me(i)}const o=pe.get(i);if(o)return o;let n=fe(i);return n||"undefined"==typeof document||(ue??=document.createElement("canvas").getContext("2d"),ue&&(ue.fillStyle="#000",ue.fillStyle=i,n=fe(String(ue.fillStyle)))),n??=[0,0,0,1],pe.set(i,n),n}function fe(e){let t=/^#([0-9a-f]{3,8})$/i.exec(e);if(t){let e=t[1];if(3!==e.length&&4!==e.length||(e=[...e].map(e=>e+e).join("")),6!==e.length&&8!==e.length)return null;const i=t=>parseInt(e.slice(t,t+2),16);return[i(0),i(2),i(4),8===e.length?i(6)/255:1]}if(t=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(e),t){let e=1;return void 0!==t[4]&&(e=t[4].endsWith("%")?parseFloat(t[4])/100:parseFloat(t[4])),[+t[1],+t[2],+t[3],e]}return null}function _e([e,t,i,s]){const o=e=>Math.round(e);return s>=1?`rgb(${o(e)},${o(t)},${o(i)})`:`rgba(${o(e)},${o(t)},${o(i)},${+s.toFixed(3)})`}function ge(e){return e.filter(e=>e&&Number.isFinite(Number(e.value))&&e.color).map((e,t)=>({s:{value:Number(e.value),color:String(e.color)},i:t})).sort((e,t)=>e.s.value-t.s.value||e.i-t.i).map(e=>e.s)}function ve(e,t,i,s){const o=e.length;if(!o||!Number.isFinite(i))return s(e[0]?.color??"#000");if(i<e[0].value)return s(e[0].color);let n=0;for(;n+1<o&&e[n+1].value<=i;)n++;if("step"===t||n===o-1)return s(e[n].color);const r=e[n],a=e[n+1],l=(i-r.value)/(a.value-r.value);return function(e,t,i){return[e[0]+(t[0]-e[0])*i,e[1]+(t[1]-e[1])*i,e[2]+(t[2]-e[2])*i,e[3]+(t[3]-e[3])*i]}(s(r.color),s(a.color),l)}function be(e,t,i,s,o,n){const r=s-i;if(!(e.length&&r>0)){const s=_e(ve(e,t,i,o));return[{offset:0,color:s},{offset:1,color:s}]}const a=n?.offset??(e=>(e-i)/r),l=[{offset:0,color:_e(ve(e,t,i,o))}],h=[...(n?.breaks??[]).map(e=>({v:e,stop:void 0})),...e.map(e=>({v:e.value,stop:e}))].sort((e,t)=>e.v-t.v||(e.stop?1:0)-(t.stop?1:0));let c=ve(e,t,i,o);for(const n of h){if(n.v<=i||n.v>=s)continue;const r=a(n.v);n.stop?"step"===t?(l.push({offset:r,color:_e(c)}),c=o(n.stop.color),l.push({offset:r,color:_e(c)})):l.push({offset:r,color:_e(o(n.stop.color))}):l.push({offset:r,color:_e("step"===t?c:ve(e,t,n.v,o))})}return l.push({offset:1,color:_e(ve(e,t,s,o))}),l}function ye(e,t,i,s){const o=Math.min(i,s),n=Math.max(i,s);if(o===n)return!1;if("step"===t)return e.some(e=>e.value>o&&e.value<=n);for(let t=0;t+1<e.length;t++)if(e[t].value===e[t+1].value&&e[t].value>o&&e[t].value<=n)return!0;return!1}const we={"5minute":3e5,hour:36e5,day:864e5},$e=(()=>{try{return"1"===globalThis.localStorage?.getItem("best-number-card-debug")}catch{return!1}})(),xe=(...e)=>$e&&console.info("[best-number-card]",...e);class ke{constructor(){this.statT=[],this.statV=[],this.statLo=[],this.statHi=[],this.statsEnd=NaN,this.rawT=[],this.rawV=[],this.rawFrom=NaN,this.rawUntil=NaN,this.statsLoaded=!1,this.preferRaw=!1,this.rawLoaded=!1,this.version=0,this.lastUsed=0,this.subscribers=new Set,this.live=!1}stopLive(e){this.live=!1,void 0!==this.pendingFrom?this.rawUntil=this.pendingFrom:Number.isFinite(this.rawUntil)||(this.rawUntil=e),this.pendingFrom=void 0}appendRaw(e,t){const i=this.rawT.length;return i&&e<=this.rawT[i-1]?e===this.rawT[i-1]&&!Object.is(t,this.rawV[i-1])&&(this.rawV[i-1]=t,this.version++,!0):(!i||!Object.is(t,this.rawV[i-1]))&&(this.rawT.push(e),this.rawV.push(t),this.version++,!0)}prune(e){const t=(t,i)=>{const s=Ne(t,e)-1;s>0&&(t.splice(0,s),i.splice(0,s),this.version++)},i=Ne(this.statT,e)-1;i>0&&(this.statLo.splice(0,i),this.statHi.splice(0,i)),t(this.statT,this.statV),t(this.rawT,this.rawV)}series(){if(this.memo?.version===this.version)return this.memo.data;let e;if(this.preferRaw)e=this.rawLoaded&&this.rawT.length||!this.statT.length?{t:this.rawT,v:this.rawV}:{t:this.statT,v:this.statV,lo:this.statLo,hi:this.statHi};else if(this.statT.length)if(this.rawT.length){const t=Number.isFinite(this.rawFrom)?Ne(this.statT,this.rawFrom):this.statT.length,i=t?Ne(this.rawT,Number.isFinite(this.rawFrom)?this.rawFrom:this.statT[t-1]+1):0,s=this.rawV.slice(i);e={t:this.statT.slice(0,t).concat(this.rawT.slice(i)),v:this.statV.slice(0,t).concat(s),lo:this.statLo.slice(0,t).concat(s),hi:this.statHi.slice(0,t).concat(s)}}else e={t:this.statT,v:this.statV,lo:this.statLo,hi:this.statHi};else e={t:this.rawT,v:this.rawV};return this.memo={version:this.version,data:e},e}notifySubscribers(){for(const e of this.subscribers)e.notify()}}const Se=new Map;function Ae(e){let t=Se.get(e);if(!t&&(t=new ke,Se.set(e,t),Se.size>60)){const e=[...Se.entries()].filter(([,e])=>e!==t&&!e.subscribers.size),i=e.sort((e,t)=>e[1].lastUsed-t[1].lastUsed)[0];i&&Se.delete(i[0])}return t.lastUsed=Date.now(),t}function Ne(e,t){let i=0,s=e.length;for(;i<s;){const o=i+s>>>1;e[o]<t?i=o+1:s=o}return i}const Me=e=>{if("number"==typeof e)return e;if("string"!=typeof e||""===e)return NaN;const t=Number(e);return Number.isFinite(t)?t:NaN},Ee=e=>"number"==typeof e?e<1e11?1e3*e:e:Date.parse(String(e)),Te=e=>6e4*Math.floor(e/6e4),Fe=e=>e.split("::")[0],ze=e=>e.split("::")[1];class He{constructor(e,t){var i,s;this.hass=e,this.opts=t,this.stores=new Map,this.subs=[],this.timers=[],this.disposed=!1,this.changeScheduled=!1,this.wasDisconnected=!1,this.onDisconnected=()=>{this.wasDisconnected=!0;const e=Date.now();for(const t of this.stores.values())t.owner===this&&t.stopLive(e);this.subs=[]},this.onReady=()=>{this.wasDisconnected&&!this.disposed&&(this.wasDisconnected=!1,this.subscribeGrouped(this.entities.filter(e=>this.stores.get(e).owner===this&&!this.stores.get(e).live)))},this.entities=[...new Set(t.entities)],this.useStatistics=t.hoursToShow>t.statisticsThreshold,this.period=(i=t.hoursToShow,"5minute"===(s=t.statisticsPeriod)||"hour"===s||"day"===s?s:i<=72?"5minute":i<=1440?"hour":"day"),this.detail=new Set(t.detail??[]);for(const e of this.entities){const i=this.statsFor(e)?this.period:this.previewFor(e)?"detail":"raw",s=Ae(`${e}|${t.hoursToShow}|${i}`);s.preferRaw="detail"===i,this.stores.set(e,s)}}statsFor(e){return this.useStatistics&&!ze(e)&&!this.detail.has(e)}previewFor(e){return this.useStatistics&&!ze(e)&&this.detail.has(e)}get windowStart(){return Date.now()-36e5*this.opts.hoursToShow}get loaded(){for(const[e,t]of this.stores){if(this.statsFor(e)&&!t.statsLoaded)return!1;if(!t.rawLoaded)return!1}return!0}setHass(e){this.hass=e}series(e){return this.stores.get(e)?.series()}errors(){const e=[];for(const[t,i]of this.stores)i.error&&e.push(`${t}: ${i.error}`);return e}async start(){const e=this.windowStart;for(const t of this.stores.values())t.subscribers.add(this),t.prune(e);this.listenToConnection();const t=this.entities.filter(e=>{const t=this.stores.get(e);return this.previewFor(e)&&!t.statsLoaded&&!t.statsLoading&&!t.rawLoaded});if(t.length){const i=this.loadStatistics(t,e).then(()=>{for(const e of t)this.stores.get(e).notifySubscribers()});for(const e of t)this.stores.get(e).statsLoading=i}if(this.useStatistics){const t=[],i=[];for(const e of this.entities){const s=this.stores.get(e);this.statsFor(e)&&!s.statsLoaded&&(s.statsLoading?t.push(s.statsLoading):i.push(e))}if(i.length){const s=this.loadStatistics(i,e);for(const e of i)this.stores.get(e).statsLoading=s;t.push(s)}if(t.length&&(await Promise.all(t),this.disposed))return}const i=this.entities.filter(e=>{const t=this.stores.get(e);return!(t.owner&&t.owner!==this&&!t.owner.isDisposed)&&((t.owner!==this||!t.live)&&(t.owner=this,!0))});if(this.subscribeGrouped(i,e),this.timers.push(window.setInterval(()=>this.maintain(),6e5)),this.useStatistics){const e=Math.max(we[this.period],9e5);this.timers.push(window.setInterval(()=>this.compact(),e))}this.notify()}subscribeGrouped(e,t=this.windowStart){const i=new Map;for(const s of e){const e=this.stores.get(s);let o;e.rawT.length||Number.isFinite(e.rawUntil)?o=Number.isFinite(e.rawUntil)?e.rawUntil:e.rawT[e.rawT.length-1]:(o=Number.isFinite(e.statsEnd)&&!e.preferRaw?e.statsEnd:t,e.rawFrom=o),o=Te(Math.max(o,t));const n=`${o}|${ze(s)?"a":"s"}`,r=i.get(n)??[];r.push(s),i.set(n,r)}for(const[e,t]of i)this.subscribe(Number(e.split("|")[0]),t,e.endsWith("|a"))}subscribe(e,t,i=!1){const s={entities:t};this.subs.push(s);let o=!0;for(const i of t){const t=this.stores.get(i);t.rawUntil=NaN,t.pendingFrom=e,t.live=!0,t.rawLoaded=t.rawLoaded&&t.rawT.length>0}const n={entities:t,from:new Date(e).toISOString(),attributes:i};xe("subscribe history/stream",n);const r=()=>{if(o){o=!1;for(const e of t){const t=this.stores.get(e);t.pendingFrom=void 0,t.rawLoaded=!0,t.version++,t.notifySubscribers()}}};this.hass.connection.subscribeMessage(e=>{if($e){const t=Object.fromEntries(Object.entries(e?.states??{}).map(([e,t])=>[e,t.length]));xe(o?"history (initial)":"history (update)",t,n)}r(),this.onStream(e,t)},i?{type:"history/stream",entity_ids:[...new Set(t.map(Fe))],start_time:new Date(e).toISOString(),minimal_response:!1,no_attributes:!1,significant_changes_only:!1}:{type:"history/stream",entity_ids:t,start_time:new Date(e).toISOString(),minimal_response:!0,no_attributes:!0,significant_changes_only:!0},{resubscribe:!1}).then(e=>{for(const e of t)this.stores.get(e).error=void 0;this.disposed||!this.subs.includes(s)?e().catch(()=>{}):s.unsub=e},e=>{const i=e?.message??e?.code??String(e);console.warn("best-number-card: history subscription failed",n,e);for(const e of t){const t=this.stores.get(e);t.live=!1,t.error=String(i)}r()})}onStream(e,t){if(e?.states)for(const i of t){const t=e.states[Fe(i)],s=this.stores.get(i);if(!t||!s)continue;const o=ze(i);let n=!1;for(const e of t){const t=Ee(e.lu??e.lc);if(!Number.isFinite(t))continue;if(o&&!e.a)continue;const i=Me(o?e.a[o]:e.s);n=s.appendRaw(t,i)||n}n&&s.notifySubscribers()}}listenToConnection(){const e=this.hass.connection;"function"==typeof e?.addEventListener&&(this.conn=e,e.addEventListener("disconnected",this.onDisconnected),e.addEventListener("ready",this.onReady))}adopt(e){const t=this.stores.get(e);this.disposed||!t||t.owner&&!t.owner.isDisposed||(t.owner=this,this.subscribeGrouped([e]))}async fetchStatistics(e,t){return this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(t).toISOString(),statistic_ids:e,period:this.period,types:["mean","min","max","state"]})}async loadStatistics(e,t){const i=Math.floor(t/we[this.period])*we[this.period];let s={};try{s=await this.fetchStatistics(e,i)??{}}catch(e){console.warn("best-number-card: statistics unavailable, using history",e)}xe("statistics",this.period,Object.fromEntries(e.map(e=>[e,s[e]?.length??0])));for(const t of e){const e=this.stores.get(t);this.applyStats(e,s[t]),e.statsLoaded=!0,e.statsLoading=void 0}}applyStats(e,t){if(!t?.length)return;const i=we[this.period];for(const s of t){const t=Ee(s.start);if(!Number.isFinite(t)||e.statT.length&&t<=e.statT[e.statT.length-1])continue;e.statT.length&&Number.isFinite(e.statsEnd)&&t>e.statsEnd&&(e.statT.push(e.statsEnd),e.statV.push(NaN),e.statLo.push(NaN),e.statHi.push(NaN));const o=Me(s.mean??s.state??NaN);e.statT.push(t),e.statV.push(o),e.statLo.push(null!=s.min?Me(s.min):o),e.statHi.push(null!=s.max?Me(s.max):o);const n=void 0!==s.end?Ee(s.end):t+i;e.statsEnd=Number.isFinite(n)?n:t+i}e.version++}async compact(){const e=this.entities.filter(e=>{const t=this.stores.get(e);return t.owner===this&&this.statsFor(e)&&Number.isFinite(t.statsEnd)});if(!e.length||"hidden"===document.visibilityState)return;const t=Math.min(...e.map(e=>this.stores.get(e).statsEnd));let i;try{i=await this.fetchStatistics(e,t)??{}}catch{return}if(!this.disposed)for(const t of e){const e=this.stores.get(t);this.applyStats(e,i[t]);const s=Ne(e.rawT,e.statsEnd)-1;s>0&&(e.rawT.splice(0,s),e.rawV.splice(0,s)),e.rawFrom=e.statsEnd,e.prune(this.windowStart),e.version++,e.notifySubscribers()}}maintain(){const e=this.windowStart;for(const t of this.stores.values())t.owner===this&&t.prune(e)}notify(){this.changeScheduled||this.disposed||(this.changeScheduled=!0,queueMicrotask(()=>{this.changeScheduled=!1,this.disposed||this.opts.onChange()}))}dispose(){if(this.disposed)return;this.disposed=!0;for(const e of this.timers)clearInterval(e);this.timers=[],this.conn?.removeEventListener&&(this.conn.removeEventListener("disconnected",this.onDisconnected),this.conn.removeEventListener("ready",this.onReady));const e=Date.now(),t=[];for(const[i,s]of this.stores)s.subscribers.delete(this),s.owner===this&&(s.owner=void 0,s.stopLive(e),s.subscribers.size&&t.push([i,s]));for(const e of this.subs)e.unsub?.().catch(()=>{});this.subs=[],t.length&&queueMicrotask(()=>{for(const[e,i]of t)i.owner||[...i.subscribers][0]?.adopt(e)})}get isDisposed(){return this.disposed}}function Ce(e,t,i,s){const o=new Float64Array(s).fill(NaN),n=new Float64Array(s).fill(NaN),r=new Float64Array(s).fill(NaN),a=new Uint8Array(s),l=new Float64Array(s).fill(NaN),h=new Float64Array(s).fill(NaN),{t:c,v:d}=e,p=e.lo??d,u=e.hi??d,m=c.length,f=(i-t)/s;let _=Ne(c,t),g=_>0?d[_-1]:NaN,v=_>0?p[_-1]:NaN,b=_>0?u[_-1]:NaN;for(let e=0;e<s;e++){const y=t+e*f,w=e===s-1?i:y+f;let $=y,x=0,k=0,S=1/0,A=-1/0,N=0,M=0,E=1/0,T=-1/0,F=0;const z=(t,i,s,o,n)=>{if(n<=y&&e>0)return;if(!Number.isFinite(t))return void(F+=Math.max(0,n-o));i<E&&(E=i),s>T&&(T=s);const r=n-o;r>0&&(x+=t*r,k+=r),t<S&&(S=t,N=o),t>A&&(A=t,M=o)};for(;_<m&&c[_]<w;)z(g,v,b,$,c[_]),g=d[_],v=p[_],b=u[_],$=Math.max(c[_],y),_++;z(g,v,b,$,w),S!==1/0&&2*F<w-y&&(o[e]=k>0?x/k:(S+A)/2,n[e]=S,r[e]=A,a[e]=N<=M?1:0,l[e]=Math.min(E,S),h[e]=Math.max(T,A))}return{start:t,end:i,mean:o,min:n,max:r,minFirst:a,bandLo:l,bandHi:h}}function De(e,t,i,s){const o=e.mean.length,n=[];let r=[];const a=o>1?i/(o-1):0;for(let l=0;l<o;l++){const h=o>1?l*a:i;if(Number.isNaN(e.mean[l]))r.length&&n.push(r),r=[];else if(2===t&&e.max[l]-e.min[l]>0){const t=a/4,o=e.minFirst[l]?e.min[l]:e.max[l],n=e.minFirst[l]?e.max[l]:e.min[l];r.push([Math.max(0,h-t),s(o)],[Math.min(i,h+t),s(n)])}else r.push([h,s(e.mean[l])])}return r.length&&n.push(r),n}const Le=e=>Math.round(10*e)/10;function Ve(e,t){if(!e.length)return"";if(1===e.length)return`M${Le(e[0][0])},${Le(e[0][1])}h0.01`;let i=`M${Le(e[0][0])},${Le(e[0][1])}`;if(!t||e.length<3){for(let t=1;t<e.length;t++)i+=`L${Le(e[t][0])},${Le(e[t][1])}`;return i}for(let t=1;t<e.length-1;t++){const[s,o]=e[t],n=(s+e[t+1][0])/2,r=(o+e[t+1][1])/2;i+=`Q${Le(s)},${Le(o)} ${Le(n)},${Le(r)}`}const s=e[e.length-1];return i+=`L${Le(s[0])},${Le(s[1])}`,i}function Ue(e,t,i){const s=e.mean.length;if(!s)return NaN;const o=Math.min(s-1,Math.max(0,Math.round(t/i*(s-1))));return e.mean[o]}function Pe(e){let t=1/0,i=-1/0;for(const s of e)for(let e=0;e<s.min.length;e++)s.min[e]<t&&(t=s.min[e]),s.max[e]>i&&(i=s.max[e]);return[t,i]}const Oe=[.25,.5,1,2,3,6,12,24,48,72,168,336,720,2160];function We(e,t){const i=[];for(let t=0;t<e.length;t++)Number.isFinite(e[t])&&i.push(e[t]);if(!i.length)return NaN;i.sort((e,t)=>e-t);const s=Math.min(1,Math.max(0,t))*(i.length-1),o=Math.floor(s);return o+1<i.length?i[o]+(i[o+1]-i[o])*(s-o):i[o]}const Re={"card.no_entities":"No entities configured","card.not_found":"Entity not available","card.all_hidden":"All entities hidden","card.loading":"Loading history…","card.no_data":"No data in this time range","card.min":"Minimum","card.max":"Maximum","card.avg":"Average","card.toggle_series":"Show/hide line","card.now":"now","card.since":"since","editor.section.daynight":"Day & night","editor.section.events":"Events","editor.events_help":"Pins on the time axis while an entity is in a certain state – e.g. window open, fireplace burning, heating on. Works with binary sensors, switches, input booleans and any entity with discrete states.","editor.add_event":"Add event","field.event_state":"State(s) to mark","field.event_lines":"Vertical lines into the graph","field.event_line":"Vertical line","field.day_night":"Show day and night","field.stars":"Stars","field.sun_times":"Sunrise / sunset","field.night_opacity":"Strength of the night","field.twilight_opacity":"Strength of morning / evening glow","field.day_opacity":"Strength of the day tint","field.stars_brightness":"Star brightness","field.stars_twinkle":"Twinkling stars","field.stars_density":"Star density","field.night_color":"Night colour","field.dawn_color":"Morning glow","field.dusk_color":"Evening glow","field.day_color":"Day tint","field.stars_color":"Star colour","editor.section.sky":"Sky colours","editor.section.compact":"Compact mode","field.compact_icon":"Show card icon","field.compact_names":"Show names","field.compact_graph":"Graph in the background","field.compact_animation":"Animate switching","field.compact_font_size":"Font size of the values","field.compact_name_size":"Font size of the name","field.text_color":"Text colour (names)","field.unavailable_text":"Text when unavailable","card.load_error":"History could not be loaded","field.font_size":"Font size of the value","field.raw_history":"Load all details","opt.tri_inherit":"Like the card","opt.tri_on":"On","opt.tri_off":"Off","field.x_axis":"Time labels","field.band":"Min/max band","field.peak_overflow":"Peaks may rise into the header","field.peak_percentile":"Normal graph area covers (% of values)","field.peak_margin":"Space above the highest peak","field.attribute":"Attribute (instead of the state)","editor.warn_attribute":"Attributes have no long-term statistics: the history incl. attributes is loaded for the whole time range, which puts more load on the system.","editor.section.advanced":"Advanced","editor.section.alert":"Alert","editor.alert_hint":"The whole card glows while a value reaches its alert threshold. Set thresholds per entity under “Alert”.","editor.custom_color":"Custom color","editor.theme_colors":"Theme colors","editor.line_color":"Line color","editor.preset":"Apply preset…","editor.jump":"Hard jump","editor.jump_help":"Color below / above this value","editor.below":"below","editor.above":"above","editor.drag":"Drag to reorder","editor.hidden_now":"currently hidden","editor.warn_no_statistics":"This sensor has no long-term statistics (no state_class). For time ranges above the statistics threshold, the raw history is loaded instead, which puts more load on the system.","editor.warn_min_max":"Minimum must be lower than maximum.","editor.warn_hide_range":"With these values the entity is always hidden.","editor.warn_hours":"Hours to show must be greater than 0.","preset.temperature":"Room temperature","preset.outdoor":"Outdoor temperature (jump at 0)","preset.heating":"Heating (jump at 95)","preset.humidity":"Humidity","preset.co2":"CO₂","preset.battery":"Battery","field.y_axis":"Y-axis labels","field.show_thresholds":"Lines at color jumps","field.show_extrema":"Show min / avg / max","field.legend_toggle":"Tap legend to hide lines","field.remember_compact":"Remember compact mode on this device","field.alert_above":"Alert at or above","field.alert_below":"Alert at or below","field.alert_style":"Alert effect","field.alert_color":"Alert color","editor.section.general":"General","editor.section.graph":"Graph","editor.section.data":"Data loading","editor.section.entities":"Entities","editor.section.interactions":"Interactions","editor.add_entity":"Add entity","editor.remove":"Remove","editor.move_up":"Move up","editor.move_down":"Move down","editor.color_scale":"Color scale","editor.color_scale_help":"Colors blend smoothly between the stops. Use the jump button on a stop to switch abruptly at that value (separate colors below / above).","editor.color_scale_help_step":"Each color applies from its value upwards; the first color also applies below.","editor.add_stop":"Add color stop","editor.visibility":"Visibility","field.name":"Name","field.icon":"Icon","field.graph":"Graph type","field.detail":"Detail","field.hours_to_show":"Hours to show","field.height":"Graph height","field.smoothing":"Smooth line","field.value_display":"Values in header","field.legend_icon":"Marker next to values","field.end_labels":"Labels at the end of the line","field.tooltip":"Tooltip on hover","field.compact":"Start in compact mode","field.statistics_threshold":"Use long-term statistics above (hours)","field.statistics_period":"Statistics resolution","field.limits_min":"Minimum (all scales)","field.limits_max":"Maximum (all scales)","field.theme":"Theme","field.tap_action":"Tap action","field.hold_action":"Hold action","field.double_tap_action":"Double tap action","field.entity":"Entity","field.unit":"Unit","field.decimals":"Decimals","field.color":"Line color (without color scale)","field.color_scale_mode":"Color scale mode","field.scale":"Scale group","field.min":"Minimum","field.max":"Maximum","field.fill":"Fill area","field.fill_gradient":"Fill coloring (with color scale)","field.line_width":"Line width","field.show_value":"Show value","field.show_graph":"Show in graph","field.hide_below":"Hide while below","field.hide_above":"Hide while above","field.hide_unavailable":"Hide while unavailable","field.value":"Value","opt.line":"Line","opt.none":"None","opt.detail_1":"Low (smooth average)","opt.detail_2":"High (keeps every peak)","opt.primary":"First entity only (like sensor card)","opt.all":"All entities","opt.dot":"Colored dot","opt.icon":"Icon","opt.value":"Current value","opt.icon_value":"Icon and value","opt.auto":"Automatic","opt.5minute":"5 minutes","opt.hour":"Hour","opt.day":"Day","opt.gradient":"Gradient","opt.step":"Steps","opt.fill_value":"By value (horizontal color bands)","opt.hover":"On hover","opt.glow":"Pulsing glow","opt.blink":"Blinking","opt.static":"Steady glow","opt.always":"Always","opt.fill_time":"Along time (vertical color bands)","helper.value_display":"Which values appear at the top: all entities, only the first one (big, like the sensor card) or none.","helper.legend_icon":"Marker in front of each name: colour dot or the entity icon.","helper.show_extrema":"Lowest, average and highest value of the shown time range, below each value.","helper.font_size":"Empty = automatic.","helper.unavailable_text":"Shown instead of e.g. “Unavailable”. Example: –","helper.detail":"Low: one averaged point per few pixels, smooth. High: minimum and maximum per pixel, so no short peak gets lost.","helper.band":"Shaded area between the lowest and highest value around each line.","helper.peak_overflow":"Single spikes may rise behind the values at the top. The scale then follows the bulk of the values instead of the highest spike, so the rest of the graph is not squashed.","helper.peak_percentile":"This share of the values counts as normal and fills the lower 60 % of the graph. Lower = more is treated as a peak.","helper.peak_margin":"Free space between the highest peak and the card's top edge.","helper.end_labels":"Shown at the right end of each line.","helper.fill_gradient":"How the area under the line is coloured with a colour scale.","helper.show_thresholds":"Dashed lines with labels where a colour scale jumps.","helper.legend_toggle":"Tap a name at the top to hide or show its line.","helper.hours_to_show":"Time range of the graph. Also e.g. 0.5 or 168.","helper.height":"Empty: the graph takes the free height of the card.","helper.limits_min":"Fixed lower end of all scales. Empty = automatic.","helper.limits_max":"Fixed upper end of all scales. Empty = automatic.","helper.statistics_threshold":"Above this time range, the pre-aggregated long-term statistics are loaded instead of every single value. This is much faster and puts less load on Home Assistant.","helper.statistics_period":"Resolution of the statistics. Automatic: 5 minutes up to 3 days, hours up to 60 days, then days.","helper.theme":"Theme for this card only.","helper.compact":"Starts as one slim row with only the values.","helper.compact_on_tap":"Tapping the card switches between compact and full view.","helper.remember_compact":"This device remembers the last view of the card.","helper.compact_graph":"Draws the graph faintly behind the row. Loads the history.","helper.day_night":"Shades night and twilight in the graph, calculated from your home location.","helper.sun_times":"Small sunrise / sunset marks with the time.","helper.raw_history":"Loads every single value for the whole time range instead of statistics. Every short peak is visible, but this puts more load on Home Assistant.","helper.attribute":"Shows an attribute instead of the state, e.g. the target temperature of a thermostat.","helper.scale":"Entities with the same name share a y-axis, e.g. “temp”. Empty = shared default axis.","helper.min":"Fixed lower end of this entity's scale.","helper.max":"Fixed upper end of this entity's scale.","helper.hide_below":"The entity is hidden completely (and not loaded) while the value is below.","helper.hide_above":"The entity is hidden completely (and not loaded) while the value is above.","helper.alert_above":"The whole card glows while the value is at or above.","helper.alert_below":"The whole card glows while the value is at or below.","helper.decimals":"Empty = the entity's display precision.","helper.show_value":"Show the value at the top.","helper.show_graph":"Draw a line for this entity.","helper.event_state":"Comma-separated, e.g. on, heat. Default: on","editor.section.display":"Values & labels","editor.section.scale":"Scale & peaks","field.event_color":"Colour","field.sky_top":"Night sky at the top","helper.sky_top":"Stars only in the upper part and the night strongest there, lighter towards the bottom. Keeps the area behind the lines calm.","field.stars_style":"Bright stars","helper.stars_style":"Look of the few bright stars; the many faint ones are always small dots.","opt.stars_dot":"Dots","opt.stars_glow":"Soft glow","opt.stars_sparkle":"Sparkle","editor.section.colors":"Colours","editor.section.entity_graph":"Graph","editor.section.entity_display":"Display","field.compact_on_tap":"Switch by tapping the card","editor.entities_help":"Drag to reorder. Open an entity for colours, colour scale, visibility and alert."},je={en:Re,de:{"card.no_entities":"Keine Entitäten konfiguriert","card.not_found":"Entität nicht verfügbar","card.all_hidden":"Alle Entitäten ausgeblendet","card.loading":"Verlauf wird geladen …","card.no_data":"Keine Daten in diesem Zeitraum","card.min":"Minimum","card.max":"Maximum","card.avg":"Durchschnitt","card.toggle_series":"Linie ein-/ausblenden","card.now":"jetzt","card.since":"seit","editor.section.daynight":"Tag & Nacht","editor.section.events":"Ereignisse","editor.events_help":"Pins am Zeitstrahl, solange eine Entität einen bestimmten Zustand hat – z. B. Fenster offen, Kamin brennt, Heizung an. Geht mit Binärsensoren, Schaltern, Input-Booleans und jeder Entität mit festen Zuständen.","editor.add_event":"Ereignis hinzufügen","field.event_state":"Markierte Zustände","field.event_lines":"Senkrechte Linien ins Diagramm","field.event_line":"Senkrechte Linie","field.day_night":"Tag und Nacht anzeigen","field.stars":"Sterne","field.sun_times":"Sonnenauf-/-untergang","field.night_opacity":"Stärke der Nacht","field.twilight_opacity":"Stärke von Morgen-/Abendrot","field.day_opacity":"Stärke der Tagesfarbe","field.stars_brightness":"Helligkeit der Sterne","field.stars_twinkle":"Funkelnde Sterne","field.stars_density":"Dichte der Sterne","field.night_color":"Nachtfarbe","field.dawn_color":"Morgenrot","field.dusk_color":"Abendrot","field.day_color":"Tagesfarbe","field.stars_color":"Sternfarbe","editor.section.sky":"Himmelsfarben","editor.section.compact":"Kompaktmodus","field.compact_icon":"Kartensymbol anzeigen","field.compact_names":"Namen anzeigen","field.compact_graph":"Verlauf im Hintergrund","field.compact_animation":"Umschalten animieren","field.compact_font_size":"Schriftgröße der Werte","field.compact_name_size":"Schriftgröße des Namens","field.text_color":"Textfarbe (Namen)","field.unavailable_text":"Text bei Nichtverfügbarkeit","card.load_error":"Verlauf konnte nicht geladen werden","field.font_size":"Schriftgröße des Werts","field.raw_history":"Alle Detaildaten laden","opt.tri_inherit":"Wie Karte","opt.tri_on":"An","opt.tri_off":"Aus","field.x_axis":"Zeitachse","field.band":"Min/Max-Band","field.peak_overflow":"Spitzen dürfen in den Kopf ragen","field.peak_percentile":"Normaler Diagrammbereich umfasst (% der Werte)","field.peak_margin":"Abstand über der höchsten Spitze","field.attribute":"Attribut (statt des Zustands)","editor.warn_attribute":"Attribute haben keine Langzeitstatistik: Für den ganzen Zeitraum wird die History inklusive Attribute geladen – das belastet das System stärker.","editor.section.advanced":"Erweitert","editor.section.alert":"Alarm","editor.alert_hint":"Die ganze Karte leuchtet, solange ein Wert seinen Alarm-Schwellwert erreicht. Schwellwerte legst du pro Entität unter „Alarm“ fest.","editor.custom_color":"Eigene Farbe","editor.theme_colors":"Design-Farben","editor.line_color":"Linienfarbe","editor.preset":"Vorlage anwenden …","editor.jump":"Harter Sprung","editor.jump_help":"Farbe unter / über diesem Wert","editor.below":"unter","editor.above":"über","editor.drag":"Zum Sortieren ziehen","editor.hidden_now":"gerade ausgeblendet","editor.warn_no_statistics":"Dieser Sensor hat keine Langzeitstatistik (keine state_class). Bei Zeiträumen über der Statistik-Schwelle wird stattdessen die Roh-History geladen – das belastet das System stärker.","editor.warn_min_max":"Das Minimum muss kleiner als das Maximum sein.","editor.warn_hide_range":"Mit diesen Werten ist die Entität immer ausgeblendet.","editor.warn_hours":"Die angezeigten Stunden müssen größer als 0 sein.","preset.temperature":"Raumtemperatur","preset.outdoor":"Außentemperatur (Sprung bei 0)","preset.heating":"Heizung (Sprung bei 95)","preset.humidity":"Luftfeuchte","preset.co2":"CO₂","preset.battery":"Akku","field.y_axis":"Y-Achsen-Beschriftung","field.show_thresholds":"Linien an Farbsprüngen","field.show_extrema":"Min / Ø / Max anzeigen","field.legend_toggle":"Legende antippen blendet Linien aus","field.remember_compact":"Kompaktmodus auf diesem Gerät merken","field.alert_above":"Alarm ab (größer/gleich)","field.alert_below":"Alarm bis (kleiner/gleich)","field.alert_style":"Alarm-Effekt","field.alert_color":"Alarmfarbe","editor.section.general":"Allgemein","editor.section.graph":"Diagramm","editor.section.data":"Datenabfrage","editor.section.entities":"Entitäten","editor.section.interactions":"Interaktionen","editor.add_entity":"Entität hinzufügen","editor.remove":"Entfernen","editor.move_up":"Nach oben","editor.move_down":"Nach unten","editor.color_scale":"Farbskala","editor.color_scale_help":"Zwischen den Stufen gehen die Farben fließend ineinander über. Mit dem Sprung-Knopf an einer Stufe wechselt die Farbe bei diesem Wert hart (getrennte Farben darunter / darüber).","editor.color_scale_help_step":"Jede Farbe gilt ab ihrem Wert aufwärts; die erste Farbe gilt auch darunter.","editor.add_stop":"Farbstufe hinzufügen","editor.visibility":"Sichtbarkeit","field.name":"Name","field.icon":"Symbol","field.graph":"Diagrammtyp","field.detail":"Detailgrad","field.hours_to_show":"Angezeigte Stunden","field.height":"Diagrammhöhe","field.smoothing":"Linie glätten","field.value_display":"Werte in der Kopfzeile","field.legend_icon":"Markierung neben den Werten","field.end_labels":"Beschriftung am Linienende","field.tooltip":"Tooltip beim Überfahren","field.compact":"Im Kompaktmodus starten","field.statistics_threshold":"Langzeitstatistik verwenden ab (Stunden)","field.statistics_period":"Auflösung der Statistik","field.limits_min":"Minimum (alle Skalen)","field.limits_max":"Maximum (alle Skalen)","field.theme":"Design","field.tap_action":"Aktion beim Tippen","field.hold_action":"Aktion beim Halten","field.double_tap_action":"Aktion bei Doppeltippen","field.entity":"Entität","field.unit":"Einheit","field.decimals":"Nachkommastellen","field.color":"Linienfarbe (ohne Farbskala)","field.color_scale_mode":"Art der Farbskala","field.scale":"Skalengruppe","field.min":"Minimum","field.max":"Maximum","field.fill":"Fläche füllen","field.fill_gradient":"Färbung der Füllung (mit Farbskala)","field.line_width":"Linienstärke","field.show_value":"Wert anzeigen","field.show_graph":"Im Diagramm anzeigen","field.hide_below":"Ausblenden, solange unter","field.hide_above":"Ausblenden, solange über","field.hide_unavailable":"Ausblenden, solange nicht verfügbar","field.value":"Wert","opt.line":"Linie","opt.none":"Keine","opt.detail_1":"Niedrig (geglätteter Mittelwert)","opt.detail_2":"Hoch (alle Spitzen bleiben erhalten)","opt.primary":"Nur erste Entität (wie Sensorkarte)","opt.all":"Alle Entitäten","opt.dot":"Farbiger Punkt","opt.icon":"Symbol","opt.value":"Aktueller Wert","opt.icon_value":"Symbol und Wert","opt.auto":"Automatisch","opt.5minute":"5 Minuten","opt.hour":"Stunde","opt.day":"Tag","opt.gradient":"Verlauf","opt.step":"Stufen","opt.fill_value":"Nach Wert (horizontale Farbbänder)","opt.hover":"Beim Überfahren","opt.glow":"Pulsierendes Leuchten","opt.blink":"Blinken","opt.static":"Dauerhaftes Leuchten","opt.always":"Immer","opt.fill_time":"Entlang der Zeit (vertikale Farbbänder)","helper.value_display":"Welche Werte oben stehen: alle Entitäten, nur die erste (groß, wie bei der Sensorkarte) oder keine.","helper.legend_icon":"Markierung vor jedem Namen: Farbpunkt oder das Symbol der Entität.","helper.show_extrema":"Niedrigster, durchschnittlicher und höchster Wert im angezeigten Zeitraum, unter jedem Wert.","helper.font_size":"Leer = automatisch.","helper.unavailable_text":"Wird statt z. B. „Nicht verfügbar“ angezeigt. Beispiel: –","helper.detail":"Niedrig: ein gemittelter Punkt alle paar Pixel, glatt. Hoch: Minimum und Maximum pro Pixel, so geht keine kurze Spitze verloren.","helper.band":"Schattierte Fläche zwischen niedrigstem und höchstem Wert um jede Linie.","helper.peak_overflow":"Einzelne Spitzen dürfen hinter die Werte oben ragen. Die Skala richtet sich dann nach den meisten Werten statt nach der höchsten Spitze, so wird der Rest des Diagramms nicht gestaucht.","helper.peak_percentile":"Dieser Anteil der Werte gilt als normal und füllt die unteren 60 % des Diagramms. Kleiner = mehr gilt als Spitze.","helper.peak_margin":"Freier Abstand zwischen der höchsten Spitze und dem oberen Kartenrand.","helper.end_labels":"Wird am rechten Ende jeder Linie angezeigt.","helper.fill_gradient":"Wie die Fläche unter der Linie mit einer Farbskala gefärbt wird.","helper.show_thresholds":"Gestrichelte Linien mit Beschriftung, wo eine Farbskala springt.","helper.legend_toggle":"Tippe oben auf einen Namen, um seine Linie aus- oder einzublenden.","helper.hours_to_show":"Zeitraum des Diagramms. Auch z. B. 0,5 oder 168.","helper.height":"Leer: Das Diagramm nimmt die freie Höhe der Karte ein.","helper.limits_min":"Festes unteres Ende aller Skalen. Leer = automatisch.","helper.limits_max":"Festes oberes Ende aller Skalen. Leer = automatisch.","helper.statistics_threshold":"Ab diesem Zeitraum werden die vorab zusammengefassten Langzeitstatistiken statt jedes einzelnen Werts geladen. Das ist viel schneller und belastet Home Assistant weniger.","helper.statistics_period":"Auflösung der Statistiken. Automatisch: 5 Minuten bis 3 Tage, Stunden bis 60 Tage, danach Tage.","helper.theme":"Design nur für diese Karte.","helper.compact":"Startet als eine schmale Zeile nur mit den Werten.","helper.compact_on_tap":"Tippen auf die Karte wechselt zwischen kompakter und voller Ansicht.","helper.remember_compact":"Dieses Gerät merkt sich die zuletzt gewählte Ansicht.","helper.compact_graph":"Zeichnet das Diagramm blass hinter die Zeile. Lädt dafür den Verlauf.","helper.day_night":"Schattiert Nacht und Dämmerung im Diagramm, berechnet aus deinem Heimstandort.","helper.sun_times":"Kleine Markierungen für Sonnenauf- und -untergang mit Uhrzeit.","helper.raw_history":"Lädt jeden einzelnen Wert für den ganzen Zeitraum statt Statistiken. Jede kurze Spitze ist sichtbar, belastet Home Assistant aber stärker.","helper.attribute":"Zeigt ein Attribut statt des Zustands, z. B. die Solltemperatur eines Thermostats.","helper.scale":"Entitäten mit demselben Namen teilen sich eine Y-Achse, z. B. „temp“. Leer = gemeinsame Standardachse.","helper.min":"Festes unteres Ende der Skala dieser Entität.","helper.max":"Festes oberes Ende der Skala dieser Entität.","helper.hide_below":"Die Entität wird ganz ausgeblendet (und nicht geladen), solange der Wert darunter liegt.","helper.hide_above":"Die Entität wird ganz ausgeblendet (und nicht geladen), solange der Wert darüber liegt.","helper.alert_above":"Die ganze Karte leuchtet, solange der Wert gleich oder darüber ist.","helper.alert_below":"Die ganze Karte leuchtet, solange der Wert gleich oder darunter ist.","helper.decimals":"Leer = Anzeigegenauigkeit der Entität.","helper.show_value":"Den Wert oben anzeigen.","helper.show_graph":"Für diese Entität eine Linie zeichnen.","helper.event_state":"Mit Komma getrennt, z. B. on, heat. Standard: on","editor.section.display":"Werte & Beschriftung","editor.section.scale":"Skala & Spitzen","field.event_color":"Farbe","field.sky_top":"Nachthimmel oben","helper.sky_top":"Sterne nur im oberen Teil, dort ist die Nacht am kräftigsten und wird nach unten heller. So bleibt der Bereich hinter den Linien ruhig.","field.stars_style":"Helle Sterne","helper.stars_style":"Aussehen der wenigen hellen Sterne; die vielen schwachen sind immer kleine Punkte.","opt.stars_dot":"Punkte","opt.stars_glow":"Weicher Schein","opt.stars_sparkle":"Funkeln","editor.section.colors":"Farben","editor.section.entity_graph":"Diagramm","editor.section.entity_display":"Anzeige","field.compact_on_tap":"Durch Tippen auf die Karte umschalten","editor.entities_help":"Zum Sortieren ziehen. Öffne eine Entität für Farben, Farbskala, Sichtbarkeit und Alarm."}};function Ie(e,t){const i=(e?.locale?.language??e?.language??"en").split("-")[0];return je[i]?.[t]??Re[t]??t}const Ge=new Map;function Be(e,t,i){if(!Number.isFinite(t))return"–";const s=function(e){const t=e?.locale?.language??e?.language??"en";switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de-DE";case"space_comma":return"fr-FR";case"system":return;default:return t}}(e),o="none"===e?.locale?.number_format,n=`${s}|${i}|${o}`;let r=Ge.get(n);return r||(r=new Intl.NumberFormat(s,{useGrouping:!o,...void 0!==i?{minimumFractionDigits:i,maximumFractionDigits:i}:{maximumFractionDigits:2}}),Ge.set(n,r)),r.format(t)}const Ke=new Map;function Ze(e,t,i){const s=e?.locale?.language??e?.language??"en",o=e?.locale?.time_format,n=`${s}|${o}|${i}`;let r=Ke.get(n);if(!r){const e="12"===o||"24"!==o&&void 0;r=new Intl.DateTimeFormat(s,{...i?{day:"2-digit",month:"2-digit"}:{},hour:"2-digit",minute:"2-digit",hour12:e}),Ke.set(n,r)}return r.format(t)}const Xe=[{id:"temperature",stops:[{value:0,color:"#2196f3"},{value:18,color:"#4caf50"},{value:24,color:"#ff9800"},{value:30,color:"#f44336"}]},{id:"outdoor",stops:[{value:0,color:"#2196f3"},{value:0,color:"#4caf50"},{value:25,color:"#ff9800"},{value:35,color:"#f44336"}]},{id:"heating",stops:[{value:20,color:"#2196f3"},{value:95,color:"#ff9800"},{value:95,color:"#8b0000"}]},{id:"humidity",mode:"step",stops:[{value:0,color:"#ff9800"},{value:40,color:"#4caf50"},{value:60,color:"#2196f3"},{value:70,color:"#3f51b5"}]},{id:"co2",stops:[{value:400,color:"#4caf50"},{value:800,color:"#4caf50"},{value:1200,color:"#ffc107"},{value:1600,color:"#ff9800"},{value:2e3,color:"#f44336"}]},{id:"battery",stops:[{value:15,color:"#f44336"},{value:15,color:"#ff9800"},{value:40,color:"#ffc107"},{value:60,color:"#4caf50"}]}];function qe(e,t="gradient"){if(!e?.length)return[];const i=[];if("step"===t)for(let t=1;t<e.length;t++)e[t].color!==e[t-1].color&&i.push(Number(e[t].value));else for(let t=0;t+1<e.length;t++)Number(e[t].value)===Number(e[t+1].value)&&e[t].color!==e[t+1].color&&i.push(Number(e[t].value));return[...new Set(i)]}const Ye=["#44739e","#984ea3","#00d2d5","#ff7f00","#af8d00","#7f80cd","#b3e900","#c42e60","#a65628","#f781bf","#8dd3c7","#bebada"];function Je(e){return e<=0?"var(--accent-color)":`var(--graph-color-${e+1}, ${Ye[(e-1)%Ye.length]})`}const Qe=Math.PI/180;function et(e,t,i){const s=e/864e5+2440587.5-2451545,o=(357.529+.98560028*s)*Qe,n=(280.459+.98564736*s+1.915*Math.sin(o)+.02*Math.sin(2*o))*Qe,r=(23.439-36e-8*s)*Qe,a=Math.atan2(Math.cos(r)*Math.sin(n),Math.cos(n)),l=Math.asin(Math.sin(r)*Math.sin(n)),h=(15*((18.697374558+24.06570982441908*s)%24)+i)*Qe-a,c=t*Qe;return Math.asin(Math.sin(c)*Math.sin(l)+Math.cos(c)*Math.cos(l)*Math.cos(h))/Qe}const tt=-.833,it=-12;function st(e){if(e>=tt)return 0;if(e<=it)return 1;const t=(tt-e)/11.167;return t*t*(3-2*t)}const ot=e=>{const t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)};function nt(e){const t=e<=-1?ot((e-it)/11):1-ot((e+1)/9);return{night:st(e),twilight:t,day:ot(e/8)}}const rt=e=>"number"==typeof e?e<1e11?1e3*e:e:Date.parse(String(e));class at{constructor(e,t,i,s){this.hass=e,this.entities=t,this.hours=i,this.onChange=s,this.data=new Map,this.disposed=!1,this.scheduled=!1,this.version=0;for(const e of t)this.data.set(e,{t:[],s:[]})}series(e){return this.data.get(e)??{t:[],s:[]}}start(){if(!this.entities.length)return;const e=Date.now()-36e5*this.hours;this.hass.connection.subscribeMessage(e=>this.onMessage(e),{type:"history/stream",entity_ids:this.entities,start_time:new Date(e).toISOString(),minimal_response:!0,no_attributes:!0,significant_changes_only:!0}).then(e=>{this.disposed?e().catch(()=>{}):this.unsub=e},e=>console.warn("best-number-card: event history failed",e)),this.timer=window.setInterval(()=>this.prune(),6e5)}onMessage(e){if(!e?.states)return;let t=!1;for(const[i,s]of Object.entries(e.states)){const e=this.data.get(i);if(e)for(const i of s){const s=rt(i.lu??i.lc);if(!Number.isFinite(s))continue;const o=e.t.length;o&&s<=e.t[o-1]||(o&&e.s[o-1]===i.s||(e.t.push(s),e.s.push(i.s),t=!0))}}t&&(this.version++,this.scheduled||(this.scheduled=!0,queueMicrotask(()=>{this.scheduled=!1,this.disposed||this.onChange()})))}prune(){const e=Date.now()-36e5*this.hours;for(const t of this.data.values()){let i=0;for(;i+1<t.t.length&&t.t[i+1]<=e;)i++;i>0&&(t.t.splice(0,i),t.s.splice(0,i))}}dispose(){this.disposed=!0,clearInterval(this.timer),this.unsub?.().catch(()=>{})}}const lt="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",ht="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",ct={number:{mode:"box",step:"any"}},dt=[["red","#f44336"],["pink","#e91e63"],["purple","#926bc7"],["deep-purple","#6e41ab"],["indigo","#3f51b5"],["blue","#2196f3"],["light-blue","#03a9f4"],["cyan","#00bcd4"],["teal","#009688"],["green","#4caf50"],["light-green","#8bc34a"],["lime","#cddc39"],["yellow","#ffeb3b"],["amber","#ffc107"],["orange","#ff9800"],["deep-orange","#ff6f22"],["brown","#795548"],["grey","#9e9e9e"],["blue-grey","#607d8b"],["black","#000000"]],pt=e=>null!=e&&""!==e;function ut(e,t,i="opt."){return{select:{mode:"dropdown",options:t.map(t=>({value:String(t),label:Ie(e,`${i}${t}`)}))}}}function mt(e){const t={};for(const[i,s]of Object.entries(e))null!=s&&""!==s&&(t[i]=s);return t}class ft extends le{constructor(){super(...arguments),this._expanded=-1,this._picker=null,this._resolve=e=>me(e,this),this._l=e=>Ie(this.hass,e),this._computeLabel=e=>this._l(`field.${e.name}`),this._computeHelper=e=>{const t=`helper.${e.name}`,i=this._l(t);return i===t?void 0:i}}setConfig(e){const t=(e.entities??[]).map(e=>"string"==typeof e?{entity:e}:e);this._config={...e,entities:t}}connectedCallback(){super.connectedCallback();const e=e=>customElements.get(e)?.getConfigElement?.();customElements.get("ha-form")||e("hui-button-card"),customElements.get("ha-entity-picker")||e("hui-entities-card")}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}get _hours(){return Number(this._config?.hours_to_show??24)}get _usesStatistics(){return this._hours>Number(this._config?.statistics_threshold??6)}_defaults(){const e=!!this.hass?.themes?.darkMode;return{graph:"line",detail:1,hours_to_show:24,smoothing:!0,tooltip:!0,compact:!1,remember_compact:!0,statistics_threshold:6,statistics_period:"auto",end_labels:"none",legend_icon:"dot",fill_gradient:"value",y_axis:"hover",x_axis:"hover",band:!1,peak_overflow:!1,peak_percentile:95,show_thresholds:!1,show_extrema:!1,legend_toggle:!0,compact_icon:!1,compact_names:!1,compact_graph:!1,compact_animation:!0,day_night:!1,stars:!0,sun_times:!0,sky_top:!0,stars_style:"glow",night_opacity:e?55:13,twilight_opacity:e?30:20,day_opacity:e?8:6,stars_brightness:80,stars_twinkle:50,stars_density:100,peak_margin:12,value_display:1===this._config.entities.length?"primary":"all"}}_sections(){const e=this.hass,t=this._config,i=this._cardData(),s="none"!==i.graph,o=t.entities.some(e=>e.color_scale?.length),n=t.entities.length>1,r="toggle-compact"===t.tap_action?.action,a=e=>({type:"grid",name:"",schema:e}),l=(e,t)=>({number:{mode:"box",min:e,max:t,step:1,unit_of_measurement:"px"}}),h=(e,t,i=1)=>({number:{mode:"slider",min:e,max:t,step:i,unit_of_measurement:"%"}});return{general:[a([{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]),{name:"value_display",selector:ut(e,["all","primary","none"])},..."all"===i.value_display||n?[{name:"legend_icon",selector:ut(e,["dot","icon","none"])}]:[],a([{name:"font_size",selector:l(8,96)},{name:"unavailable_text",selector:{text:{}}}]),...s?[{name:"show_extrema",selector:{boolean:{}}}]:[]],graph:[a([{name:"graph",selector:ut(e,["line","none"])},...s?[{name:"hours_to_show",selector:{number:{mode:"box",min:.1,step:"any",unit_of_measurement:"h"}}}]:[]]),...s?[{name:"detail",selector:ut(e,["1","2"],"opt.detail_")},a([{name:"y_axis",selector:ut(e,["hover","always","none"])},{name:"x_axis",selector:ut(e,["hover","always","none"])}]),{name:"end_labels",selector:ut(e,["none","value","icon","icon_value"])},a([{name:"smoothing",selector:{boolean:{}}},{name:"band",selector:{boolean:{}}},{name:"tooltip",selector:{boolean:{}}},...n?[{name:"legend_toggle",selector:{boolean:{}}}]:[]]),...o?[{name:"fill_gradient",selector:ut(e,["value","time"],"opt.fill_")},{name:"show_thresholds",selector:{boolean:{}}}]:[],{type:"expandable",flatten:!0,title:this._l("editor.section.scale"),expanded:!!t.peak_overflow||pt(t.limits?.min)||pt(t.limits?.max)||pt(t.height),schema:[{name:"peak_overflow",selector:{boolean:{}}},...t.peak_overflow?[{name:"peak_percentile",selector:h(80,100)},{name:"peak_margin",selector:l(0,200)}]:[],a([{name:"limits_min",selector:ct},{name:"limits_max",selector:ct}]),{name:"height",selector:{number:{mode:"box",min:20,step:1,unit_of_measurement:"px"}}}]}]:[]],daynight:[{name:"day_night",selector:{boolean:{}}},...t.day_night?[a([{name:"stars",selector:{boolean:{}}},{name:"sun_times",selector:{boolean:{}}}]),{name:"sky_top",selector:{boolean:{}}},...!1!==t.stars?[{name:"stars_style",selector:ut(e,["dot","glow","sparkle"],"opt.stars_")}]:[],{name:"night_opacity",selector:h(5,90)},{name:"twilight_opacity",selector:h(0,80)},...t.day_color?[{name:"day_opacity",selector:h(0,50)}]:[],...!1!==t.stars?[{name:"stars_brightness",selector:h(10,100)},{name:"stars_twinkle",selector:h(0,100)},{name:"stars_density",selector:h(10,300,5)}]:[]]:[]],compact:[{name:"compact",selector:{boolean:{}}},{name:"compact_on_tap",selector:{boolean:{}}},...t.compact||r?[...r?[{name:"compact_animation",selector:{boolean:{}}}]:[],{name:"remember_compact",selector:{boolean:{}}},a([{name:"compact_icon",selector:{boolean:{}}},{name:"compact_names",selector:{boolean:{}}}]),...s?[{name:"compact_graph",selector:{boolean:{}}}]:[],a([{name:"compact_font_size",selector:l(8,72)},{name:"compact_name_size",selector:l(8,72)}])]:[]],interactions:[...r?[]:[{name:"tap_action",selector:{ui_action:{}}}],{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}],advanced:[...s?[{name:"statistics_threshold",selector:{number:{mode:"box",min:0,step:"any",unit_of_measurement:"h"}}},...this._usesStatistics?[{name:"statistics_period",selector:ut(e,["auto","5minute","hour","day"])}]:[]]:[],{name:"theme",selector:{theme:{}}}]}}_section(e,t,i,s=B,o=!1){return j`<ha-expansion-panel outlined .header=${t} .expanded=${o} class="section">
      <ha-icon slot="leading-icon" .icon=${e}></ha-icon>
      <div class="section-body">
        ${i.length?j`<ha-form
              .hass=${this.hass}
              .data=${this._cardData()}
              .schema=${i}
              .computeLabel=${this._computeLabel}
              .computeHelper=${this._computeHelper}
              @value-changed=${this._cardChanged}
            ></ha-form>`:B}
        ${s}
      </div>
    </ha-expansion-panel>`}_cardData(){const e=this._config;return{...this._defaults(),...e,detail:String(e.detail??1),limits_min:e.limits?.min,limits_max:e.limits?.max,compact_on_tap:"toggle-compact"===e.tap_action?.action}}_cardChanged(e){e.stopPropagation();const{limits_min:t,limits_max:i,compact_on_tap:s,entities:o,...n}=e.detail.value,r={...n,entities:this._config.entities},a=mt({min:t,max:i});Object.keys(a).length?r.limits=a:delete r.limits,s?r.tap_action={action:"toggle-compact"}:"toggle-compact"===r.tap_action?.action&&delete r.tap_action,void 0!==r.detail&&(r.detail=Number(r.detail));for(const[e,t]of Object.entries(this._defaults()))r[e]!==t||e in this._config||delete r[e];this._emit(mt(r))}_cardWarnings(){const e=this._config,t=[];return!pt(e.hours_to_show)||Number(e.hours_to_show)>0||t.push(this._l("editor.warn_hours")),pt(e.limits?.min)&&pt(e.limits?.max)&&Number(e.limits.min)>=Number(e.limits.max)&&t.push(this._l("editor.warn_min_max")),t}_entitySchema(e){const t=this.hass,i=e=>({type:"grid",name:"",schema:e}),s=!!e.color_scale?.length,o="none"!==this._config.graph,n=o&&!1!==e.show_graph,r=ut(t,["inherit","on","off"],"opt.tri_");return[{name:"entity",selector:{entity:{}}},i([{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]),{type:"expandable",flatten:!0,title:this._l("editor.section.entity_display"),expanded:!1===e.show_value||pt(e.font_size)||pt(e.unit)||pt(e.decimals)||!!e.attribute,schema:[i([{name:"show_value",selector:{boolean:{}}},...o?[{name:"show_extrema",selector:r}]:[]]),i([{name:"font_size",selector:{number:{mode:"box",min:8,max:96,step:1,unit_of_measurement:"px"}}},{name:"decimals",selector:{number:{mode:"box",min:0,max:6,step:1}}},{name:"unit",selector:{text:{}}},{name:"unavailable_text",selector:{text:{}}}]),{name:"attribute",selector:{attribute:{entity_id:e.entity}}}]},...o?[{type:"expandable",flatten:!0,title:this._l("editor.section.entity_graph"),expanded:!1===e.show_graph||!!e.raw_history,schema:[{name:"show_graph",selector:{boolean:{}}},...n?[...e.attribute?[]:[{name:"raw_history",selector:{boolean:{}}}],i([{name:"band",selector:r},{name:"peak_overflow",selector:r},{name:"line_width",selector:{number:{mode:"box",min:.5,max:12,step:.5,unit_of_measurement:"px"}}},{name:"fill",selector:{boolean:{}}}]),...s&&!1!==e.fill?[{name:"fill_gradient",selector:ut(t,["value","time"],"opt.fill_")}]:[],{name:"scale",selector:{text:{}}},i([{name:"min",selector:ct},{name:"max",selector:ct}])]:[]]}]:[]]}_entityRulesSchema(e){const t=e=>({type:"grid",name:"",schema:e});return[{type:"expandable",flatten:!0,title:this._l("editor.visibility"),expanded:pt(e.hide_below)||pt(e.hide_above)||!!e.hide_unavailable,schema:[t([{name:"hide_below",selector:ct},{name:"hide_above",selector:ct}]),{name:"hide_unavailable",selector:{boolean:{}}}]},{type:"expandable",flatten:!0,title:this._l("editor.section.alert"),expanded:pt(e.alert_above)||pt(e.alert_below),schema:[t([{name:"alert_above",selector:ct},{name:"alert_below",selector:ct}])]}]}_entityWarnings(e){const t=[];pt(e.min)&&pt(e.max)&&Number(e.min)>=Number(e.max)&&t.push(this._l("editor.warn_min_max")),pt(e.hide_below)&&pt(e.hide_above)&&Number(e.hide_below)>=Number(e.hide_above)&&t.push(this._l("editor.warn_hide_range"));const i=this.hass?.states[e.entity],s=this._usesStatistics&&"none"!==this._config.graph&&!1!==e.show_graph;return i&&s&&e.attribute?t.push(this._l("editor.warn_attribute")):i&&s&&e.entity.startsWith("sensor.")&&!i.attributes.state_class&&t.push(this._l("editor.warn_no_statistics")),t}_updateEntity(e,t){const i=[...this._config.entities];null===t?i.splice(e,1):i[e]=mt(t),this._expanded>=i.length&&(this._expanded=-1),this._emit({...this._config,entities:i})}_move(e,t){const i=[...this._config.entities];if(t<0||t>=i.length||e===t)return;const s=this._expanded>=0?i[this._expanded]:void 0,[o]=i.splice(e,1);i.splice(t,0,o),this._expanded=s?i.indexOf(s):-1,this._emit({...this._config,entities:i})}_addEntity(e){e.stopPropagation();const t=e.detail.value?.entity;if(!t)return;const i=[...this._config.entities,{entity:t}];this._expanded=i.length-1,this._emit({...this._config,entities:i}),e.target.data={}}_dragStart(e,t){if(0!==e.button)return;e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId);const i=[...this.renderRoot.querySelectorAll(".entity-row")];this._drag={from:t,to:t,startY:e.clientY,dy:0,rects:i.map(e=>e.getBoundingClientRect())}}_dragMove(e){const t=this._drag;if(!t)return;const i=e.clientY-t.startY,s=t.rects[t.from],o=s.top+s.height/2+i,n=t.rects.filter((e,i)=>i!==t.from&&e.top+e.height/2<o).length;this._drag={...t,dy:i,to:n}}_dragEnd(){const e=this._drag;this._drag=void 0,e&&e.from!==e.to&&this._move(e.from,e.to)}_dragKey(e,t){let i;if("ArrowUp"===e.key)i=t-1;else{if("ArrowDown"!==e.key)return;i=t+1}e.preventDefault(),this._move(t,i),this.updateComplete.then(()=>{const e=this.renderRoot.querySelectorAll(".handle");e[Math.max(0,Math.min(e.length-1,i))]?.focus()})}_rowStyle(e){const t=this._drag;if(!t)return"";if(e===t.from)return`transform:translateY(${t.dy}px);z-index:2;position:relative;transition:none`;const i=t.rects[t.from].height+8;return t.from<t.to&&e>t.from&&e<=t.to?`transform:translateY(${-i}px)`:t.to<t.from&&e>=t.to&&e<t.from?`transform:translateY(${i}px)`:""}_setScale(e,t,i){const s={...this._config.entities[e]};t.length?s.color_scale=t:delete s.color_scale,null===i||"gradient"===i?delete s.color_scale_mode:i&&(s.color_scale_mode=i),this._updateEntity(e,s)}_applyPreset(e,t){const i=Xe.find(e=>e.id===t);i&&this._setScale(e,i.stops.map(e=>({...e})),i.mode??null)}_renderPreview(e,t,i=!1){const s=ge(e);if(!s.length)return B;const o=s[0].value,n=s[s.length-1].value,r=.12*(n-o)||5,a=o-r,l=n+r,h=`linear-gradient(to right, ${be(s,t,a,l,this._resolve).map(e=>`${e.color} ${(100*e.offset).toFixed(2)}%`).join(", ")})`;if(i)return j`<span class="mini-scale" style="background:${h}"></span>`;const c=[...new Set(s.map(e=>e.value))];return j`<div class="preview">
      <div class="preview-bar" style="background:${h}"></div>
      <div class="preview-ticks">
        ${c.map(e=>j`<span style="left:${((e-a)/(l-a)*100).toFixed(2)}%">${Be(this.hass,e)}</span>`)}
      </div>
    </div>`}_renderColorField(e,t,i,s,o=""){const n=this._picker===e,r=e=>{this._picker=null,i(e)};return j`<div class="cf ${n?"open":""}">
      <div class="cf-row">
        <button
          class="cf-swatch"
          type="button"
          style="background:${t||o||"transparent"}"
          aria-label=${s}
          aria-expanded=${n?"true":"false"}
          title=${s}
          @click=${()=>this._picker=n?null:e}
        ></button>
        <input
          class="text"
          type="text"
          aria-label=${s}
          placeholder=${o}
          .value=${t??""}
          @change=${e=>r(e.target.value.trim()||void 0)}
        />
      </div>
      ${n?j`<div class="cf-pop" @keydown=${e=>"Escape"===e.key&&(this._picker=null)}>
            <div class="cf-label">${this._l("editor.theme_colors")}</div>
            <div class="cf-grid">
              ${dt.map(([e,i])=>{const s=`var(--${e}-color, ${i})`;return j`<button
                  type="button"
                  class="cf-chip ${t===s?"sel":""}"
                  style="background:${s}"
                  title=${e}
                  aria-label=${e}
                  @click=${()=>r(s)}
                ></button>`})}
            </div>
            <label class="cf-custom">
              <input
                type="color"
                .value=${vt(t||o||"#ff0000",this)}
                @change=${e=>r(e.target.value)}
              />
              ${this._l("editor.custom_color")}
            </label>
          </div>`:B}
    </div>`}_renderStops(e,t){const i=t.color_scale??[],s=t.color_scale_mode??"gradient",o=function(e){const t=[];for(let i=0;i<e.length;i++){const s=e[i],o=e[i+1];o&&Number(o.value)===Number(s.value)?(t.push({value:Number(s.value),below:s.color,color:o.color}),i++):t.push({value:Number(s.value),color:s.color})}return t}(i),n=t=>this._setScale(e,function(e){return e.flatMap(e=>void 0!==e.below?[{value:e.value,color:e.below},{value:e.value,color:e.color}]:[{value:e.value,color:e.color}])}(t)),r=(e,t)=>n(o.map((i,s)=>s===e?{...i,...t}:i)),a=e=>{const t=o[e];if(void 0!==t.below){const{below:i,...s}=t;n(o.map((t,i)=>i===e?s:t))}else{const s=1e-9*Math.max(1,Math.abs(t.value)),o=_e(ve(ge(i),"gradient",t.value-s,this._resolve));r(e,{below:vt(o,this)})}};return j`<div class="stops">
      <div class="stops-head">
        <span class="stops-title">${this._l("editor.color_scale")}</span>
        ${i.length?j`<select
              class="native"
              aria-label=${this._l("field.color_scale_mode")}
              @change=${t=>this._setScale(e,i,t.target.value)}
            >
              <option value="gradient" ?selected=${"gradient"===s}>${this._l("opt.gradient")}</option>
              <option value="step" ?selected=${"step"===s}>${this._l("opt.step")}</option>
            </select>`:B}
        <select
          class="native"
          aria-label=${this._l("editor.preset")}
          @change=${t=>{const i=t.target;this._applyPreset(e,i.value),i.value=""}}
        >
          <option value="" selected>${this._l("editor.preset")}</option>
          ${Xe.map(e=>j`<option value=${e.id}>${this._l(`preset.${e.id}`)}</option>`)}
        </select>
      </div>
      ${this._renderPreview(i,s)}
      ${o.map((t,i)=>j`<div class="stop">
          <input
            class="num"
            type="number"
            step="any"
            aria-label=${this._l("field.value")}
            .value=${String(t.value)}
            @change=${e=>{const t=parseFloat(e.target.value);Number.isFinite(t)&&r(i,{value:t})}}
          />
          <div class="stop-colors">
            ${void 0!==t.below?j`${this._renderColorField(`s${e}-${i}-b`,t.below,e=>r(i,{below:e??t.below}),this._l("editor.below"))}
                  <span class="arrow">→</span>`:B}
            ${this._renderColorField(`s${e}-${i}`,t.color,e=>r(i,{color:e??t.color}),this._l("editor.above"))}
          </div>
          ${"gradient"===s?j`<ha-icon-button
                class="jump ${void 0!==t.below?"on":""}"
                .label=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                title=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                .path=${"M3,17H9V7H15V17H21V19H13V9H11V19H3V17Z"}
                @click=${()=>a(i)}
              ></ha-icon-button>`:B}
          <ha-icon-button
            .label=${this._l("editor.remove")}
            .path=${lt}
            @click=${()=>n(o.filter((e,t)=>t!==i))}
          ></ha-icon-button>
        </div>`)}
      <button
        class="text-button"
        @click=${()=>{const e=o[o.length-1];n([...o,{value:e?e.value+10:0,color:e?.color??"#ff0000"}])}}
      >
        + ${this._l("editor.add_stop")}
      </button>
      ${i.length?j`<div class="help">${this._l("step"===s?"editor.color_scale_help_step":"editor.color_scale_help")}</div>`:B}
    </div>`}_rawValue(e){const t=this.hass?.states[e.entity];if(!t)return;if(!e.attribute)return t.state;const i=t.attributes[e.attribute];return null==i?"":String(i)}_isHiddenNow(e){const t=this._rawValue(e),i=t?Number(t):NaN,s=Number.isFinite(i);return!(!e.hide_unavailable||s)||(!!(s&&pt(e.hide_below)&&i<Number(e.hide_below))||!!(s&&pt(e.hide_above)&&i>Number(e.hide_above)))}_renderEntity(e,t){const i=this.hass?.states[e.entity],s=(e.name||i?.attributes.friendly_name||e.entity)+(e.attribute&&!e.name?` · ${e.attribute}`:""),o=e.unit??(e.attribute?"":i?.attributes.unit_of_measurement??""),n=this._rawValue(e)??"",r=""!==n&&Number.isFinite(Number(n))?Be(this.hass,Number(n)):n,a=this._entityWarnings(e),l=this._isHiddenNow(e);return j`<div class="entity-row ${this._drag?.from===t?"dragging":""}" style=${this._rowStyle(t)}>
      <div
        class="handle"
        tabindex="0"
        role="button"
        aria-label=${this._l("editor.drag")}
        title=${this._l("editor.drag")}
        @pointerdown=${e=>this._dragStart(e,t)}
        @pointermove=${e=>this._dragMove(e)}
        @pointerup=${()=>this._dragEnd()}
        @pointercancel=${()=>this._dragEnd()}
        @keydown=${e=>this._dragKey(e,t)}
      >
        <svg viewBox="0 0 24 24"><path d=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></path></svg>
      </div>
      <ha-expansion-panel
        outlined
        .expanded=${this._expanded===t}
        @expanded-changed=${e=>{e.detail.expanded?this._expanded=t:this._expanded===t&&(this._expanded=-1)}}
      >
        <div slot="header" class="panel-header">
          <ha-state-icon .hass=${this.hass} .stateObj=${i} .icon=${e.icon}></ha-state-icon>
          <span class="panel-title">${s}</span>
          ${l?j`<span class="badge">${this._l("editor.hidden_now")}</span>`:B}
          ${a.length?j`<span class="badge warn-badge">⚠</span>`:B}
          <span class="panel-value">${r} ${o}</span>
          ${e.color_scale?.length?this._renderPreview(e.color_scale,e.color_scale_mode??"gradient",!0):j`<span class="swatch" style="background:${e.color??Je(t)}"></span>`}
        </div>
        <div class="panel-body">
          ${a.map(e=>j`<div class="warning">⚠ ${e}</div>`)}
          ${this._entityForm(e,t,this._entitySchema(e))}
          <div class="sub-title">${this._l("editor.section.colors")}</div>
          ${e.color_scale?.length?B:j`<div class="field-row">
                <span class="field-label">${this._l("editor.line_color")}</span>
                ${this._renderColorField(`l${t}`,e.color,i=>this._updateEntity(t,{...e,color:i}),this._l("editor.line_color"),Je(t))}
              </div>`}
          ${this._renderStops(t,e)}
          ${this._entityForm(e,t,this._entityRulesSchema(e))}
          <div class="panel-actions">
            <button class="text-button danger" @click=${()=>this._updateEntity(t,null)}>${this._l("editor.remove")}</button>
          </div>
        </div>
      </ha-expansion-panel>
    </div>`}_entityForm(e,t,i){return j`<ha-form
            .hass=${this.hass}
            .data=${{show_value:!0,show_graph:!0,...e,band:_t(e.band),show_extrema:_t(e.show_extrema),peak_overflow:_t(e.peak_overflow)}}
            .schema=${i}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${i=>{i.stopPropagation();const s={...i.detail.value,band:gt(i.detail.value.band),show_extrema:gt(i.detail.value.show_extrema),peak_overflow:gt(i.detail.value.peak_overflow)};!0===s.show_value&&void 0===e.show_value&&delete s.show_value,!0===s.show_graph&&void 0===e.show_graph&&delete s.show_graph,s.color_scale=e.color_scale,s.color_scale_mode=e.color_scale_mode,this._updateEntity(t,s)}}
          ></ha-form>`}_renderSkyColors(){const e=this._config,t=(t,i)=>j`<div class="field-row">
      <span class="field-label">${this._l(`field.${t}`)}</span>
      ${this._renderColorField(t,e[t],i=>this._emit(mt({...e,[t]:i})),this._l(`field.${t}`),i)}
    </div>`;return j`<div class="sub-title">${this._l("editor.section.sky")}</div>
      ${t("night_color",this.hass?.themes?.darkMode?"#03061a":"#2b3d80")} ${t("dawn_color","#ff8a3d")} ${t("dusk_color","#d9467a")}
      ${t("day_color","")}
      ${!1!==e.stars?t("stars_color",this.hass?.themes?.darkMode?"#ffffff":"#26367a"):B}`}_renderAlertSection(){const e=this._config,t=e.entities.some(e=>pt(e.alert_above)||pt(e.alert_below)),i=t=>this._emit(mt({...e,...t}));return j`<div class="help">${this._l("editor.alert_hint")}</div>
      ${t?j`<ha-form
              .hass=${this.hass}
              .data=${{alert_style:e.alert_style??"glow"}}
              .schema=${[{name:"alert_style",selector:ut(this.hass,["glow","blink","static"])}]}
              .computeLabel=${this._computeLabel}
              @value-changed=${e=>{e.stopPropagation();const t=e.detail.value.alert_style;i({alert_style:"glow"===t?void 0:t})}}
            ></ha-form>
            <div class="field-row">
              <span class="field-label">${this._l("field.alert_color")}</span>
              ${this._renderColorField("alert",e.alert_color,e=>i({alert_color:e}),this._l("field.alert_color"),"var(--error-color, #db4437)")}
            </div>`:B}`}render(){if(!this.hass||!this._config)return B;const e=this._config,t=this._cardWarnings(),i=this._sections(),s="none"!==e.graph,o=this._l;return j`
      ${t.map(e=>j`<div class="warning">⚠ ${e}</div>`)}
      <div class="section-title">${o("editor.section.entities")}</div>
      <div class="help">${o("editor.entities_help")}</div>
      <div class="entities ${this._drag?"is-dragging":""}">
        ${e.entities.map((e,t)=>this._renderEntity(e,t))}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${ht}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{name:"entity",selector:{entity:{}}}]}
          .computeLabel=${()=>o("editor.add_entity")}
          @value-changed=${this._addEntity}
        ></ha-form>
      </div>
      <div class="sections">
        ${this._section("mdi:card-text-outline",o("editor.section.general"),i.general,this._renderTextColor(),!0)}
        ${this._section("mdi:chart-line",o("editor.section.graph"),i.graph)}
        ${s?this._section("mdi:map-marker-outline",o("editor.section.events"),[],this._renderEvents()):B}
        ${s?this._section("mdi:weather-night",o("editor.section.daynight"),i.daynight,e.day_night?this._renderSkyColors():B):B}
        ${this._section("mdi:arrow-collapse-vertical",o("editor.section.compact"),i.compact)}
        ${this._section("mdi:alert-circle-outline",o("editor.section.alert"),[],this._renderAlertSection())}
        ${this._section("mdi:gesture-tap",o("editor.section.interactions"),i.interactions)}
        ${this._section("mdi:cog-outline",o("editor.section.advanced"),i.advanced)}
      </div>
    `}_renderTextColor(){return j`<div class="field-row">
      <span class="field-label">${this._l("field.text_color")}</span>
      ${this._renderColorField("text-color",this._config.text_color??this._config.compact_text_color,e=>{const{compact_text_color:t,...i}=this._config;this._emit(mt({...i,text_color:e}))},this._l("field.text_color"),"var(--secondary-text-color)")}
    </div>`}_setEvents(e){const t={...this._config,events:e};e.length||delete t.events,this._emit(t)}_renderEvents(){const e=this._config.events??[],t=(t,i)=>{const s=[...e];null===i?s.splice(t,1):s[t]=mt({...s[t],...i}),this._setEvents(s)};return j`<div class="help">${this._l("editor.events_help")}</div>
      ${e.length?j`<ha-form
            .hass=${this.hass}
            .data=${{event_lines:!1!==this._config.event_lines}}
            .schema=${[{name:"event_lines",selector:{boolean:{}}}]}
            .computeLabel=${this._computeLabel}
            @value-changed=${e=>{e.stopPropagation();const t={...this._config,event_lines:e.detail.value.event_lines};!1!==t.event_lines&&delete t.event_lines,this._emit(t)}}
          ></ha-form>`:B}
      <div class="events">
        ${e.map((e,i)=>j`<div class="event-row">
            <ha-form
              .hass=${this.hass}
              .data=${{...e,state:Array.isArray(e.state)?e.state.join(", "):e.state,event_line:_t(e.line)}}
              .schema=${[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"event_state",selector:{text:{}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"event_line",selector:ut(this.hass,["inherit","on","off"],"opt.tri_")}]}]}
              .computeLabel=${e=>"event_state"===e.name?this._l("field.event_state"):"event_line"===e.name?this._l("field.event_line"):this._computeLabel(e)}
              .computeHelper=${e=>this._computeHelper(e)}
              @value-changed=${e=>{e.stopPropagation();const s=e.detail.value,o=s.event_state??s.state,n="string"==typeof o?o.split(",").map(e=>e.trim()).filter(Boolean):o;t(i,{entity:s.entity,name:s.name,icon:s.icon,line:gt(s.event_line),state:n&&n.length?1===n.length?n[0]:n:void 0})}}
            ></ha-form>
            <div class="field-row">
              <span class="field-label">${this._l("field.event_color")}</span>
              ${this._renderColorField(`ev${i}`,e.color,e=>t(i,{color:e}),this._l("field.event_color"))}
              <ha-icon-button .label=${this._l("editor.remove")} .path=${lt} @click=${()=>t(i,null)}></ha-icon-button>
            </div>
          </div>`)}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${ht}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{name:"entity",selector:{entity:{}}}]}
          .computeLabel=${()=>this._l("editor.add_event")}
          @value-changed=${t=>{t.stopPropagation();const i=t.detail.value?.entity;i&&(this._setEvents([...e,{entity:i}]),t.target.data={})}}
        ></ha-form>
      </div>`}}ft.properties={hass:{attribute:!1},_config:{state:!0},_expanded:{state:!0},_drag:{state:!0},_picker:{state:!0}},ft.styles=n`
    :host {
      display: block;
    }
    .sections {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 24px;
    }
    .section ha-icon[slot="leading-icon"] {
      color: var(--secondary-text-color);
    }
    .section-body {
      padding: 0 0 8px;
    }
    .sub-title {
      margin: 16px 0 4px;
      font-weight: 500;
      font-size: 14px;
      color: var(--secondary-text-color);
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
    .events {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .event-row {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 12px;
      padding: 8px 12px;
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
  `;const _t=e=>void 0===e?"inherit":e?"on":"off",gt=e=>"on"===e||"off"!==e&&void 0;function vt(e,t){if(/^#[0-9a-f]{6}$/i.test(e))return e;const[i,s,o]=me(e,t),n=e=>Math.round(e).toString(16).padStart(2,"0");return`#${n(i)}${n(s)}${n(o)}`}customElements.get("best-number-card-editor")||customElements.define("best-number-card-editor",ft);const bt=ce,yt=24,wt="line",$t=6,xt=!0,kt="none",St="dot",At="hover",Nt="hover",Mt=95,Et=12,Tt=["#f2a53a","#5fb0ff","#5fd17a","#c084fc","#f87171","#2dd4bf"];let Ft=0;const zt=e=>null!=e&&""!==e;function Ht(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}class Ct extends le{constructor(){super(...arguments),this._compact=!1,this._width=0,this._graphH=0,this._room=0,this._hoverX=null,this._tick=0,this._off=new Set,this._uid="bnc"+ ++Ft,this._cfgVersion=0,this._dsKey="",this._fastUntil=0,this._tickDue=0,this._lastTick=0,this._held=!1,this._suppressClick=!1,this._evKey="",this._animating=!1,this._storageKey="",this._colorCache=new Map,this._resolve=e=>{let t=this._colorCache.get(e);return t||(t=me(e,this),this._colorCache.set(e,t)),t},this._themeVars=[],this._onVisibility=()=>{"visible"===document.visibilityState&&this._ds&&this._scheduleTick()},this._onPointerDown=e=>{this._held=!1,this._down={x:e.clientX,y:e.clientY},this._config?.hold_action&&"none"!==this._config.hold_action.action&&(clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._held=!0,this._doAction("hold",e)},500))},this._onPointerUp=()=>clearTimeout(this._holdTimer),this._onKeyDown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._doAction("tap",e))},this._onClick=e=>{if(clearTimeout(this._holdTimer),this._suppressClick)return void(this._suppressClick=!1);if(this._held)return void(this._held=!1);if(this._down&&Math.hypot(e.clientX-this._down.x,e.clientY-this._down.y)>10)return;const t=this._fromEvent(e,"toggle");if(t&&!1!==this._config?.legend_toggle)return void this._toggleSeries(t);const i=this._config?.double_tap_action;if(i&&"none"!==i.action)return this._clickTimer?(clearTimeout(this._clickTimer),this._clickTimer=void 0,void this._doAction("double_tap",e)):void(this._clickTimer=window.setTimeout(()=>{this._clickTimer=void 0,this._doAction("tap",e)},250));this._doAction("tap",e)},this._onGraphDown=e=>{"mouse"!==e.pointerType&&(this._scrub={x:e.clientX,y:e.clientY,active:!1})},this._onMove=e=>{if(!1===this._config?.tooltip)return;if("mouse"===e.pointerType)return void this._setHoverFromEvent(e);const t=this._scrub;if(t){if(!t.active){const i=Math.abs(e.clientX-t.x),s=Math.abs(e.clientY-t.y);if(i<8||i<s)return;t.active=!0,clearTimeout(this._holdTimer),clearTimeout(this._hideTimer)}this._setHoverFromEvent(e)}},this._onGraphUp=e=>{"mouse"!==e.pointerType&&(this._scrub?.active&&(this._suppressClick=!0,setTimeout(()=>this._suppressClick=!1,400),clearTimeout(this._hideTimer),this._hideTimer=window.setTimeout(()=>this._hoverX=null,2e3)),this._scrub=void 0)},this._onLeave=e=>{"mouse"===e.pointerType&&(this._hoverX=null)}}static getConfigElement(){return document.createElement("best-number-card-editor")}static getStubConfig(e){return{entities:Object.keys(e.states).filter(t=>Vt(e,t)).slice(0,2).map(e=>({entity:e}))}}setConfig(e){if(!e)throw new Error("Invalid configuration");const t=(Array.isArray(e.entities)?e.entities:e.entity?[e.entity]:[]).map(e=>"string"==typeof e?{entity:e}:{...e}).filter(e=>e&&"string"==typeof e.entity);if(!t.length)throw new Error("Please define at least one entity");for(const e of t)e.color_scale&&(e.color_scale=ge(e.color_scale));const i=this._config;if(this._cfgVersion++,this._config={...e,entities:t},this._storageKey=`best-number-card:compact:${Ht(JSON.stringify([e.name,t.map(e=>e.entity)]))}`,(!i||i.compact!==e.compact)&&(this._compact=!!e.compact,!1!==e.remember_compact)){const t=function(e){try{const t=window.localStorage?.getItem(e);return t?JSON.parse(t):void 0}catch{return}}(this._storageKey);t&&t.d===!!e.compact&&(this._compact=!!t.v)}}getCardSize(){return this._compact?1:3}getGridOptions(){return{columns:6,min_columns:3,min_rows:1}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibility),this._syncDataSource()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibility),this._disposeDataSource(),this._ro?.disconnect(),this._ro=void 0,this._graphEl=void 0,clearTimeout(this._hideTimer),clearTimeout(this._holdTimer),clearTimeout(this._clickTimer),this._clickTimer=void 0}shouldUpdate(e){if(!this._config)return!1;if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass");return!t||!this.hass||(t.themes!==this.hass.themes||t.locale!==this.hass.locale||t.language!==this.hass.language||this._config.entities.some(e=>t.states[e.entity]!==this.hass.states[e.entity]))}willUpdate(e){(e.has("hass")||e.has("_config")||e.has("_compact"))&&(this._syncDataSource(),this._syncEvents());const t=e.get("hass");(e.has("_config")||!t||t.themes!==this.hass?.themes)&&(this._applyTheme(),this._colorCache.clear(),this._model=void 0)}updated(e){this._updateAlert(),(e.has("_config")||e.has("_compact"))&&this._measureRoom();const t=this.renderRoot.querySelector(".graph");t!==this._graphEl&&(this._ro?.disconnect(),this._graphEl=t??void 0,t&&(this._ro??=new ResizeObserver(e=>{const t=Math.round(e[0].contentRect.width),i=Math.round(e[0].contentRect.height);t&&t!==this._width&&(this._width=t),i&&i!==this._graphH&&!this._animating&&(this._graphH=i),this._measureRoom()}),this._ro.observe(t)))}_measureRoom(){const e=this._graphEl,t=this.renderRoot.querySelector("ha-card"),i=!!this._config?.peak_overflow||!!this._config?.entities.some(e=>e.peak_overflow);if(!i||!e||!t||e.classList.contains("bg"))return void(this._room&&(this._room=0));const s=Math.max(0,Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top));Math.abs(s-this._room)>1&&(this._room=s)}_visible(){return this._config.entities.filter(e=>!this._isHidden(e))}_isHidden(e){const t=this._current(e),i=Number.isFinite(t);return!(!e.hide_unavailable||i)||(!!(i&&zt(e.hide_below)&&t<Number(e.hide_below))||!!(i&&zt(e.hide_above)&&t>Number(e.hide_above)))}get _hours(){const e=Number(this._config?.hours_to_show??yt);return e>0?e:yt}_graphEntities(){return this._visible().filter(e=>!1!==e.show_graph)}_syncDataSource(){const e=this._config;if(!e||!this.hass||!this.isConnected)return;const t=!(this._compact&&!e.compact_graph||"none"===(e.graph??wt)),i=t?[...new Set(this._graphEntities().map(e=>this._sid(e)))]:[],s=Number(e.statistics_threshold??$t),o=t?this._graphEntities().filter(e=>e.raw_history).map(e=>this._sid(e)):[],n=i.length?JSON.stringify([i,o,this._hours,s,e.statistics_period??"auto"]):"";if(n===this._dsKey)return void this._ds?.setHass(this.hass);if(this._disposeDataSource(),this._dsKey=n,!n)return;this._ds=new He(this.hass,{entities:i,hoursToShow:this._hours,statisticsThreshold:s,statisticsPeriod:e.statistics_period,detail:o,onChange:()=>this._scheduleTick()}),this._fastUntil=Date.now()+5e3,this._ds.start().catch(e=>console.warn("best-number-card:",e));const r=36e5*this._hours/Math.max(this._width||400,100);this._ticker=window.setInterval(()=>this._scheduleTick(),Math.min(Math.max(2*r,5e3),3e5))}_eventConfigs(){return(this._config?.events??[]).filter(e=>e&&"string"==typeof e.entity&&e.entity)}_syncEvents(){const e=this._config;if(!e||!this.hass||!this.isConnected)return;const t=!this._compact&&"none"!==(e.graph??wt)?[...new Set(this._eventConfigs().map(e=>e.entity))]:[],i=t.length?JSON.stringify([t,this._hours]):"";i!==this._evKey&&(this._ev?.dispose(),this._ev=void 0,this._evKey=i,i&&(this._ev=new at(this.hass,t,this._hours,()=>this._scheduleTick()),this._ev.start(),this._fastUntil=Date.now()+5e3))}_disposeDataSource(){this._ev?.dispose(),this._ev=void 0,this._evKey="",this._ds?.dispose(),this._ds=void 0,this._dsKey="",clearInterval(this._ticker),clearTimeout(this._tickTimer),this._tickTimer=void 0}_scheduleTick(){if("hidden"===document.visibilityState)return;const e=Date.now(),t=36e5*this._hours/Math.max(this._width||400,100),i=e<this._fastUntil?100:Math.min(Math.max(t,1e3),3e4),s=Math.max(e,this._lastTick+i);if(void 0!==this._tickTimer){if(s>=this._tickDue)return;clearTimeout(this._tickTimer)}this._tickDue=s,this._tickTimer=window.setTimeout(()=>{this._tickTimer=void 0,this._lastTick=Date.now(),this._tick++},s-e)}_state(e){return this.hass?.states[e.entity]}_sid(e){return t=e.entity,(i=e.attribute)?`${t}::${i}`:t;var t,i}_raw(e){const t=this._state(e);if(!t)return;if(!e.attribute)return t.state;const i=t.attributes[e.attribute];return null==i?"":String(i)}_name(e){if(e.name)return e.name;const t=this._state(e),i=t?.attributes.friendly_name??e.entity;if(!e.attribute)return i;return`${i} · ${(t?this.hass?.formatEntityAttributeName?.(t,e.attribute):void 0)??e.attribute}`}_unit(e){return void 0!==e.unit?e.unit:e.attribute?/temp/i.test(e.attribute)?this.hass?.config?.unit_system?.temperature??"":"":this._state(e)?.attributes.unit_of_measurement??""}_decimals(e,t){if(zt(e.decimals))return Number(e.decimals);const i=e.attribute?void 0:this.hass?.entities?.[e.entity]?.display_precision;if("number"==typeof i)return i;if(void 0!==t){const e=/\.(\d+)$/.exec(t);return e?Math.min(e[1].length,4):0}}_formatState(e){const t=this._state(e),i=e.unavailable_text??this._config?.unavailable_text;if(!t)return i??Ie(this.hass,"card.not_found");const s=this._raw(e)??"",o=Number(s);return""!==s&&Number.isFinite(o)?Be(this.hass,o,this._decimals(e,s)):void 0!==i?i:e.attribute?s||"–":this.hass?.formatEntityState?.(t)??t.state}_valueUnit(e){return Number.isFinite(this._current(e))?this._unit(e):""}_formatValue(e,t){const i=this._decimals(e,this._raw(e));return Be(this.hass,t,void 0===i?1:i)}_baseColor(e){return e.color?e.color:Je(this._config.entities.indexOf(e))}_colorFor(e,t){return e.color_scale?.length&&Number.isFinite(t)?_e(ve(e.color_scale,e.color_scale_mode??"gradient",t,this._resolve)):this._baseColor(e)}_current(e){const t=this._raw(e);return void 0!==t&&""!==t?Number(t):NaN}_applyTheme(){for(const e of this._themeVars)this.style.removeProperty(e);this._themeVars=[];const e=this.hass?.themes,t=this._config?.theme?e?.themes?.[this._config.theme]:void 0;if(!t)return;const i=t.modes?.[e?.darkMode?"dark":"light"]??{};for(const[e,s]of Object.entries({...t,...i})){if("string"!=typeof s)continue;const t=`--${e}`;this.style.setProperty(t,s),this._themeVars.push(t)}}_alertActive(){return this._config.entities.some(e=>{const t=this._current(e);return!!Number.isFinite(t)&&(zt(e.alert_above)&&t>=Number(e.alert_above)||zt(e.alert_below)&&t<=Number(e.alert_below))})}_updateAlert(){const e=!!this._config&&this._alertActive();this.toggleAttribute("alert",e),e&&(this.setAttribute("alert-style",this._config.alert_style??"glow"),this._config.alert_color?this.style.setProperty("--bnc-alert-color",this._config.alert_color):this.style.removeProperty("--bnc-alert-color"))}_bandOn(e){return e.band??this._config?.band??!1}_setCompact(e){const t=this.renderRoot.querySelector("ha-card"),i=!1!==this._config?.compact_animation&&!!t&&"function"==typeof t.animate&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,s=i?t.getBoundingClientRect().height:0;this._compact=e,this._hoverX=null,!1!==this._config?.remember_compact&&function(e,t){try{window.localStorage?.setItem(e,JSON.stringify(t))}catch{}}(this._storageKey,{v:e,d:!!this._config?.compact}),i&&this.updateComplete.then(()=>this._animateHeight(t,s))}async _animateHeight(e,t){const i=e.getBoundingClientRect().height,s=this.renderRoot.querySelector(".graph"),o=s?Math.round(s.getBoundingClientRect().height):0;if(o&&o!==this._graphH&&(this._graphH=o,await this.updateComplete),Math.abs(i-t)<2)return;this._animating=!0;const n=e.animate([{height:`${t}px`},{height:`${i}px`}],{duration:280,easing:"cubic-bezier(0.2, 0, 0, 1)"}),r=()=>{this._animating=!1;const e=this.renderRoot.querySelector(".graph"),t=e?Math.round(e.getBoundingClientRect().height):0;t&&t!==this._graphH&&(this._graphH=t),this._measureRoom()};n.onfinish=r,n.oncancel=r}_toggleSeries(e){const t=new Set(this._off);t.has(e)?t.delete(e):t.add(e),this._off=t}_baseGraphHeight(){const e=Number(this._config?.height);return e>0?e:Math.round(Math.min(Math.max((this._width||400)/5,56),140))}_graphHeight(){return Number(this._config?.height)>0?Number(this._config.height):this._graphH>0?this._graphH:this._baseGraphHeight()}_labelMargin(e){const t=this._config?.end_labels??kt;if("none"===t||this._compact)return 0;let i=0;for(const s of e){let e=8;if("icon"!==t&&"icon_value"!==t||(e+=20),"value"===t||"icon_value"===t){e+=7*`${this._formatState(s)} ${this._valueUnit(s)}`.length+4}i=Math.max(i,e)}return i}_buildModel(){const e=this._config;if(!this._ds||!this._width)return;const t=this._graphEntities(),i=this._graphHeight(),s=Math.max(20,this._width-this._labelMargin(t.filter(e=>!this._off.has(this._sid(e))))),o=2===Number(e.detail)?2:1,n=JSON.stringify([this._tick,this._cfgVersion,this._dsKey,this._width,i,this._room,s,o,[...this._off],this._ds.loaded,this._compact,this._ev?.version??-1]);if(this._model?.key===n)return this._model;const r=Date.now(),a=r-36e5*this._hours,l=Math.max(2,Math.round(s/(2===o?2:8))),h=t.filter(e=>!this._off.has(this._sid(e))),c=h.length>1,d=e=>e.raw_history?Math.max(2,Math.round(s/2)):l,p=e=>e.raw_history?2:o,u=t.map(e=>({e:e,b:Ce(this._ds.series(this._sid(e))??{t:[],v:[]},a,r,d(e))})),m=new Map,f=this._compact?0:this._room;for(const{e:t,b:i}of u){const s=t.scale||"default",o=m.get(s)??{lo:1/0,hi:-1/0,peaks:[]},n=this._off.has(this._sid(t));if(!n||!m.has(s)){const[s,r]=this._bandOn(t)?Dt(i):Pe([i]);if(!n&&(o.lo=Math.min(o.lo,s),o.hi=Math.max(o.hi,r),o.first??=t,f>0&&(t.peak_overflow??e.peak_overflow)))for(let e=0;e<i.mean.length;e++)o.peaks.push(i.mean[e])}m.set(s,o)}for(const[i,s]of m){const o=t.filter(e=>(e.scale||"default")===i),n=o.map(e=>e.min).filter(zt).map(Number),r=o.map(e=>e.max).filter(zt).map(Number),a=n.length?Math.min(...n):e.limits?.min,l=r.length?Math.max(...r):e.limits?.max;if(zt(a)&&(s.lo=Number(a)),zt(l))s.hi=Number(l);else if(s.peaks.length&&Number.isFinite(s.lo)){const t=Math.min(100,Math.max(50,Number(e.peak_percentile)||Mt))/100,i=s.lo+(We(s.peaks,t)-s.lo)/.6;i>s.lo&&s.hi-i>.1*(s.hi-s.lo)&&(s.peak=s.hi,s.hi=i)}Number.isFinite(s.lo)&&Number.isFinite(s.hi)||(s.lo=0,s.hi=1),s.hi<=s.lo&&(s.hi=s.lo+1,s.lo-=1)}const _=e=>(e-a)/(r-a)*s,g=[];this._ev&&!this._compact&&this._eventConfigs().forEach((e,t)=>{const i=void 0===e.state?["on"]:Array.isArray(e.state)?e.state.map(String):[String(e.state)];for(const o of function(e,t,i,s){const o=new Set(t.map(e=>e.toLowerCase())),n=[];let r=null;for(let t=0;t<e.t.length;t++){const i=o.has(String(e.s[t]).toLowerCase());i&&null===r?r=e.t[t]:i||null===r||(n.push({from:r,to:e.t[t],open:!1}),r=null)}return null!==r&&n.push({from:r,to:s,open:!0}),n.filter(e=>e.to>i&&e.from<s)}(this._ev.series(e.entity),i,a,r))g.push({cfg:e,...o,x1:Math.max(0,_(o.from)),x2:Math.min(s,_(o.to)),color:e.color||Tt[t%Tt.length],pin:o.from>=a,lane:t})});let v=!1,b=!1;const y=u.map(({e:t,b:o},n)=>{const{lo:r,hi:a}=m.get(t.scale||"default"),l=Number(t.line_width)>0?Number(t.line_width):c?3:4,h=this._compact?8:2,d=l/2+h,u=i-l/2-h-(g.length?24:0),_=m.get(t.scale||"default").peak,y=Math.max(0,zt(e.peak_margin)?Number(e.peak_margin)||0:Et),w=function(e,t,i,s,o){const n=(s-i)/(t-e),r=(e,t,i)=>Object.assign(e,{topValue:t,maxValue:i});if(!(o&&o.max>t&&o.room>0))return r(i=>s-(Math.min(Math.max(i,e),t)-e)*n,t,t);const a=i-o.room;if(n*(o.max-t)<=o.room){const t=(s-a)/(o.max-e);return r(i=>s-(Math.min(Math.max(i,e),o.max)-e)*t,e+(s-i)/t,o.max)}const l=o.room/(o.max-t);return r(r=>{const a=Math.min(Math.max(r,e),o.max);return a<=t?s-(a-e)*n:i-(a-t)*l},t,o.max)}(r,a,d,u,void 0!==_?{max:_,room:Math.max(0,f+d-y)}:void 0);void 0!==_&&(b=!0);let $=0,x=0;for(const e of o.mean)Number.isFinite(e)&&($+=e,x++);const[k,S]=Dt(o);x&&(v=!0);const A={cfg:t,index:n,buckets:o,segs:De(o,p(t),s,w),lo:r,hi:a,y:w,color:this._baseColor(t),lineWidth:l,fill:t.fill??!c,off:this._off.has(this._sid(t)),ext:{min:k,max:S,avg:x?$/x:NaN},band:this._bandOn(t),smooth:(e.smoothing??xt)&&1===p(t)};if(t.color_scale?.length){A.gradId=`${this._uid}-g${n}`;const i=t.color_scale_mode??"gradient",s=w.maxValue,l=w(r),h=l-w(s);A.grad=be(t.color_scale,i,r,s,this._resolve,s>a&&h>0?{offset:e=>(l-w(e))/h,breaks:[a]}:void 0),A.fill&&"time"===(t.fill_gradient??e.fill_gradient)&&(A.fillGradId=`${this._uid}-f${n}`,A.fillGrad=function(e,t,i,s){const o=i.length,n=i=>_e(ve(e,t,i,s)),r=[];let a=NaN,l=0;for(let s=0;s<o;s++){const h=i[s];if(!Number.isFinite(h))continue;const c=o>1?s/(o-1):0;if(Number.isFinite(a)&&ye(e,t,a,h)){const e=(l+c)/2;r.push({offset:e,color:n(a)},{offset:e,color:n(h)})}r.push({offset:c,color:n(h)}),a=h,l=c}if(!r.length){const e=n(NaN);return[{offset:0,color:e},{offset:1,color:e}]}return r.filter((e,t)=>0===t||t===r.length-1||e.color!==r[t-1].color||e.color!==r[t+1].color)}(t.color_scale,i,o.mean,this._resolve))}return A}),w=[];for(const e of m.values()){if(!e.first)continue;const t=y.find(t=>t.cfg===e.first)?.y.topValue??e.hi;w.push({lo:e.lo,hi:t,entity:e.first,colored:Lt(m)>1})}const $=[];if(e.show_thresholds&&!this._compact){const e=new Set;for(const t of y)if(!t.off)for(const i of qe(t.cfg.color_scale,t.cfg.color_scale_mode)){if(i<=t.lo||i>=t.y.maxValue||t.y(i)<0)continue;const s=Math.round(t.y(i));e.has(s)||(e.add(s),$.push({y:s,value:i,entity:t.cfg,color:this._colorFor(t.cfg,i)}))}}const x=this._compact?[]:function(e,t){const i=Math.max(1,Math.floor(t/90)),s=Oe.find(t=>t>=e/i)??e,o=[];for(let i=1;i*s<e-1e-9;i++){const n=t*(1-i*s/e);n>=70&&o.push({x:Math.round(n),hours:i*s})}return o.reverse(),o.push({x:t,hours:0}),o}(this._hours,s);return this._model={key:n,width:this._width,plotW:s,height:i,start:a,end:r,series:y,axes:w,thresholds:$,hasData:v,ticks:x,events:g,room:b?f:0},this._model}_fromEvent(e,t){for(const i of e.composedPath()){const e=i?.dataset?.[t];if(e)return e}}_doAction(e,t){const i=this._config,s=i[`${e}_action`]??("tap"===e?{action:"more-info"}:void 0);if(!s||!this.hass)return;if("toggle-compact"===s.action)return void this._setCompact(!this._compact);let o=this._visible()[0]?.entity??i.entities[0].entity;"more-info"!==s.action||s.entity||(o=this._fromEvent(t,"entity")??o),function(e,t,i,s){if(!i||"none"===i.action)return!0;const o=i;if(o.confirmation){const e="object"==typeof o.confirmation&&o.confirmation.text?o.confirmation.text:"Are you sure?";if(!window.confirm(e))return!0}switch(i.action){case"more-info":{const t=o.entity??s;return t&&de(e,"hass-more-info",{entityId:t}),!0}case"toggle":return s&&t.callService("homeassistant","toggle",{entity_id:s}),!0;case"navigate":return o.navigation_path&&(history.pushState(null,"",o.navigation_path),de(window,"location-changed",{replace:!1})),!0;case"url":return o.url_path&&window.open(o.url_path,!1===o.new_tab?"_self":"_blank"),!0;case"perform-action":case"call-service":{const e=o.perform_action??o.service;if(!e)return!0;const[i,s]=e.split(".",2);return t.callService(i,s,o.data??o.service_data,o.target),!0}case"fire-dom-event":return de(e,"ll-custom",o),!0;default:;}}(this,this.hass,s,o)}_setHoverFromEvent(e){if(!this._model)return;const t=e.currentTarget.getBoundingClientRect(),i=e.clientX-t.left;this._hoverX=i>=0&&i<=this._model.plotW?i:null}render(){const e=this._config;if(!e||!this.hass)return B;const t=this._visible(),i="none"!==(e.graph??wt),s=!this._compact&&i,o=this._compact&&i&&!!e.compact_graph,n=s||o?this._buildModel():void 0,r=e.text_color??e.compact_text_color;return j`
      <ha-card
        class=${this._compact?"compact":s&&n?.room?"peaks":""}
        style=${r?`--bnc-cnc:${r}`:""}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
        tabindex="0"
        role="button"
        aria-label=${e.name??this._name(t[0]??e.entities[0])}
      >
        ${n&&t.length&&e.day_night?this._renderDayNight(n):B}
        ${o&&t.length?j`<div class="graph bg" aria-hidden="true">${n?this._renderSvg(n,!this._ds?.loaded):B}</div>`:B}
        ${this._compact?this._renderCompact(t):this._renderHeader(t,n)}
        ${s&&t.length?this._renderGraph(n):B}
      </ha-card>
    `}_renderIcon(e,t){const i=e?this._state(e):void 0;return j`<ha-state-icon .hass=${this.hass} .stateObj=${i} .icon=${t??e?.icon}></ha-state-icon>`}_renderMarker(e){const t=this._config.legend_icon??St;if("none"===t)return B;const i=this._colorFor(e,this._current(e));return"icon"===t?j`<span class="marker icon" style="color:${i}">${this._renderIcon(e)}</span>`:j`<span class="marker dot" style="background:${i}"></span>`}_sizeStyle(e){const t=Number(e?.font_size??this._config.font_size);return t>0?`--bnc-fs:${t}px`:""}_valueStyle(e){return e.color_scale?.length?`color:${this._colorFor(e,this._current(e))}`:""}_renderExtrema(e,t){if(!(e.show_extrema??this._config.show_extrema)||!t)return B;const i=t.series.find(t=>t.cfg===e);if(!i||!Number.isFinite(i.ext.min))return B;const s=e=>Ie(this.hass,e);return j`<div class="extrema">
      <span title=${s("card.min")}>↓ ${this._formatValue(e,i.ext.min)}</span>
      <span title=${s("card.avg")}>Ø ${this._formatValue(e,i.ext.avg)}</span>
      <span title=${s("card.max")}>↑ ${this._formatValue(e,i.ext.max)}</span>
    </div>`}_renderHeader(e,t){const i=this._config,s=1===i.entities.length,o=e[0]??i.entities[0],n=i.value_display??(s?"primary":"all"),r=i.name??(s||"primary"===n?this._name(o):void 0),a=i.icon??(s||"primary"===n?void 0:null),l=void 0===r&&null!==a&&"all"===n,h=(void 0!==r||null!==a)&&!l,c=h?j`<div class="header ${"all"!==n||s?"":"tight"}">
          <div class="name">${r??""}</div>
          ${null!==a?j`<div class="icon">${this._renderIcon(o,a)}</div>`:B}
        </div>`:B;if(!e.length)return j`${c}<div class="info empty">${Ie(this.hass,"card.all_hidden")}</div>`;if("none"===n)return j`${c}`;if("primary"===n)return j`${c}
        <div class="info fade" data-entity=${o.entity} style=${this._sizeStyle(o)}>
          <span class="value" style=${this._valueStyle(o)}>${this._formatState(o)}</span>
          <span class="measurement">${this._valueUnit(o)}</span>
          ${this._renderExtrema(o,t)}
        </div>`;const d=e.filter(e=>!1!==e.show_value),p=d.length>1,u=p&&!1!==i.legend_toggle&&"none"!==i.graph;return j`${c}
      <div class="values fade ${p?"multi":""} ${h?"":"noheader"}">
        ${d.map(e=>{const i=this._off.has(this._sid(e));return j`<div class="item ${i?"off":""}" data-entity=${e.entity} style=${this._sizeStyle(e)}>
            ${p?j`<div
                  class="item-name ${u?"toggle":""}"
                  data-toggle=${u?this._sid(e):""}
                  title=${u?Ie(this.hass,"card.toggle_series"):""}
                >
                  ${this._renderMarker(e)}<span>${this._name(e)}</span>
                </div>`:B}
            <div class="item-value">
              <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
              <span class="measurement">${this._valueUnit(e)}</span>
            </div>
            ${this._renderExtrema(e,t)}
          </div>`})}
        ${l?j`<div class="icon corner-icon">${this._renderIcon(o,a??void 0)}</div>`:B}
      </div>`}_renderCompact(e){const t=this._config,i=e.filter(e=>!1!==e.show_value),s=e[0]??t.entities[0],o=[Number(t.compact_font_size??t.font_size)>0?`--bnc-cfs:${Number(t.compact_font_size??t.font_size)}px`:"",Number(t.compact_name_size)>0?`--bnc-cns:${Number(t.compact_name_size)}px`:""].filter(Boolean).join(";"),n=t.compact_graph&&"none"!==t.graph;return j`<div class="compact-row fade ${n?"over-graph":""} ${n&&t.day_night?"soft-halo":""}" style=${o}>
      ${t.compact_icon?j`<span class="icon compact-icon">${this._renderIcon(s,t.icon)}</span>`:B}
      ${t.name?j`<span class="compact-name">${t.name}</span>`:B}
      <div class="compact-values">
        ${i.length?i.map(e=>j`<span
                class="compact-item"
                data-entity=${e.entity}
                title=${this._name(e)}
                style=${Number(e.font_size)>0?`--bnc-cfs:${Number(e.font_size)}px`:""}
              >
                ${i.length>1||"icon"===t.legend_icon?this._renderMarker(e):B}
                <span class="compact-text">
                  ${t.compact_names?j`<span class="compact-label">${this._name(e)}</span>`:B}
                  <span class="vm">
                    <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
                    <span class="measurement">${this._valueUnit(e)}</span>
                  </span>
                </span>
              </span>`):j`<span class="empty">${Ie(this.hass,"card.all_hidden")}</span>`}
      </div>
    </div>`}_renderGraph(e){const t=this._graphHeight(),i=!this._ds?.loaded,s=this._config.y_axis??At,o=this._config.x_axis??Nt;return j`<div
      class="graph fade ${null!==this._hoverX?"active":""} ${"always"===o?"xa-always":""}"
      style=${Number(this._config.height)>0?`height:${t}px;flex:none`:`flex:1 1 ${this._baseGraphHeight()}px;min-height:${Math.min(40,this._baseGraphHeight())}px`}
      @pointerdown=${this._onGraphDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onGraphUp}
      @pointercancel=${this._onGraphUp}
      @pointerleave=${this._onLeave}
    >
      ${e?j`${this._renderSvg(e,i)} ${this._renderEndLabels(e)}
          ${i?j`<span class="sr-only" role="status">${Ie(this.hass,"card.loading")}</span>`:B}
          ${e.hasData||i?B:j`<div class="nodata">
                ${this._ds?.errors().length?j`${Ie(this.hass,"card.load_error")}<small>${this._ds.errors().join(" · ")}</small>`:Ie(this.hass,"card.no_data")}
              </div>`}
          ${"none"!==s&&e.hasData?this._renderAxes(e,s):B}
          ${"none"!==o&&e.hasData?this._renderTimeAxis(e,o):B}
          ${e.hasData?this._renderSunTimes(e):B} ${this._renderEventPins(e)}
          ${this._renderTooltip(e)}`:B}
    </div>`}_renderAxes(e,t){const i=(e,t)=>`${this._formatValue(e,t)} ${this._unit(e)}`.trim();return j`<div class="axes ${"hover"===t?"hover":""}" style=${e.events.length?"bottom:24px":""}>
      ${e.axes.map(e=>{const t=t=>e.colored?`color:${this._colorFor(e.entity,t)}`:"";return j`<div class="axis">
          <span style=${t(e.hi)}>${i(e.entity,e.hi)}</span><span style=${t(e.lo)}>${i(e.entity,e.lo)}</span>
        </div>`})}
    </div>`}_isDark(){return!!this.hass?.themes?.darkMode}_renderDayNight(e){const t=Number(this.hass?.config?.latitude),i=Number(this.hass?.config?.longitude);if(!Number.isFinite(t)||!Number.isFinite(i))return B;const s=this._config,o=this._isDark(),n=!1!==s.stars,r=JSON.stringify([e.key,o,t,i,n,s.night_color,s.night_opacity,s.dawn_color,s.dusk_color,s.day_color,s.twilight_opacity,s.day_opacity,s.stars_brightness,s.stars_twinkle,s.stars_density,s.stars_color,s.stars_style,s.sky_top]);if(this._dnCache?.key===r)return this._dnCache.tpl;const a=(e,t)=>zt(e)&&Number.isFinite(Number(e))?Math.max(0,Number(e))/100:t,l=s.night_color||(o?"#03061a":"#2b3d80"),h=a(s.night_opacity,o?.55:.13),c=s.dawn_color||"#ff8a3d",d=s.dusk_color||"#d9467a",p=a(s.twilight_opacity,o?.3:.2),u=s.day_color||"",m=a(s.day_opacity,o?.08:.06),f=Math.max(2,Math.round(e.plotW/4)),_=[];for(let s=0;s<=f;s++){const o=e.start+s/f*(e.end-e.start),n=et(o,t,i),r=nt(n);_.push({o:s/f,n:r.night,tw:r.twilight,d:r.day,rising:et(o+6e5,t,i)>n})}const g=(e,t)=>e.filter((i,s)=>0===s||s===e.length-1||!t(i,e[s-1])||!t(i,e[s+1])),v=`${this._uid}-dn`,b=(t,i)=>{const s=g(i,(e,t)=>e[1]===t[1]&&e[2]===t[2]);return s.some(([,,e])=>e>.001)?{def:I`<linearGradient id=${`${v}-${t}`} gradientUnits="userSpaceOnUse" x1="0" x2=${e.plotW} y1="0" y2="0">
          ${s.map(([e,t,i])=>I`<stop offset=${e} stop-color=${t} stop-opacity=${i.toFixed(3)}></stop>`)}</linearGradient>`,rect:I`<rect width=${e.width} height="100%" fill=${`url(#${v}-${t})`}></rect>`}:{def:B,rect:B}},y=b("n",_.map(e=>[e.o,l,e.n*h])),w=b("t",_.map(e=>[e.o,e.rising?c:d,e.tw*p])),$=u?b("d",_.map(e=>[e.o,u,e.d*m])):{def:B,rect:B};if(y.rect===B&&w.rect===B&&$.rect===B)return this._dnCache={key:r,tpl:j``},this._dnCache.tpl;const x=!1!==s.sky_top,k=x?I`<linearGradient id=${`${v}-v`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0.5"></stop>
          </linearGradient>
          <mask id=${`${v}-vm`}><rect width=${e.width} height="100%" fill=${`url(#${v}-v)`}></rect></mask>
          <linearGradient id=${`${v}-sv`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0.2" stop-color="#fff"></stop><stop offset="0.72" stop-color="#fff" stop-opacity="0"></stop>
          </linearGradient>
          <mask id=${`${v}-svm`}><rect width=${e.width} height="100%" fill=${`url(#${v}-sv)`}></rect></mask>`:B,S=x&&y.rect!==B?I`<g mask=${`url(#${v}-vm)`}>${y.rect}</g>`:y.rect;let A=B,N=B;const M=a(s.stars_brightness,.8),E=a(s.stars_twinkle,.5),T=a(s.stars_density,1),F=s.stars_style??"glow";if(n&&y.rect!==B&&M>0&&T>0){const t=function(e){let t=e>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e6/1e6)}(parseInt(Ht(this._uid+e.width),36)),i=Math.round(e.width*(x?.24:.28)*T),n=s.stars_color?[s.stars_color]:o?["#ffffff","#ffffff","#ffffff","#d6e4ff","#fff0d4"]:["#26367a","#26367a","#3b4f9e","#45376f"],r=[],a=[];for(let s=0;s<i;s++){const i=Math.pow(t(),3.2),s=t()*e.width,l=x?.72*Math.pow(t(),1.5):Math.pow(t(),1.4),h=x?1:1-.6*l,c=(o?.35:.5)+1.7*i,d=Math.min(1,(.3+.7*i)*M*h*(o?1:.9)),p=n[Math.floor(t()*n.length)],u=t()<E*(.3+i),m=3+4*t(),f=u?`animation-duration:${m.toFixed(1)}s;animation-delay:${(-t()*m).toFixed(1)}s`:"",_=`${(100*l).toFixed(2)}%`;if("dot"!==F&&i>.5&&a.push(I`<circle cx=${s.toFixed(1)} cy=${_} r=${(4.5*c).toFixed(1)} fill=${`url(#${v}-glow)`} opacity=${(.7*d).toFixed(2)}></circle>`),"sparkle"===F&&i>.62){const e=3.2*c,t=`M${-e},0Q0,0 0,${-e}Q0,0 ${e},0Q0,0 0,${e}Q0,0 ${-e},0Z`;r.push(I`<svg x=${s.toFixed(1)} y=${_} overflow="visible"><path class=${u?"star tw":"star"} d=${t} fill=${p} fill-opacity=${d.toFixed(2)} style=${f}></path></svg>`);continue}r.push(I`<circle class=${u?"star tw":"star"} cx=${s.toFixed(1)} cy=${_} r=${c.toFixed(2)} fill=${p} fill-opacity=${d.toFixed(2)} style=${f}></circle>`)}const l=g(_.map(e=>[e.o,e.n]),(e,t)=>e[1]===t[1]);N=I`<linearGradient id=${`${v}-w`} gradientUnits="userSpaceOnUse" x1="0" x2=${e.plotW} y1="0" y2="0">
          ${l.map(([e,t])=>I`<stop offset=${e} stop-color="#fff" stop-opacity=${t.toFixed(3)}></stop>`)}</linearGradient>
        <mask id=${`${v}-m`}><rect width=${e.width} height="100%" fill=${`url(#${v}-w)`}></rect></mask>
        <radialGradient id=${`${v}-glow`}>
          <stop offset="0" stop-color=${n[0]} stop-opacity="0.8"></stop>
          <stop offset="0.3" stop-color=${n[0]} stop-opacity="0.25"></stop>
          <stop offset="1" stop-color=${n[0]} stop-opacity="0"></stop>
        </radialGradient>`;const h=I`${a}${r}`;A=I`<g mask=${`url(#${v}-m)`}>${x?I`<g mask=${`url(#${v}-svm)`}>${h}</g>`:h}</g>`}const z=j`<div class="daynight" aria-hidden="true">
      <svg width=${e.width} height="100%">
        <defs>${$.def} ${w.def} ${y.def} ${k} ${N}</defs>
        ${$.rect} ${w.rect} ${S} ${A}
      </svg>
    </div>`;return this._dnCache={key:r,tpl:z},z}_renderSunTimes(e){const t=this._config;if(!t.day_night||!1===t.sun_times)return B;const i=Number(this.hass?.config?.latitude),s=Number(this.hass?.config?.longitude);if(!Number.isFinite(i)||!Number.isFinite(s))return B;const o=t=>(t-e.start)/(e.end-e.start)*e.plotW;return j`${function(e,t,i,s){const o=6e5,n=[];let r=e,a=et(r,i,s)-tt;for(let l=e+o;l<=t+o;l+=o){const e=Math.min(l,t),o=et(e,i,s)-tt;if(a<0!=o<0){let t=r,l=e,h=a;for(let e=0;e<6;e++){const e=(t+l)/2,o=et(e,i,s)-tt;h<0==o<0?(t=e,h=o):l=e}n.push({t:Math.round((t+l)/2),type:o>0?"rise":"set"})}if(r=e,a=o,e>=t)break}return n}(e.start,e.end,i,s).filter(t=>o(t.t)>18&&o(t.t)<e.plotW-18).map(e=>j`<div class="sun-mark ${e.type}" style="left:${o(e.t)}px">
          <ha-icon .icon=${"rise"===e.type?"mdi:weather-sunset-up":"mdi:weather-sunset-down"}></ha-icon>
          <span>${Ze(this.hass,e.t,!1)}</span>
        </div>`)}`}_eventName(e){return e.name??this.hass?.states[e.entity]?.attributes.friendly_name??e.entity}_eventTimeText(e){const t=this._hours>24,i=Ze(this.hass,e.from,t);return e.open?`${Ie(this.hass,"card.since")} ${i}`:`${i}–${Ze(this.hass,e.to,!1)}`}_renderEventShapes(e){if(!e.events.length)return B;const t=e.height-12,i=Math.min(4,Math.max(...e.events.map(e=>e.lane))+1),s=i>2?3:4,o=t-(i*s+2*(i-1))/2;return I`${e.events.map(e=>{const n=o+e.lane%i*(s+2);return I`
        ${e.pin&&!1!==(e.cfg.line??this._config.event_lines)?I`<line class="ev-guide" x1=${e.x1} x2=${e.x1} y1="0" y2=${t-10} style="stroke:${e.color}"></line>`:B}
        ${e.x2-e.x1>1?I`<rect class="ev-bar" x=${e.x1} y=${n} width=${e.x2-e.x1} height=${s} rx=${s/2} style="fill:${e.color}"></rect>`:B}`})}`}_renderEventPins(e){if(!e.events.length)return B;let t=-1/0;const i=e.events.filter(e=>e.pin).sort((e,t)=>e.x1-t.x1).filter(e=>!(e.x1-t<22)&&(t=e.x1,!0));return j`${i.map(e=>{const t=this.hass?.states[e.cfg.entity];return j`<div
        class="ev-pin"
        data-entity=${e.cfg.entity}
        title=${`${this._eventName(e.cfg)} · ${this._eventTimeText(e)}`}
        style="left:${e.x1}px;bottom:${12}px;--c:${e.color}"
      >
        <ha-state-icon .hass=${this.hass} .stateObj=${t} .icon=${e.cfg.icon}></ha-state-icon>
      </div>`})}`}_renderTimeAxis(e,t){const i=e=>Ie(this.hass,e);return j`<div class="xaxis ${"hover"===t?"hover":""}" style=${e.events.length?"bottom:25px":""}>
      ${e.ticks.map(e=>j`<span class=${0===e.hours?"now":""} style="left:${e.x}px">${(e=>0===e?i("card.now"):e<1?`−${Math.round(60*e)} min`:e<48?`−${+e.toFixed(1)} h`:`−${+(e/24).toFixed(1)} d`)(e.hours)}</span>`)}
    </div>`}_renderSvg(e,t=!1){const i=this._hoverX,s=e.series.filter(e=>!e.off),o=t=>e.height-t.lineWidth/2-2,n=t=>e.hasData?t.segs.map(e=>Ve(e,t.smooth)):[`M0,${o(t)}L${e.plotW},${o(t)}`],r=Math.max(60,.35*e.plotW);return j`<svg width=${e.width} height=${e.height} viewBox="0 0 ${e.width} ${e.height}">
      <defs>
        ${t?I`<linearGradient id=${`${this._uid}-glow`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0"></stop>
                <stop offset="0.5" stop-color="#fff" stop-opacity="0.9"></stop>
                <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <mask id=${`${this._uid}-glowmask`}>
                ${s.map(e=>n(e).map(t=>I`<path d=${t} fill="none" stroke="#fff" stroke-width=${e.lineWidth+3} stroke-linecap="round"></path>`))}
              </mask>`:B}
        ${s.map(e=>e.gradId?I`<linearGradient id=${e.gradId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${e.y(e.lo)} y2=${e.y(e.y.maxValue)}>
                ${e.grad.map(e=>I`<stop offset=${e.offset} stop-color=${e.color}></stop>`)}
              </linearGradient>`:B)}
        ${s.map(t=>t.fillGradId?I`<linearGradient id=${t.fillGradId} gradientUnits="userSpaceOnUse" x1="0" x2=${e.plotW} y1="0" y2="0">
                ${t.fillGrad.map(e=>I`<stop offset=${e.offset} stop-color=${e.color}></stop>`)}
              </linearGradient>`:B)}
        ${e.room?I`<linearGradient id=${`${this._uid}-pkg`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${-e.room} y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0.6"></stop>
                <stop offset="1" stop-color="#fff" stop-opacity="1"></stop>
              </linearGradient>
              <mask id=${`${this._uid}-pk`} maskUnits="userSpaceOnUse" x="0" y=${-e.room} width=${e.width} height=${e.height+e.room}>
                <rect x="0" y=${-e.room} width=${e.width} height=${e.height+e.room} fill=${`url(#${this._uid}-pkg)`}></rect>
              </mask>`:B}
      </defs>
      ${e.thresholds.map(t=>I`<line class="threshold" x1="0" x2=${e.plotW} y1=${t.y} y2=${t.y} style="stroke:${t.color}"></line>`)}
      ${e.ticks.map(t=>0===t.hours?B:I`<line class="tick" x1=${t.x} x2=${t.x} y1="0" y2=${e.height}></line>`)}
      ${this._renderEventShapes(e)}
      <g mask=${e.room?`url(#${this._uid}-pk)`:B}>
      ${s.map(t=>{const i=t.gradId?`url(#${t.gradId})`:t.color,s=t.fillGradId?`url(#${t.fillGradId})`:i;return I`<g>
          ${t.band?I`<path class="band" d=${function(e,t,i){const s=e.mean.length,o=s>1?t/(s-1):0;let n="",r=[];const a=()=>{if(r.length>1){const t=r.map(t=>`${Le(t*o)},${Le(i(e.bandHi[t]))}`),s=r.map(t=>`${Le(t*o)},${Le(i(e.bandLo[t]))}`).reverse();n+=`M${t.join("L")}L${s.join("L")}Z`}r=[]};for(let t=0;t<s;t++)Number.isFinite(e.bandLo[t])&&Number.isFinite(e.bandHi[t])?r.push(t):a();return a(),n}(t.buckets,e.plotW,t.y)} style="fill:${i}"></path>`:B}
          ${t.fill?t.segs.map(i=>I`<path class="fill" d=${function(e,t,i){return e.length<2?"":`${Ve(e,t)}L${Le(e[e.length-1][0])},${i}L${Le(e[0][0])},${i}Z`}(i,t.smooth,e.height)} style="fill:${s}"></path>`):B}
          ${t.segs.map(e=>I`<path class="line" d=${Ve(e,t.smooth)} style="stroke:${i};stroke-width:${t.lineWidth}px"></path>`)}
        </g>`})}
      </g>
      ${!e.hasData&&t?s.map(e=>I`<path class="line placeholder" d=${n(e)[0]} style="stroke:${e.color};stroke-width:${e.lineWidth}px"></path>`):B}
      ${t?I`<g mask=${`url(#${this._uid}-glowmask)`}>
            <rect class="glow" x=${-r} y="0" width=${r} height=${e.height} fill=${`url(#${this._uid}-glow)`}
              style=${`--sweep:${e.plotW+r}px`}></rect>
          </g>`:B}
      ${null!==i?I`<line class="cursor" x1=${i} x2=${i} y1="0" y2=${e.height}></line>
          ${s.map(t=>{const s=Ue(t.buckets,i,e.plotW);return Number.isFinite(s)?I`<circle class="dot" cx=${i} cy=${t.y(s)} r="4" style="fill:${this._colorFor(t.cfg,s)}"></circle>`:B})}`:B}
    </svg>
    ${e.thresholds.map(t=>j`<div class="threshold-label" style="top:${t.y}px;right:${e.width-e.plotW+4}px;color:${t.color}">
        ${this._formatValue(t.entity,t.value)}
      </div>`)}`}_renderEndLabels(e){const t=this._config.end_labels??kt;if("none"===t)return B;const i=e.series.filter(e=>!e.off).map(t=>{const i=this._current(t.cfg),s=function(e){for(let t=e.length-1;t>=0;t--)if(Number.isFinite(e[t]))return e[t];return NaN}(t.buckets.mean),o=t.y(Number.isFinite(i)?i:s);return{s:t,v:i,y:Number.isFinite(o)?o:e.height/2}}).sort((e,t)=>e.y-t.y);for(let e=1;e<i.length;e++)i[e].y=Math.max(i[e].y,i[e-1].y+18);const s=i.length?i[i.length-1].y-(e.height-9-12):0;if(s>0)for(const e of i)e.y-=s;for(const e of i)e.y=Math.max(e.y,9);return j`${i.map(({s:i,v:s,y:o})=>{const n=this._colorFor(i.cfg,s);return j`<div class="end-label" data-entity=${i.cfg.entity} style="left:${e.plotW+4}px;top:${o}px;color:${n}">
        ${"icon"===t||"icon_value"===t?this._renderIcon(i.cfg):B}
        ${"value"===t||"icon_value"===t?j`<span>${this._formatState(i.cfg)}<small>${this._valueUnit(i.cfg)?` ${this._valueUnit(i.cfg)}`:""}</small></span>`:B}
      </div>`})}`}_renderTooltip(e){const t=this._hoverX;if(null===t)return B;const i=e.start+t/e.plotW*(e.end-e.start),s=e.series.filter(e=>!e.off).map(i=>({s:i,v:Ue(i.buckets,t,e.plotW)})),o=t>e.width/2;return j`<div class="tooltip" style="${o?`right:${e.width-t+10}px`:`left:${t+10}px`}">
      <div class="tt-time">${Ze(this.hass,i,this._hours>24)}</div>
      ${s.map(({s:e,v:t})=>j`<div class="tt-row">
          <span class="marker dot" style="background:${this._colorFor(e.cfg,t)}"></span>
          ${s.length>1?j`<span class="tt-name">${this._name(e.cfg)}</span>`:B}
          <span class="tt-value">${Number.isFinite(t)?this._formatValue(e.cfg,t):"–"} ${this._unit(e.cfg)}</span>
        </div>`)}
      ${e.events.filter(e=>i>=e.from&&i<=e.to).map(e=>j`<div class="tt-row tt-event">
            <span class="marker dot" style="background:${e.color}"></span>
            <span class="tt-name">${this._eventName(e.cfg)}</span>
            <span class="tt-value">${this._eventTimeText(e)}</span>
          </div>`)}
    </div>`}}function Dt(e){let t=1/0,i=-1/0;for(let s=0;s<e.bandLo.length;s++)e.bandLo[s]<t&&(t=e.bandLo[s]),e.bandHi[s]>i&&(i=e.bandHi[s]);return[t,i]}function Lt(e){let t=0;for(const i of e.values())i.first&&t++;return t}function Vt(e,t){const i=t.split(".")[0];if(!["sensor","number","input_number"].includes(i))return!1;const s=e.states[t];if(!s)return!1;const o=s.attributes;return!("sensor"===i&&!o.unit_of_measurement&&!o.state_class)&&("unavailable"===s.state||"unknown"===s.state||Number.isFinite(Number(s.state)))}Ct.properties={hass:{attribute:!1},_config:{state:!0},_compact:{state:!0},_width:{state:!0},_graphH:{state:!0},_room:{state:!0},_hoverX:{state:!0},_tick:{state:!0},_off:{state:!0}},Ct.styles=n`
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
      position: relative;
      isolation: isolate; /* the day/night layer sits behind the content but above the card background */
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
    /* peak_overflow: the peaks rise behind the header – keep the text on top and readable */
    .peaks .header,
    .peaks .values,
    .peaks .info {
      position: relative;
      z-index: 1;
      pointer-events: none;
      text-shadow:
        0 0 4px var(--ha-card-background, var(--card-background-color, #fff)),
        0 0 8px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .peaks .header > *,
    .peaks .values > *,
    .peaks .info > * {
      pointer-events: auto;
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
    .ev-guide {
      stroke-width: 1;
      stroke-dasharray: 2 3;
      opacity: 0.45;
    }
    .ev-bar {
      opacity: 0.75;
    }
    .ev-pin {
      position: absolute;
      transform: translate(-50%, 50%);
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c);
      background: color-mix(in srgb, var(--c) 22%, var(--card-background-color, #fff));
      border: 1.5px solid var(--c);
      --mdc-icon-size: 12px;
      pointer-events: auto;
      z-index: 1;
    }
    .ev-pin ha-state-icon {
      display: flex;
    }
    .tt-event .tt-value {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .daynight {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
    .daynight svg {
      position: absolute;
      left: 0;
      top: 0;
    }
    .star.tw {
      animation: bnc-twinkle 4s ease-in-out infinite;
    }
    .star.tw {
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes bnc-twinkle {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.35;
        transform: scale(0.8);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .star.tw {
        animation: none;
      }
    }
    .sun-mark {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 9.5px;
      line-height: 11px;
      pointer-events: none;
      --mdc-icon-size: 15px;
      opacity: 0.85;
    }
    .sun-mark.rise {
      color: #e0a43a;
    }
    .sun-mark.set {
      color: #9aa6e6;
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
    /* above the night shading a strong halo would show as light boxes */
    .compact-row.over-graph.soft-halo {
      text-shadow: 0 0 3px var(--bnc-halo);
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
  `,customElements.get("best-number-card")||(customElements.define("best-number-card",Ct),console.info(`%c BEST-NUMBER-CARD %c v${bt} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4")),window.customCards=window.customCards||[],window.customCards.some(e=>"best-number-card"===e.type)||window.customCards.push({type:"best-number-card",name:"Best Number Card",description:"Sensor card for multiple entities with color scales and efficient history loading.",preview:!0,documentationURL:"https://github.com/zitroaen/bestnumbercard",getEntitySuggestion:(e,t)=>Vt(e,t)?{config:{type:"custom:best-number-card",entities:[{entity:t}]}}:null});export{Ct as BestNumberCard,bt as VERSION,Vt as isNumericSensor};
