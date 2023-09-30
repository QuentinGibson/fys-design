import { ActionArgs, DataFunctionArgs, LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCaseBySlug, updateCaseBySlug } from "~/models/case.server";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { useCallback, useEffect, useState } from "react";
import { getSession, requireUser, sessionStorage } from "~/session.server";
import Dropdown from "~/components/dropdown/Dropdown";
import { getTags } from "~/models/tag.server";
import { validateHeaderValue } from "node:http";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Case" }
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
      directory: "./public/uploads/cases",
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
  let imageUrl
  if (image.filepath) {
    const publicIndex = image.filepath.indexOf("uploads") - 1
    imageUrl = image.filepath.slice(publicIndex)
  }
  const logo = formData.get("logo") as any || null

  let logoUrl
  if (logo.filepath) {
    const publicIndex = logo.filepath.indexOf("uploads") - 1
    logoUrl = logo.filepath.slice(publicIndex)
  }
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const tagsraw = formData.get("tags") as string
  const tags = JSON.parse(tagsraw)

  const inputData = { name, slug, content, logo: logoUrl, image: imageUrl, tags }

  const [errors, caseData] = await updateCaseBySlug(slug, inputData)
  console.log("Error from update")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from update")
  console.table(caseData)
  console.log("--------------------------")
  console.log()
  if (!errors) {
    session.flash("level", "SUCCESS")
    session.flash("message", "Case updated!")
    return redirect("/superadmin/case", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    })
  }

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
  const slug = params.slug
  invariant(slug, "No slug found!")
  const caseData = await getCaseBySlug(slug)
  const tags = await getTags()
  return { caseData, tags }
}


export default function SuperAdminProjectSlugRoute() {
  const { caseData, tags } = useLoaderData<typeof loader>()
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")
  const [currentDropdownValue, setCurrentDropdownValue] = useState<{ label: string, value: string }[]>(caseData?.tags.map(tag => ({ label: tag.name, value: tag.id })) || [] as { label: string, value: string }[])
  const tagOptions = tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])

  useEffect(() => {
    quill?.clipboard.dangerouslyPasteHTML(0, caseData?.content || "");

  }, [quill])

  const handleDropdownChange = useCallback((value: any) => {
    setCurrentDropdownValue(value)
  }, [setCurrentDropdownValue, currentDropdownValue])
  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Edit Case {caseData?.slug}</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-4">
            <Link className="p-3 bg-emerald-600" to={`/case-studies/${caseData?.slug}`}>View Page</Link>
            <Form
              action={`/api/deleteCase/${caseData?.id}`}
              method="GET"
            >
              <button
                className="p-3 bg-red-600"
                type="submit"
              >
                Delete Case
              </button>
            </Form>
          </div>
          <Form method="POST" encType="multipart/form-data">
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Name*</span>
                    <br />
                    <input name="name" type="text" className="text-black" defaultValue={caseData?.name} required />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Slug*</span>
                    <br />
                    <input name="slug" type="text" className="text-black" defaultValue={caseData?.slug} required />
                  </label>
                </div>
              </div>
              <div className="grid">
                <label htmlFor="logo">Logo</label>
                <input name="logo" id="logo" type="file" accept="image/*" />
              </div>
              <div className="grid">
                <label htmlFor="image">Image</label>
                <input name="image" id="image" type="file" accept="image/*" />
              </div>
              <div className="grid">
                <label htmlFor="tags">Tags</label>
                <Dropdown currentSelected={currentDropdownValue} options={tagOptions} placeHolder={"Search..."} onChange={handleDropdownChange} />
                <input type="text" hidden name="tags" value={JSON.stringify(currentDropdownValue)} />
                {/* {(actionData.errors as any).perks && <p className="text-red-500">{(actionData?.errors as any).perks}</p> } */}
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
