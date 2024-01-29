/* eslint-disable camelcase */
import TelegramBot from 'node-telegram-bot-api';
import update from 'immutability-helper';
import 'dotenv/config';

import FakeDatabase from './utils/databases/fakeDatabase.js';
import controller from './src/users/controller.js';
import { dictionary, makeEffect } from './src/keyboards.js';
import registrationStages from './src/stages/registration.js';
import botCommands from './src/botCommands.js';
import Guest from './src/users/classes/Guest.js';

const appState = {
  registration: {}, // список пользователей кто находится на этапе регистрации
};

const db = new FakeDatabase(process.env.DB_PATH);
db.getData();

const bot = new TelegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(botCommands);

const registration = async (id: number) => {
  if (Object.hasOwn(appState.registration, id)) {
    const { mainMsgId } = appState.registration[id];
    bot.deleteMessage(id, mainMsgId);
  }
  appState.registration = update(appState.registration, {
    $merge: { [id]: { status: 'process' } },
  });
  const { message_id } = await bot.sendMessage(id, 'Необходимо заполнить следующие поля:', {
    reply_markup: dictionary(appState.registration[id]).registration,
  });
  appState.registration = update(
    appState.registration,
    { [id]: { $merge: { message_id } } },
  );
};

const changeState = (userId: number, newObj: object, param: string) => {
  if (param) {
    const map = {
      unsetId: () => {
        appState.registration = update(appState.registration, {
          $unset: [userId],
        });
      },
    };
    map[param]();
  } else {
    appState.registration = update(appState.registration, {
      [userId]: { $merge: newObj },
    });
  }
  return appState;
};

const regMap = registrationStages(bot, changeState);

bot.on('callback_query', async (msg) => {
  const { data, from } = msg;
  const { id } = from;
  if (appState.registration[id] && data) {
    await regMap[data](id, appState);
    const map = {
      final: () => {
        const { name, phone, info } = appState.registration[id];
        db.writeData({
          [id]: {
            name, phone, info, date: new Date(),
          },
        });
      },
    };
    if (appState.registration[id].status === 'final') {
      map[appState.registration[id].status]();
      changeState(id, {}, 'unsetId');
    }
    // if (appState.registration[id].status === 'final') map.final();
  }
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
    bot.sendMessage(id, userObj.greetings()).then(() => {
      if (userObj instanceof Guest) bot.sendMessage(id, 'Для начала тебе нужно пройти\n/registration.');
    });
  }
  const { [id]: userRegData = null } = appState.registration;
  if (!userRegData) return;
  const { status } = userRegData;
  const mapEffects = {
    name: () => makeEffect(bot, appState, 'name', changeState, msg),
    phone: () => makeEffect(bot, appState, 'phone', changeState, msg),
    info: () => makeEffect(bot, appState, 'info', changeState, msg),
    process: () => {
      bot.sendMessage(id, 'Для начала пройдите регистрацию.')
        .then(({ message_id }) => {
          setTimeout(() => {
            bot.deleteMessage(id, message_id);
          }, 5000);
        });
    },
  };
  mapEffects[status]();
});
