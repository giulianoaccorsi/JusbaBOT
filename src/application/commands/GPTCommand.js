const axios = require("axios");

class GPTCommand {
  constructor() {
    this.command = "!gpt";
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    const body =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";

    const question = body.replace("!gpt", "").trim();

    if (!question) {
      await sock.sendMessage(jid, {
        text: "Por favor, forneça uma pergunta após o comando `!gpt`.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: question }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const gptResponse = response.data.choices[0].message.content;

      await sock.sendMessage(jid, {
        text: `🤖 *GPT diz:*\n\n${gptResponse}`,
      });
    } catch (error) {
      console.error(
        "Erro ao se comunicar com a API do GPT:",
        error.response?.data || error.message
      );
      await sock.sendMessage(jid, {
        text: "Desculpe, ocorreu um erro ao se comunicar com o GPT.",
      });
    }
  }
}

module.exports = GPTCommand;
