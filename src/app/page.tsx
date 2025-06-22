import { Suspense } from "react";
import HomePageClient from "../components/layout/HomePageClient";
import { getLatestCommit } from "@/lib/github";

/**
 * The main home page of the application.
 *
 * This is a React Server Component (RSC), which allows it to perform
 * server-side operations like data fetching directly. Here, it fetches the
 * latest GitHub commit information to be displayed on the page.
 *
 * It then renders the `HomePageClient` component, which is a Client Component,
 * passing the fetched data as props. This pattern is great for performance,
 * as the server handles the data fetching, and the client handles interactivity.
 *
 * The `Suspense` boundary is included for good practice, allowing a fallback UI
 * to be shown if the client component takes time to load.
 */
export default async function Home() {
  // Fetch the latest commit details from the GitHub API on the server.
  // This happens at request time, so the data is always fresh.
  const { commitTime, commitMessage } = await getLatestCommit();

  return (
    <Suspense>
      <HomePageClient commitTime={commitTime} commitMessage={commitMessage} />
    </Suspense>
  );
}
