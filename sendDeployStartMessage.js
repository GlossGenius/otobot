import { Octokit } from "octokit";
import { WebClient } from "@slack/web-api";
import { createDeploymentNotificationMessage } from "./slackMessages.js ";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const slackClient = new WebClient(process.env.SLACK_TOKEN);

export async function sendDeployStartMessage({ pr_url, slack_channel }) {
  const parts = pr_url.split("/");

  const pr = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: parts[3],
      repo: parts[4],
      pull_number: parts[6],
    }
  );

  const ghIdOfUserPrMerger = pr.data.merged_by.login;
  const ghIdOfUserPrAuthor = pr.data.user.login;

  const ghUserOfPrAuthor = await octokit.request("GET /users/{username}", {
    username: ghIdOfUserPrAuthor,
  });
  const ghUserOfPrMerger = await octokit.request("GET /users/{username}", {
    username: ghIdOfUserPrMerger,
  });

  const slackUsers = await slackClient.users.list();

  const slackUserForPrAuthor = slackUsers.members.find(
    (user) => user.real_name === ghUserOfPrAuthor.data.name
  );

  slackClient.chat.postMessage({
    channel: slack_channel,
    blocks: createDeploymentNotificationMessage(),
  });
}
