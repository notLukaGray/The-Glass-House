import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isDebug = searchParams.get('debug') === 'true';
    
    const token = process.env.GITHUB_TOKEN;

    // --- Start Temporary Debugging ---
    if (isDebug) {
      console.log('--- GITHUB API DEBUG ---');
      console.log(`Token Type: ${typeof token}`);
      console.log(`Token Exists: ${!!token}`);
      if (token) {
        console.log(`Token Length: ${token.length}`);
        console.log(`Token Starts With: ${token.substring(0, 4)}...`);
      }
      console.log('------------------------');
    }
    // --- End Temporary Debugging ---

    if (!token) {
      console.warn('GitHub token not available, returning null data');
      return NextResponse.json({
        error: 'GitHub token not configured on the server.',
        commitTime: null,
        commitMessage: null,
      });
    }

    const res = await fetch(
      "https://api.github.com/repos/notLukaGray/portfolio/commits?sha=main&per_page=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 }, // ISR: revalidate every 60s
      }
    );
    
    if (!res.ok) {
      const errorBody = await res.json();
      console.error('GitHub API error:', { status: res.status, statusText: res.statusText, body: errorBody });
      return NextResponse.json({
        error: 'Failed to fetch from GitHub API.',
        details: errorBody,
        commitTime: null,
        commitMessage: null,
      }, { status: res.status });
    }
    
    const data = await res.json();
    const commitTime = data[0]?.commit?.committer?.date || null;
    const commitMessage = data[0]?.commit?.message || null;
    
    return NextResponse.json({ commitTime, commitMessage });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in GitHub API route:', errorMessage);
    return NextResponse.json({
      error: 'An internal server error occurred.',
      details: errorMessage,
      commitTime: null,
      commitMessage: null,
    }, { status: 500 });
  }
} 