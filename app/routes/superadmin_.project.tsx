import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getProjects } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const projects = await getProjects()
  return json(projects)
};
export default function SuperAdminProjectRoute() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center py-20">
        <h1 className="font-body text-4xl">View Projects</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto items-center">
        {projects.map((project, index) => {
          return (
            <Link className="hover:underline" key={index} to={`/superadmin/project/${project.slug}`}>{project.name}</Link>
          )
        })}
      </div>
    </main>
  );
};