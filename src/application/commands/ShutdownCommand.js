class ShutdownCommand {
  constructor() {
    this.command = "!desligar"; // Gatilho do comando
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;
    // Antes de desligar, envie uma mensagem de confirmação
    await sock.sendMessage(jid, { text: "Bot está desligando..." });

    // Aguarde um pouco (opcional)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Desliga o processo
    process.exit(0);
  }
}

module.exports = ShutdownCommand;
