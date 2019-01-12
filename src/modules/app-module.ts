import { Service } from 'typedi';

@Service()
export abstract class AppModule {

  async init() {

  }

  isTurnedOn(): boolean {
    return true;
  }

}
