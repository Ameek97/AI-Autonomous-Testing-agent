import RepoList from "./repolist"
import EmptyRepoList from "./EmptyRepoList"

function Repocard({ repolist = [] }) {


   return (
    <>
    {repolist.length > 0 ? (
      <RepoList repolist={repolist} />
    ) : (
      <EmptyRepoList />
    )}
   </>
      )

}

export default Repocard