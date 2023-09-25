import { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ContactForm from "../components/ContactForm";
import Squiggle from "~/components/Squiggle";
import { getProjectBySlug } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "No slug found!")
  const project = await getProjectBySlug(slug)
  invariant(project, "No project found!")
  return { project }
};
; export default function ProjectSlugRoute() {
  const { project } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="grid md:grid-cols-[1fr_1.5fr] border-y min-h-[552px]">
        <div className="md:border-r border-b md:border-b-0 flex justify-center items-center p-9">
          <h1 className="text-5xl font-body">{project.name}</h1>
        </div>
        <div className="w-full max-w-[544px] gap-y-20 px-6 my-6 mx-auto justify-center content-center grid gap-x-4 grid-cols-[1fr_1fr]">
          <div>
            <p className="font-display font-bold">{project.industries.length === 1 ? "Industry" : "Industries"}</p>
            <p>
              {project.industries.map((industry, index, arr) => {
                return (
                  <span className="font-sauce text-base" key={index}>{industry.name}{index !== arr.length - 1 ? ", " : ""}</span>
                )
              })}
            </p>
          </div>
          <div>
            <p className="font-display font-bold">{project.industries.length === 1 ? "Service" : "Services"}</p>
            <p>
              {project.services.map((service, index, arr) => {
                return (
                  <span className="font-sauce text-base" key={index}>{service.name}{index !== arr.length - 1 ? ", " : ""}</span>
                )
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
        <div className="max-w-lg mx-auto my-40" dangerouslySetInnerHTML={{ __html: project.content }}></div>
      </div>
      <div className="relative my-10 py-10">
        <Squiggle />
        <ContactForm />
      </div>
    </main>
  );
}