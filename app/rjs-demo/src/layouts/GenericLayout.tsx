import { PageLayout, ModuleSlot } from 'rjs-frame';

export class GenericLayout extends PageLayout {
  renderContent() {
    return (
    <>
      <h1>Generic Layout</h1>
      <div className="home-layout" style={{border: '1px solid red', padding: '10px'}}>
        <ModuleSlot name="header">          
          <div>Loading header...</div>000
        </ModuleSlot>
        <div className="content">
          <ModuleSlot name="sidebar" />
          <ModuleSlot />
        </div>
        <ModuleSlot name="footer" />
      </div>
    </>);
  }
} 