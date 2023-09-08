import { LoaderArgs, defer, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProjects } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const projects = await getProjects()
  invariant(projects, "No projects found! Please add projects!")
  return json(projects)
};
export default function PortfolioRoute() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center items-center my-28">
        <h1 className="font-body text-5xl">Some of our favorite projects</h1>
      </div>
      <div className="grid md:grid-cols-2 md:gap-x-6 md:gap-y-24 mx-4 items-center justify-items-center">
        {projects.map((project, index) => {
          return (
            <div className="max-w-[400px]" key={index}>
              <Link to={`/portfolio/${project.slug}`}>
                <div>
                  <div className="overflow-hidden">
                    <img className="hover:scale-110 duration-1000" src={project.image} alt={`Our featured sample of ${project.name}`} />
                  </div>
                </div>
                <p className="font-body text-3xl mt-9">{project.name}</p>
              </Link>
            </div>
          )
        })}
      </div>
    </main>
  );
};