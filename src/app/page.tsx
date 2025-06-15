import { Suspense } from "react";
import HomePageClient from "./_components/HomePageClient";

async function getLastCommitInfo() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/notLukaGray/portfolio/commits?sha=main&per_page=1",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 }, // ISR: revalidate every 60s
      }
    );
    
    if (!res.ok) {
      console.error('GitHub API error:', res.status, res.statusText);
      return { commitTime: null, commitMessage: null };
    }
    
    const data = await res.json();
    const commitTime = data[0]?.commit?.committer?.date || null;
    const commitMessage = data[0]?.commit?.message || null;
    return { commitTime, commitMessage };
  } catch (error) {
    console.error('Error fetching commit info:', error);
    return { commitTime: null, commitMessage: null };
  }
}

export default async function Home() {
  const { commitTime, commitMessage } = await getLastCommitInfo();
  return (
    <Suspense>
      <HomePageClient commitTime={commitTime} commitMessage={commitMessage} />
    </Suspense>
  );
}
