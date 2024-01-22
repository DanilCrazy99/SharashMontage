import TelegramBot from 'node-telegram-bot-api';
import update from 'immutability-helper';
import 'dotenv/config';

import FakeDatabase from './utils/databases/fakeDatabase.js';
import controller from './users/controller.js';
import keyboards from './src/keyboards.js';

const appState = {
  registration: {},
}; // список пользователей кто находится на этапе регистрации
// {
//   userId
//   name + familyname
//   number
//   cardNumber
// }

const db = new FakeDatabase(process.env.DB_PATH);
db.getData();

const bot = new TelegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands([
  {
    command: 'registration',
    description: 'Регистрация нового пользователя',
  },
  {
    command: 'stats',
    description: 'Статистика по проделанным работам',
  },
  {
    command: 'balance',
    description: 'Информация о балансе',
  },
]);

bot.onText(/\/start/, async (msg) => {
  const { id } = msg.chat;
  const user = await db.getUserById(id);
  const userObj = new controller[user.role](user);
  await bot.sendMessage(id, userObj.greetings(), { parse_mode: 'MarkdownV2' });
});

const registration = async (id) => {
  appState.registration = update(appState.registration, {
    $merge: { [id]: { status: 'started' } },
  });
  console.log(appState);
  const { message_id: msgId } = await bot.sendMessage(id, 'Необходимо заполнить следующие поля:', {
    reply_markup: {
      inline_keyboard: keyboards.registration,
    },
  });
  appState.registration = update(appState.registration, { [id]: { $merge: { msgId } } });
};

bot.onText(/\/registration/, async (msg) => {
  const { id } = msg.chat;
  registration(id);
});

const regPoints = {
  registration_name: (userId) => bot
    .sendMessage(userId, 'Введите свои данные таким образом:\nИмя Фамилия')
    .then(() => {
      appState.registration = update(appState.registration, {
        $merge: { [userId]: { status: 'name' } },
      });
    }),
  registration_phone: (userId) => bot
    .sendMessage(userId, 'Введите свои данные таким образом:\n+7987-654-1212')
    .then(() => {
      appState.registration = update(appState.registration, {
        $merge: { [userId]: { status: 'phone' } },
      });
      console.log(appState);
    }),
  registration_card: (userId) => bot
    .sendMessage(userId, 'Введите свои данные таким образом:\n1234 5678 1234 5678')
    .then(() => {
      appState.registration = update(appState.registration, {
        $merge: { [userId]: { status: 'card' } },
      });
    }),
};

bot.on('callback_query', async (msg) => {
  const { data, from } = msg;
  const { id: userId } = from;
  console.log(userId, data);
  await regPoints[data](userId);
});

// bot.onText(/\/photo/, async (msg) => {
//   const { id } = msg.chat;
//   const { photos } = await bot.getUserProfilePhotos(id);
//   const { file_id } = photos[1][1];
//   console.log(await bot.getFileStream(file_id));
//   writeFile('photo', await bot.getFileStream(file_id));
// })
