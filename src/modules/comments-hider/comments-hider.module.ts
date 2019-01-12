import { AppStorage } from '../../utils/app-storage';
import { CommentsHiderModuleState } from './module-state';
import { isElementInViewport, lazyLoadImages, scrollTo, scrollToTop } from '../../utils/utils';
import { getEntries } from '../../utils/queries';
import { AppModule } from '../app-module';
import { AppEvents, OnItemsLoadedPayload } from '../../events';
import './styles.scss';
import { StatePersistor } from '../../utils/state-persistor';
import { getCommentId } from '../../utils/extractors';
import { Service } from 'typedi';

@Service()
export class CommentsHiderModule extends AppModule {

  static readonly MODULE_NAME = 'CommentsHiderModule';

  private static readonly ELEMENT_CLASS = 'x-comment-hider';

  private readonly statePersistor = new StatePersistor<CommentsHiderModuleState>(new AppStorage(CommentsHiderModule.MODULE_NAME));

  private articleId: string;

  constructor(private appEvents: AppEvents) {
    super();

    this.articleId = this.getArticleId();

  }

  async init() {
    await this.statePersistor.initState({commentHidePersistor: {}});

    this.listenForEvents();
  }


  private listenForEvents() {
    this.appEvents.onItemsLoaded
        .asObservable()
        .subscribe((payload: OnItemsLoadedPayload) => this.addCommentButtons(payload.isInitial));
  }

  private addCommentButtons(isInitial: boolean) {

    const entries = getEntries();

    let appliedCounter = 0;
    let firstShownComment: Element;

    for (const commentBlock of entries) {
      if (commentBlock.querySelector(`.${CommentsHiderModule.ELEMENT_CLASS}`)) {
        continue;
      }

      const aElem = this.createHideButton(commentBlock);

      const commentId = getCommentId(commentBlock);

      if (this.isCommentHidden(this.articleId, commentId)) {
        this.hideComments(aElem, commentBlock, this.articleId, commentId);
      } else {
        this.showComments(aElem, commentBlock, this.articleId, commentId);
        if (!firstShownComment) {
          firstShownComment = commentBlock;
        }
      }

      aElem.addEventListener('click', () => {
        if (this.isCommentHidden(this.articleId, commentId)) {
          this.showComments(aElem, commentBlock, this.articleId, commentId);
        } else {
          this.hideComments(aElem, commentBlock, this.articleId, commentId);
          this.appEvents.onCommentHid.next();
          if (!isElementInViewport(commentBlock)) {
            scrollTo(commentBlock);
          }
          lazyLoadImages();
        }
      });

      appliedCounter++;
    }

    console.log(`Added ${appliedCounter}/${entries.length} comments hide buttons`);

    lazyLoadImages();

    /* We want to scroll only on the initial page load, because it would
     * make user angry, that we are scrilling to the bottom when user is still at the top

     * Need to use setTimeouts, because it won't scroll immediately */
    if (isInitial) {
      setTimeout(() => {
        scrollToTop();
      }, 500);
    }
  }

  private getArticleId() {
    if (!location.pathname.startsWith('/link')) {
      return 'mikroblog';
    }

    return location.pathname.split('/')[2];
  }

  private createHideButton(parent: Element): Element {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');
    a.classList.add(CommentsHiderModule.ELEMENT_CLASS);

    parent.prepend(a);

    return a;
  }

  private hideComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
    aElem.textContent = '[+]';
    parent.classList.add('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId] = true;
    this.statePersistor.save();
  }

  private showComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    delete this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
    this.statePersistor.save();
  }

  private isCommentHidden(articleId: string, commentId: string): boolean {
    return this.statePersistor.state.commentHidePersistor[articleId] &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
  }

}
