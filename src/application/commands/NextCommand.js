class NextCommand {
  constructor(tabelaService) {
    this.command = "!next";
    this.tabelaService = tabelaService;
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    const body =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";

    const match = body.match(/!next (\d+)/);
    if (!match) {
      await sock.sendMessage(jid, {
        text: "Por favor, forneça o número da rodada no formato `!next <número>`.",
      });
      return;
    }

    const rodada = parseInt(match[1], 10);

    try {
      const tabela = await this.tabelaService.getNext();

      if (!tabela || tabela.length === 0) {
        await sock.sendMessage(jid, {
          text: "Não encontrei nenhum dado na tabela.",
        });
        return;
      }

      const jogosDaRodada = tabela.filter(
        (row) => parseInt(row["PARTIDA"], 10) === rodada
      );

      if (jogosDaRodada.length === 0) {
        await sock.sendMessage(jid, {
          text: `Não encontrei jogos para a rodada ${rodada}.`,
        });
        return;
      }

      let textoResposta = `*Jogos da Rodada ${rodada}:*\n\n`;

      jogosDaRodada.forEach((jogo) => {
        const confronto = jogo["Confronto"] || "Confronto desconhecido";
        textoResposta += `${confronto}\n`;
      });

      await sock.sendMessage(jid, { text: textoResposta });
    } catch (error) {
      console.error("Erro ao processar o comando !next:", error);
      await sock.sendMessage(jid, {
        text: "Ocorreu um erro ao processar a tabela.",
      });
    }
  }
}

module.exports = NextCommand;
