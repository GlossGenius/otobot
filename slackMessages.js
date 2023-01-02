function getUserStrings(user) {
  return {
    short: user.slack
      ? `<@${user.slack.id}>`
      : `<${user.gh.data.html_url}|${user.gh.data.login}>`,
    long: user.slack
      ? `<@${user.slack.id}>`
      : `Slack user not found. Github user: <${user.gh.data.html_url}|${user.gh.data.login}> (Make sure your full name in GH and Slack match)`,
  };
}

export function createDeploymentNotificationMessage({
  users,
  pr,
  repo_name,
  sha1,
  workflow_url,
}) {
  const author = getUserStrings(users.author);
  const merger = getUserStrings(users.merger);

  const initialMessage = [];
  initialMessage.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${merger.short}, by merging a PR to \`main\`, has started a deployment of ${repo_name} to \`production\`
If you didn't mean to start this deployment, please go to <${workflow_url}|the workflow on CircleCI> and cancel it.

Expectations of ${merger.short}:
- They will be available for at least an hour to respond to any issues that come up. Please keep an eye on #incidents
- They will test new changes in production when the deployment is done.`,
    },
  });
  initialMessage.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*PR Title*: <${pr.data.html_url}|${pr.data.title}>`,
    },
  });
  initialMessage.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Author*: ${author.long}`,
    },
  });

  if (users.merger.gh.login !== users.author.gh.login) {
    initialMessage.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Merger*: ${merger.long}`,
      },
    });
  }

  initialMessage.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Commit*: ${sha1}`,
    },
  });
  initialMessage.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "View Build Log",
        },
        url: workflow_url,
      },
    ],
  });

  return {
    initialMessage,
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
