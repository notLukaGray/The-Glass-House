export async function getLatestCommit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn(
      "GITHUB_TOKEN is not configured. Skipping GitHub API fetch. The last updated time will not be displayed.",
    );
    return { commitTime: null, commitMessage: null };
  }

  try {
    const res = await fetch(
      "https://api.github.com/repos/notLukaGray/The-Glass-House/commits?sha=main&per_page=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "the-glass-house-app",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      console.error("GitHub API fetch failed:", {
        status: res.status,
        statusText: res.statusText,
        body: errorBody,
      });
      return { commitTime: null, commitMessage: null };
    }

    const data = await res.json();
    const latestCommit = data[0];

    const commitTime = latestCommit?.commit?.committer?.date || null;
    const commitMessage = latestCommit?.commit?.message || null;

    return { commitTime, commitMessage };
  } catch (error) {
    console.error(
      "An unexpected error occurred while fetching from GitHub:",
      error,
    );
    return { commitTime: null, commitMessage: null };
  }
}

export async function getGitHubData(repoName: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GitHub token not found in environment variables");
  }

  const response = await fetch(`https://api.github.com/repos/${repoName}`, {
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "the-glass-house-app",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
