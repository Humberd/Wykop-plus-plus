import { AppModule } from '../app-module';
import { StatePersistor } from '../../utils/state-persistor';
import { AppStorage } from '../../utils/app-storage';
import { CommentsDarkenerModuleState } from './module-state';
import { Service } from 'typedi';
import { AppState } from '../../services/app-state';
import './styles.scss';
import { AppEvents } from '../../services/events';

@Service()
export class CommentsDarkenerModule extends AppModule {
  static readonly MODULE_NAME = 'CommentsDarkenerModule';

  private readonly statePersistor = new StatePersistor<CommentsDarkenerModuleState>(new AppStorage(CommentsDarkenerModule.MODULE_NAME));

  constructor(private appState: AppState,
              private appEvents: AppEvents) {
    super();
  }

  async init() {
    await this.statePersistor.initState();

    this.prepareState();

    this.listenToEvents();
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

  private listenToEvents() {
    this.appEvents.onItemsLoaded
        .asObservable()
        .subscribe(payload => {
          const allComments = this.extractAllComments(payload.data);
          this.darkenComments(allComments);
        });
  }

  private extractAllComments(rootComments: NodeListOf<Element>): Element[] {
    return Array.from(rootComments)
        .reduce((arr, elem) => {
          arr.push(...elem.querySelectorAll('.wblock.dC'));
          return arr;
        }, [] as Element[]);
  }

  private darkenComments(comments: Element[]) {

    let appliedCounter = 0;

    for (const comment of comments) {
      // @ts-ignore
      const commentId = comment.dataset.id;
      if (!this.statePersistor.state[this.appState.articleId].visitedComments[commentId]) {
        this.statePersistor.state[this.appState.articleId].visitedComments[commentId] = true;
        continue;
      }

      comment.classList.add('already-seen');

      appliedCounter++;
    }

    console.log(`Darkened ${appliedCounter}/${comments.length} comments`);

    this.statePersistor.save();
  }


}
