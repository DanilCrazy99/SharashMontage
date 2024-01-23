export default (bot, changeState) => {
  const regMap = {
    registration_name: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\nИмя Фамилия')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        changeState(userId, { status: 'name', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
    registration_phone: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\n+7987-654-1212')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        changeState(userId, { status: 'phone', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
    registration_card: (userId, appState) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\n1234 5678 1234 5678')
      .then(({ message_id: addMsg }) => {
        const { addMsg: oldAddMsg = null, status } = appState.registration[userId];
        changeState(userId, { status: 'card', addMsg });
        return { oldAddMsg, status };
      }).then(({ oldAddMsg, status }) => {
        if (oldAddMsg && (status !== 'process')) bot.deleteMessage(userId, oldAddMsg);
      }),
  };
  return regMap;
};
