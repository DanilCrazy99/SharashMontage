/* eslint-disable camelcase */
const dictionary = {
  registration: [
    {
      text: 'Имя и Фамилия',
      callback_data: 'registration_name',
    },
    {
      text: 'Номер телефона',
      callback_data: 'registration_phone',
    },
    {
      text: 'Номер карты(для перевода зарплаты)',
      callback_data: 'registration_card',
    },
  ],
};
// keyboard: [[{ text: 'hello' }, { text: 'hi' }]],
// [{text, callback_data}, {}, ...]
// newData = { text, callback_data }
const makeColumnMarkup = (arrData, newData) => {
  if (newData) {
    const { callback_data: newDataCallback = null, text: newDataText } = newData;
    return arrData.map(({ text, callback_data }) => (newDataCallback === callback_data
      ? [{ text: newDataText, callback_data }]
      : [{ text, callback_data }]));
  }
  return arrData
    .map(({ text, callback_data }) => [{ text, callback_data }]);
};

const makeEffect = async (bot, appState, paramName, updateStateFunc, { chat: { id }, text }) => {
  const { keyboard: { addMsgId }, registration } = appState;
  bot.deleteMessage(id, addMsgId);
  const { [paramName]: prevValue } = registration[id];
  const newState = updateStateFunc('process', text);
  // appState.registration = update(appState.registration, {
  //   [id]: { $merge: { status: 'process', name: text, addMsg: null } },
  // });
  if (newState.registration[id][paramName] !== prevValue) {
    const { reply_markup, message_id } = await bot.editMessageReplyMarkup({
      inline_keyboard: makeColumnMarkup(
        dictionary.registration,
        { text, callback_data: `registration_${paramName}` },
      ),
    }, { chat_id: id, message_id: newState.registration[id].mainMsgId });
    updateStateFunc(reply_markup, message_id);
    // appState.keyboard = update(appState.keyboard, {
    //   [id]: { $set: { reply_markup, message_id } },
    // });
  }
};

export { dictionary, makeColumnMarkup, makeEffect };
