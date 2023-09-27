import { ActionArgs, LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getSession, requireUser } from "~/session.server";
import clsx from "clsx";
import { createService } from "~/models/service.server";
import { getPerks } from "~/models/perk.server";
import invariant from "tiny-invariant";


export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Create Service" }
  ]
}
export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)

  if (user.role !== "ADMIN") {
    session.flash("message", "No premission to complete that action")
    session.flash("level", "Error")
    redirect("/")
  }

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 10_000_000,
      directory: "./public/uploads/projects",
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
  let url: string = ""
  if (image.filepath) {
    const publicIndex = image.filepath.indexOf("uploads") - 1
    url = image.filepath.slice(publicIndex)
  }
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  const serializedData = { name, image: url, description }

  const [errors, service] = await createService(serializedData)
  console.log("Error from createService")
  console.table(errors)
  console.log("--------------------------")
  console.log("Service from createService")
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
  const perks = await getPerks()
  return { perks }
};

export default function SuperAdminProjectCreateRoute() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  const { perks } = useLoaderData<typeof loader>()
  const perkOptions = perks.map(perk => ({ label: perk.name, value: perk.id }))
  const options = [
    { label: "test1", value: "test1" },
    { label: "test2", value: "test2" },
    { label: "test3", value: "test3" },
    { label: "test4", value: "test4" }
  ]

  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Create Project</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <Form method="POST" encType="multipart/form-data">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Name*</span>
                      <br />
                      <input
                        name="name"
                        type="text"
                        className={clsx(
                          "text-black",
                          actionData?.errors.name && "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.name}
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
                <div className="grid gap-y-4">
                  <label htmlFor="description">Perks</label>

                  {actionData?.errors.description &&
                    <p className="text-red-500">{actionData.errors.description}</p>
                  }
                </div>
                <div className="grid gap-y-4">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    className="h-40 text-black"
                    required />
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
      </div>
    </main>
  );
};