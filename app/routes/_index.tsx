import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ContactForm from "~/components/ContactForm";
import OrangeSquiggle from "~/components/OrangeSquiggle";
import OrangeSquiggleAlt from "~/components/OrangeSquiggleAlt";
import Squiggle from "~/components/Squiggle";
import { getLatestProjects } from "~/models/project.server";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "FYS Design" }];

export const loader = async ({ request, params }: LoaderArgs) => {
  const latestProjects = await getLatestProjects()
  invariant(latestProjects, "No projects found in latest projects")
  return { latestProjects }
};

export default function Index() {
  const { latestProjects } = useLoaderData<typeof loader>()
  const { projects } = latestProjects
  const user = useOptionalUser();
  return (
    <main>
      <section className="relative py-32">
        <Squiggle />
        <div className="z-10 relative mx-auto flex flex-col lg:flex-row sm:px-8 max-w-screen-lg">
          <div className="basis-[480px]">
            <span className="font-display uppercase text-lg tracking-[1.8px] mb-4 inline-block">MEET FYS</span>
            <h1 className="text-4xl mb-6 font-body md:text-6xl">We're more than just Shopify Experts</h1>
            <div className="flex flex-col gap-6 font-sauce">
              <p className="font-sauce">Pacific IQ is a highly awarded Shopify centric studio located in California. Our specialty is e-commerce, where we offer elevated design, state-of-the-art engineering, and superior service.</p>
              <p className="font-sauce">Our team is always seeking new and innovative ideas, with a vision to create practical and artistic applications of advanced technology for our clients. We cater to a wide range of businesses, including innovative startups and large corporations.</p>
              <div>
                <Link to="/contact" className="my-8 uppercase py-3 px-9 bg-white text-primary font-display tracking-[1.8px]">Book a Consult</Link>
              </div>
            </div>
          </div>
          <div className="relative mt-10 flex mx-auto justify-center w-11/12 sm:w-fit">
            <OrangeSquiggle />
            <div className="max-w-sm">
              <img className="rounded-t-full w-full max-w-sm" src="/static/palms.jpeg" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-32 font-sauce sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between max-w-screen-lg mx-auto">
          <div className="basis-[480px] lg:order-2">
            <span className="uppercase text-md mb-4 inline-block font-display tracking-[1.8px]">Services</span>
            <h1 className="text-4xl md:text-6xl mb-6 font-body">Elevate your brand</h1>
            <div className="pb-6">
              <h2 className="font-bold mb-1"> Website Design + Development </h2>
              <p>We are a team of certified Shopify Experts with specialized skills and extensive experience in creating high-quality websites that are designed to drive conversions. Our expertise enables us to work effectively to develop completely customized solutions tailored to your needs.</p>
            </div>
            <div className="py-6">
              <h2 className="font-bold mb-1"> Website Design + Development </h2>
              <p>We are a team of certified Shopify Experts with specialized skills and extensive experience in creating high-quality websites that are designed to drive conversions. Our expertise enables us to work effectively to develop completely customized solutions tailored to your needs.</p>
            </div>
            <div className="py-6">
              <h2 className="font-bold mb-1"> Website Design + Development </h2>
              <p>We are a team of certified Shopify Experts with specialized skills and extensive experience in creating high-quality websites that are designed to drive conversions. Our expertise enables us to work effectively to develop completely customized solutions tailored to your needs.</p>
            </div>
          </div>
          <div className="rounded-t-full flex justify-center w-11/12 sm:w-fit relative my-24 lg:order-1 mx-auto">
            <img className="rounded-t-full w-full max-w-sm" src="/static/service-talk.jpeg" alt="" />
            <OrangeSquiggleAlt />
          </div>
        </div>
      </section>
      <section className="py-24 font-body">
        <div className="flex flex-col items-center">
          <h1 className="text-md uppercase font-display tracking-[1.8px]">Recent Projects</h1>
        </div>
        <ul className="flex flex-col items-center gap-6 my-24">
          {projects.map((project, key) => (
            <li key={key}>
              <div className="text-center" >
                <a className="opacity-75 hover:opacity-100 transition duration-500 text-4xl" md:text-6xl href={`project/${project.id}`}>
                  {project.name}
                </a>
              </div>
            </li>))}
        </ul>
      </section>
      <section className="py-24 font-sauce text-sm max-w-lg mx-auto">
        <div className="flex">
          <div className="flex flex-col justify-center w-full text-center">
            <h1 className="text-5xl font-body text-[45px]">Client Testimonials</h1>
            <p className="py-6">Kind words from some of our favorite clients.</p>
            <button className="bg-white text-lg text-primary px-8 py-3 font-display tracking-[1.8px]">View More</button>
          </div>
          <div>
          </div>
        </div>
        
      </section>
      <section className="py-24 relative">
        <Squiggle />
        <ContactForm />
      </section>
    </main>
  );
}
