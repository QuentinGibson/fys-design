import { ActionArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { getSession, requireUser } from "~/session.server";
import { createProject } from "~/models/project.server";
import clsx from "clsx";
import { createTestimonial } from "~/models/testimonial.server";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Create Testimonial" }
  ]
}
export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)


  if (user.role !== "ADMIN") {
    session.flash("message", "No premission to complete that action")
    session.flash("level", "ERROR")
    redirect("/")
  }

  const formData = await request.formData()

  const name = formData.get("name") as string
  const content = formData.get("content") as string

  const inputData = { name, content }
  const [errors, testimonial] = await createTestimonial(inputData)
  console.log("Error from ")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from update")
  console.table(testimonial)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/testimonial`)

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
        <h1>Create Testimony</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <Form method="POST" encType="multipart/form-data">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="flex flex-col gap-8 justify-center">
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
                        defaultValue={
                          actionData?.values.name
                        }
                        required
                      />
                    </label>
                    {
                      actionData?.errors.name &&
                      <p className="text-red-500">
                        {actionData?.errors.name}
                      </p>
                    }
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="content">Content*</label>
                  <textarea name="content" id="content" className="text-black h-80"></textarea>
                  {
                    actionData?.errors.content &&
                    <p className="text-red-500">
                      {actionData?.errors.content}
                    </p>
                  }
                </div>
                <div>
                  <button
                    className="bg-black py-3 px-4"
                    type="submit"
                  >
                    {navigation.state === "submitting" ? "Saving Project" : "Save Project"}
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