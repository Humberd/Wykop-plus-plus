import { AppStorage } from '../../appStorage';

export interface State {
  commentHidePersistor: {
    [key: string]: {
      lastUpdate?: number;
      collapsedThings: {
        [key: string]: boolean
      }
    }
  }
}

export class CommentsState {
  state: State;

  constructor(private storage: AppStorage) {
  }

  async initState() {
    this.state = (await this.storage.readAll() as State) || {
      commentHidePersistor: {},
    };
  }

  save() {
    this.storage.saveAll(this.state);
  }

}
