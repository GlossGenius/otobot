function getUserString(user) {
  return user.slack
    ? `<@${user.slack.id}>`
    : `Slack user not found. Github user: <${user.gh.data.html_url}|${user.gh.data.login}> (Make sure your full name in GH and Slack match)`;
}

export function createDeploymentNotificationMessage({
  users,
  pr,
  repo_name,
  sha1,
}) {
  console.log(pr.data.body);
  const author = getUserString(users.author);
  return {
    initialMessage: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Deploying a new version of ${repo_name} to \`production\``,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*PR Title*: <${pr.data.html_url}|${pr.data.title}>`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Author*: ${author}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Commit*: ${sha1}`,
        },
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
    ],
    thread: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*The pull request description follows a different markdown format than Slack, so it might look weird.*`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: pr.data.body,
        },
      },
    ],
  };
}
