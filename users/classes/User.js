const roles = {
  admin: 'админ',
  foreman: 'бригадир',
  guest: 'гость',
  worker: 'работяга',
};

export default class User {
  constructor(user) {
    const {
      id, firstname, familyname, role,
    } = user;
    this.userId = id;
    this.firstname = firstname;
    this.familyname = familyname;
    this.roleName = roles[role];
  }
}
