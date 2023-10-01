import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession, requireUser } from "~/session.server";
import clsx from "clsx";
import { createType } from "~/models/type.server";


export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Create Type" }
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

  const inputData = { name }
  const [errors, type] = await createType(inputData)
  console.log("Error from createType")
  console.table(errors)
  console.log("--------------------------")
  console.log("Type from createType")
  console.table(type)
  console.log("--------------------------")
  console.log()
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return redirect(`/superadmin/type`)

};

export default function SuperAdminProjectCreateRoute() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  return (
    <main>
      <div className="flex justify-center font-body text-4xl md:text-6xl py-20">
        <h1>Create Type</h1>
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