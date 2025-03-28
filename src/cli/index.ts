import { program } from "commander";
import { registerInitCommand } from "./commands/init";
import { registerValidateCommand } from "./commands/validate";
import { registerDimensionsCommand } from "./commands/dimensions";
import { registerPropertiesCommand } from "./commands/properties";
import { registerEventsCommand } from "./commands/events";
import { registerGenerateCommand } from "./commands/generate";

// Register all commands
registerInitCommand(program);
registerValidateCommand(program);
registerDimensionsCommand(program);
registerPropertiesCommand(program);
registerEventsCommand(program);
registerGenerateCommand(program);

// Parse command line arguments
program.parse(process.argv);