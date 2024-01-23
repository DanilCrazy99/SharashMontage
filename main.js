/* eslint-disable camelcase */
import TelegramBot from 'node-telegram-bot-api';
import update from 'immutability-helper';
import 'dotenv/config';

import FakeDatabase from './utils/databases/fakeDatabase.js';
import controller from './users/controller.js';
import { dictionary, makeColumnMarkup } from './src/keyboards.js';
import registrationStages from './src/stages/registration.js';
import botCommands from './src/botCommands.js';

const appState = {
  registration: {},
  keyboard: {},
}; // список пользователей кто находится на этапе регистрации
// {
//   status
//   userId
//   name
//   phone
//   card
// }

const db = new FakeDatabase(process.env.DB_PATH);
db.getData();

const bot = new TelegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(botCommands);

const registration = async (id) => {
  if (Object.hasOwn(appState.registration, id)) {
    const { mainMsgId } = appState.registration[id];
    bot.deleteMessage(id, mainMsgId);
  }
  appState.registration = update(appState.registration, {
    $merge: { [id]: { status: 'started' } },
  });
  const { message_id } = await bot.sendMessage(id, 'Необходимо заполнить следующие поля:', {
    reply_markup: {
      inline_keyboard: makeColumnMarkup(dictionary.registration),
    },
  });
  appState.registration = update(
    appState.registration,
    { [id]: { $merge: { mainMsgId: message_id } } },
  );
  console.log(appState.registration[id]);
};

const changeState = (userId, status, additionalMsg) => {
  appState.registration = update(appState.registration, {
    [userId]: { $merge: { status, addMsg: additionalMsg } },
  });
};

const regMap = registrationStages(bot, changeState);

bot.on('callback_query', async (msg) => {
  const { data, from } = msg;
  const { id } = from;
  console.log('Query param: ', data);
  await regMap[data](id);
});

bot.on('message', async (msg) => {
  const { chat, text } = msg;
  const { id } = chat;
  if (/\/registration/.test(text)) {
    await registration(id);
    return;
  }
  if (/\/start/.test(text)) {
    const user = await db.getUserById(id);
    const userObj = new controller[user.role](user);
    await bot.sendMessage(id, userObj.greetings(), { parse_mode: 'MarkdownV2' });
  }
  const { [id]: userRegData = null } = appState.registration;
  if (!userRegData) return;
  const { status, addMsg: addMsgId } = userRegData;
  if (userRegData.status === 'started') return;
  const mapEffects = {
    name: async () => {
      bot.deleteMessage(id, addMsgId);
      const { name: prevName } = appState.registration[id];
      appState.registration = update(appState.registration, {
        [id]: { $merge: { status: 'process', name: text, addMsg: null } },
      });
      if (appState.registration[id].name !== prevName) {
        const { reply_markup, message_id } = await bot.editMessageReplyMarkup({
          inline_keyboard: makeColumnMarkup(
            dictionary.registration,
            { text, callback_data: 'registration_name' },
          ),
        }, { chat_id: id, message_id: appState.registration[id].mainMsgId });
        appState.keyboard = update(appState.keyboard, {
          [id]: { $set: { reply_markup, message_id } },
        });
      }
    },
    phone: async () => {
      bot.deleteMessage(id, addMsgId);
      const { phone: prevPhone } = appState.registration[id];
      appState.registration = update(appState.registration, {
        [id]: { $merge: { status: 'process', phone: text, addMsg: null } },
      });
      if (appState.registration[id].phone !== prevPhone) {
        const { reply_markup, message_id } = await bot.editMessageReplyMarkup({
          inline_keyboard: makeColumnMarkup(
            dictionary.registration,
            { text, callback_data: 'registration_phone' },
          ),
        }, { chat_id: id, message_id: appState.registration[id].mainMsgId });
        appState.keyboard = update(appState.keyboard, {
          [id]: { $set: { reply_markup, message_id } },
        });
      }
    },
    card: () => {},
  };
  mapEffects[status]();
  console.log(appState.registration[id]);
});

// bot.onText(/\/photo/, async (msg) => {
//   const { id } = msg.chat;
//   const { photos } = await bot.getUserProfilePhotos(id);
//   const { file_id } = photos[1][1];
//   console.log(await bot.getFileStream(file_id));
//   writeFile('photo', await bot.getFileStream(file_id));
// })
