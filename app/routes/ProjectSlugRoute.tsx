import { useLoaderData } from "@remix-run/react";
import ContactForm from "~/components/ContactForm";
import Squiggle from "~/components/Squiggle";
import { loader } from "./portfolio_.$slug";

export default function ProjectSlugRoute() {
  const { project } = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="grid grid-cols-[1fr_1.5fr] border-y min-h-[552px]">
        <div className="border-r flex justify-center items-center p-9">
          <h1 className="text-5xl font-body">{project.name}</h1>
        </div>
        <div className="w-full max-w-[544px] gap-y-20 px-6 my-6 mx-auto justify-center content-center grid gap-x-4 grid-cols-[1fr_1fr]">
          <div>
            <p className="font-display font-bold">{project.industries.length === 1 ? "Industry" : "Industries"}</p>
            <p>
              {project.industries.map((industry, index, arr) => {
                return (
                  <span className="font-sauce text-base" key={index}>{industry.name}{index !== arr.length - 1 ? ", " : ""}</span>
                );
              })}
            </p>
          </div>
          <div>
            <p className="font-display font-bold">{project.industries.length === 1 ? "Service" : "Services"}</p>
            <p>
              {project.services.map((service, index, arr) => {
                return (
                  <span className="font-sauce text-base" key={index}>{service.name}{index !== arr.length - 1 ? ", " : ""}</span>
                );
              })}
            </p>
          </div>
          <div>
            <p className="font-display font-bold">Link</p>
            <p>
              {project.link}
            </p>
          </div>
          <div>
            <p className="font-display font-bold">Summary</p>
            <p>
              {project.summary}
            </p>
          </div>
        </div>
      </div>
      <div>
        {project.content}
      </div>
      <div>
        <Squiggle />

        <ContactForm />
      </div>
    </main>
  );
}
