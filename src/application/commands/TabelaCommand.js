class TabelaCommand {
  constructor(tabelaService) {
    this.command = "!tabela";
    this.tabelaService = tabelaService;
  }

  async execute(sock, message) {
    const jid = message.key.remoteJid;

    try {
      const tabela = await this.tabelaService.getTabela();

      if (!tabela || tabela.length === 0) {
        await sock.sendMessage(jid, {
          text: "Não encontrei nenhum dado na tabela.",
        });
        return;
      }

      tabela.sort((a, b) => {
        const pontosA = parseInt(a["Pontos"], 10) || 0;
        const pontosB = parseInt(b["Pontos"], 10) || 0;
        const saldoA = parseInt(a["Saldo Final"], 10) || 0;
        const saldoB = parseInt(b["Saldo Final"], 10) || 0;

        if (pontosB !== pontosA) {
          return pontosB - pontosA;
        }
        return saldoB - saldoA;
      });

      let textoResposta = "*PokeEmpaticos 🏆*\n\n";

      for (let i = 0; i < tabela.length; i++) {
        const linha = tabela[i];

        const posicao = i + 1;
        const nome = linha["Nome"] || "Desconhecido";
        const vitorias = linha["Vitórias"] || "0";
        const empates = linha["Empates"] || "0";
        const derrotas = linha["Derrotas"] || "0";
        const pontos = linha["Pontos"] || "0";
        const saldo = linha["Saldo Final"] || "0";

        textoResposta +=
          `*${posicao}º* ${nome}\n` +
          `Vitórias: ${vitorias} | Empates: ${empates} | Derrotas: ${derrotas}\n` +
          `Pontos: ${pontos} | Saldo: ${saldo}\n\n`;
      }

      await sock.sendMessage(jid, { text: textoResposta });
    } catch (error) {
      console.error("Erro ao obter tabela do CSV:", error);
      await sock.sendMessage(jid, {
        text: "Ocorreu um erro ao obter a tabela.",
      });
    }
  }
}

module.exports = TabelaCommand;
