import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import "./repolist.css"

const formatUpdated = (value) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function Repolist( {repolist} ){

return (
    <Accordion type="single" collapsible className="repo-accordion">
      {repolist.map((repo) => {
        const updated = formatUpdated(repo.updated_at)
        const description = repo.description || "No description available."
        const descriptionClass = repo.description
          ? "repo-accordion__description"
          : "repo-accordion__description is-empty"

        return (
          <AccordionItem key={repo.id} value={String(repo.id)} className="repo-accordion__item">
            <AccordionTrigger className="repo-accordion__trigger">
              <div className="repo-accordion__summary">
                <p className="repo-accordion__name">{repo.name}</p>
                <p className="repo-accordion__fullname">{repo.full_name}</p>
                <p className={descriptionClass}>{description}</p>
                <div className="repo-accordion__meta">
                  {repo.language ? (
                    <span className="repo-accordion__chip">{repo.language}</span>
                  ) : null}
                  <span className={repo.private ? "repo-accordion__chip repo-accordion__chip--private" : "repo-accordion__chip"}>
                    {repo.private ? "Private" : "Public"}
                  </span>
                  {updated ? (
                    <span className="repo-accordion__updated">Updated {updated}</span>
                  ) : null}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <p className={repo.description ? "repo-accordion__body" : "repo-accordion__body is-empty"}>
                {description}
              </p>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

}

export default Repolist
