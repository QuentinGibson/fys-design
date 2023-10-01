import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getIndustries } from "~/models/industry.server";
import { requireUser, getSession } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser(request)
  if (user.role !== "ADMIN") {
    const session = await getSession(request)
    session.flash("level", "ERROR")
    session.flash("message", "Must have premission to view this page.")
    redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    })
  }
  const industries = await getIndustries()
  return json({ industries })
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Super Admin All Industries" }
  ]
}

export default function SuperAdminServiceRoute() {
  const { industries } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center py-20">
        <h1 className="font-body text-4xl">View Industries</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto items-center">
        {industries.map((industry, index) => {
          return (
            <Link className="hover:underline" key={index} to={`/superadmin/industry/${industry.id}`}>{industry.name}</Link>
          )
        })}
      </div>
    </main>
  );
};