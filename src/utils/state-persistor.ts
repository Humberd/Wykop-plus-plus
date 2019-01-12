import { AppStorage } from './app-storage';

export class StatePersistor<T> {
  state: T;

  constructor(private storage: AppStorage) {
  }

  async initState(defaultState: any = {}) {
    this.state = (await this.storage.readAll() as T) || defaultState;
  }

  save() {
    this.storage.saveAll(this.state);
  }
}
