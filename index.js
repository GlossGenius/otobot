import express from "express";
import bodyParser from "body-parser";
import { sendDeployStartMessage } from "./sendDeployStartMessage.js";

const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * TODO
 * - deployment end message
 * - pr body in thread
 * - approve button
 * - templatize longer message with handlebars or something
 */
router.post("/notify_deployment_start", async (request, response) => {
  const { pr_url, slack_channel, repo_name, sha1 } = request.body;

  try {
    await sendDeployStartMessage({
      pr_url,
      slack_channel,
      repo_name,
      sha1,
    });
  } catch (e) {
    response.send(500, e);
  }

  response.send(200);
});

// add router in the Express app.
app.use("/", router);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
