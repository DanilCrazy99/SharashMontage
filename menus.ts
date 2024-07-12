import { Menu } from '@grammyjs/menu';
import { MyContext } from './types';

const adminMainMenu = new Menu<MyContext>('root-menu')
  .submenu('Внести новый объект', 'obj-menu')
  .row()
  .submenu('Credits', 'credits-menu');

const objects = new Menu<MyContext>('obj-menu')
  .text('Название объекта', (ctx) => {
    // Устанавливаю состояние пользователя
    ctx.session.state = 'obj_name';
    // Делаю force reply для запроса названия
    ctx
      .reply(
        ctx.session.data?.name
          ? `Имя объекта: ${ctx.session.data?.name}`
          : 'Введи название объекта',
        {
          reply_markup: { force_reply: true },
          disable_notification: true,
        }
      )
      .then((msg) => {
        if (ctx.session.data) {
          Object.assign(ctx.session.data, { tempMsg: [msg.message_id] });
        }
      });
    ctx.deleteMessage();
  })
  .row()
  .text('Описание объекта')
  .row();

const settings = new Menu<MyContext>('credits-menu')
  .text('Show Credits', (ctx) => ctx.reply('Powered by grammY'))
  .back('Go Back');

adminMainMenu.register([settings, objects]);
export { adminMainMenu, objects };
