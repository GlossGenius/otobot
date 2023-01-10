import { Octokit } from "octokit";
import { WebClient } from "@slack/web-api";
import { createDeploymentNotificationMessage } from "./slackMessages.js ";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const slackClient = new WebClient(process.env.SLACK_TOKEN, {
  rejectRateLimitedCalls: true,
});

// TODO: Make this work for a direct push (no pr)
export async function sendDeployStartMessage({
  slack_channel,
  sha1,
  repo_owner,
  repo_name,
  workflow_url,
}) {
  console.log("Preparing deployment message with following params", {
    slack_channel,
    sha1,
    repo_owner,
    repo_name,
    workflow_url,
  });
  const results = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls{?per_page,page}",
    {
      owner: repo_owner,
      repo: repo_name,
      commit_sha: sha1,
    }
  );

  const incompletePrData = results.data[0];

  const pr = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: repo_owner,
      repo: repo_name,
      pull_number: incompletePrData.number,
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

  /**
   * Slack's docs doesn't say what their limit is for how
   * many users you can fetch without causing an error. We'll
   * see how long we can get away without using pagination.
   */
  const slackUserForPrAuthor = slackUsers.members.find(
    (user) => user.real_name === ghUserOfPrAuthor.data.name
  );
  const slackUserForPrMerger = slackUsers.members.find(
    (user) => user.real_name === ghUserOfPrMerger.data.name
  );

  const blocks = createDeploymentNotificationMessage({
    users: {
      author: {
        gh: ghUserOfPrAuthor,
        slack: slackUserForPrAuthor,
      },
      merger: {
        gh: ghUserOfPrMerger,
        slack: slackUserForPrMerger,
      },
    },
    pr,
    repo_name,
    sha1,
    workflow_url,
  });

  const message = await slackClient.chat.postMessage({
    channel: slack_channel,
    blocks: blocks.initialMessage,
  });

  return slackClient.chat.postMessage({
    channel: slack_channel,
    thread_ts: message.ts,
    blocks: blocks.thread,
  });
}
