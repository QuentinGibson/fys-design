
import { LoaderArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteTagByID } from "~/models/tag.server";
import { getSession, requireUser, sessionStorage } from "~/session.server";

export const action = async ({ request, params }: LoaderArgs) => {
  await requireUser(request)
  const session = await getSession(request)
  const id = params.id

  // Find project by slug
  invariant(id, "No slug found!")
  const [errors, deletedTag] = await deleteTagByID(id)

  // Return or show error
  if (errors) {
    session.flash("message", "Failed to delete case!")
    session.flash("level", "ERROR")
    console.log(`ERRORS`)
    console.table(errors)
    return redirect("/superadmin/tag", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    })
  }
  session.flash("level", `SUCCESS`)
  session.flash("message", `${deletedTag?.name} Deleted!`)
  return redirect("/superadmin/tag", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    }
  })

};

export const loader = async ({ request, params }: LoaderArgs) => {
  return redirect("/superadmin/tag")
};