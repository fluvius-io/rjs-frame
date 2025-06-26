import { PageModule } from "rjs-frame";
import "./Footer.css";

export class Footer extends PageModule {
  constructor(props: any) {
    super(props);
  }

  renderContent() {
    const className = (this.props as any).className;

    return (
      <div className={`footer-container ${className || ""}`}>
        <div className="footer-content">
          <p className="footer-copyright">
            &copy; 2024 Invest Mate. All rights reserved.
          </p>
          <p className="footer-updated">Last updated: 2 minutes ago</p>
        </div>
      </div>
    );
  }
}
