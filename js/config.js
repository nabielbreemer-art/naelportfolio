/* Public client configuration only.
 * IMPORTANT:
 * Only the Supabase anon/public key may be exposed in frontend code.
 * NEVER expose the Supabase service_role key.
 */
const SUPABASE_URL = "https://ctsucjrevcaavfpjyssl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8gVafEpvoHry4T7ZGN06XQ_bhu8sHv7";

/* Optional hosted contact form settings. */
const CONTACT_FORM = {
  mode: "mailto", // "mailto", "formspree", or "emailjs"
  formspreeUrl: "",
  emailjs: { serviceId: "", templateId: "", publicKey: "" }
};

const DEMO_PROFILE = {
  id: "demo-profile", full_name: "Alex Morgan", profession: "Creative Developer & Designer",
  bio: "I care about the details people feel but rarely name: the right amount of friction, a layout that breathes, and software that feels obvious on the first try.",
  location: "Tokyo, Japan", experience_years: 4, email: "hello@example.com", phone: "+81 00 0000 0000",
  avatar_url: "", resume_url: "", role: "admin"
};

const DEMO_PROJECTS = [
  {id:"demo-1",title:"Personal Portfolio",slug:"personal-portfolio",description:"A considered portfolio system that turns a collection of work into a clear point of view.",thumbnail_url:"",category:"Web",technologies:["HTML","CSS","JavaScript"],demo_url:"https://example.com",github_url:"https://github.com",featured:true,status:"published",sort_order:1,created_at:"2026-07-12"},
  {id:"demo-2",title:"Northstar Commerce",slug:"northstar-commerce",description:"A warmer, faster shopping experience for a small collection of beautifully made objects.",thumbnail_url:"",category:"UI/UX",technologies:["Figma","Prototyping","UX"],demo_url:"",github_url:"",featured:true,status:"published",sort_order:2,created_at:"2026-05-03"},
  {id:"demo-3",title:"Field Notes",slug:"field-notes",description:"A mobile-first journal for collecting observations, places, and the ideas between them.",thumbnail_url:"",category:"Mobile",technologies:["Product","UI Design","Research"],demo_url:"",github_url:"https://github.com",featured:false,status:"published",sort_order:3,created_at:"2026-03-18"},
  {id:"demo-4",title:"Signal Dashboard",slug:"signal-dashboard",description:"A calmer way to read operational data and make the next decision with confidence.",thumbnail_url:"",category:"Web",technologies:["Dashboard","Data Viz","Frontend"],demo_url:"",github_url:"",featured:false,status:"published",sort_order:4,created_at:"2025-12-02"}
];
const DEMO_SKILLS = [
  {id:"s1",name:"HTML & CSS",category:"Frontend",level:"Advanced",icon:"◇",sort_order:1},{id:"s2",name:"JavaScript",category:"Frontend",level:"Advanced",icon:"◇",sort_order:2},{id:"s3",name:"Accessibility",category:"Frontend",level:"Advanced",icon:"◇",sort_order:3},
  {id:"s4",name:"Product design",category:"Design",level:"Advanced",icon:"✦",sort_order:1},{id:"s5",name:"Prototyping",category:"Design",level:"Advanced",icon:"✦",sort_order:2},{id:"s6",name:"Design systems",category:"Design",level:"Working",icon:"✦",sort_order:3},
  {id:"s7",name:"Git & GitHub",category:"Tools",level:"Advanced",icon:"○",sort_order:1},{id:"s8",name:"Supabase",category:"Tools",level:"Working",icon:"○",sort_order:2},{id:"s9",name:"Figma",category:"Tools",level:"Advanced",icon:"○",sort_order:3}
];
const DEMO_EXPERIENCE = [
  {id:"e1",position:"Independent developer & designer",company:"Self-employed",location:"Tokyo / Remote",start_date:"2023-01-01",end_date:null,is_current:true,description:"Helping early-stage teams turn rough ideas into useful, distinctive digital products.",technologies:["Product strategy","Frontend","UI/UX"],sort_order:1},
  {id:"e2",position:"Frontend developer",company:"Studio North",location:"Remote",start_date:"2021-04-01",end_date:"2022-12-01",is_current:false,description:"Built expressive marketing sites and design systems for brands with something to say.",technologies:["JavaScript","CSS","Motion"],sort_order:2},
  {id:"e3",position:"UI/UX designer",company:"Common Ground",location:"Tokyo",start_date:"2020-04-01",end_date:"2021-03-01",is_current:false,description:"Translated research and strategy into interfaces people could understand at a glance.",technologies:["Figma","Research","Prototyping"],sort_order:3}
];
const DEMO_SERVICES = [
  {id:"v1",title:"Web development",description:"Fast, durable websites that give your ideas a confident home.",icon:"↗",featured:true,sort_order:1},
  {id:"v2",title:"Product design",description:"From messy first thought to an interface that makes sense.",icon:"✦",featured:false,sort_order:2},
  {id:"v3",title:"Creative direction",description:"A sharper point of view for products ready to mean something.",icon:"◌",featured:false,sort_order:3}
];
const DEMO_SOCIAL = [{id:"l1",platform:"GitHub",url:"https://github.com",icon:"GH",is_visible:true,sort_order:1},{id:"l2",platform:"LinkedIn",url:"https://linkedin.com",icon:"in",is_visible:true,sort_order:2},{id:"l3",platform:"Email",url:"mailto:hello@example.com",icon:"@",is_visible:true,sort_order:3}];
