import { ActionArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { getSession, requireUser } from "~/session.server";
import { createProject } from "~/models/project.server";
import clsx from "clsx";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Create Project" }
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
  const link = formData.get("link") as string
  const slug = formData.get("slug") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string

  const serializedData = { name, link, slug, summary, content, image: url }

  const [errors, project] = await createProject(serializedData)
  console.log("Error from createProject")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from createProject")
  console.table(project)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/project`)

};

export default function SuperAdminProjectCreateRoute() {
  const { quill, quillRef } = useQuill();
  const navigation = useNavigation()
  const [content, setContent] = useState<string>("")
  const actionData = useActionData<typeof action>()
  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])

  useEffect(() => {
    quill?.clipboard.dangerouslyPasteHTML(0, content);

  }, [quill])
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
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Link</span>
                      <br />
                      <input
                        name="link"
                        type="text"
                        className={clsx(
                          "text-black",
                          actionData?.errors.link && "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.link}
                      />
                    </label>
                    {actionData?.errors.link &&
                      <p className="text-red-500">{actionData.errors.link}</p>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Slug*</span>
                      <br />
                      <input
                        name="slug"
                        type="text"
                        className={clsx(
                          "text-black",
                          actionData?.errors.slug && "border-2 border-red-500"
                        )}
                        defaultValue={actionData?.values.slug}
                        required />
                    </label>
                    {actionData?.errors.slug &&
                      <p className="text-red-500">{actionData.errors.slug}</p>
                    }
                  </div>
                </div>
                <div className="grid">
                  <label htmlFor="image">Image</label>
                  <input name="image" id="image" type="file" accept="image/*" />
                </div>
                <div className="grid gap-y-4">
                  <label htmlFor="summary">Summary*</label>
                  <textarea
                    name="summary"
                    id="summary"
                    className="h-40 text-black"
                    required />
                  {actionData?.errors.summary &&
                    <p className="text-red-500">{actionData.errors.summary}</p>
                  }
                </div>
                <div className="flex">
                  <div>
                    <div className="h-[1000px] w-full mb-20">
                      {
                        actionData?.errors.content &&
                        <p className="text-red-500">{actionData.errors.content}</p>
                      }
                      <div ref={quillRef} />
                      <input type="hidden" name="content" value={content} />
                    </div>
                  </div>
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