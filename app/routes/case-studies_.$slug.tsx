import { LoaderArgs, MetaFunction, json } from "@remix-run/node";
import { Meta, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCaseBySlug } from "~/models/case.server";
import contentStyles from "~/contentStyle.css"

export const links = () => [{ rel: "stylesheet", href: contentStyles }];


export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "No slug entered!")
  const study = await getCaseBySlug(slug)
  invariant(study, "No study found!")
  return json({ study })
};

export function meta({ matches, data }: { matches: any, data: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Case Study " + data.study.name }
  ]
}

export default function CaseStudiesRoute() {
  const { study } = useLoaderData<typeof loader>()
  return (
    <main>
      <div className="grid md:grid-cols-2 px-4 pt-10 md:px-0">
        <div className="flex flex-col max-w-lg mx-auto justify-center gap-9">
          <img src={study.logo} alt="" width={300} />
          <p className="font-body text-4xl">{study.name}</p>
          <div className="flex">
            <p>{study.tags.map((currentTag, index) => {
              return (
                <div key={index} className="bg-gray-600 text-white px-6 py-3 rounded-full">
                  {currentTag.name}
                </div>
              )
            })}</p>
          </div>

        </div>
        <div className="mx-auto w-full max-w-lg">
          <div className="relative">
            <img src={study.image} width={400} alt="" className="mx-auto" />
          </div>
        </div>
      </div>
      <div className="py-20">
        <div id="case-content" className="max-w-2xl mx-auto grid gap-y-7" dangerouslySetInnerHTML={{ __html: study.content }}>
        </div>
      </div>
    </main>
  );
};