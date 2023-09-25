import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ContactForm({ services }: { services: any }) {
  const contactFetcher = useFetcher()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const isLoading = contactFetcher.state === "loading"
    const isSubmitting = contactFetcher.state === "submitting"

    if (isLoading) {
      const response = contactFetcher.data
      if (response) {
        console.log(`--- contact.state: SENT -------`)
        console.log(response)
        // If there are no errors, reset the form
        if (!response.errors) {
          if (formRef.current) formRef.current.reset()
        }
      }
    }
  }, [contactFetcher])
  return (
    <div className="max-w-lg mx-auto font-sauce">
      <div className="bg-secondary text-primary">
        <div className="flex flex-col items-center py-6 gap-4">
          <h3 className="text-4xl w-3/4 text-center mb-8 font-body">Ready to get started?</h3>
          <p className="w-4/5 text-center">Schedule a free consultation with our team today.</p>
          {
            (!contactFetcher.data?.errors && contactFetcher?.data) && <p className="text-emerald-300 bg-gray-700 py-2 px-4">Sent successfully! We got your message!</p>

          }
        </div>
        <contactFetcher.Form ref={formRef} method="POST" action={"/api/newcontact"}>
          <div className="py-6 mx-4 grid grid-flow-row gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col text-sm">
                <label className="font-bold mb-2" htmlFor="firstName">First Name*</label>
                <input
                  className={clsx(
                    "py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20",
                    contactFetcher.data?.errors?.firstName && "border-2 border-red-500"
                  )}
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                />
                {
                  contactFetcher.data?.errors?.firstName &&
                  <p className="text-red-500">{contactFetcher.data?.errors?.firstName}</p>}
              </div>
              <div className="flex flex-col text-sm">
                <label className="font-bold mb-2" htmlFor="lastName">Last Name*</label>
                <input
                  className={clsx(
                    "py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20",
                    contactFetcher.data?.errors?.lastName && "border-2 border-red-500"
                  )}
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  name="lastName"
                  required
                />
                {
                  contactFetcher.data?.errors?.lastName &&
                  <p className="text-red-500">{contactFetcher.data?.errors?.lastName}</p>
                }
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2 text-sm" htmlFor="service">Service you are interested in*</label>
              <select
                name="service"
                className={clsx(
                  "py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20",
                  contactFetcher.data?.errors?.serviceId && "border-2 border-red-500"
                )}
                placeholder="Service you are interested in"
                id="service"
                required
              >
                {
                  services && services.map(
                    useMemo(() => (service: any, index: number) => {
                      return (
                        <option key={index} value={service.id}>
                          {service.name}
                        </option>
                      )
                    }, [])
                  )
                }
              </select>
              {
                contactFetcher.data?.errors?.serviceId &&
                <p className="text-red-500">{contactFetcher.data?.errors?.serviceId}</p>
              }
            </div>
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2 text-sm" htmlFor="email">Email Address*</label>
              <input
                className={clsx(
                  "py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20",
                  contactFetcher.data?.errors?.email && "border-2 border-red-500"
                )}
                type="text"
                id="email"
                name="email"
                placeholder="Email Address"
                required
              />
              {
                contactFetcher.data?.errors?.email &&
                <p className="text-red-500">{contactFetcher.data?.errors?.email}</p>
              }
            </div>
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2 text-sm" htmlFor="message">Message*</label>
              <textarea
                name="message"
                id="message"
                className={clsx(
                  "w-full h-20 p-6",
                  contactFetcher.data?.errors?.message && "border-2 border-red-500"
                )}
              ></textarea>
              {
                contactFetcher.data?.errors?.message &&
                <p className="text-red-500">
                  {contactFetcher.data?.errors?.message}
                </p>
              }
            </div>
            <div className="flex flex-col">
              <button type="submit" className="py-3 px-6 bg-primary text-white font-bold text-lg">Submit</button>
            </div>
            <div className="flex flex-col">
              <p className="text-primary text-[12px] font-medium">* We don't share your data.</p>
            </div>
          </div>
        </contactFetcher.Form>
      </div>
    </div>
  );
};