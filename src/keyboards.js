/* eslint-disable camelcase */
const dictionary = {
  registration: {
    inline_keyboard: [
      [{
        text: 'Имя и Фамилия',
        callback_data: 'registration_name',
      }],
      [{
        text: 'Номер телефона',
        callback_data: 'registration_phone',
      }],
      [{
        text: 'Номер карты(для перевода зарплаты)',
        callback_data: 'registration_card',
      }],
    ],
  },
};
// keyboard: [[{ text: 'hello' }, { text: 'hi' }]],
// [{text, callback_data}, {}, ...]
// newData = { text, callback_data }
const makeColumnMarkup = (objData, newData) => {
  if (newData) {
    const { callback_data: newDataCallback = null, text: newDataText } = newData;
    return objData.inline_keyboard
      .map(([{ text, callback_data }]) => (newDataCallback === callback_data
        ? [{ text: newDataText, callback_data }]
        : [{ text, callback_data }]));
  }
  return objData.inline_keyboard;
};

const makeEffect = async (bot, appState, paramName, updateStateFunc, { chat: { id }, text }) => {
  const { registration, registration: { [id]: { addMsg, reply_markup } } } = appState;
  bot.deleteMessage(id, addMsg);
  const { [paramName]: prevValue } = registration[id];
  const newState = updateStateFunc(id, { status: 'process', [paramName]: text });
  // appState.registration = update(appState.registration, {
  //   [id]: { $merge: { status: 'process', name: text, addMsg: null } },
  // });
  if (newState.registration[id][paramName] !== prevValue) {
    const { reply_markup: newMarkup, message_id } = await bot.editMessageReplyMarkup({
      inline_keyboard: makeColumnMarkup(
        reply_markup,
        { text, callback_data: `registration_${paramName}` },
      ),
    }, { chat_id: id, message_id: newState.registration[id].message_id });
    updateStateFunc(id, { reply_markup: newMarkup, message_id });
    // appState.keyboard = update(appState.keyboard, {
    //   [id]: { $set: { reply_markup, message_id } },
    // });
  }
};

export { dictionary, makeColumnMarkup, makeEffect };
