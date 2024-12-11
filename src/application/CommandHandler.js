const chalk = require("chalk");
const MarkAllCommand = require("./commands/MarkAllCommand");
const PingCommand = require("./commands/PingCommand");
const ShutdownCommand = require("./commands/ShutdownCommand");
const TabelaService = require("./services/TabelaService");
const TabelaCommand = require("./commands/TabelaCommand");
const RevealCommand = require("./commands/RevealCommand");
const GPTCommand = require("./commands/GPTCommand");

class CommandHandler {
  constructor(brasileiraoService, userMentionService) {
    const markAllCmd = new MarkAllCommand(userMentionService);
    const pingCmd = new PingCommand();
    const shutdownCmd = new ShutdownCommand();
    const tabelaService = new TabelaService();
    const tabelaCmd = new TabelaCommand(tabelaService);
    const revealCmd = new RevealCommand();
    const gptCmd = new GPTCommand();

    this.commands = {
      [markAllCmd.command]: markAllCmd,
      [pingCmd.command]: pingCmd,
      [shutdownCmd.command]: shutdownCmd,
      [tabelaCmd.command]: tabelaCmd,
      [revealCmd.command]: revealCmd,
      [gptCmd.command]: gptCmd,
    };

    this.blockedUsers = ["5511958072575@s.whatsapp.net"];
  }

  async handle(sock, message) {
    const body =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";
    const [commandName] = body.trim().split(" ");

    const jid = message.key.remoteJid;
    const participant = message.key.participant || jid;
    const nomeUsuario = message.pushName || "Desconhecido";
    let nomeChat = "";

    if (jid.endsWith("@g.us")) {
      const metadata = await sock.groupMetadata(jid);
      nomeChat = metadata.subject || "Desconhecido";
    } else {
      nomeChat = "Conversa Privada";
    }

    if (this.blockedUsers.includes(participant)) {
      console.log(
        chalk.bold.red("~") + chalk.bold.white(">"),
        chalk.green(`[${jid.endsWith("@g.us") ? "Grupo" : "Privado"}]`),
        chalk.red("Comando bloqueado:"),
        chalk.blue(commandName),
        "de",
        chalk.cyan(nomeUsuario),
        "em",
        chalk.yellow(nomeChat)
      );
      await sock.sendMessage(jid, {
        text: `Desculpe, ${nomeUsuario}, você está bloqueado e não pode usar comandos.`,
      });
      return;
    }

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

    if (this.commands[commandName]) {
      await this.commands[commandName].execute(sock, message);
    }
  }
}

module.exports = CommandHandler;
