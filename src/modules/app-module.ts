export abstract class AppModule {
  static readonly MODULE_NAME: string;

  constructor(public moduleName?: string) {
  }

  async init() {

  }

  isTurnedOn(): boolean {
    return true;
  }

}
