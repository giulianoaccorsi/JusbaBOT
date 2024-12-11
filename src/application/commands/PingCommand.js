class PingCommand {
  constructor() {
    this.command = "!ping";
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;
    await sock.sendMessage(jid, { text: "pong" });
  }
}

module.exports = PingCommand;
