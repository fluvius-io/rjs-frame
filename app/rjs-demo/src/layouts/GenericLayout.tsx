import { PageLayout, ModuleSlot } from 'rjs-frame';

export class GenericLayout extends PageLayout {
  renderContent() {
    return (
    <>
      <h1>Generic Layout</h1>
      <div className="home-layout" style={{border: '1px solid red', padding: '10px'}}>
        <ModuleSlot id="header">          
        <div>Loading header...</div>
        </ModuleSlot>
        <div className="content">
          <ModuleSlot id="sidebar" />
          <ModuleSlot>
            <div>No Main Content ...</div>
          </ModuleSlot>
        </div>
        <ModuleSlot id="footer" />
      </div>
    </>);
  }
} 