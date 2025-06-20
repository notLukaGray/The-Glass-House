import { Suspense } from "react";
import HomePageClient from "../components/layout/HomePageClient";
import { getLatestCommit } from "@/lib/github";

export default async function Home() {
  const { commitTime, commitMessage } = await getLatestCommit();
  
  return (
    <Suspense>
      <HomePageClient commitTime={commitTime} commitMessage={commitMessage} />
    </Suspense>
  );
}
