import { DataFunctionArgs, LoaderArgs, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProjectBySlug, updateProjectBySlug } from "~/models/project.server";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { useEffect, useState } from "react";
import { getSession, requireUser, sessionStorage } from "~/session.server";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Project" }
  ]
}
export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser(request)
  if (user.role !== "ADMIN") {
    const session = await getSession(request)
    session.flash("error", "Must have premission to view this page.")
    redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    })
  }
  const slug = params.slug
  invariant(slug, "No slug found!")
  const project = getProjectBySlug(slug)
  invariant(project, "No project found!")
  return project
}


export default function SuperAdminProjectSlugRoute() {
  const { project } = useLoaderData<typeof loader>()
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")
  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])

  useEffect(() => {
    quill?.clipboard.dangerouslyPasteHTML(0, project.content);

  }, [quill])
  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Edit Project {project.name}</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-4">
            <Link className="p-3 bg-emerald-600" to={`/portfolio/${project.slug}`}>View Page</Link>
            <Link className="p-3 bg-red-600" to={`/api/deleteProject/${project.slug}`}>Delete Project</Link>
          </div>
          <Form method="POST" encType="multipart/form-data">
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Name*</span>
                    <br />
                    <input name="name" type="text" className="text-black" defaultValue={project.name} required />
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Link</span>
                    <br />
                    <input name="link" type="text" className="text-black" defaultValue={project.link || ""} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Slug*</span>
                    <br />
                    <input name="slug" type="text" className="text-black" defaultValue={project.slug} required />
                  </label>
                </div>
              </div>
              <div className="grid">
                <label htmlFor="image">Image</label>
                <input name="image" id="image" type="file" accept="image/*" />
              </div>
              <div className="grid gap-y-4">
                <label htmlFor="summary">Summary*</label>
                <textarea name="sumamry" id="summary" className="h-40 text-black" defaultValue={project.summary} required />
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
      </div >
    </main >
  );
};

export const action = async ({ request, params }: DataFunctionArgs) => {
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

  return await updateProjectBySlug(slug, {
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
    .catch(async (error) => {
      console.log(`Error RAN!`)
      session.flash("level", "ERROR")
      session.flash("message", "Project failed to save!")
      return redirect(`/superadmin/project/${slug}`, {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session)
        }
      })
    })

};