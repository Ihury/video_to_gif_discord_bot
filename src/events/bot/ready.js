import Trigger from "../../structures/Trigger.js";

export default class extends Trigger {
  constructor (client) {
    super(client, {
      name: "ready",      
    })
  }

  run = async () => {
    console.log(this.chalk.green(`\n🤖 Bot logged in as ${this.client.user.tag}!\n`));

    this.client.registryCommands();
  }
}