const { createBaileysClient } = require("./src/infrastructure/baileysClient");
const UserMentionService = require("./src/application/services/UserMentionService");
const CommandHandler = require("./src/application/CommandHandler");
const express = require("express");
const {
  setupMessageController,
} = require("./src/presentation/messageController");

(async () => {
  const userMentionService = new UserMentionService();
  const commandHandler = new CommandHandler(userMentionService);

  await createBaileysClient(commandHandler);
})();

const app = express();

app.get("/", (req, res) => res.send("Bot rodando!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor HTTP rodando na porta ${PORT}`));
