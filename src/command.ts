import yargs from "yargs"
import { hideBin } from "yargs/helpers"

yargs(hideBin(process.argv))
  .command(
    "new <translate>",
    "Creates a new Translation",
    (yargs) => yargs.positional("translate", {
      description: "The content of the translation",
      type: "string",
    }),
    (argv) => console.log(argv.translate)
  )
    .parse()