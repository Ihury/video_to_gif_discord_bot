import Trigger from "../../structures/Trigger.js"


export default class extends Trigger {
  constructor(client) {
    super(client, {
      name: 'interactionCreate',
      description: 'Triggers when an interaction is created'
    })
  }

  run = async (interaction) => {
    if (!interaction.guild) return

    if (interaction.isCommand() || interaction.isMessageContextMenuCommand()) {
      const command = this.client.commands.find((c) => c.name === interaction.commandName)

      if (!command) return

      command.run(interaction)
    } 
  }
}