class MarkAllCommand {
  constructor(userMentionService) {
    this.userMentionService = userMentionService;
    this.command = "!marcar"; // gatilho do comando
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    // Verificar se é grupo
    if (!jid.endsWith("@g.us")) {
      await sock.sendMessage(jid, {
        text: "Este comando só pode ser usado em grupos.",
      });
      return;
    }

    // Obter metadados do grupo
    const metadata = await sock.groupMetadata(jid);
    const senderId = message.key.participant || message.key.remoteJid;
    // Caso message.key.participant não exista, use remoteJid (em conversas 1-1 não há participant)

    // Procurar o sender nos participantes do grupo
    const senderInGroup = metadata.participants.find((p) => p.id === senderId);

    // Verificar se o usuário é admin ou superadmin
    if (
      !senderInGroup ||
      (senderInGroup.admin !== "admin" && senderInGroup.admin !== "superadmin")
    ) {
      await sock.sendMessage(jid, {
        text: "Apenas administradores podem usar este comando.",
      });
      return;
    }

    // Se for admin, então executar o comando de marcar
    const result = await this.userMentionService.mentionAllInGroup(sock, jid);
    if (typeof result === "string") {
      await sock.sendMessage(jid, { text: result });
    } else {
      await sock.sendMessage(jid, {
        text: result.text,
        mentions: result.mentions,
      });
    }
  }
}

module.exports = MarkAllCommand;
