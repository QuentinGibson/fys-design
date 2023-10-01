import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getSession, requireUser, sessionStorage } from "~/session.server";
import clsx from "clsx";
import { getIndustryByID, updateIndustryById } from "~/models/industry.server";


export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Industry" }
  ]
}

export const action = async ({ request, params }: ActionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request)
  const inputId = params.id

  invariant(inputId, "No id found!")

  if (user.role !== "ADMIN") {
    session.flash("message", "No premission to complete that action")
    session.flash("level", "ERROR")
    redirect("/")
  }

  const formData = await request.formData()

  const name = formData.get("name") as string

  const inputData = { name }
  const [errors, industry] = await updateIndustryById(inputId, inputData)
  console.log("Error from updateIndustry")
  console.table(errors)
  console.log("--------------------------")
  console.log("Industry from updateIndustry")
  console.table(industry)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/testimonial`)

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
  const id = params.id
  invariant(id, "No id found!")
  const industry = await getIndustryByID(id)
  invariant(industry, "No tag found!")
  return json({ industry })
}


export default function SuperAdminProjectSlugRoute() {
  const { industry } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Edit Industry {industry.name}</h1>
      </div>
      <div>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-4">
            <Link
              className="p-3
               bg-emerald-600"
              to={`/testimonial/`}
            >
              View Page
            </Link>
            <Form
              action={`/api/deleteIndustry/${industry.id}`}
              method="POST"
            >
              <button
                className="p-3 bg-red-600"
                type="submit"
              >
                Delete Testimonials
              </button>
            </Form>
          </div>
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
                          actionData?.values.name ||
                          industry.name
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
