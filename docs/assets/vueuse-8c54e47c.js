import{g as Q,r as v,i as T,w as _,a as N,o as R,n as j,u as x,b as z}from"./vue-89324afd.js";var b;const O=typeof window<"u",H=e=>typeof e=="function",L=e=>typeof e=="string",$=()=>{};O&&((b=window==null?void 0:window.navigator)!=null&&b.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function g(e){return typeof e=="function"?e():x(e)}function B(e){return e}function y(e){return Q()?(z(e),!0):!1}function W(e,t=!0){N()?R(e):t?e():j(e)}function X(e,t=1e3,n={}){const{immediate:r=!0,immediateCallback:u=!1}=n;let a=null;const i=v(!1);function l(){a&&(clearInterval(a),a=null)}function o(){i.value=!1,l()}function c(){const s=g(t);s<=0||(i.value=!0,u&&e(),l(),a=setInterval(e,s))}if(r&&O&&c(),T(t)||H(t)){const s=_(t,()=>{i.value&&O&&c()});y(s)}return y(o),{isActive:i,pause:o,resume:c}}function A(e){var t;const n=g(e);return(t=n==null?void 0:n.$el)!=null?t:n}const I=O?window:void 0;function h(...e){let t,n,r,u;if(L(e[0])||Array.isArray(e[0])?([n,r,u]=e,t=I):[t,n,r,u]=e,!t)return $;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const a=[],i=()=>{a.forEach(s=>s()),a.length=0},l=(s,f,p,d)=>(s.addEventListener(f,p,d),()=>s.removeEventListener(f,p,d)),o=_(()=>[A(t),g(u)],([s,f])=>{i(),s&&a.push(...n.flatMap(p=>r.map(d=>l(s,p,d,f))))},{immediate:!0,flush:"post"}),c=()=>{o(),i()};return y(c),c}function F(e,t=!1){const n=v(),r=()=>n.value=Boolean(e());return r(),W(r,t),n}const w=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},m="__vueuse_ssr_handlers__";w[m]=w[m]||{};w[m];var E=Object.getOwnPropertySymbols,k=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable,U=(e,t)=>{var n={};for(var r in e)k.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&E)for(var r of E(e))t.indexOf(r)<0&&M.call(e,r)&&(n[r]=e[r]);return n};function Y(e,t,n={}){const r=n,{window:u=I}=r,a=U(r,["window"]);let i;const l=F(()=>u&&"ResizeObserver"in u),o=()=>{i&&(i.disconnect(),i=void 0)},c=_(()=>A(e),f=>{o(),l.value&&u&&f&&(i=new ResizeObserver(t),i.observe(f,a))},{immediate:!0,flush:"post"}),s=()=>{o(),c()};return y(s),{isSupported:l,stop:s}}var P;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(P||(P={}));var G=Object.defineProperty,S=Object.getOwnPropertySymbols,V=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable,C=(e,t,n)=>t in e?G(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,K=(e,t)=>{for(var n in t||(t={}))V.call(t,n)&&C(e,n,t[n]);if(S)for(var n of S(t))D.call(t,n)&&C(e,n,t[n]);return e};const q={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};K({linear:B},q);function Z(e={}){const{window:t=I,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:u=!0,includeScrollbar:a=!0}=e,i=v(n),l=v(r),o=()=>{t&&(a?(i.value=t.innerWidth,l.value=t.innerHeight):(i.value=t.document.documentElement.clientWidth,l.value=t.document.documentElement.clientHeight))};return o(),W(o),h("resize",o,{passive:!0}),u&&h("orientationchange",o,{passive:!0}),{width:i,height:l}}export{X as a,Y as b,Z as u};