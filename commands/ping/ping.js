module.exports = {
  data: {
    name: "ping",
  },
  async execute(message, args) {
    message.channel.send("Pong!");
  },
};
