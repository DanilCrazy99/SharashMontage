import 'dotenv/config';

import { Bot, session } from 'grammy';
import { Dictionary, MyContext, SessionData } from './types';
import { HelpMessage, UserMessage } from './userMessages';
import { USERS } from './config';
import { adminMainMenu, objects } from './menus';

const bot = new Bot<MyContext>(process.env.API_KEY_BOT || '');

let botId = 0;
bot.init().then(() => {
  botId = bot.botInfo.id;
});

function initial(): SessionData {
  return { state: 'idle', data: {} };
}
bot.use(session({ initial }));

bot.use(async (ctx, next) => {
  ctx.config = {
    role: USERS[ctx.from?.id || 0] ?? 'guest',
  };
  await next();
});

bot.use(adminMainMenu);

bot.command('menu', (ctx) => {
  switch (ctx.config.role) {
    case 'admin':
    case 'dev':
      ctx.reply(
        `Меню администрации${
          ctx.session.data?.name ? `\nНазвание: ${ctx.session.data?.name}` : ''
        }${
          ctx.session.data?.description
            ? `\nОписание объекта: ${ctx.session.data.description}`
            : ''
        }`,
        {
          reply_markup: adminMainMenu,
        }
      ).then((msg) => {
        ctx.session.data?.tempMsg?.push(msg.message_id)
      });
      break;
    default:
      ctx.reply('Думаешь что ты у нас такой умный. Иди отсюда!');
      break;
  }
});

// bot.command('adduser', async (ctx) => {
//   ctx.reply('Напиши id пользователя которого ты хочешь добавить', {
//     reply_markup: {
//       force_reply: true,
//     },
//   });
//   ctx.session.state = 'adduser'
// });

bot.command('help', (ctx) => {
  ctx.reply(HelpMessage[ctx.config.role]);
});

bot.on('message', (ctx) => {
  const dict: Dictionary = {
    idle: () => {
      ctx.reply('Зайди куда-нибудь. Сейчас ты ничего не делаешь');
    },
    obj_name: () => {
      if (ctx.update.message.reply_to_message?.from?.id === botId && ctx.session.state === 'obj_name') {
        if (ctx.session.data) {
          Object.assign(ctx.session.data, { name: ctx.message.text });
        }
        console.log(ctx.session.data);
        if (ctx.session.data?.tempMsg) {
          ctx.deleteMessages([...ctx.session.data.tempMsg]);
          ctx.session.data.tempMsg = [];
        }
        ctx.reply(`Меню администрации${
          ctx.session.data?.name ? `\nНазвание: ${ctx.session.data?.name}` : ''
        }${
          ctx.session.data?.description
            ? `\nОписание объекта: ${ctx.session.data.description}`
            : ''
        }`, {
          reply_markup: objects,
        });
      }
      ctx.session.state = 'idle';
    },
    obj_description: () => {
    },
    obj_money: () => {},
    obj_people: () => {},
    obj_volume: () => {},
  };
  dict[ctx.session.state]();
});

bot.command('start', async (ctx) => {
  console.log(ctx);
  await ctx.reply(UserMessage[ctx.config.role]);
  if (ctx.config.role === 'guest') {
    return;
  }
  if (ctx.config.role === 'dev') {
    console.log('hello');
  }
});

bot.api.setMyCommands([
  { command: 'help', description: 'Показать все доступные команды' },
]);

bot.start();
