import { cssBundleHref } from "@remix-run/css-bundle";
import clsx from "clsx";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getUser, getSession, sessionStorage } from "~/session.server";
import stylesheet from "~/tailwind.css";
import themeStylesheet from "~/theme.css";
import { ThemeProvider, useTheme } from "./utils/theme-provider";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";

export function meta() {
  return [
    { title: "FYS" }
  ]
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: themeStylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request);
  const message: flashMessage = {
    level: session.get("level"),
    message: session.get("message")
  }
  return json({
    user: await getUser(request), message
  },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
};

function Body() {
  const [theme] = useTheme();
  const { message } = useLoaderData<typeof loader>();
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    setTimeout(() => setVisible(false), 5000)
  })
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Layout message={message}>

          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Body />
    </ThemeProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <h1>We're sorry, theres a huge error</h1>
        <div>
          <p>Status: {error.status}</p>
          <p>{error.statusText}</p>
        </div>
        <div>
          <p>{error.data.message}</p>
        </div>
      </main>
    )
  }

  let errorMessage = "Unknown Error"
  return (
    <main>
      <h1>We're sorry, theres a huge error</h1>
      <p>{errorMessage}</p>
      {/*@ts-ignore*/}
      {error.message &&
        /*@ts-ignore*/
        <p>{error.message}</p>
      }
    </main>
  )
}