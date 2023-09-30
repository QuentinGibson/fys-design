import { LoaderArgs, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { getSession, requireUser } from "~/session.server";
import { MouseEvent } from "react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser(request)
  if (user.role !== "ADMIN") {
    const session = await getSession(request)
    session.flash("message", "Please log in before going to this page.")
    session.flash("level", "ERROR")
    return redirect("/login")
  }
  return null
};
export default function SuperAdminRoute() {
  function handleInitClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    if (!window.confirm("This action will reset the entire site! Only use if you know what you're doing. Would you like to proceed?")) {
      event.preventDefault()
    }
  }
  return (
    <main>
      <div className="flex flex-col items-center gap-4 py-20">
        <h1 className="text-4xl font-body">Admin Portal</h1>
        <div>
          <Form method="GET" action="/api/init">
            <button
              type="submit"
              onClick={(event) => { handleInitClick(event) }}
              className="hover:underline hover:text-red-500"
            >
              Repopulate
            </button>
          </Form>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-9 md:grid-flow-col">
          <div className="flex flex-col gap-3">
            <p className="font-body text-2xl underline underline-offset-4">Portfolio</p>
            <div className="flex flex-col gap-2">
              <Link className="hover:underline" to="/superadmin/project/create">Create Project</Link>
              <Link className="hover:underline" to="/superadmin/project/">View Projects</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body text-2xl underline underline-offset-4">Services</p>
            <div className="flex flex-col gap-2">
              <Link className="hover:underline" to="/superadmin/service/create">Create Services</Link>
              <Link className="hover:underline" to="/superadmin/service/">View Services</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body text-2xl underline underline-offset-4">Case Studies</p>
            <div className="flex flex-col gap-2">
              <Link className="hover:underline" to="/superadmin/case/create">Create Case</Link>
              <Link className="hover:underline" to="/superadmin/case/">View Case</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body text-2xl underline underline-offset-4">Testimonies</p>
            <div className="flex flex-col gap-2">
              <Link className="hover:underline" to="/superadmin/testimonial/create">Create Testimonies</Link>
              <Link className="hover:underline" to="/superadmin/testimonial/">View Testimonies</Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body text-2xl underline underline-offset-4">Tags</p>
            <div className="flex flex-col gap-2">
              <Link className="hover:underline" to="/superadmin/tag/create">Create Tag</Link>
              <Link className="hover:underline" to="/superadmin/tag/">View Tags</Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};