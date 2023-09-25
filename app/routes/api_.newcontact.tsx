import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { createContactFormSubmission } from "~/models/contactFormSubmission.server";
import { getSession } from "~/session.server";

export const action = async ({ request, params }: DataFunctionArgs) => {
  const session = await getSession(request)

  const formData = await request.formData()

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const service = formData.get("service") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string
  const inputData = { firstName, lastName, serviceId: service, email, message }
  let [errors, res] = await createContactFormSubmission(inputData)
  // errors = { lastName: "This is a test error", serviceId: "Test error", message: "Test error", email: "test error" }
  console.log("Error from create contact")
  console.table(errors)
  console.log("--------------------------")
  console.log("Contact from create")
  console.table(res)
  console.log("--------------------------")
  if (errors) {
    const values = Object.fromEntries(formData)
    return json({ errors, values })
  }
  return json({ errors: null, values: res })

};