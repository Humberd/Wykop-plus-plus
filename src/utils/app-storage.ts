export class AppStorage {

  constructor(private key: string,
              private storage = chrome.storage.local) {
  }

  saveAll(state: any): void {
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

  clearAll() {
    this.storage.clear();
  }

}
