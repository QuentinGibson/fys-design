import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTestimonials } from "~/models/testimonial.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const testimonials = await getTestimonials()
  return json(testimonials)
};
export default function TestimonialRoute() {
  const { testimonials } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex my-20 justify-center items-center">
        <h1 className="font-body text-5xl">Testimonials</h1>
      </div>
      {testimonials.map((testimony, index) => {
        return (
          <div key={index} className="p-20 border-b ">
            <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-x-9">
              <div className="flex justify-center items-center">
                <p className="font-bold text-5xl font-body">{testimony.name}</p>
              </div>
              <div>
                <p className="font-sauce">
                  {testimony.content.split(" ").slice(0, 100).join(" ")}
                  {" ..."}
                </p>
              </div>
              <div>
                <p className="font-sauce">
                  {testimony.content.split(" ").slice(-100).join(" ")}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </main>
  );
};