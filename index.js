const { createBaileysClient } = require("./src/infrastructure/baileysClient");
const BrasileiraoService = require("./src/application/services/BrasileiraoService");
const UserMentionService = require("./src/application/services/UserMentionService");
const CommandHandler = require("./src/application/CommandHandler");
const {
  setupMessageController,
} = require("./src/presentation/messageController");

(async () => {
  const sock = await createBaileysClient();

  const brasileiraoService = new BrasileiraoService();
  const userMentionService = new UserMentionService();
  const commandHandler = new CommandHandler(
    brasileiraoService,
    userMentionService
  );

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") {
      setupMessageController(sock, commandHandler);
      console.log("Bot iniciado e aguardando mensagens...");
    }
  });
})();

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot rodando!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor HTTP rodando na porta ${PORT}`));
