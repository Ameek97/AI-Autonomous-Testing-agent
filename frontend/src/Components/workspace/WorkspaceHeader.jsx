import "./WorkspaceHeader.css";

const PLACEHOLDER = {
  productName: "TestPilot",
  workspaceTitle: "Workspace",
  projectName: "checkout-api",
  github: {
    connected: true,
    label: "GitHub connected",
    account: "acme-labs",
  },
  user: {
    name: "Alex Chen",
    initials: "AC",
  },
};

function WorkspaceHeader() {
  return (
    <header className="workspace-header">
      <div className="workspace-header__left">
        <div className="workspace-header__mark" aria-hidden="true">
          TP
        </div>
        <div className="workspace-header__identity">
          <span className="workspace-header__product">{PLACEHOLDER.productName}</span>
          <span className="workspace-header__divider" aria-hidden="true">
            /
          </span>
          <span className="workspace-header__project">{PLACEHOLDER.projectName}</span>
        </div>
      </div>

      <div className="workspace-header__center">
        <h1 className="workspace-header__title">{PLACEHOLDER.workspaceTitle}</h1>
      </div>

      <div className="workspace-header__right">
        <div
          className={`workspace-header__github${PLACEHOLDER.github.connected ? " is-connected" : ""}`}
        >
          <span className="workspace-header__status-dot" aria-hidden="true" />
          <span className="workspace-header__github-copy">
            <span className="workspace-header__github-label">
              {PLACEHOLDER.github.label}
            </span>
            <span className="workspace-header__github-account">
              {PLACEHOLDER.github.account}
            </span>
          </span>
        </div>

        <div className="workspace-header__profile">
          <span className="workspace-header__avatar" aria-hidden="true">
            {PLACEHOLDER.user.initials}
          </span>
          <span className="workspace-header__user-name">{PLACEHOLDER.user.name}</span>
        </div>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
