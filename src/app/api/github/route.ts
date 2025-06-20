import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GitHub token not available, returning null data');
      return NextResponse.json({ commitTime: null, commitMessage: null });
    }

    const res = await fetch(
      "https://api.github.com/repos/notLukaGray/portfolio/commits?sha=main&per_page=1",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 }, // ISR: revalidate every 60s
      }
    );
    
    if (!res.ok) {
      console.error('GitHub API error:', res.status, res.statusText);
      return NextResponse.json({ commitTime: null, commitMessage: null });
    }
    
    const data = await res.json();
    const commitTime = data[0]?.commit?.committer?.date || null;
    const commitMessage = data[0]?.commit?.message || null;
    
    return NextResponse.json({ commitTime, commitMessage });
  } catch (error) {
    console.error('Error fetching commit info:', error);
    return NextResponse.json({ commitTime: null, commitMessage: null });
  }
} 