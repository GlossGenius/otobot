#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv =
  //   .example("$0 count -f foo.js", "count the lines in the given file")
  //   .alias("f", "file")
  //   .nargs("f", 1)
  //   .describe("f", "Load a file")
  //   .demandOption(["f"])
  //   .help("h")
  //   .alias("h", "help")
  //   .epilog("copyright 2019")
  yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [options]")
    .command("count", "Count the lines in a file").argv;

console.log(argv);
