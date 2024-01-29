/* eslint-disable camelcase */
export default (bot, updateStateFunc) => {
  const regMap = {
    registration_name: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\nИмя Фамилия')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        updateStateFunc(userId, { status: 'name', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
    registration_phone: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\n+7987-654-1212')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        updateStateFunc(userId, { status: 'phone', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
    registration_info: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои дополнительные данные')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        updateStateFunc(userId, { status: 'info', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
    registration_confirm: (userId, appState) => bot
      .sendMessage(userId, 'Ваши данные отправлены')
      .then(() => {
        const { message_id } = appState.registration[userId];
        bot.deleteMessage(userId, message_id);
        updateStateFunc(userId, { status: 'final' });
      }),
  };
  return regMap;
};
