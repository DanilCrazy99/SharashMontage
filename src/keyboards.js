/* eslint-disable camelcase */
const dictionary = (regState) => ({
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
        text: regState.card ?? 'Номер карты(для перевода зарплаты)',
        callback_data: 'registration_card',
      }],
    ],
  },
});

const makeEffect = async (bot, appState, paramName, updateStateFunc, { chat: { id }, text }) => {
  const { registration, registration: { [id]: { addMsg } } } = appState;
  bot.deleteMessage(id, addMsg);
  const { [paramName]: prevValue } = registration[id];
  const newState = updateStateFunc(id, { status: 'process', [paramName]: text });
  if (newState.registration[id][paramName] !== prevValue) {
    const { reply_markup: newMarkup, message_id } = await bot.editMessageReplyMarkup(dictionary(
      newState.registration[id],
    ).registration, { chat_id: id, message_id: newState.registration[id].message_id });
    updateStateFunc(id, { reply_markup: newMarkup, message_id });
  }
};

export { dictionary, makeEffect };
