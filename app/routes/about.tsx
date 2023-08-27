import { Link } from "@remix-run/react";
import ContactForm from "~/components/ContactForm";
import OrangeSquiggle from "~/components/OrangeSquiggle";
import Squiggle from "~/components/Squiggle";

export default function AboutRoute() {
  return (
    <main>
      <section className="grid mx-4 lg:grid-cols-2 lg:mx-8 lg:py-20 lg:items-center lg:gap-x-12 lg:grid">
        <div className="flex flex-col gap-8 pt-20 pb-5 mx-auto">
          <p className="font-display uppercase text-lg tracking-[1.8px] inline-block">
            We're F.Y.S
          </p>
          <p className="font-body text-4xl md:text-6xl lg:max-w-md">
            We are driven by our passion for design & results.
          </p>
          <div className="flex">
            <Link
              to="/contact"
              className="uppercase px-9 py-3 bg-white text-primary font-display tracking-widest"
            >
              Book A Consult
            </Link>
          </div>
        </div>
        <div className="relative mt-10 flex  justify-center w-11/12 sm:w-fit lg:order-first mx-auto">
          <OrangeSquiggle />
          <div className="max-w-sm">
            <img
              className="rounded-t-full w-full max-w-sm"
              src="/static/palms.jpeg"
              alt=""
            />
          </div>
        </div>
      </section>
      <section className="pt-20 lg:flex lg:gap-8 lg:justify-center mx-auto">
        <div className="flex items-center flex-col gap-4 lg:justify-center">
          <p className="uppercase font-display lg:order-last">Form</p>
          <div className="flex items-center flex-col lg:flex-row">
            <div
              id="circle"
              className="rounded-full h-[9px] w-[9px] bg-tertiary"
            ></div>
            <div
              id="line"
              className="w-[1px] h-20 lg:w-40 lg:h-[1px] bg-tertiary"
            ></div>
          </div>
        </div>
        <div
          id="center"
          className="relative flex justify-center items-center my-6"
        >
          <div className="w-52 h-52 rounded-full relative overflow-hidden ">
            <div
              id="squiggle"
              className="bg-[length:36px] w-[150%] h-[150%] absolute -top-1/4 -left-1/4 center-squiggle flex justify-center items-center"
            >
              <p className="">F.Y.S</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 lg:justify-center">
          <div className="flex items-center flex-col lg:flex-row">
            <div
              id="line"
              className="w-[1px] h-20 lg:w-40 lg:h-[1px] bg-tertiary"
            ></div>
            <div
              id="circle"
              className="rounded-full h-[9px] w-[9px] bg-tertiary"
            ></div>
          </div>
          <p className="uppercase font-display">Function</p>
        </div>
      </section>
      <section>
        <div className="my-16 max-w-2xl mx-auto">
          <p className="text-4xl leading-10 font-body lg:text-6xl lg:py-16 text-center">
            We create beautiful websites that are optimized to convert.
          </p>
        </div>
      </section>
      <section className="border-t border-tertiary">
        <div className="flex justify-center overflow-hidden">
          <div
            id="top-orange-squiggle"
            className="rounded-full w-52 h-52 orange-squiggle relative -top-28"
          ></div>
        </div>
        <div className="flex-col flex items-center gap-4 my-10">
          <p className="font-display uppercase">Our Process</p>
          <p className="font-body text-5xl">How we work</p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:max-w-2xl mx-auto">
          <div className="flex items-center flex-col mt-20">
            <div id="line" className="w-[1px] h-20 bg-tertiary"></div>
            <div
              id="circle"
              className="rounded-full h-[9px] w-[9px] bg-tertiary"
            ></div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 items-center">
              <p className="uppercase font-display">Discovery</p>
              <p className="font-body text-4xl text-center">
                We take the time to listen and immerse ourselves in your
                business and understand your goals. We strive to balance
                aesthetic and conversion optimization to ensure your investment
                produces ROI.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center flex-col mt-20">
              <div id="line" className="w-[1px] h-20 bg-tertiary"></div>
              <div
                id="circle"
                className="rounded-full h-[9px] w-[9px] bg-tertiary"
              ></div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 items-center">
                <p className="uppercase font-display">Formulation</p>
                <p className="font-body text-4xl text-center">
                  Our talented and dynamic designers will work within your brand
                  guidelines to create a detailed prototype of your new website.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center flex-col mt-20">
              <div id="line" className="w-[1px] h-20 bg-tertiary"></div>
              <div
                id="circle"
                className="rounded-full h-[9px] w-[9px] bg-tertiary"
              ></div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 items-center">
                <p className="uppercase font-display">Development</p>
                <p className="font-body text-4xl text-center">
                  After approval of the prototype, our development team will get
                  to work building your new website. Our quality assurance team
                  will complete in-depth testing to ensure a smooth launch.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center flex-col mt-20">
              <div id="line" className="w-[1px] h-20 bg-tertiary"></div>
              <div
                id="circle"
                className="rounded-full h-[9px] w-[9px] bg-tertiary"
              ></div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 items-center">
                <p className="uppercase font-display">
                  Then together we launch it
                </p>
                <div className="w-60 h-60 rounded-full relative overflow-hidden ">
                  <div
                    id="squiggle"
                    className="bg-[length:36px] w-[150%] h-[150%] absolute -left-1/4 center-squiggle flex justify-center items-center"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 relative mt-10">
        <Squiggle />
        <ContactForm />
      </section>
    </main>
  );
}
