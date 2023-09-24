import { ActionArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { requireUser, getSession } from "~/session.server";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { createService } from "~/models/service.server";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

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

  const serializedData = { name, description, image: url }

  const [errors, service] = await createService(serializedData)
  console.log("Error from createService")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from createService")
  console.table(service)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/service`)

};


export default function SuperAdminServiceCreateRoute() {
  const navigation = useNavigation()
  const [content, setContent] = useState<string>("")
  const actionData = useActionData<typeof action>()
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
                          actionData?.errors.name &&
                          "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.name}
                        required />
                    </label>
                    {actionData?.errors.name &&
                      <p className="text-red-500">
                        {actionData.errors.name}
                      </p>
                    }
                  </div>
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Description*</span>
                      <br />
                      <input
                        name="link"
                        type="text"
                        className={clsx(
                          "text-black",
                          actionData?.errors.description &&
                          "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.description}
                      />
                    </label>
                    {actionData?.errors.link &&
                      <p className="text-red-500">
                        {actionData.errors.link}
                      </p>
                    }
                  </div>
                </div>
                <div className="grid">
                  <label htmlFor="image">Image</label>
                  <input
                    name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                  />
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
  )
};