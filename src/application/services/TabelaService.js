const Papa = require("papaparse");
const fetch = require("node-fetch");

class TabelaService {
  constructor() {
    // Substitua SEU_ID e SUA_GID pela sua planilha e aba
    this.csvUrl =
      "https://docs.google.com/spreadsheets/d/1Tr1tacu97uOoEf-bkr50SXMlN9AlJJBj/export?format=csv&gid=1106007996";
  }

  async getTabela() {
    // Faz o fetch do CSV
    const response = await fetch(this.csvUrl);
    const csvText = await response.text();

    // Parseia o CSV
    const result = Papa.parse(csvText, { header: true });

    // result.data será um array de objetos, ex:
    // [
    //   { "Colocação": "1", "Nome": "Gustavo", "Vitórias": "1", "Empates": "0", "Derrotas": "0", "Pontos": "3", "Saldo": "3" },
    //   ...
    // ]
    return result.data;
  }
}

module.exports = TabelaService;
