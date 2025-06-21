import { PageLayout, PageSlot } from "rjs-frame";

export class GenericLayout<T extends PageLayoutProps> extends PageLayout<T> {
  renderContent() {
    return (
      <>
        <h1>Generic Layout</h1>
        <PageSlot name="header">
          <div style={{ padding: "1rem", border: "1px solid #eee" }}>
            Loading header...
          </div>
        </PageSlot>
        <div className="content">
          <PageSlot name="sidebar" condition={{ sidebar: false }}>
            <div style={{ padding: "1rem", border: "1px solid #eee" }}>
              Sidebar is Empty
            </div>
          </PageSlot>
          <PageSlot>
            <div style={{ padding: "1rem", border: "1px solid #eee" }}>
              Main is Empty
            </div>
          </PageSlot>
        </div>
        <PageSlot
          name="footer"
          condition={(params) => params.showFooter !== false}
        >
          <div style={{ padding: "1rem", border: "1px solid #eee" }}>
            Footer is Empty
          </div>
        </PageSlot>
      </>
    );
  }
}
