import { AppModule } from '../app-module';
import { StatePersistor } from '../../utils/state-persistor';
import { AppStorage } from '../../utils/app-storage';
import { CommentsDarkenerModuleState } from './module-state';
import { Service } from 'typedi';
import { AppState } from '../../services/app-state';
import { getAllComments } from '../../utils/queries';
import './styles.scss';

@Service()
export class CommentsDarkenerModule extends AppModule {
  static readonly MODULE_NAME = 'CommentsDarkenerModule';

  private readonly statePersistor = new StatePersistor<CommentsDarkenerModuleState>(new AppStorage(CommentsDarkenerModule.MODULE_NAME));

  constructor(private appState: AppState) {
    super();
  }

  async init() {
    await this.statePersistor.initState();

    this.prepareState();

    for (const comment of getAllComments()) {
      // @ts-ignore
      const commentId = comment.dataset.id;
      if (this.statePersistor.state[this.appState.articleId].visitedComments[commentId]) {
        comment.classList.add('already-seen');
        continue;
      }

      this.statePersistor.state[this.appState.articleId].visitedComments[commentId] = true;

    }

    this.statePersistor.save();

  }

  private prepareState() {
    if (!this.statePersistor.state[this.appState.articleId]) {
      this.statePersistor.state[this.appState.articleId] = {
        lastVisit: new Date().getTime(),
        visitedComments: {}
      };
    } else {
      this.statePersistor.state[this.appState.articleId].lastVisit = new Date().getTime();
    }
  }

}
