/**
 * Fetches the latest commit information from a specific GitHub repository.
 * This function is designed to be called from server-side environments like
 * Server Components or API Routes, as it uses a private access token.
 *
 * It leverages Next.js's built-in `fetch` for server-side caching and revalidation,
 * ensuring the GitHub API is not called on every single request.
 *
 * @returns {Promise<{commitTime: string | null, commitMessage: string | null}>}
 *          An object containing the timestamp and message of the latest commit,
 *          or null values if the fetch fails or is skipped.
 */
export async function getLatestCommit() {
  const token = process.env.GITHUB_TOKEN;

  // If the GitHub token isn't set, we skip the fetch entirely.
  // This prevents errors during local development or in environments where the
  // token is not configured.
  if (!token) {
    console.warn(
      "GITHUB_TOKEN is not configured. Skipping GitHub API fetch. The last updated time will not be displayed.",
    );
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
        // This is a key Next.js feature. It tells Next.js to cache the result
        // of this fetch request for 3600 seconds (1 hour). Subsequent calls
        // within this window will receive the cached data instantly without
        // hitting the GitHub API again.
        next: { revalidate: 3600 },
      },
    );

    // If the response is not successful, log the error and return nulls.
    // This handles cases like an invalid token or GitHub API downtime gracefully.
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({})); // Avoid crashing if error body isn't JSON
      console.error("GitHub API fetch failed:", {
        status: res.status,
        statusText: res.statusText,
        body: errorBody,
      });
      return { commitTime: null, commitMessage: null };
    }

    const data = await res.json();
    const latestCommit = data[0];

    // Safely access the nested properties of the commit data.
    const commitTime = latestCommit?.commit?.committer?.date || null;
    const commitMessage = latestCommit?.commit?.message || null;

    return { commitTime, commitMessage };
  } catch (error) {
    console.error(
      "An unexpected error occurred while fetching from GitHub:",
      error,
    );
    // Return nulls for any other unexpected errors (e.g., network issues).
    return { commitTime: null, commitMessage: null };
  }
}

/**
 * Fetches GitHub repository data using the GitHub API.
 * Requires a GitHub token for authentication.
 */
export async function getGitHubData(repoName: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GitHub token not found in environment variables");
  }

  const response = await fetch(`https://api.github.com/repos/${repoName}`, {
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "portfolio-app",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
