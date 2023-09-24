import { LoaderArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteProjectBySlug } from "~/models/project.server";
import { getSession, sessionStorage } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const session = await getSession(request)
  const slug = params.slug
  invariant(slug, "No slug found!")

  // Find project by slug
  invariant(slug, "No slug found!")
  const [errors, deletedProject] = await deleteProjectBySlug(slug)

  // Return or show error
  if (errors) {
    session.flash("message", "Failed to delete project!")
    session.flash("level", "ERROR")
    console.log(`ERRORS`)
    console.table(errors)
    return redirect("/superadmin/project", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    })
  }
  session.flash("level", `SUCCESS`)
  session.flash("message", `${deletedProject?.name} Deleted!`)
  return redirect("/superadmin/project", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    }
  })

};
