import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ContactForm from "~/components/ContactForm";
import invariant from "tiny-invariant";
import ServiceCard from "~/components/ServiceCard";
import Squiggle from "~/components/Squiggle";
import { getServicesAndPerks } from "~/models/service.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const allServices = await getServicesAndPerks();
  invariant(allServices, "No services found!");
  return defer({
    allServices,
  });
};
export default function ServiceRoute() {
  const {
    allServices: { services },
  } = useLoaderData<typeof loader>();
  return (
    <main>
      <section className="mb-16 mt-20 lg:mb-36">
        <div className="mx-auto flex max-w-lg flex-col justify-center">
          <h1 className="text-center font-display text-lg">Sevices</h1>
          <h2 className="text-center font-body text-4xl">
            What Can For.You.Sales Do For You?
          </h2>
        </div>
      </section>
      <section>
        {services.map((service, index) => {
          const flipped = index % 2 === 1;
          return (
            <ServiceCard
              key={index}
              service={service}
              flipped={flipped}
            ></ServiceCard>
          );
        })}
      </section>
      <section className="relative py-24">
        <Squiggle />
        <ContactForm />
      </section>
    </main>
  );
}
