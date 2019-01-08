export abstract class AppModule {

  constructor(public moduleName?: string) {
  }

  async init() {

  }

  isTurnedOn(): boolean {
    return true;
  }

}
