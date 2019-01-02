export class CommentsState {

  constructor(storage) {
    this.storage = storage;
  }

  async initState() {
    this.state = (await this.storage.readAll()) || {
      commentHidePersistor: {},
    };
  }

  save() {
    this.storage.saveAll(this.state);
  }

}
