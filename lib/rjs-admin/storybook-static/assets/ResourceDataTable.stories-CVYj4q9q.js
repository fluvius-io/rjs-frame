import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{j as q}from"./api-B9Cd0jbc.js";import{B as o}from"./Button-eyc4dcTo.js";import{D as Y}from"./DataTable-HVkZIiGn.js";import{r}from"./iframe-4KYKMOYs.js";import"./QueryBuilder-yOD016_Y.js";import"./index-9S3zA3-C.js";import"./FilterModal-DA-8JZVV.js";const l=({dataApi:i,title:Z="API Data Table",subtitle:$="Data fetched from API with dynamic metadata",showSearch:ee=!0,showFilters:ae=!0,className:te,actions:re})=>{const[y,ne]=r.useState([]),[h,se]=r.useState(null),[A,D]=r.useState(!1),[ie,j]=r.useState(!1),[w,R]=r.useState(!1),[T,b]=r.useState(null),[c,I]=r.useState({page:1,pageSize:10,total:0}),d=r.useRef(null),S=r.useRef(!0),v=r.useRef([]),[n,oe]=r.useState({}),P=async()=>{j(!0);try{console.log("🌐 ResourceDataTable: Fetching metadata..."),console.log("📋 ResourceDataTable: Using queryMeta on dataApi:",i);let a=await q.queryMeta(i);console.log("📋 ResourceDataTable: Received metadata:",a),se(a.data)}catch(a){console.error("❌ ResourceDataTable: Failed to fetch metadata:",a),console.error("❌ ResourceDataTable: Error details:",{dataApi:i,message:a instanceof Error?a.message:String(a),stack:a instanceof Error?a.stack:void 0}),b(a instanceof Error?a.message:"Failed to fetch metadata")}finally{j(!1)}},_=async()=>{d.current&&d.current.abort();const a=new AbortController;d.current=a,S.current?(D(!0),S.current=!1):(v.current=y,R(!0)),b(null);try{const t={page:c.page.toString(),limit:c.pageSize.toString()};n.sort&&n.sort.length>0&&(t.sort=n.sort[0],console.log("🔄 ResourceDataTable: Adding sort parameter:",n.sort[0])),n.searchQuery&&(t.search=n.searchQuery,console.log("🔍 ResourceDataTable: Adding search parameter:",n.searchQuery)),n.query&&(t.query=n.query,console.log("🔧 ResourceDataTable: Adding query string:",n.query)),console.log("🌐 ResourceDataTable: Fetching data from API:",i);const s=await q.query(i,{search:t});if(console.log("📊 ResourceDataTable: Received response:",s),!(Array.isArray(s.data)&&s.meta))throw new Error("Invalid response format: "+JSON.stringify(s));console.log("✅ ResourceDataTable: Using meta-based response format"),console.log("📊 ResourceDataTable: Meta object:",s.meta),console.log("📊 ResourceDataTable: Data count:",s.data.length),ne(s.data),I(x=>{var z,N,M;return{...x,page:((z=s.meta)==null?void 0:z.page_no)||x.page,pageSize:((N=s.meta)==null?void 0:N.limit)||x.pageSize,total:((M=s.meta)==null?void 0:M.total_items)||s.data.length}})}catch(t){a.signal.aborted||(console.error("❌ ResourceDataTable: Failed to fetch data:",t),console.error("❌ ResourceDataTable: Data fetch error details:",{dataApi:i,currentQuery:n,pagination:c,message:t instanceof Error?t.message:String(t),stack:t instanceof Error?t.stack:void 0}),b(t instanceof Error?t.message:"Failed to fetch data"))}finally{a.signal.aborted||(D(!1),R(!1),d.current=null)}};r.useEffect(()=>(P(),_(),()=>{d.current&&d.current.abort()}),[i]),r.useEffect(()=>{h&&_()},[n,c]);const de=a=>{oe(a)},le=(a,k)=>{I(t=>({...t,page:a,pageSize:k}))},ce=w&&v.current.length>0?v.current:y;return A||ie?null:T?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx("div",{className:"text-destructive mb-4",children:T}),e.jsx(o,{onClick:()=>{P(),_()},children:"Retry"})]}):h?e.jsx(Y,{metadata:h,data:ce,pagination:c,loading:A,backgroundLoading:w,title:Z,subtitle:$,showSearch:ee,showFilters:ae,onQueryChange:de,onPageChange:le,actions:re,className:te}):e.jsx("div",{className:"p-8 text-center",children:e.jsx("div",{children:"No metadata available"})})};l.__docgenInfo={description:`A convenience component that fetches both metadata and data from API endpoints
This demonstrates the complete workflow of using API-driven metadata`,methods:[],displayName:"ResourceDataTable",props:{dataApi:{required:!0,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"API Data Table"',computed:!1}},subtitle:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Data fetched from API with dynamic metadata"',computed:!1}},showSearch:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showFilters:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},actions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const me={fields:{_id:{label:"User ID",sortable:!0,hidden:!1,identifier:!0,factory:null,source:null},name__family:{label:"Family Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},name__given:{label:"Given Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},email:{label:"Email Address",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},status:{label:"Status",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null}},operators:{":and":{index:1,field_name:"",operator:"and",widget:{name:"AND",desc:null,inversible:!0,data_query:null}},":or":{index:2,field_name:"",operator:"or",widget:{name:"OR",desc:null,inversible:!0,data_query:null}},"_id:in":{index:3,field_name:"_id",operator:"in",widget:null},"_id:eq":{index:4,field_name:"_id",operator:"eq",widget:null},"_id:is":{index:5,field_name:"_id",operator:"is",widget:null},"name__family:eq":{index:6,field_name:"name__family",operator:"eq",widget:null},"name__family:ilike":{index:7,field_name:"name__family",operator:"ilike",widget:null},"name__family:is":{index:8,field_name:"name__family",operator:"is",widget:null},"name__family:in":{index:9,field_name:"name__family",operator:"in",widget:null},"name__given:eq":{index:10,field_name:"name__given",operator:"eq",widget:null},"name__given:ilike":{index:11,field_name:"name__given",operator:"ilike",widget:null},"name__given:is":{index:12,field_name:"name__given",operator:"is",widget:null},"name__given:in":{index:13,field_name:"name__given",operator:"in",widget:null},"email:eq":{index:14,field_name:"email",operator:"eq",widget:null},"email:ilike":{index:15,field_name:"email",operator:"ilike",widget:null}},sortables:["_id","name__family","name__given","email","status"],default_order:["_id:asc"]},xe={title:"Components/ResourceDataTable",component:l,parameters:{layout:"padded",docs:{description:{component:"A DataTable component that fetches metadata and data from real API endpoints via Vite proxy."}}},tags:["autodocs"]},m={render:()=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm",children:[e.jsx("strong",{children:"🌐 Live API:"})," This example fetches real data from your backend server via Vite proxy. Make sure your server is running on ",e.jsx("code",{children:"http://localhost:8000"})," and check browser console for API calls."]}),e.jsx(l,{dataApi:"idm:user",title:"Users from Real API",subtitle:"Both metadata and data fetched from live backend server",actions:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{variant:"outline",size:"sm",children:"Export"}),e.jsx(o,{size:"sm",children:"Add User"})]})})]})},u={render:()=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm",children:[e.jsx("strong",{children:"🏢 Organizations API:"})," This example fetches organization data from your backend server. Make sure your server is running on ",e.jsx("code",{children:"http://localhost:8000"})," and provides organization endpoints."]}),e.jsx(l,{dataApi:"idm:organization",title:"Organizations from Real API",subtitle:"Organization metadata and data fetched from live backend server",actions:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{variant:"outline",size:"sm",children:"Export"}),e.jsx(o,{size:"sm",children:"Add Organization"})]})})]})},g={render:()=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm",children:[e.jsx("strong",{children:"🔄 API Integration:"})," Metadata and data from real API endpoint. Make sure your server is running on ",e.jsx("code",{children:"http://localhost:8000"}),"."]}),e.jsx(l,{dataApi:"idm:user",title:"Users from API",subtitle:"Metadata and data from real API",actions:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{variant:"outline",size:"sm",children:"Export"}),e.jsx(o,{size:"sm",children:"Add User"})]})})]})},f={render:()=>{const i=[{_id:"user_001",name__family:"Smith",name__given:"John",email:"john.smith@example.com",status:"Active"},{_id:"user_002",name__family:"Johnson",name__given:"Jane",email:"jane.johnson@example.com",status:"Inactive"},{_id:"user_003",name__family:"Williams",name__given:"Bob",email:"bob.williams@example.com",status:"Active"}];return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm",children:[e.jsx("strong",{children:"📋 Static Mode:"})," Using hardcoded API metadata format with static sample data."]}),e.jsx(Y,{metadata:me,data:i,pagination:{page:1,pageSize:10,total:i.length},title:"Direct API Metadata Usage",subtitle:"Using API metadata format directly with static data",showSearch:!0,showFilters:!0})]})}},p={render:()=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm",children:[e.jsx("strong",{children:"⚠️ Server Error Demo:"})," This will show error state if backend server is not running."]}),e.jsx(l,{dataApi:"idm:nonexistent",title:"Error State Demo",subtitle:"This will show error if server is not running"})]})};var E,B,U;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    return <div>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🌐 Live API:</strong> This example fetches real data from your backend server via Vite proxy. 
          Make sure your server is running on <code>http://localhost:8000</code> and check browser console for API calls.
        </div>
        <ResourceDataTable dataApi="idm:user" title="Users from Real API" subtitle="Both metadata and data fetched from live backend server" actions={<div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Add User</Button>
            </div>} />
      </div>;
  }
}`,...(U=(B=m.parameters)==null?void 0:B.docs)==null?void 0:U.source}}};var O,F,L;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    return <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🏢 Organizations API:</strong> This example fetches organization data from your backend server. 
          Make sure your server is running on <code>http://localhost:8000</code> and provides organization endpoints.
        </div>
        <ResourceDataTable dataApi="idm:organization" title="Organizations from Real API" subtitle="Organization metadata and data fetched from live backend server" actions={<div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Add Organization</Button>
            </div>} />
      </div>;
  }
}`,...(L=(F=u.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var C,J,Q;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔄 API Integration:</strong> Metadata and data from real API endpoint.
          Make sure your server is running on <code>http://localhost:8000</code>.
        </div>
        <ResourceDataTable dataApi="idm:user" title="Users from API" subtitle="Metadata and data from real API" actions={<div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Add User</Button>
            </div>} />
      </div>;
  }
}`,...(Q=(J=g.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var V,W,G;f.parameters={...f.parameters,docs:{...(V=f.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const sampleData = [{
      _id: 'user_001',
      name__family: 'Smith',
      name__given: 'John',
      email: 'john.smith@example.com',
      status: 'Active'
    }, {
      _id: 'user_002',
      name__family: 'Johnson',
      name__given: 'Jane',
      email: 'jane.johnson@example.com',
      status: 'Inactive'
    }, {
      _id: 'user_003',
      name__family: 'Williams',
      name__given: 'Bob',
      email: 'bob.williams@example.com',
      status: 'Active'
    }];
    return <div>
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          <strong>📋 Static Mode:</strong> Using hardcoded API metadata format with static sample data.
        </div>
        <DataTable metadata={mockApiMetadata} data={sampleData} pagination={{
        page: 1,
        pageSize: 10,
        total: sampleData.length
      }} title="Direct API Metadata Usage" subtitle="Using API metadata format directly with static data" showSearch showFilters />
      </div>;
  }
}`,...(G=(W=f.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};var H,K,X;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    return <div>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong>⚠️ Server Error Demo:</strong> This will show error state if backend server is not running.
        </div>
        <ResourceDataTable dataApi="idm:nonexistent" title="Error State Demo" subtitle="This will show error if server is not running" />
      </div>;
  }
}`,...(X=(K=p.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};const ye=["WithApiMetadataAndData","OrganizationsFromApi","WithApiMetadata","DirectApiMetadata","ServerNotRunning"];export{f as DirectApiMetadata,u as OrganizationsFromApi,p as ServerNotRunning,g as WithApiMetadata,m as WithApiMetadataAndData,ye as __namedExportsOrder,xe as default};
