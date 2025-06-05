import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as o}from"./iframe-4KYKMOYs.js";import{B as F}from"./Button-eyc4dcTo.js";import{F as d}from"./FilterModal-DA-8JZVV.js";import"./QueryBuilder-yOD016_Y.js";import"./api-B9Cd0jbc.js";import"./index-9S3zA3-C.js";const u={fields:{_id:{label:"User ID",sortable:!0,hidden:!1,identifier:!0,factory:null,source:null},name__family:{label:"Family Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},name__given:{label:"Given Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},email:{label:"Email Address",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},status:{label:"Status",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null}},operators:{":and":{index:1,field_name:"",operator:"and",widget:{name:"AND",desc:null,inversible:!0,data_query:null}},":or":{index:2,field_name:"",operator:"or",widget:{name:"OR",desc:null,inversible:!0,data_query:null}},"_id:eq":{index:4,field_name:"_id",operator:"eq",widget:null},"name__family:eq":{index:6,field_name:"name__family",operator:"eq",widget:null},"name__family:ilike":{index:7,field_name:"name__family",operator:"ilike",widget:null},"name__given:eq":{index:10,field_name:"name__given",operator:"eq",widget:null},"name__given:ilike":{index:11,field_name:"name__given",operator:"ilike",widget:null},"email:eq":{index:14,field_name:"email",operator:"eq",widget:null},"email:ilike":{index:15,field_name:"email",operator:"ilike",widget:null}},sortables:["_id","name__family","name__given","email","status"],default_order:["_id:asc"]},I={title:"Components/FilterModal",component:d,parameters:{layout:"centered",docs:{description:{component:`A reusable filter modal component that provides a visual interface for building complex database queries with filters.

**Features:**
- Visual filter building with QueryBuilder integration
- Modal state management with local filter editing
- Apply/Cancel functionality with proper state handling
- Keyboard support (Escape to close)
- Responsive design with mobile-friendly layout

**Usage in PaginatedList:**
This component is designed to be used within PaginatedList but can also be used standalone in other contexts where filter functionality is needed.`}}},tags:["autodocs"]},a={render:()=>{const[t,s]=o.useState(!1),[l,m]=o.useState(),[n,c]=o.useState(),O=()=>{s(!0)},j=()=>{s(!1)},C=p=>{c(p.query),m(p.query),console.log("Applied filters:",p)};return e.jsxs("div",{className:"p-6 space-y-4",children:[e.jsxs("div",{className:"p-4 bg-gray-50 border rounded-md",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Filter Modal Demo"}),e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"Click the button below to open the filter modal and build some filters."}),e.jsx(F,{onClick:O,children:"Open Filter Modal"}),n&&e.jsx("div",{className:"mt-4 p-3 bg-blue-50 border border-blue-200 rounded",children:e.jsxs("div",{className:"text-sm",children:[e.jsx("strong",{children:"Applied Filters:"}),e.jsx("div",{className:"mt-1 font-mono text-blue-700",children:n})]})})]}),e.jsx(d,{isOpen:t,metadata:u,currentQuery:l,onClose:j,onApply:C})]})}},i={render:()=>{const[t,s]=o.useState(!0),l='email:ilike:"@example.com"',m=()=>{s(!1)},n=c=>{console.log("Applied filters:",c),s(!1)};return e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"p-4 bg-gray-50 border rounded-md mb-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Filter Modal with Existing Filters"}),e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"This example shows the modal opening with pre-existing filters loaded."}),e.jsxs("div",{className:"text-sm",children:[e.jsx("strong",{children:"Existing filters:"}),e.jsx("div",{className:"mt-1 font-mono text-blue-700",children:l})]}),e.jsx(F,{onClick:()=>s(!0),className:"mt-3",disabled:t,children:t?"Modal is Open":"Reopen Modal"})]}),e.jsx(d,{isOpen:t,metadata:u,currentQuery:l,onClose:m,onApply:n})]})}},r={args:{isOpen:!1,metadata:u,currentQuery:void 0,onClose:()=>{},onApply:()=>{}},render:t=>e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"p-4 bg-gray-50 border rounded-md",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Closed Filter Modal"}),e.jsxs("p",{className:"text-sm text-gray-600",children:["When ",e.jsx("code",{children:"isOpen"})," is false, the FilterModal renders nothing (returns null). This is the default state when not in use."]})]}),e.jsx(d,{...t})]})};var f,h,g;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<string | undefined>();
    const [appliedFilters, setAppliedFilters] = useState<string | undefined>();
    const handleOpen = () => {
      setIsOpen(true);
    };
    const handleClose = () => {
      setIsOpen(false);
    };
    const handleApply = (query: ResourceQuery) => {
      setAppliedFilters(query.query);
      setCurrentFilters(query.query);
      console.log('Applied filters:', query);
    };
    return <div className="p-6 space-y-4">
        <div className="p-4 bg-gray-50 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Filter Modal Demo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click the button below to open the filter modal and build some filters.
          </p>
          
          <Button onClick={handleOpen}>
            Open Filter Modal
          </Button>
          
          {appliedFilters && <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm">
                <strong>Applied Filters:</strong>
                <div className="mt-1 font-mono text-blue-700">
                  {appliedFilters}
                </div>
              </div>
            </div>}
        </div>

        <FilterModal isOpen={isOpen} metadata={mockMetadata} currentQuery={currentFilters} onClose={handleClose} onApply={handleApply} />
      </div>;
  }
}`,...(g=(h=a.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var x,b,y;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    // Simulate existing filters
    const existingQuery = \`email:ilike:"@example.com"\`;
    const handleClose = () => {
      setIsOpen(false);
    };
    const handleApply = (query: ResourceQuery) => {
      console.log('Applied filters:', query);
      setIsOpen(false);
    };
    return <div className="p-6">
        <div className="p-4 bg-gray-50 border rounded-md mb-4">
          <h3 className="text-lg font-semibold mb-2">Filter Modal with Existing Filters</h3>
          <p className="text-sm text-gray-600 mb-2">
            This example shows the modal opening with pre-existing filters loaded.
          </p>
          <div className="text-sm">
            <strong>Existing filters:</strong>
            <div className="mt-1 font-mono text-blue-700">
              {existingQuery}
            </div>
          </div>
          
          <Button onClick={() => setIsOpen(true)} className="mt-3" disabled={isOpen}>
            {isOpen ? 'Modal is Open' : 'Reopen Modal'}
          </Button>
        </div>

        <FilterModal isOpen={isOpen} metadata={mockMetadata} currentQuery={existingQuery} onClose={handleClose} onApply={handleApply} />
      </div>;
  }
}`,...(y=(b=i.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var v,_,N;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    isOpen: false,
    metadata: mockMetadata,
    currentQuery: undefined,
    onClose: () => {},
    onApply: () => {}
  },
  render: args => {
    return <div className="p-6">
        <div className="p-4 bg-gray-50 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Closed Filter Modal</h3>
          <p className="text-sm text-gray-600">
            When <code>isOpen</code> is false, the FilterModal renders nothing (returns null).
            This is the default state when not in use.
          </p>
        </div>
        <FilterModal {...args} />
      </div>;
  }
}`,...(N=(_=r.parameters)==null?void 0:_.docs)==null?void 0:N.source}}};const E=["Interactive","WithExistingFilters","Closed"];export{r as Closed,a as Interactive,i as WithExistingFilters,E as __namedExportsOrder,I as default};
