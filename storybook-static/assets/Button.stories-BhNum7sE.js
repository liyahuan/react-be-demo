import{f as z}from"./index-BASH1HpE.js";import{j as e}from"./jsx-runtime-BnIj46N_.js";import{P as w,S as P,T as W}from"./Button-DZKo5nBr.js";import"./index-CsdIBAqE.js";const T=({primary:j=!1,size:v="medium",backgroundColor:k,label:C,...h})=>{const q=j?"btn-default":"btn-success";return e.jsxs(e.Fragment,{children:[e.jsx(w,{type:"button",className:["btn",`btn--${v}`,q].join(" "),style:{backgroundColor:k},...h,children:C}),e.jsx(P,{children:"Goodbye World"}),e.jsx(W,{children:"Hey World"})]})};T.__docgenInfo={description:"",methods:[],displayName:"Button",props:{primary:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},backgroundColor:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | 'large'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"literal",value:"'large'"}]},description:"",defaultValue:{value:"'medium'",computed:!1}},label:{required:!0,tsType:{name:"string"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const N={title:"Example/Button",component:T,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{backgroundColor:{control:"color"}},args:{onClick:z()}},r={args:{primary:!0,label:"Button"}},a={args:{primary:!1,label:"Button"}},s={args:{size:"large",label:"Button"}},t={args:{size:"small",label:"Button"}},o={args:{primary:!0,label:"Delete now",backgroundColor:"red"}};var n,l,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    primary: true,
    label: 'Button'
  }
}`,...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var i,u,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    primary: false,
    label: 'Button'
  }
}`,...(c=(u=a.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var d,p,g;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    size: 'large',
    label: 'Button'
  }
}`,...(g=(p=s.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var y,b,f;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    size: 'small',
    label: 'Button'
  }
}`,...(f=(b=t.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var B,S,x;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    primary: true,
    label: 'Delete now',
    backgroundColor: 'red'
  }
}`,...(x=(S=o.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};const V=["Primary","Success","Large","Small","Warning"];export{s as Large,r as Primary,t as Small,a as Success,o as Warning,V as __namedExportsOrder,N as default};
