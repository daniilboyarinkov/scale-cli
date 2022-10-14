#!/usr/bin/env node
import { Command } from "commander"
import * as packageJson from "../../package.json"
import { constructOutputPath } from "../utils/constructOutputPath"

import { fileSizer } from "../utils/fileSizer"

const program = new Command()

program
  .name("scale-cli")
  .description(packageJson.description)
  .version(packageJson.version)

program
  .command("scale")
  .argument("<inputPath>", "Path to input file")
  // .option("-i, --input <inputPath>")
  .option("-c, --coefficient <k>", "Scale Coefficient. Default: 2", "2")
  .option("-o, --output <outputPath>", "Path to output file")
  .action((input, options) => {
    let outputPath = options.output?.trim()
    if (!outputPath) outputPath = constructOutputPath(input)

    const coefficient = options.coefficient ?? "2"
    fileSizer(input, outputPath, +coefficient)
  })

program.parse()
