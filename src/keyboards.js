/* eslint-disable camelcase */
const dictionary = (regState) => {
  const { name, phone } = regState;
  return {
    registration: {
      inline_keyboard: [
        [{
          text: regState.name ?? 'Имя и Фамилия',
          callback_data: 'registration_name',
        }],
        [{
          text: regState.phone ?? 'Номер телефона',
          callback_data: 'registration_phone',
        }],
        [{
          text: regState.info ?? 'Дополнительная информация',
          callback_data: 'registration_info',
        }],
        name && phone ? [{
          text: 'Подтвердить отправку✅',
          callback_data: 'registration_confirm',
        }] : [],
      ],
    },
  };
};

const makeEffect = (bot, appState, paramName, updateStateFunc, { chat: { id }, text }) => {
  const { registration, registration: { [id]: { addMsg } } } = appState;
  bot.deleteMessage(id, addMsg);
  const { [paramName]: prevValue } = registration[id];
  const newState = updateStateFunc(id, { status: 'process', [paramName]: text });
  if (newState.registration[id][paramName] !== prevValue) {
    bot.editMessageReplyMarkup(dictionary(
      newState.registration[id],
    ).registration, { chat_id: id, message_id: newState.registration[id].message_id });
  }
};

export { dictionary, makeEffect };
