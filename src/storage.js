const COMMENTS_STORAGE_KEY = 'x-comments-state';

export class CommentsStorage {

  constructor() {
    this.storage = chrome.storage.local;
  }

  saveAll(state) {
    this.storage.set({
      [COMMENTS_STORAGE_KEY]: state
    });
  }

  async readAll() {
    return new Promise((resolve, reject) => {
      this.storage.get(COMMENTS_STORAGE_KEY, value => {
        resolve(value[COMMENTS_STORAGE_KEY])
      })
    })

    // try {
    //   JSON.parse(this.storage.get(COMMENTS_STORAGE_KEY));
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  clear() {
    this.storage.remove(COMMENTS_STORAGE_KEY);
  }

}