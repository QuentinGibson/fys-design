import { ActionArgs, LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getSession, requireUser } from "~/session.server";
import clsx from "clsx";
import { createService } from "~/models/service.server";
import { getPerks } from "~/models/perk.server";
import invariant from "tiny-invariant";
import Dropdown from "~/components/dropdown/Dropdown";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";




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
  const perksraw = formData.get("perks") as string
  const perks = JSON.parse(perksraw)

  const serializedData = {
    name,
    image: url,
    description,
    perks: perks.map((perk: any) => perk.value)
  }

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

type Perk = string

export default function SuperAdminProjectCreateRoute() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  const { perks } = useLoaderData<typeof loader>()
  const [currentPerks, setCurrentPerks] = useState<Perk[]>([])
  const selectRef = useRef<HTMLSelectElement>(null)
  const perkOptions = useMemo(() => {
    return perks.map(perk => ({ label: perk.name, value: perk.id }))
  }, [perks])

  const handlePerksChange = useCallback((value: any) => {
    setCurrentPerks(value)
  }, [setCurrentPerks, currentPerks])

  useEffect(() => {
    if (selectRef.current) {
      console.log(selectRef.current.value)
    }
  })

  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Create Service</h1>
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
                  <Dropdown options={perkOptions} placeHolder={"Search..."} onChange={handlePerksChange} />
                  <input type="text" hidden name="perks" value={JSON.stringify(currentPerks)} />
                  {actionData?.errors.perks &&
                    <p className="text-red-500">{actionData.errors.perks as string}</p>

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