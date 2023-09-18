import { ActionArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { getSession, requireUser } from "~/session.server";
import { createProject } from "~/models/project.server";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Create Project" }
  ]
}
export const action = async ({ request, params }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)

  if (user.role !== "ADMIN") {
    session.flash("error", "No premission to complete that action")
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
  let url
  if (image.filepath) {
    const publicIndex = image.filepath.indexOf("uploads") - 1
    url = image.filepath.slice(publicIndex)
  }
  const name = formData.get("name") as string
  const link = formData.get("link") as string
  const slug = formData.get("slug") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string

  return await createProject({
    image: url,
    name,
    slug,
    content,
    summary,
    link
  })
    .then(async () => {
      session.flash("level", "SUCCESS")
      session.flash("message", "Post updated sucessfully!")
      return redirect(`/superadmin/project/`, {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session)
        }
      })
    })
    .catch(async () => {
      console.log(`Error RAN!`)
      session.flash("level", "ERROR")
      session.flash("message", "Project failed to save!")
      return json({}, {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session)
        },
        status: 400
      })
    })

};

export default function SuperAdminProjectCreateRoute() {
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")
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
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Name*</span>
                    <br />
                    <input name="name" type="text" className="text-black" required />
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Link</span>
                    <br />
                    <input name="link" type="text" className="text-black" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Slug*</span>
                    <br />
                    <input name="slug" type="text" className="text-black" required />
                  </label>
                </div>
              </div>
              <div className="grid">
                <label htmlFor="image">Image</label>
                <input name="image" id="image" type="file" accept="image/*" />
              </div>
              <div className="grid gap-y-4">
                <label htmlFor="summary">Summary*</label>
                <textarea name="summary" id="summary" className="h-40 text-black" required />
              </div>
              <div className="flex">
                <div>
                  <div className="h-[1000px] w-full mb-20">
                    <div ref={quillRef} />
                    <input type="hidden" name="content" value={content} />
                  </div>
                </div>
              </div>
              <div>
                <button className="bg-black py-3 px-4" type="submit">Save Project</button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
};