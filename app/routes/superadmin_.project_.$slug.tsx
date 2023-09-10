import { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProjectBySlug } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "No slug found!")
  const project = getProjectBySlug(slug)
  invariant(project, "No project found!")
  return project
};

export default function SuperAdminProjectSlugRoute() {
  const { project } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Edit Project {project.name}</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <Form>
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Name</span>

                    <br />
                    <input type="text" className="text-black" defaultValue={project.name} />
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Link</span>
                    <br />
                    <input type="text" className="text-black" defaultValue={project.link || ""} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label htmlFor="">
                    <span className="text-lg">Slug</span>
                    <br />
                    <input name="slug" type="text" className="text-black" defaultValue={project.slug} />
                  </label>
                </div>
              </div>
              <div className="grid">
                <label htmlFor="">Image</label>
                <input type="file" />
              </div>
              <div className="grid gap-y-4">
                <label htmlFor="">Summary</label>
                <textarea className="h-40 text-black" defaultValue={project.summary} />
              </div>
              <div className="flex">
                <div className="flex">
                  <Link className="bg-black p-4 rounded" to={`/superadmin/project/${project.slug}/editcontext`} >Edit Context</Link>
                </div>
              </div>
            </div>



          </Form>
        </div>

      </div>
    </main>
  );
};