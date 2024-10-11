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

    const alertMessage =  `🔔 @everyone You have **${ isCheckIn ? 15 : 30 } minutes** to check ${ isCheckIn ? 'in' : 'out' } ! Don't forget to mark your attendance before time runs out.`
    const alertMessageSkrike = `⏳ @everyone Check-in is now closed.`

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
                },  isCheckIn ? 900000 : 1800000);

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
                case 'morning_in':
                    case'afternoon_in':
                    initializeAlert(true)
                    break;
                case 'morning_out':
                    case'afternoon_out':
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