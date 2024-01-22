import User from './User.js';
import mdHelper from './utils/mdHelper.js';

export default class Worker extends User {
  greetings() {
    return `Привет ${this.firstname} ${this.familyname}, наш ${mdHelper.underline(this.roleName)}`;
  }
}
