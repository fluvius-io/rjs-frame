import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as a}from"./iframe-4KYKMOYs.js";import{Q as i,t as f}from"./QueryBuilder-yOD016_Y.js";import"./Button-eyc4dcTo.js";import"./api-B9Cd0jbc.js";import"./index-9S3zA3-C.js";const l={fields:{_id:{label:"User ID",sortable:!0,hidden:!1,identifier:!0,factory:null,source:null},name__family:{label:"Family Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},name__given:{label:"Given Name",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},email:{label:"Email Address",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},status:{label:"Status",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null},age:{label:"Age",sortable:!0,hidden:!1,identifier:!1,factory:null,source:null}},operators:{":and":{index:1,field_name:"",operator:"and",widget:{name:"AND",desc:"Logical AND operator",inversible:!0,data_query:null}},":or":{index:2,field_name:"",operator:"or",widget:{name:"OR",desc:"Logical OR operator",inversible:!0,data_query:null}},"_id:eq":{index:3,field_name:"_id",operator:"eq",widget:null},"_id:in":{index:4,field_name:"_id",operator:"in",widget:null},"name__family:eq":{index:5,field_name:"name__family",operator:"eq",widget:null},"name__family:ilike":{index:6,field_name:"name__family",operator:"ilike",widget:null},"name__family:in":{index:7,field_name:"name__family",operator:"in",widget:null},"name__given:eq":{index:8,field_name:"name__given",operator:"eq",widget:null},"name__given:ilike":{index:9,field_name:"name__given",operator:"ilike",widget:null},"email:eq":{index:10,field_name:"email",operator:"eq",widget:null},"email:ilike":{index:11,field_name:"email",operator:"ilike",widget:null},"status:eq":{index:12,field_name:"status",operator:"eq",widget:null},"status:in":{index:13,field_name:"status",operator:"in",widget:null},"age:eq":{index:14,field_name:"age",operator:"eq",widget:null},"age:gt":{index:15,field_name:"age",operator:"gt",widget:null},"age:lt":{index:16,field_name:"age",operator:"lt",widget:null}},sortables:["_id","name__family","name__given","email","status","age"],default_order:["_id:asc"]},se={title:"Components/QueryBuilder",component:i,parameters:{layout:"padded",docs:{description:{component:`A visual query builder that provides a unified interface for building complex database queries.

Features configurable section visibility, allowing you to show/hide:
- Field selection
- Sort rules 
- Filter rules (including complex AND/OR groups)
- Query display

Operates on QueryBuilderState internally and can be converted to ResourceQuery objects for backend APIs.`}}},tags:["autodocs"]},n={render:()=>{const[t,s]=a.useState({selectedFields:[],sortRules:[],filterRules:[]}),[r,d]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-blue-50 border border-blue-200 rounded text-sm",children:[e.jsx("strong",{children:"🔧 Visual Query Builder:"})," This example demonstrates the visual interface for building queries with field selection, sorting, and filters."]}),e.jsx(i,{metadata:l,title:"User Query Builder",onQueryChange:s,onExecute:d}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Current State"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:JSON.stringify(t,null,2)}),e.jsx("h4",{className:"font-medium mt-3 mb-2",children:"As ResourceQuery:"}),e.jsx("pre",{className:"text-xs bg-blue-50 p-2 rounded overflow-x-auto",children:JSON.stringify(f(t),null,2)})]}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Last Executed State"}),e.jsx("pre",{className:"text-xs bg-green-100 p-2 rounded overflow-x-auto",children:r?JSON.stringify(r,null,2):"No query executed yet"}),r&&e.jsxs(e.Fragment,{children:[e.jsx("h4",{className:"font-medium mt-3 mb-2",children:"As ResourceQuery:"}),e.jsx("pre",{className:"text-xs bg-green-50 p-2 rounded overflow-x-auto",children:JSON.stringify(f(r),null,2)})]})]})]})]})}},o={render:()=>{const t={selectedFields:["name__family","email"],sortRules:[{field:"name__family",direction:"asc"}],filterRules:[{id:"filter-1",type:"field",field:"name__family",operator:"ilike",value:"Smith"}]},[s,r]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-blue-50 border border-blue-200 rounded text-sm",children:[e.jsx("strong",{children:"🔄 Initial State:"})," This example starts with predefined field selection, sorting, and filters."]}),e.jsx(i,{metadata:l,initialQuery:t,onQueryChange:r,title:"Query Builder with Initial State",showFieldSelection:!0,showSortRules:!0,showFilterRules:!0}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Current State"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:s?JSON.stringify(s,null,2):"No changes yet"})]})]})}},u={render:()=>{const[t,s]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-green-50 border border-green-200 rounded text-sm",children:[e.jsx("strong",{children:"📱 Compact Mode:"})," A more compact query builder suitable for smaller spaces or embedded use."]}),e.jsx("div",{className:"max-w-4xl",children:e.jsx(i,{metadata:l,title:"Compact User Query Builder",onQueryChange:s,className:"max-w-none"})}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"State Output"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:t?JSON.stringify(t,null,2):"Build a query above"})]})]})}},c={render:()=>{var v,N,S;const[t,s]=a.useState(!1),[r,d]=a.useState(null),[y,b]=a.useState(null),z=async H=>{s(!0),b(null),d(null);try{await new Promise(X=>setTimeout(X,1e3));const K={query:f(H),results:[{_id:"1",name__family:"Smith",email:"john@example.com"},{_id:"2",name__family:"Johnson",email:"jane@example.com"}],total:2};d(K)}catch(h){b(h instanceof Error?h.message:"Unknown error")}finally{s(!1)}};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-red-50 border border-red-200 rounded text-sm",children:[e.jsx("strong",{children:"🚀 Live Data Execution:"})," Build a query and execute it against mock data. The results will be displayed below."]}),e.jsx(i,{metadata:l,title:"Query Builder with Live Execution",onExecute:z}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"font-medium",children:"Execution Results"}),t&&e.jsx("div",{className:"text-sm text-blue-600",children:"🔄 Executing query..."})]}),y&&e.jsxs("div",{className:"p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700",children:["❌ Error: ",y]}),r&&!t&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("div",{className:"text-sm text-green-700",children:"✅ Query executed successfully"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Total Items:"})," ",((v=r.meta)==null?void 0:v.total_items)||r.total||(Array.isArray(r)?r.length:"Unknown")]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Current Page:"})," ",((N=r.meta)==null?void 0:N.page_no)||r.page||"N/A"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Items on Page:"})," ",((S=r.data||r)==null?void 0:S.length)||0]})]}),e.jsxs("details",{children:[e.jsx("summary",{className:"cursor-pointer text-sm font-medium",children:"View Raw Response Data"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-2",children:JSON.stringify(r,null,2)})]})]}),!r&&!y&&!t&&e.jsx("div",{className:"text-sm text-gray-500 italic",children:'Build a query above and click "Execute Query" to see results'})]})]})}},m={render:()=>{const t={selectedFields:["_id","name__family"]},[s,r]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-green-50 border border-green-200 rounded text-sm",children:[e.jsx("strong",{children:"🎯 Field Selection Only:"})," This mode only shows field selection, hiding all other sections."]}),e.jsx(i,{metadata:l,initialQuery:t,title:"Field Selection Only",onQueryChange:r,showFieldSelection:!0,showSortRules:!1,showFilterRules:!1,showQueryDisplay:!0,className:"max-w-2xl"}),s&&e.jsxs("div",{className:"mt-4 p-3 bg-gray-50 border rounded max-w-2xl",children:[e.jsx("div",{className:"text-sm font-medium mb-2",children:"Generated State:"}),e.jsx("pre",{className:"text-xs text-gray-600 overflow-auto",children:JSON.stringify(s,null,2)})]})]})}},p={render:()=>{const[t,s]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-indigo-50 border border-indigo-200 rounded text-sm",children:[e.jsx("strong",{children:"🧩 Composite Operators Demo:"})," This example showcases AND/OR groups with nested filters. Build complex queries like: ",e.jsxs("code",{children:['(name = "Smith" OR name = "Jones") AND (age ',">",'= 25 AND status = "active")']})]}),e.jsx(i,{metadata:l,title:"Advanced Query Builder with Composite Operators",onQueryChange:s}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Generated Query Structure"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:t?JSON.stringify(t,null,2):"No query built yet"}),e.jsxs("div",{className:"mt-3 text-sm text-gray-600",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these interactions:"})}),e.jsxs("ul",{className:"list-disc list-inside mt-1 space-y-1",children:[e.jsx("li",{children:"Click the AND/OR button to toggle between logical operators"}),e.jsx("li",{children:'Use "+ Add AND Group" to create nested AND conditions'}),e.jsx("li",{children:'Use "+ Add OR Group" to create nested OR conditions'}),e.jsx("li",{children:'Check "NOT" to negate individual filters or entire groups'}),e.jsx("li",{children:"Build complex nested structures up to 5 levels deep"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{className:"border rounded p-3",children:[e.jsx("h4",{className:"font-medium mb-2",children:"🔵 AND Groups (Blue)"}),e.jsx("p",{children:"All conditions must be true. Use for restrictive filtering."}),e.jsxs("code",{className:"text-xs bg-blue-50 p-1 rounded",children:["age ",">",' 25 AND status = "active"']})]}),e.jsxs("div",{className:"border rounded p-3",children:[e.jsx("h4",{className:"font-medium mb-2",children:"🟢 OR Groups (Green)"}),e.jsx("p",{children:"Any condition can be true. Use for inclusive filtering."}),e.jsx("code",{className:"text-xs bg-green-50 p-1 rounded",children:'name = "Smith" OR name = "Jones"'})]})]})]})}},x={render:()=>{const[t,s]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-green-50 border border-green-200 rounded text-sm",children:[e.jsx("strong",{children:"📋 Direct Metadata Mode:"})," This example uses metadata provided directly to the component, perfect for embedded use cases where metadata is already available."]}),e.jsx(i,{metadata:l,title:"Query Builder with Direct Metadata",onQueryChange:s}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Generated State"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:t?JSON.stringify(t,null,2):"No query built yet"})]})]})}},g={render:()=>{const[t,s]=a.useState(null);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-3 bg-purple-50 border border-purple-200 rounded text-sm",children:[e.jsx("strong",{children:"🎛️ Custom Configuration:"})," This example shows the flexible section visibility controls. Only filters are enabled, hiding field selection and sorting."]}),e.jsx(i,{metadata:l,title:"Filters Only",onQueryChange:s,showFieldSelection:!1,showSortRules:!1,showFilterRules:!0,className:"max-w-4xl"}),e.jsxs("div",{className:"border rounded p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Filter State Output"}),e.jsx("pre",{className:"text-xs bg-gray-100 p-2 rounded overflow-x-auto",children:t?JSON.stringify(t,null,2):"No filters applied yet"})]})]})}};var w,j,_;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState>({
      selectedFields: [],
      sortRules: [],
      filterRules: []
    });
    const [executedState, setExecutedState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔧 Visual Query Builder:</strong> This example demonstrates the visual interface for building queries with field selection, sorting, and filters.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="User Query Builder" onQueryChange={setCurrentState} onExecute={setExecutedState} />

        {/* Display current and executed states */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Current State</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(currentState, null, 2)}
            </pre>
            
            <h4 className="font-medium mt-3 mb-2">As ResourceQuery:</h4>
            <pre className="text-xs bg-blue-50 p-2 rounded overflow-x-auto">
              {JSON.stringify(toResourceQuery(currentState), null, 2)}
            </pre>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Last Executed State</h3>
            <pre className="text-xs bg-green-100 p-2 rounded overflow-x-auto">
              {executedState ? JSON.stringify(executedState, null, 2) : 'No query executed yet'}
            </pre>
            
            {executedState && <>
                <h4 className="font-medium mt-3 mb-2">As ResourceQuery:</h4>
                <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(toResourceQuery(executedState), null, 2)}
                </pre>
              </>}
          </div>
        </div>
      </div>;
  }
}`,...(_=(j=n.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};var Q,O,C;o.parameters={...o.parameters,docs:{...(Q=o.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => {
    const initialState: Partial<QueryBuilderState> = {
      selectedFields: ['name__family', 'email'],
      sortRules: [{
        field: 'name__family',
        direction: 'asc'
      }],
      filterRules: [{
        id: 'filter-1',
        type: 'field',
        field: 'name__family',
        operator: 'ilike',
        value: 'Smith'
      }]
    };
    const [state, setState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔄 Initial State:</strong> This example starts with predefined field selection, sorting, and filters.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} initialQuery={initialState} onQueryChange={setState} title="Query Builder with Initial State" showFieldSelection showSortRules showFilterRules />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Current State</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {state ? JSON.stringify(state, null, 2) : 'No changes yet'}
          </pre>
        </div>
      </div>;
  }
}`,...(C=(O=o.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var R,B,A;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>📱 Compact Mode:</strong> A more compact query builder suitable for smaller spaces or embedded use.
        </div>
        
        <div className="max-w-4xl">
          <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="Compact User Query Builder" onQueryChange={setCurrentState} className="max-w-none" />
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">State Output</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'Build a query above'}
          </pre>
        </div>
      </div>;
  }
}`,...(A=(B=u.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var D,q,k;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const executeQuery = async (state: QueryBuilderState) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Convert to ResourceQuery for API
        const resourceQuery = toResourceQuery(state);

        // Mock data response based on query
        const mockResponse = {
          query: resourceQuery,
          results: [{
            _id: '1',
            name__family: 'Smith',
            email: 'john@example.com'
          }, {
            _id: '2',
            name__family: 'Johnson',
            email: 'jane@example.com'
          }],
          total: 2
        };
        setData(mockResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    return <div className="space-y-6">
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong>🚀 Live Data Execution:</strong> Build a query and execute it against mock data. The results will be displayed below.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="Query Builder with Live Execution" onExecute={executeQuery} />

        {/* Query execution results */}
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Execution Results</h3>
            {isLoading && <div className="text-sm text-blue-600">🔄 Executing query...</div>}
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ❌ Error: {error}
            </div>}

          {data && !isLoading && <div className="space-y-3">
              <div className="text-sm text-green-700">
                ✅ Query executed successfully
              </div>
              
              {/* Data summary */}
              <div className="text-sm space-y-1">
                <div><strong>Total Items:</strong> {data.meta?.total_items || data.total || (Array.isArray(data) ? data.length : 'Unknown')}</div>
                <div><strong>Current Page:</strong> {data.meta?.page_no || data.page || 'N/A'}</div>
                <div><strong>Items on Page:</strong> {(data.data || data)?.length || 0}</div>
              </div>

              {/* Raw data */}
              <details>
                <summary className="cursor-pointer text-sm font-medium">
                  View Raw Response Data
                </summary>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-2">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>}

          {!data && !error && !isLoading && <div className="text-sm text-gray-500 italic">
              Build a query above and click "Execute Query" to see results
            </div>}
        </div>
      </div>;
  }
}`,...(k=(q=c.parameters)==null?void 0:q.docs)==null?void 0:k.source}}};var E,F,J;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const simpleState: Partial<QueryBuilderState> = {
      selectedFields: ['_id', 'name__family']
    };
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🎯 Field Selection Only:</strong> This mode only shows field selection, hiding all other sections.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} initialQuery={simpleState} title="Field Selection Only" onQueryChange={setCurrentState} showFieldSelection={true} showSortRules={false} showFilterRules={false} showQueryDisplay={true} className="max-w-2xl" />
        
        {currentState && <div className="mt-4 p-3 bg-gray-50 border rounded max-w-2xl">
            <div className="text-sm font-medium mb-2">Generated State:</div>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(currentState, null, 2)}
            </pre>
          </div>}
      </div>;
  }
}`,...(J=(F=m.parameters)==null?void 0:F.docs)==null?void 0:J.source}}};var M,T,L;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-sm">
          <strong>🧩 Composite Operators Demo:</strong> This example showcases AND/OR groups with nested filters. 
          Build complex queries like: <code>(name = "Smith" OR name = "Jones") AND (age {'>'}= 25 AND status = "active")</code>
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="Advanced Query Builder with Composite Operators" onQueryChange={setCurrentState} />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated Query Structure</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No query built yet'}
          </pre>
          
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Try these interactions:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Click the AND/OR button to toggle between logical operators</li>
              <li>Use "+ Add AND Group" to create nested AND conditions</li>
              <li>Use "+ Add OR Group" to create nested OR conditions</li>
              <li>Check "NOT" to negate individual filters or entire groups</li>
              <li>Build complex nested structures up to 5 levels deep</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">🔵 AND Groups (Blue)</h4>
            <p>All conditions must be true. Use for restrictive filtering.</p>
            <code className="text-xs bg-blue-50 p-1 rounded">age {'>'} 25 AND status = "active"</code>
          </div>
          
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">🟢 OR Groups (Green)</h4>
            <p>Any condition can be true. Use for inclusive filtering.</p>
            <code className="text-xs bg-green-50 p-1 rounded">name = "Smith" OR name = "Jones"</code>
          </div>
        </div>
      </div>;
  }
}`,...(L=(T=p.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};var I,G,U;x.parameters={...x.parameters,docs:{...(I=x.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>📋 Direct Metadata Mode:</strong> This example uses metadata provided directly to the component, 
          perfect for embedded use cases where metadata is already available.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="Query Builder with Direct Metadata" onQueryChange={setCurrentState} />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated State</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No query built yet'}
          </pre>
        </div>
      </div>;
  }
}`,...(U=(G=x.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};var W,P,V;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);
    return <div className="space-y-6">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded text-sm">
          <strong>🎛️ Custom Configuration:</strong> This example shows the flexible section visibility controls.
          Only filters are enabled, hiding field selection and sorting.
        </div>
        
        <QueryBuilder metadata={mockMetadataWithCompositeOperators} title="Filters Only" onQueryChange={setCurrentState} showFieldSelection={false} showSortRules={false} showFilterRules={true} className="max-w-4xl" />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Filter State Output</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No filters applied yet'}
          </pre>
        </div>
      </div>;
  }
}`,...(V=(P=g.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};const ae=["BasicQueryBuilder","WithInitialState","CompactMode","WithLiveDataExecution","FieldSelectionOnly","CompositeOperators","WithDirectMetadata","CustomSectionVisibility"];export{n as BasicQueryBuilder,u as CompactMode,p as CompositeOperators,g as CustomSectionVisibility,m as FieldSelectionOnly,x as WithDirectMetadata,o as WithInitialState,c as WithLiveDataExecution,ae as __namedExportsOrder,se as default};
