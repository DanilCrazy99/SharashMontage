const TelegramBot = require('node-telegram-bot-api');

export default () => {
  const bot = new TelegramBot(process.env.API_KEY_BOT, {
    polling: true,
  });
};
