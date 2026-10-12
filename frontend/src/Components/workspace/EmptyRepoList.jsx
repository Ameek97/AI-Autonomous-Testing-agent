import { GitBranch } from "lucide-react";
import "./EmptyRepoList.css";

function EmptyRepoList() {
  return (
    <section className="empty-repo-list">
      <div className="empty-repo-list__icon" aria-hidden="true">
        <GitBranch />
      </div>
      <h3 className="empty-repo-list__title">No repositories added yet</h3>
      <p className="empty-repo-list__description">
        Add a GitHub repository to get started with TestPilot.
      </p>
    </section>
  );
}

export default EmptyRepoList;
