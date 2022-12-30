import { Octokit } from "octokit";
import express from "express";
import bodyParser from "body-parser";
import { WebClient } from "@slack/web-api";
import { createDeploymentNotificationMessage } from "./slackMessages.js ";

const router = express.Router();
const app = express();
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const slackClient = new WebClient(process.env.SLACK_TOKEN);

router.post("/notify_deployment_start", async (request, response) => {
  console.log(request.body);

  const { pr_url } = request.body;
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
    channel: "#general",
    blocks: createDeploymentNotificationMessage(),
  });

  response.send(200);
});

// add router in the Express app.
app.use("/", router);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
