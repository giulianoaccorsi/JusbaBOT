class UserMentionService {
  async mentionAllInGroup(sock, jid) {
    // Obter detalhes do grupo
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;
    const mentions = participants.map((p) => p.id);

    let text = "Marcando todos:\n";

    for (let participant of participants) {
      text += `@${participant.id.split("@")[0]} `;
    }

    return { text, mentions };
  }
}

module.exports = UserMentionService;
