
import { LoaderArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteCaseById } from "~/models/case.server";
import { getSession, requireUser, sessionStorage } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUser(request)
  const session = await getSession(request)
  const id = params.id

  // Find project by slug
  invariant(id, "No slug found!")
  const [errors, deletedCase] = await deleteCaseById(id)

  // Return or show error
  if (errors) {
    session.flash("message", "Failed to delete case!")
    session.flash("level", "ERROR")
    console.log(`ERRORS`)
    console.table(errors)
    return redirect("/superadmin/case", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    })
  }
  session.flash("level", `SUCCESS`)
  session.flash("message", `${deletedCase?.slug} Deleted!`)
  return redirect("/superadmin/case", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    }
  })

};
