import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getTypes } from "~/models/type.server";
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
  const types = await getTypes()
  return json({ types })
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Super Admin All Types" }
  ]
}

export default function SuperAdminServiceRoute() {
  const { types } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center py-20">
        <h1 className="font-body text-4xl">View Types</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto items-center">
        {types.map((types, index) => {
          return (
            <Link className="hover:underline" key={index} to={`/superadmin/type/${types.id}`}>{types.name}</Link>
          )
        })}
      </div>
    </main>
  );
};