import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCases } from "~/models/case.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const cases = await getCases();
  invariant(cases, "No cases found!")
  return json(cases)
};
export default function CaseStudies() {
  const { cases } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="flex justify-center items-center my-20">
        <h1 className="font-display text-lg">Case Studies</h1>
      </div>
      <div className="mx-auto max-w-[976px] grid gap-y-36 gap-x-4">
        {cases.map((caseData, index) => {
          const caseLink = `/case-studies/${caseData.slug}`
          return (
            <div key={index} className="grid md:grid-cols-[1fr_1.5fr] box-border gap-y-9">
              <div className="inline-block overflow-hidden">
                <Link className="overflow-hidden max-w-[400px] w-full" to={caseLink}>
                  <img className="hover:scale-110 hover:opacity-75 duration-1000 h-full" width={10000} src={caseData.image} alt={`A featured sample of ${caseData.name}`} />
                </Link>
              </div>

              <div className="flex justify-between p-12 flex-col items-stretch gap-y-9">
                <img className="inline-block" width={300} src={caseData.logo} alt={`The logo for ${caseData.name}`} />
                <p className="font-body text-5xl ">
                  {caseData.name}
                </p>
                <Link to={caseLink} className="font-sauce text-lg">
                  View Case Study
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  );
};