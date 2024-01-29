import User from './User.js';

export default class Admin extends User {
  greetings() {
    return `Привет ${this.firstname} ${this.familyname}, наш ${this.roleName}`;
  }
}
