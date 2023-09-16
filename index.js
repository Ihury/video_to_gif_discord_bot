import dotenv from "dotenv";
import chalk from "chalk";
import { GatewayIntentBits } from "discord.js";
import { Settings } from "luxon";

import Bot from "./src/structures/Client.js";

Settings.defaultZone = "America/Sao_Paulo";

process.on("unhandledRejection", (err) => {
  console.error(err);
});
process.on("uncaughtException", (err) => {
  console.error(err);
});

dotenv.config();

console.log(chalk.green("Starting server...\n"));

const client = new Bot({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.login(process.env.DISCORD_BOT_TOKEN);