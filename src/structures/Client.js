import { Client } from "discord.js";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import chalk from "chalk";

export default class Bot extends Client {
  constructor(options) {
    super(options);
  }

  loadEvents = async (dir) => {
    const files = readdirSync(dir);

    for (const file of files) {
      const path = join(dir, file);

      if (statSync(path).isDirectory()) await this.loadEvents(path);

      if (file.endsWith(".js")) {
        const eventClass = (
          await import(`file:///${join(process.cwd(), path)}`)
        ).default;
        const event = new eventClass(this);

        this.on(event.name, event.run);
      }
    }
  };

  loadTrigger = async (trigger, dir) => {
    const files = readdirSync(dir);

    for (const file of files) {
      const path = join(dir, file);

      if (statSync(path).isDirectory()) await this.loadTrigger(trigger, path);

      if (file.endsWith(".js")) {
        const triggerClass = (
          await import(`file:///${join(process.cwd(), path)}`)
        ).default;
        const triggerObject = new triggerClass(this);

        this[trigger].push(triggerObject);
      }
    }
  };

  registryCommands = async () => {
    this.application.commands
      .set(this.commands)
      .then(() => console.log(chalk.cyan("Commands registered!")))
      .catch((e) => this.errorLog(new Error(), e));
  };

  login = async (token) => {
    await this.loadEvents("./src/events");
    console.log(chalk.cyan("Events loaded!"));

    const triggers = ["commands"];
    for (const trigger of triggers) {
      this[trigger] = [];
      await this.loadTrigger(trigger, `./src/triggers/${trigger}`);
      console.log(chalk.cyan(`${trigger} loaded!`));
    }

    await super.login(token);
  };

  errorLog = (forcedError, error) => {
    const stack = forcedError.stack.split("\n")[1].trim();

    console.log(chalk.yellow(`Error\n${stack}\n${error.stack}`));
  };
}
