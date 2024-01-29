import User from './User.js';

export default class Guest extends User {
  greetings() {
    return `Привет ${this.roleName}.`;
  }
}
