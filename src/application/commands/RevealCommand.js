class RevealCommand {
  constructor() {
    this.command = "!revelar";
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    const contextInfo = message.message.extendedTextMessage?.contextInfo;
    if (!contextInfo || !contextInfo.quotedMessage) {
      await sock.sendMessage(jid, {
        text: "Use este comando respondendo a uma mensagem de visualização única.",
      });
      return;
    }

    const quoted = contextInfo.quotedMessage;

    if (!quoted.viewOnceMessage) {
      await sock.sendMessage(jid, {
        text: "A mensagem citada não é de visualização única.",
      });
      return;
    }

    const realMsg = quoted.viewOnceMessage.message;
    let content;

    if (realMsg.imageMessage) {
      // Imagem
      const buffer = await sock.downloadMediaMessage({
        message: { imageMessage: realMsg.imageMessage },
      });
      content = { image: buffer, caption: realMsg.imageMessage.caption || "" };
    } else if (realMsg.videoMessage) {
      // Vídeo
      const buffer = await sock.downloadMediaMessage({
        message: { videoMessage: realMsg.videoMessage },
      });
      content = { video: buffer, caption: realMsg.videoMessage.caption || "" };
    } else if (realMsg.audioMessage) {
      // Áudio
      const buffer = await sock.downloadMediaMessage({
        message: { audioMessage: realMsg.audioMessage },
      });
      // Se quiser marcar como áudio de voz (PTT), inclua `ptt: true`
      content = { audio: buffer, mimetype: "audio/ogg", ptt: true };
    } else {
      await sock.sendMessage(jid, {
        text: "Tipo de mensagem viewOnce não suportado.",
      });
      return;
    }

    await sock.sendMessage(jid, content);
  }
}

module.exports = RevealCommand;
