function getUserString(user) {
  return user.slack
    ? `<@${user.slack.id}>`
    : `Slack user not found. Github user: ${user.gh.login} (Make sure your full name in GH and Slack match)`;
}

export function createDeploymentNotificationMessage({
  users,
  pr,
  repo_name,
  sha1,
}) {
  const author = getUserString(users.author);

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Deploying a new version of ${repo_name} to \`production\``,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Commit*: ${sha1}`,
        },
        {
          type: "mrkdwn",
          text: `*Author*: ${author}`,
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View Build Log",
          },
          url: "https://app.circleci.com/pipelines/asdf",
        },
      ],
    },
  ];
}
