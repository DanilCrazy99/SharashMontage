import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const bot = new TelegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.onText(/\/menu/, (msg) => {
  const { id, type } = msg.chat;
  if (type !== 'private') return;
  const chatId = id;
  
  console.log(msg);
  bot.sendMessage(chatId, );
});
