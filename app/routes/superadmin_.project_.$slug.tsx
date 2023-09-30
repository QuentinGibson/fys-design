import { ActionArgs, LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProjectBySlug, updateProjectBySlug } from "~/models/project.server";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css"
import editorStyles from "~/editor.css"
import { useCallback, useEffect, useState } from "react";
import { getSession, requireUser, sessionStorage } from "~/session.server";
import clsx from "clsx";
import Dropdown from "~/components/dropdown/Dropdown";
import { getIndustries } from "~/models/industry.server";
import { getTypes } from "~/models/type.server";

export const links = () => [{ rel: "stylesheet", href: draftCSS }, { rel: "stylesheet", href: editorStyles }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Project" }
  ]
}

export const action = async ({ request, params }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)
  const inputSlug = params.slug

  invariant(inputSlug, "No slug found!")

  if (user.role !== "ADMIN") {
    session.flash("message", "No premission to complete that action")
    session.flash("level", "ERROR")
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
  const industriesRaw = JSON.parse(formData.get("industries") as string)
  const servicesRaw = JSON.parse(formData.get("services") as string)
  const industries = {
    set: industriesRaw.map((industry: Option) => ({ id: industry.value }))
  }
  const services = {
    set: servicesRaw.map((service: Option) => ({ id: service.value }))
  }

  const inputData = { name, link, slug, summary, image: url, content, industries, services }
  const [errors, project] = await updateProjectBySlug(inputSlug, inputData)
  console.log("Error from update")
  console.table(errors)
  console.log("--------------------------")
  console.log("Project from update")
  console.table(project)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/project`)

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
  const project = await getProjectBySlug(slug)
  const industries = await getIndustries()
  const services = await getTypes()
  invariant(project, "No project found!")
  return { project, industries, services }
}


export default function SuperAdminProjectSlugRoute() {
  const { project, industries, services } = useLoaderData<typeof loader>()
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")
  const navigation = useNavigation()
  const submitting = navigation.state === "submitting"
  const startingIndustries = project.industries.map(industry => ({ label: industry.name, value: industry.id }))
  const startingServices = project.services.map(service => ({ label: service.name, value: service.id }))
  const [currentIndustries, setCurrentIndustries] = useState<Option[]>(startingIndustries || [])
  const [currentServices, setCurrentServices] = useState<Option[]>(startingServices || [])
  const actionData = useActionData<typeof action>()
  const industryOptions = industries.map((industry) => ({ label: industry.name, value: industry.id }))
  const serviceOptions = services.map((service) => ({ label: service.name, value: service.id }))
  const handleIndustryChange = useCallback((value: Option[]) => {
    setCurrentIndustries(value)
    console.log(`Industry: ${JSON.stringify(value)}`)
  }, [currentIndustries, setCurrentIndustries])
  const handleServiceChange = useCallback((value: Option[]) => {
    setCurrentServices(value)
    console.log(`Services: ${JSON.stringify(value)}`)
  }, [currentServices, setCurrentServices])

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
            <Link
              className="p-3
               bg-emerald-600"
              to={`/portfolio/${project.slug}`}
            >
              View Page
            </Link>
            <Form
              action={`/api/deleteProject/${project.slug}`}
              method="GET"
            >
              <button
                className="p-3 bg-red-600"
                type="submit"
              >
                Delete Project
              </button>
            </Form>
          </div>
          <Form method="POST" encType="multipart/form-data">
            <fieldset disabled={submitting}>
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
                        defaultValue={
                          actionData?.values.name ||
                          project.name
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
                  <div className="flex flex-col gap-4">
                    <label htmlFor="">
                      <span className="text-lg">Link</span>
                      <br />
                      <input
                        name="link"
                        type="text"
                        className={clsx(
                          "text-black",
                          actionData?.errors.link &&
                          "border-2 border-red-500"
                        )}
                        defaultValue={
                          actionData?.values.link ||
                          project.link ||
                          ""
                        }
                      />
                    </label>
                    {
                      actionData?.errors.link &&
                      <p className="text-red-500">
                        {actionData?.errors.link}
                      </p>
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
                          actionData?.errors.name &&
                          "border-2 border-red-500"
                        )}
                        defaultValue={
                          actionData?.values.slug ||
                          project.slug
                        }
                        required />
                    </label>
                    {
                      actionData?.errors.slug &&
                      <p className="text-red-500">
                        {actionData?.errors.slug}
                      </p>
                    }

                  </div>
                </div>
                <div className="grid">
                  <label htmlFor="image">Image</label>
                  <input name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                  />
                </div>

                <div className="grid gap-y-4">
                  <label htmlFor="description">Industries</label>
                  <Dropdown currentSelected={startingIndustries} options={industryOptions} placeHolder={"Search..."} onChange={handleIndustryChange} />
                  <input type="text" hidden name="industries" value={JSON.stringify(currentIndustries)} />
                  {/* {actionData?.errors.industries &&
                    <p className="text-red-500">{actionData.errors.industries as string}</p>

                  } */}
                </div>
                <div className="grid gap-y-4">
                  <label htmlFor="description">Services</label>
                  <Dropdown currentSelected={startingServices} options={serviceOptions} placeHolder={"Search..."} onChange={handleServiceChange} />
                  <input type="text" hidden name="services" value={JSON.stringify(currentServices)} />
                  {/* {actionData?.errors.services &&
                    <p className="text-red-500">{actionData.errors.services as string}</p>

                  } */}
                </div>
                <div className="grid gap-y-4">
                  <label htmlFor="summary">Summary*</label>
                  <textarea
                    name="summary"
                    id="summary"
                    className={clsx(
                      "h-40 text-black",
                      actionData?.errors.summary &&
                      "border-2 border-red-500"
                    )}
                    defaultValue={
                      actionData?.values.summary ||
                      project.summary
                    }
                    required
                  />
                  {
                    actionData?.errors.summary &&
                    <p className="text-red-500">
                      {actionData?.errors.summary}
                    </p>
                  }

                </div>
                <div className="flex">
                  <div>
                    <div className="h-[1000px] w-full mb-20">

                      {
                        actionData?.errors.content &&
                        <p className="text-red-500">
                          {actionData?.errors.content}
                        </p>
                      }

                      <div ref={quillRef} />
                      <input
                        type="hidden"
                        name="content"
                        value={content}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="bg-black py-3 px-4"
                    type="submit"
                  >
                    {submitting ? "Saving Project" : "Save Project"}
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
