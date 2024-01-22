import { readFile } from 'fs/promises';
import path from 'path';
import update from 'immutability-helper';

export default class FakeDatabase {
  constructor(pathFile) {
    this.originPath = pathFile;
    this.data = {};
    this.ext = path.extname(pathFile);
  }

  async getData() {
    await readFile(this.originPath, 'utf-8').then((newData) => {
      this.data = newData;
    }).catch((e) => {
      throw new Error(e);
    });
  }

  async writeData(newData) {
    const newTransaction = update(this.data, { $merge: { newData } });
    console.log(newTransaction);
  }

  typesFakeDBs = {
    '.json': {
      parseData: async (data) => JSON.parse(data),
    },
  };

  // async refreshData() {
  //   this.data
  // }

  async getUserById(userId) {
    await this.getData();
    const { ext, data } = this;
    const { users } = await this.typesFakeDBs[ext].parseData(data);
    const user = users.find(({ id }) => id === userId);
    return user ?? { role: 'guest' };
  }
}
