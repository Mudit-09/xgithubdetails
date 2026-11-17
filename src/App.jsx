import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchUser = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a GitHub username.");
      setUser(null);
      return;
    }

    setError("");
    setUser(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(trimmedUsername)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("GitHub user not found. Please try again.");
        }
        throw new Error("Something went wrong. Please try again.");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message || "Unable to fetch user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <div className="github-icon" aria-hidden="true">GH</div>
          <h1>GitHub User Finder</h1>
          <p>Search a GitHub username to see profile details.</p>
        </header>

        <form onSubmit={searchUser} className="search-form">
          <input
            type="text"
            name="username"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-label="GitHub username"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        {loading && <p className="loading">Fetching GitHub profile...</p>}

        {user && (
          <section className="profile">
            <img
              className="avatar"
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
            />
            <h2>{user.name || user.login}</h2>
            <a
              className="username"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              @{user.login}
            </a>

            {user.bio && <p className="bio">{user.bio}</p>}

            {user.location && <p className="detail">📍 {user.location}</p>}
            {user.company && <p className="detail">🏢 {user.company}</p>}
            {user.blog && (
              <p className="detail">
                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                  {user.blog}
                </a>
              </p>
            )}

            <div className="stats">
              <div><strong>{user.public_repos}</strong><span>Repositories</span></div>
              <div><strong>{user.followers}</strong><span>Followers</span></div>
              <div><strong>{user.following}</strong><span>Following</span></div>
            </div>

            <a className="profile-link" href={user.html_url} target="_blank" rel="noreferrer">
              View GitHub Profile
            </a>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
