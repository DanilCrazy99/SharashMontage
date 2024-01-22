export default {
  registration: [
    [
      {
        id: 'name',
        text: 'Имя и Фамилия',
        callback_data: 'registration_name',
      },
    ],
    [
      {
        id: 'phone',
        text: 'Номер телефона',
        callback_data: 'registration_phone',
      },
    ],
    [
      {
        id: 'card',
        text: 'Номер карты(для перевода зарплаты)',
        callback_data: 'registration_card',
      },
    ],
  ],
  // keyboard: [[{ text: 'hello' }, { text: 'hi' }]],
};
