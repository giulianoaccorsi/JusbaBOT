class MarkAllCommand {
  constructor(userMentionService) {
    this.userMentionService = userMentionService;
    this.command = "!mt";
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      await sock.sendMessage(jid, {
        text: "Este comando só pode ser usado em grupos.",
      });
      return;
    }

    const metadata = await sock.groupMetadata(jid);
    const senderId = message.key.participant || message.key.remoteJid;
    const senderInGroup = metadata.participants.find((p) => p.id === senderId);

    if (
      !senderInGroup ||
      (senderInGroup.admin !== "admin" && senderInGroup.admin !== "superadmin")
    ) {
      await sock.sendMessage(jid, {
        text: "Apenas administradores podem usar este comando.",
      });
      return;
    }

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
