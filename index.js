import { Octokit } from "octokit";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();
const app = express();
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  response.send(pr);
});

// add router in the Express app.
app.use("/", router);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
