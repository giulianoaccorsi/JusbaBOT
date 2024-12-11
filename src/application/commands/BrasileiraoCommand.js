class BrasileiraoCommand {
  constructor(brasileiraoService) {
    this.command = "!brasileirao";
    this.brasileiraoService = brasileiraoService;
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;
    const info = this.brasileiraoService.getInfo();
    await sock.sendMessage(jid, { text: info });
  }
}

module.exports = BrasileiraoCommand;
