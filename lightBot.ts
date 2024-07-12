import 'dotenv/config';

import { Bot, session } from 'grammy';
import { MyContext, SessionData } from './types';
import { writeFile, readFile } from 'fs/promises';

const db = { data: {} };
readFile('./logs', 'utf-8')
  .then((data) => {
    Object.assign(db.data, JSON.parse(data));
  })
  .catch(console.log);

const bot = new Bot<MyContext>(process.env.API_KEY_BOT || '');

function initial(): SessionData {
  return { state: 'idle', data: {} };
}
bot.use(session({ initial }));

bot.use(async (ctx, next) => {
  ctx.config = {
    role: 'guest',
  };
  await next();
});

bot.api.setMyCommands([
  { command: 'work', description: 'Нажимаешь когда начинаешь работу' },
  { command: 'end', description: 'Нажимаешь когда закончил работу' },
]);

bot.command('work', (ctx) => {
  console.log(ctx.from);
  Object.assign(db.data, {
    [Date.now()]: {
      id: ctx.from?.id,
      name: ctx.from?.first_name,
      username: ctx.from?.username,
      status: 'started',
    },
  });
  writeFile('./logs', JSON.stringify(db.data));
  ctx.reply('Ты начал работу');
});

bot.command('end', (ctx) => {
  console.log(ctx.from);
  Object.assign(db.data, {
    [Date.now()]: {
      id: ctx.from?.id,
      name: ctx.from?.first_name,
      username: ctx.from?.username,
      status: 'finished',
    },
  });
  writeFile('./logs', JSON.stringify(db.data));
  ctx.reply('Ты закончил работу');
});
bot.start();
