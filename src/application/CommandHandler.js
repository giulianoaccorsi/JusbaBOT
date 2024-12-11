const chalk = require("chalk");
const MarkAllCommand = require("./commands/MarkAllCommand");
const BrasileiraoCommand = require("./commands/BrasileiraoCommand");
const PingCommand = require("./commands/PingCommand");
const ShutdownCommand = require("./commands/ShutdownCommand");
const TabelaService = require("./services/TabelaService");
const TabelaCommand = require("./commands/TabelaCommand");
const RevealCommand = require("./commands/RevealCommand");

class CommandHandler {
  constructor(brasileiraoService, userMentionService) {
    const markAllCmd = new MarkAllCommand(userMentionService);
    const brasileiraoCmd = new BrasileiraoCommand(brasileiraoService);
    const pingCmd = new PingCommand();
    const shutdownCmd = new ShutdownCommand();
    const tabelaService = new TabelaService();
    const tabelaCmd = new TabelaCommand(tabelaService);
    const revealCmd = new RevealCommand();

    this.commands = {
      [markAllCmd.command]: markAllCmd,
      [brasileiraoCmd.command]: brasileiraoCmd,
      [pingCmd.command]: pingCmd,
      [shutdownCmd.command]: shutdownCmd,
      [tabelaCmd.command]: tabelaCmd,
      [revealCmd.command]: revealCmd,
    };
  }

  async handle(sock, message) {
    const body =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";
    const [commandName] = body.trim().split(" ");

    // Identificar informações sobre o chat e o usuário para o log
    const jid = message.key.remoteJid;
    const nomeUsuario = message.pushName || "Desconhecido";
    let nomeChat = "";

    if (jid.endsWith("@g.us")) {
      const metadata = await sock.groupMetadata(jid);
      nomeChat = metadata.subject || "Desconhecido";
    } else {
      nomeChat = "Conversa Privada";
    }

    // Se a mensagem começar com "!", consideramos como comando e fazemos o log
    if (body.startsWith("!")) {
      console.log(
        chalk.bold.red("~") + chalk.bold.white(">"),
        chalk.green(`[GRUPO - ${jid.endsWith("@g.us") ? "Grupo" : "Privado"}]`),
        "Comando:",
        chalk.blue(commandName),
        "de",
        chalk.cyan(nomeUsuario),
        "em",
        chalk.yellow(nomeChat)
      );
    }

    // Executa o comando, se existir
    if (this.commands[commandName]) {
      await this.commands[commandName].execute(sock, message);
    }
  }
}

module.exports = CommandHandler;
