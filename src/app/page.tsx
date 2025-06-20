import { Suspense } from "react";
import HomePageClient from "../components/layout/HomePageClient";

async function getLastCommitInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });
    
    if (!res.ok) {
      console.error('GitHub API error:', res.status, res.statusText);
      return { commitTime: null, commitMessage: null };
    }
    
    const data = await res.json();
    return { commitTime: data.commitTime, commitMessage: data.commitMessage };
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
