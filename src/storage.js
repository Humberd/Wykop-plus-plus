export class Storage {

  constructor(key) {
    this.key = key;
    this.storage = chrome.storage.local;
  }

  saveAll(state) {
    this.storage.set({
      [this.key]: state,
    });
  }

  async readAll() {
    return new Promise(resolve => {
      this.storage.get(this.key, value => {
        resolve(value[this.key]);
      });
    });

  }

}
