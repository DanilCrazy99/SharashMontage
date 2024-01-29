const roles = {
  admin: 'админ',
  foreman: 'бригадир',
  guest: 'гость',
  worker: 'работяга',
};

interface UserInterface {
  userId: number,
  firstname: string,
  familyname: string,
  roleName: string,
}

export default class User implements UserInterface {
  userId;
  firstname;
  familyname;
  roleName;

  constructor(user: {id: number, firstname: string, familyname: string, role: string}) {
    const {
      id, firstname, familyname, role,
    } = user;
    this.userId = id;
    this.firstname = firstname;
    this.familyname = familyname;
    this.roleName = roles[role];
  }
}
