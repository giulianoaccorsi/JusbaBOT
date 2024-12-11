function setupMessageController(sock, commandHandler) {
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const body =
      msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    if (body.startsWith("!")) {
      try {
        await commandHandler.handle(sock, msg);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

module.exports = { setupMessageController };
