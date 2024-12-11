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

    const viewOnceObj =
      quoted.viewOnceMessageV2Extension ||
      quoted.viewOnceMessageV2 ||
      quoted.viewOnceMessage;

    if (!viewOnceObj) {
      await sock.sendMessage(jid, {
        text: "A mensagem citada não é de visualização única.",
      });
      return;
    }

    const realMsg = viewOnceObj.message;
    let content;

    const downloadMedia = async (mediaMessage, mediaType) => {
      try {
        const stream = await downloadContentFromMessage(
          mediaMessage,
          mediaType
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      } catch (error) {
        console.error(`Erro ao baixar mídia (${mediaType}):`, error);
        throw new Error("Falha ao processar a mídia citada.");
      }
    };

    try {
      if (realMsg.audioMessage) {
        const buffer = await downloadMedia(realMsg.audioMessage, "audio");
        content = {
          audio: buffer,
          mimetype: realMsg.audioMessage.mimetype || "audio/ogg",
          ptt: realMsg.audioMessage.ptt || false,
        };
      } else if (realMsg.imageMessage) {
        const buffer = await downloadMedia(realMsg.imageMessage, "image");
        content = {
          image: buffer,
          caption: realMsg.imageMessage.caption || "",
        };
      } else if (realMsg.videoMessage) {
        const buffer = await downloadMedia(realMsg.videoMessage, "video");
        content = {
          video: buffer,
          caption: realMsg.videoMessage.caption || "",
        };
      } else {
        await sock.sendMessage(jid, {
          text: "Tipo de mensagem viewOnce não suportado.",
        });
        return;
      }

      await sock.sendMessage(jid, content);
    } catch (err) {
      console.error("Erro ao processar o comando '!revelar':", err);
      await sock.sendMessage(jid, {
        text: "Ocorreu um erro ao tentar revelar a mensagem.",
      });
    }
  }
}

module.exports = RevealCommand;
