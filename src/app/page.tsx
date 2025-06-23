import { Suspense } from "react";
import HomePageClient from "../components/layout/HomePageClient";
import { getLatestCommit } from "@/lib/github";

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
