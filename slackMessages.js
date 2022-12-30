export function createDeploymentNotificationMessage() {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Deploying a new version of `$CIRCLE_PROJECT_REPONAME` to `production`",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Project*: $CIRCLE_PROJECT_REPONAME",
        },
        {
          type: "mrkdwn",
          text: "*Branch*: $CIRCLE_BRANCH",
        },
        {
          type: "mrkdwn",
          text: "*Commit*: $CIRCLE_SHA1",
        },
        {
          type: "mrkdwn",
          text: "*Author*: $CIRCLE_USERNAME",
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
