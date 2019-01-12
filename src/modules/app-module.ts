import { injectable } from 'inversify';

@injectable()
export abstract class AppModule {

  async init() {

  }

  isTurnedOn(): boolean {
    return true;
  }

}
