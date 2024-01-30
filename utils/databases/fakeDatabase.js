import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import update from 'immutability-helper';

export default class FakeDatabase {
  constructor(pathFile) {
    this.originPath = pathFile;
    this.data = {};
    this.ext = path.extname(pathFile);
  }

  typesFakeDBs = {
    '.json': {
      parseData: async (data) => {
        if (typeof data === 'string') return JSON.parse(data);
        return data;
      },
    },
  };

  getData() {
    return new Promise((res, rej) => {
      readFile(this.originPath, 'utf-8').then((newData) => {
        if (newData) {
          const { ext } = this;
          this.typesFakeDBs[ext].parseData(newData).then((result) => {
            this.data = result;
          });
          res(this.data);
        }
      }).catch((e) => {
        if (e.code !== 'ENOENT') rej(e);
      });
    });
  }

  writeData(newData) {
    this.getData().then(() => {
      const oldData = this.data || JSON.parse(this.data);
      const newObj = update(oldData, { $merge: newData });
      writeFile(this.originPath, JSON.stringify(newObj));
    });
  }

  // async refreshData() {
  //   this.data
  // }

  async getUserById(userId) {
    await this.getData();
    const { ext, data } = this;
    const { users = {} } = await this.typesFakeDBs[ext].parseData(data);
    if (Object.keys(users).length < 1) return { role: 'guest' };
    const user = users.find(({ id }) => id === userId);
    return user ?? { role: 'guest' };
  }
}
