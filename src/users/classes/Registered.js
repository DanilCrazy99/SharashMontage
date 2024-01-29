import User from './User.js';

export default class Registered extends User {
  greetings() {
    return `Привет ${this.firstname} ${this.familyname}, наш ${this.roleName}`;
  }
}
