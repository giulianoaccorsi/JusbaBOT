const Papa = require("papaparse");
const fetch = require("node-fetch");

class TabelaService {
  constructor() {
    this.csvUrl =
      "https://docs.google.com/spreadsheets/d/1Tr1tacu97uOoEf-bkr50SXMlN9AlJJBj/export?format=csv&gid=1106007996";
  }

  async getTabela() {
    const response = await fetch(this.csvUrl);
    const csvText = await response.text();

    const result = Papa.parse(csvText, { header: true });
    return result.data;
  }
}

module.exports = TabelaService;
