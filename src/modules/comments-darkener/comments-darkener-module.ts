import { AppModule } from '../app-module';
import { AppEvents } from '../../events';
import { getEntries } from '../../utils/queries';
import { StatePersistor } from '../../utils/state-persistor';
import { AppStorage } from '../../utils/app-storage';
import { CommentsDarkenerModuleState } from './module-state';
import { getCommentDate } from '../../utils/extractors';
import { injectable } from 'inversify';

@injectable()
export class CommentsDarkenerModule extends AppModule {
  static readonly MODULE_NAME = 'CommentsDarkenerModule';

  private readonly statePersistor = new StatePersistor<CommentsDarkenerModuleState>(new AppStorage(CommentsDarkenerModule.MODULE_NAME));

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    this.statePersistor.initState();

    for (const entry of getEntries()) {
      console.log(getCommentDate(entry).getTime());
    }
  }

}
