import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function Repolist( {repolist} ){

return (
    <Accordion type="single" collapsible>
      {repolist.map((repo) => {
        return (
          <AccordionItem key={repo.id} value={String(repo.id)}>
            <AccordionTrigger>
              <div>
                <h3>{repo.name}</h3>
                <p>{repo.full_name}</p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {repo.description || "No description available."}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

}

export default Repolist