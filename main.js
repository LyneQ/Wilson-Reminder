const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const colors = require("colors");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${colors.yellow(client.user.tag)} !`);
});

const cronDetails = {
  morning_in: "45 8 * * 1-5",
  morning_out: "30 12 * * 1-5",
  afternoon_in: "15 13 * * 1-5",
  afternoon_out: "0 17 * * 1-5",
};

const initializeAlert = (isCheckIn = true) => {
  const checkInMessage = `🔔 <@&${process.env.MENTION_ROLE_ID}> You have **${isCheckIn ? 15 : 30} minutes** to ${isCheckIn ? `[check in](${process.env.CHECKING_URL})` : "check out"} ! Don't forget to mark your attendance before time runs out.`;
  const checkOutMessage = `⏳ <@&${process.env.MENTION_ROLE_ID}> Check-${isCheckIn ? "in" : "out"} is now closed.`;
  const timeOutDuration = {
    in: 900000,
    out: 1800000,
    testing: 6000,
  };

  client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
    console.log(`Fetched guild ${guild.name}`);

    guild.channels
      .fetch(process.env.CHECKING_CHANNEL_ID)
      .then(async (channel) => {
        console.log(`Fetched channel ${channel.name}`);
        const sentMessage = await channel.send(checkInMessage);
        setTimeout(
          () => {
            channel.messages.fetch(sentMessage.id).then((message) => {
              message.edit({ content: checkOutMessage });
            });
          },
          isCheckIn ? timeOutDuration.in : timeOutDuration.out,
        );
      })
      .catch((err) => {
        console.log(`Error fetching channel ${err}`);
      });
  });
};

for (const [key, value] of Object.entries(cronDetails)) {
  console.log(`Setting up ${key} cron job`);

  cron.schedule(value, () => {
    switch (key) {
      case "morning_in":
      case "afternoon_in":
      case "test_in":
        console.log(
          `starting ${key} task at ${new Date().toLocaleTimeString()}`,
        );
        initializeAlert(true);
        break;
      case "morning_out":
      case "afternoon_out":
      case "test_out":
        console.log(
          `starting ${key} task at ${new Date().toLocaleTimeString()}`,
        );
        initializeAlert(false);
        break;
      default:
        console.log(`invalid value for key: ${key}`.red);
    }
  });
}

client.login(process.env.BOT_TOKEN);
