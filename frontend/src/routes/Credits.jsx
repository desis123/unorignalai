import React from "react";

const Credits = () => {
  const creditsList = [
    { name: "Tegh Mehta", role: "Developer" },
    { name: "Preyansh Dutta", role: "Developer" },
    { name: "Andres Prada", role: "Developer" },
  ];

  const sourcesList = [
    {
      name: "React documentation",
      url: "https://reactjs.org/docs/getting-started.html",
    },
    { name: "Stack Overflow", url: "https://stackoverflow.com/" },
    { name: "GitHub", url: "https://github.com/" },
    { name: "Auth0 Documentation", url: "https://auth0.com/" },
    { name: "GitHub Copilot / OpenAI", url: "https://copilot.github.com/" },
    { name: "C09 Labs", url: "" },
    { name: "Icons", url: "https://icons8.com/" },
    {
      name: "letsencrypt-docker-compose",
      url: "https://github.com/evgeniy-khist/letsencrypt-docker-compose",
    },
  ];

  return (
    <div>
      <h2>Credits</h2>
      <ul>
        {creditsList.map((credit, index) => (
          <li key={index}>
            {credit.name} - {credit.role}
          </li>
        ))}
      </ul>

      <h2>Sources</h2>
      <ul>
        {sourcesList.map((source, index) => (
          <li key={index}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Credits;
