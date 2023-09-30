import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteService } from "~/models/service.server";
import { getSession, requireUser, sessionStorage } from "~/session.server";

export const action = async ({ request, params }: ActionArgs) => {
  await requireUser(request)
  const session = await getSession(request)
  const id = params.id
  invariant(id, "No ID found!")

  const [errors, deletedService] = await deleteService(id).catch(error => {
    throw error
  })

  if (errors) {
    session.flash("message", "Failed to delete project!")
    session.flash("level", "ERROR")
    console.log(`ERRORS`)
    console.table(errors)
    return redirect("/superadmin/service", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    })
  }
  session.flash("level", `SUCCESS`)
  session.flash("message", `${deletedService?.name} Deleted!`)
  return redirect("/superadmin/service", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    }
  })
}

export const loader = async ({ request, params }: LoaderArgs) => {
  return redirect("/superadmin/service")
};