const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { setupMessageController } = require("../presentation/messageController");
const qrcode = require("qrcode-terminal");
const pino = require("pino");

async function createBaileysClient(commandHandler) {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "error" }),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Escaneie o QR Code abaixo para se conectar:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("Conectado ao WhatsApp!");
      setupMessageController(sock, commandHandler);
      console.log("Bot iniciado e aguardando mensagens...");
    } else if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error &&
        lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode !== 401;
      if (shouldReconnect) {
        console.log("Tentando reconexão...");
        createBaileysClient(commandHandler);
      } else {
        console.error(
          "Conexão fechada e não será tentada a reconexão automática"
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

module.exports = { createBaileysClient };
