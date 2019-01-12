import { AppModule } from '../app-module';
import { StatePersistor } from '../../utils/state-persistor';
import { AppStorage } from '../../utils/app-storage';
import { CommentsDarkenerModuleState } from './module-state';
import { Service } from 'typedi';
import { AppState } from '../../services/app-state';
import { getEntries } from '../../utils/queries';
import { getCommentDate } from '../../utils/extractors';
import './styles.scss';

@Service()
export class CommentsDarkenerModule extends AppModule {
  static readonly MODULE_NAME = 'CommentsDarkenerModule';

  private readonly statePersistor = new StatePersistor<CommentsDarkenerModuleState>(new AppStorage(CommentsDarkenerModule.MODULE_NAME));

  lastVisit: number;

  constructor(private appState: AppState) {
    super();
  }

  async init() {
    await this.statePersistor.initState();

    if (!this.statePersistor.state[this.appState.articleId]) {
      this.lastVisit = 0;
      this.statePersistor.state[this.appState.articleId] = {
        lastVisit: new Date().getTime(),
        visitedComments: {}
      };
    } else {
      this.lastVisit = this.statePersistor.state[this.appState.articleId].lastVisit;
      this.statePersistor.state[this.appState.articleId].lastVisit = new Date().getTime();
    }

    this.statePersistor.save();

    for (const entry of getEntries()) {
      const commentTime = getCommentDate(entry).getTime();
      if (commentTime < this.lastVisit) {
        entry.classList.add('already-seen');
      }
    }
  }

}
