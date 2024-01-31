import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import update from 'immutability-helper';

type Data = {
  users?: {
    [x: number]: {
      name: string,
      phone: string,
      info?: string, 
      role: string,
    }
  },
  docs?: {},
  registration?: {
    [x: number]: {
      name: string,
      phone: string,
      info?: string,
      date: Date,
    }
  },
}

export default class FakeDatabase {
  originPath;
  data: Data = {};
  ext;

  constructor(pathFile: string) {
    this.originPath = pathFile;
    this.ext = path.extname(pathFile);
  }

  typesFakeDBs: {
    [ext: string]: {
      parseData: (a: string) => Promise<object>
    }
  } = {
    '.json': {
      parseData: (data: string) => new Promise((res) => {
        res(JSON.parse(data));
      }),
    },
  };

  getData():Promise<Data> {
    return new Promise((res, rej) => {
      readFile(this.originPath, 'utf-8').then((newData) => {
        if (newData) {
          const { ext } = this;
          this.typesFakeDBs[ext].parseData(newData).then((result) => {
            this.data = result;
          }).then(() => res(this.data));
        }
      }).catch((e) => {
        if (e.code !== 'ENOENT') rej(e);
      });
    });
  }

  writeData(newData: {}) {
    return new Promise(() => {
      this.getData().then(() => {
        const oldData = this.data;
        const newObj = update(oldData, { $merge: newData });
        this.data = newObj;
        return this.data;
      }).then(data => writeFile(this.originPath, JSON.stringify(data)));
    })
  }

  getUserById(userId: number) {
      const { users = {} } = this.data;
      if (Object.keys(users).length < 1) return { role: 'guest' };
      return users[userId] ?? { role: 'guest' };
  };
}
