import express from "express";
import bodyParser from "body-parser";
import { sendDeployStartMessage } from "./sendDeployStartMessage.js";

const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post("/notify_deployment_start", async (request, response) => {
  const { pr_url, slack_channel } = request.body;

  await sendDeployStartMessage({ pr_url, slack_channel });

  response.send(200);
});

// add router in the Express app.
app.use("/", router);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
