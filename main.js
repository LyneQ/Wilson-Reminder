const { Client, GatewayIntentBits } = require('discord.js')
const cron = require('node-cron');

const colors = require('colors');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {

    console.log(`Logged in as ${colors.yellow(client.user.tag)} !`);

    sendReminder()

});

const cronDetails = {
    morning_in: "45 8 * * 1-5",
    morning_out: "30 12 * * 1-5",
    afternoon_in: "15 13 * * 1-5",
    afternoon_out: "0 17 * * 1-5",
}


const initializeAlert = (isCheckIn = true) => {

    const alertMessage =  `hi @everyone, it's time to [check ${isCheckIn ? 'in' : 'out' }](${process.env.CHECKING_URL}) ! `
    const alertMessageSkrike = `hi @everyone, time to ~~check ${isCheckIn ? 'in' : 'out' }~~ is over ! `

    client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
        console.log(`Fetched guild ${guild.name}`);
        guild.channels.fetch(process.env.CHECKING_CHANNEL_ID)
            .then(async (channel) => {
                console.log(`Fetched channel ${channel.name}`);
                const sentMessage = await channel.send(alertMessage);

                setTimeout(() => {
                    channel.messages.fetch(sentMessage.id).then((message) => {
                       message.edit({ content: alertMessageSkrike })
                    })
                },  isCheckIn ? 9000000 : 18000000);

            }).catch((err) => {
            console.log(`Error fetching channel ${err}`);
        });
    })

}


function sendReminder(channel, message) {

    for (const [key, value] of Object.entries(cronDetails)) {
        console.log(`Setting up ${key} cron job`);

        cron.schedule(value, () => {

            switch (key) {
                case 'morning_in' || 'afternoon_in':
                    initializeAlert(true)
                    break;
                case 'morning_out'  || 'afternoon_out':
                    initializeAlert(false);
                    break;
                default:
                    console.log(`invalid value for key: ${key}`.red);
            }
            console.log(`Running ${key} cron job`);
        });
    }

}


client.login(process.env.BOT_TOKEN);