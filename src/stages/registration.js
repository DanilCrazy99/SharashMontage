export default (bot, changeState) => {
  const regMap = {
    registration_name: (userId) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\nИмя Фамилия')
      .then(({ message_id: additionalMsg }) => {
        changeState(userId, 'name', additionalMsg);
      }),
    registration_phone: (userId) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\n+7987-654-1212')
      .then(({ message_id: additionalMsg }) => {
        changeState(userId, 'phone', additionalMsg);
      }),
    registration_card: (userId) => bot
      .sendMessage(userId, 'Введите свои данные таким образом:\n1234 5678 1234 5678')
      .then(({ message_id: additionalMsg }) => {
        changeState(userId, 'card', additionalMsg);
      }),
  };
  return regMap;
};
