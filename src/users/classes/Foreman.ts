import User from './User.js';

export default class Foreman extends User {
  greetings() {
    return `Привет ${this.firstname} ${this.familyname}, наш ${this.roleName}`;
  }
}
