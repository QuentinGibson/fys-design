
import { ActionArgs, LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getSession, requireUser, sessionStorage } from "~/session.server";
import clsx from "clsx";
import { getServiceByID, updateService } from "~/models/service.server";
import Dropdown from "~/components/dropdown/Dropdown";
import { useCallback, useState } from "react";
import { getPerks } from "~/models/perk.server";


export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Service" }
  ]
}

export const action = async ({ request, params }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)
  const inputId = params.id

  invariant(inputId, "No slug found!")

  if (user.role !== "ADMIN") {
    session.flash("message", "No premission to complete that action")
    session.flash("level", "ERROR")
    redirect("/")
  }

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 10_000_000,
      directory: "./public/uploads/services",
      avoidFileConflicts: true,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const image = formData.get("image") as any || null
  let url
  if (image.filepath) {
    const publicIndex = image.filepath.indexOf("uploads") - 1
    url = image.filepath.slice(publicIndex)
  }
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const perkraw = formData.get("perk") as any
  console.log(perkraw)

  const inputData = { name, description, image }
  const [errors, service] = await updateService(inputId, inputData)
  console.log("Error from update")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from update")
  console.table(service)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/service`)

};

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
  const id = params.id
  invariant(id, "No id found!")
  const service = await getServiceByID(id)
  invariant(service, "No project found!")
  const perks = await getPerks()
  return { service, perks }
}


export default function SuperAdminProjectSlugRoute() {
  const { service, perks } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [currentPerks, setCurrentPerks] = useState<Perk[]>([])
  const navigation = useNavigation()
  const perkOptions = perks.map((perk: any) => ({ label: perk.label, value: perk.id }))

  const handlePerksChange = useCallback((value: any) => {
    setCurrentPerks(value)
  }, [setCurrentPerks, currentPerks])
  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Edit Service {service.name}</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-4">
            <Link
              className="p-3
               bg-emerald-600"
              to={`/services`}
            >
              View Page
            </Link>
            <Form
              action={`/api/deleteService/${service.id}`}
              method="GET"
            >
              <button
                className="p-3 bg-red-600"
                type="submit"
              >
                Delete Service
              </button>
            </Form>
          </div>
          <Form method="POST" encType="multipart/form-data">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="flex flex-col gap-8">
                <div className="grid">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Name*</span>
                      <br />
                      <input
                        name="name"
                        type="text"
                        className={clsx(
                          "text-black",
                          "md:w-80",
                          actionData?.errors.name && "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.name || service.name}
                        required />
                    </label>
                    {actionData?.errors.name &&
                      <p className="text-red-500">{actionData.errors.name}</p>
                    }
                  </div>
                </div>
                <div className="grid">
                  <label htmlFor="image">Image</label>
                  <input name="image" id="image" type="file" accept="image/*" />
                </div>
                <div className="grid">
                  <label htmlFor="image">Perks</label>
                  <Dropdown options={perkOptions} placeHolder={"Search..."} onChange={handlePerksChange} />
                  <input type="text" hidden name="perks" value={JSON.stringify(currentPerks)} />
                  {/* {(actionData.errors as any).perks && <p className="text-red-500">{(actionData?.errors as any).perks}</p> } */}
                </div>
                <div className="grid gap-y-4">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    className="h-40 text-black"
                    defaultValue={actionData?.values.description || service.description}
                    required
                  />
                  {actionData?.errors.description &&
                    <p className="text-red-500">{actionData.errors.description}</p>
                  }
                </div>
                <div>
                  <button
                    className="bg-black py-3 px-4"
                    type="submit"
                  >
                    {
                      navigation.state === "submitting"
                        ? "Saving Project" : "Save Project"
                    }
                  </button>
                </div>
              </div>
            </fieldset>
          </Form>
        </div>
      </div >
    </main >
  );
};
