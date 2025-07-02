export async function getLatestCommit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
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
      },
    );

    if (!res.ok) {
      return { commitTime: null, commitMessage: null };
    }

    const data = await res.json();
    const latestCommit = data[0];

    const commitTime = latestCommit?.commit?.committer?.date || null;
    const commitMessage = latestCommit?.commit?.message || null;

    return { commitTime, commitMessage };
  } catch {
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
