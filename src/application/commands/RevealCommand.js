const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

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

    // Verifica se é viewOnceMessage ou viewOnceMessageV2
    if (!quoted.viewOnceMessage && !quoted.viewOnceMessageV2) {
      await sock.sendMessage(jid, {
        text: "A mensagem citada não é de visualização única.",
      });
      return;
    }

    const viewOnceObj = quoted.viewOnceMessageV2 || quoted.viewOnceMessage;
    const realMsg = viewOnceObj.message;
    let content;

    // Função para baixar o conteúdo da mensagem
    const downloadMedia = async (mediaMessage, mediaType) => {
      const stream = await downloadContentFromMessage(mediaMessage, mediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    };

    if (realMsg.imageMessage) {
      const buffer = await downloadMedia(realMsg.imageMessage, "image");
      content = { image: buffer, caption: realMsg.imageMessage.caption || "" };
    } else if (realMsg.videoMessage) {
      const buffer = await downloadMedia(realMsg.videoMessage, "video");
      content = { video: buffer, caption: realMsg.videoMessage.caption || "" };
    } else if (realMsg.audioMessage) {
      const buffer = await downloadMedia(realMsg.audioMessage, "audio");
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
