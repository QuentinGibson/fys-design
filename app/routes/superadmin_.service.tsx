
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getServices } from "~/models/service.server";
import { getTestimonials } from "~/models/testimonial.server";
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
  const services = await getServices()
  return json({ services })
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Super Admin All Services" }
  ]
}

export default function SuperAdminServiceRoute() {
  const { services } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center py-20">
        <h1 className="font-body text-4xl">View Services</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto items-center">
        {services.map((service, index) => {
          return (
            <Link className="hover:underline" key={index} to={`/superadmin/service/${service.id}`}>{service.name}</Link>
          )
        })}
      </div>
    </main>
  );
};