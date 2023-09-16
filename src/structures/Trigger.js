import chalk from "chalk";

export default class Trigger {
  constructor(client, options) {
    this.client = client;
    Object.assign(this, options);
    this.chalk = chalk;
  }
}