const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function createBaileysClient() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (connection === "open") {
      console.log("Conectado ao WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

module.exports = { createBaileysClient };
