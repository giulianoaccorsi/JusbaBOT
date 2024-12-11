class ShutdownCommand {
  constructor() {
    this.command = "!desligar";
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;
    await sock.sendMessage(jid, { text: "Bot está desligando..." });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(0);
  }
}

module.exports = ShutdownCommand;
