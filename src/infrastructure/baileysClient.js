const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function createBaileysClient() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "debug" }),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log("Conectado ao WhatsApp!");
    } else if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error &&
        lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode !== 401;
      if (shouldReconnect) {
        createBaileysClient();
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
