import type { CustomService } from "~/models/service.server";
import { BsCheckLg, BsChevronRight } from "react-icons/bs";

export default function ServiceCard({
  service,
  flipped = true,
}: {
  service: CustomService;
  flipped: Boolean;
}) {
  return (
    <article className="mb-20 xl:mx-auto xl:w-3/4 xl:max-w-screen-xl">
      <div className="mx-auto grid max-w-lg gap-x-4 gap-y-20 xl:m-0 xl:max-w-none xl:grid-cols-2">
        <div className="col-span-1">
          <div className="h-full border-[0.8px] border-white/25">
            <div className="border-b-[0.8px] border-white/25 p-7">
              <p className="font-body text-3xl">{service.name}</p>
            </div>
            <div className="p-7">
              <p>{service.description}</p>
              <div className="py-7">
                <ul className="">
                  {service.perks.map((service, index) => {
                    return (
                      <li key={index} className="inline-block">
                        <div className="mb-3 mr-1 flex items-center gap-4 rounded-full bg-white px-4 py-3 text-primary">
                          <BsCheckLg className="text-lg" />
                          <p className="font-semibold">{service.name}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex items-baseline font-bold">
                  <p className="text-xl">Enquire Now </p>
                  <BsChevronRight className="text-sm font-bold" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`col-span-1 mx-auto flex max-w-md ${
            flipped ? "-order-1" : ""
          }`}
        >
          <img
            className="max-w-full rounded-t-full"
            src={service.image}
            alt=""
          />
        </div>
      </div>
    </article>
  );
}
