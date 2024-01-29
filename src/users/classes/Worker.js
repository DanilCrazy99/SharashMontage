import User from './User.js';

export default class Worker extends User {
  greetings() {
    return `Привет ${this.firstname} ${this.familyname}, наш ${this.roleName}`;
  }
}
