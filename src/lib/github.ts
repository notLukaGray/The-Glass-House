/**
 * Fetches the latest commit information from the GitHub API.
 * This function is designed to be called from server-side environments (Server Components, API Routes).
 */
export async function getLatestCommit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GitHub token is not configured. Skipping fetch.');
    return { commitTime: null, commitMessage: null };
  }

  try {
    const res = await fetch(
      "https://api.github.com/repos/notLukaGray/portfolio/commits?sha=main&per_page=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        // Revalidate every hour
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const errorBody = await res.json();
      console.error('GitHub API fetch failed:', { status: res.status, body: errorBody });
      return { commitTime: null, commitMessage: null };
    }

    const data = await res.json();
    const latestCommit = data[0];
    
    const commitTime = latestCommit?.commit?.committer?.date || null;
    const commitMessage = latestCommit?.commit?.message || null;

    return { commitTime, commitMessage };

  } catch (error) {
    console.error('An unexpected error occurred while fetching from GitHub:', error);
    return { commitTime: null, commitMessage: null };
  }
} 