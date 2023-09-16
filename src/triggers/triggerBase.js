import Trigger from "../../structures/Trigger.js";

export default class extends Trigger {
  constructor (client) {
    super(client, {
      name: "",
      description: "",
      // only for commands
      options: [],
      globalPermissions: {
        member: ["KICK_MEMBERS"],
        me: ["KICK_MEMBERS"],
      },
      channelPermissions: {
        member: ["SEND_MESSAGES"],
        me: ["SEND_MESSAGES"]
      },
      // only for prefixed commands
      aliases: [""]
    })
  }

  run = async (interaction) => {
    // do anything
  }
}