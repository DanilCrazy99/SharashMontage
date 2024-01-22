import User from './User.js';
import mdHelper from './utils/mdHelper.js';

export default class Guest extends User {
  greetings() {
    return `Привет ${mdHelper.underline(this.roleName)}\\. Для начала тебе нужно пройти регистрацию\\.`;
  }
}
