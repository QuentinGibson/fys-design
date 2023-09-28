import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getCases } from "~/models/case.server";
import { getProjects } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const cases = await getCases()
  return json(cases)
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Super Admin All Projects" }
  ]
}

export default function SuperAdminProjectRoute() {
  const { cases } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center py-20">
        <h1 className="font-body text-4xl">View Cases</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto items-center">
        {cases.map((case, index) => {
          return (
        <Link className="hover:underline" key={index} to={`/superadmin/project/${project.slug}`}>{project.name}</Link>
        )
        })}
      </div>
    </main>
  );
};