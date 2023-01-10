#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { sendDeployStartMessage } from "./sendDeployStartMessage.js";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <command> [options]")
  .command(
    "notify-deploy-start",
    "Sends message to Slack that deployment is starting"
  )
  .command(
    "notify-deploy-end",
    "Sends message to Slack that deployment is starting"
  )
  .option("slack_channel")
  .option("sha1")
  .option("repo_owner")
  .option("repo_name")
  .option("workflow_url")
  .demandOption([
    "slack_channel",
    "repo_owner",
    "repo_name",
    "sha1",
    "workflow_url",
  ])
  .help("h")
  .alias("h", "help").argv;

const commandString = argv._[0];

async function execute() {
  if (commandString === "notify-deploy-start") {
    try {
      await sendDeployStartMessage(argv);
      console.log("Done");
    } catch (e) {
      console.error(e);
    }
  } else if (commandString === "notify-deploy-end") {
    //TODO
  }
}

execute();
