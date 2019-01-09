import { AppStorage } from '../../appStorage';
import { CommentsState } from './comments-state';
import { isElementInViewport, lazyLoadImages, scrollTo } from '../../utils';
import { getEntries } from '../../queries';
import { AppModule } from '../app-module';
import { AppEvents } from '../../events';
import './styles.scss';

export class CommentsHiderModule extends AppModule {

  static readonly MODULE_NAME = 'CommentsHiderModule';

  private static readonly STORAGE_KEY = 'comments-state';
  private static readonly ELEMENT_CLASS = 'x-comment-hider';

  private statePersistor: CommentsState;
  private articleId: string;

  constructor(private appEvents: AppEvents) {
    super();

    const storage = new AppStorage(CommentsHiderModule.STORAGE_KEY);
    this.statePersistor = new CommentsState(storage);

    this.articleId = this.getArticleId();

  }

  async init() {
    await this.statePersistor.initState();

    this.listenForEvents();
  }


  private listenForEvents() {
    this.appEvents.onItemsLoaded
        .asObservable()
        .subscribe(() => this.addCommentButtons());
  }

  private addCommentButtons() {
    const entries = getEntries();

    let appliedCounter = 0;

    for (const commentBlock of entries) {
      if (commentBlock.querySelector(`.${CommentsHiderModule.ELEMENT_CLASS}`)) {
        continue;
      }

      const aElem = this.createHideButton();
      commentBlock.prepend(aElem);

      // @ts-ignore
      const commentId = commentBlock.querySelector('.dC').dataset.id;

      if (this.isCommentHidden(this.articleId, commentId)) {
        this.hideComments(aElem, commentBlock, this.articleId, commentId);
      } else {
        this.showComments(aElem, commentBlock, this.articleId, commentId);
      }

      aElem.addEventListener('click', () => {
        if (this.isCommentHidden(this.articleId, commentId)) {
          this.showComments(aElem, commentBlock, this.articleId, commentId);
        } else {
          this.hideComments(aElem, commentBlock, this.articleId, commentId);
          lazyLoadImages();
        }
      });

      appliedCounter++;
    }

    console.log(`Added ${appliedCounter}/${entries.length} comments hide buttons`);

    lazyLoadImages();
  }

  private getArticleId() {
    if (!location.pathname.startsWith('/link')) {
      return 'mikroblog';
    }

    return location.pathname.split('/')[2];
  }

  private createHideButton(): Element {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');
    a.classList.add(CommentsHiderModule.ELEMENT_CLASS);

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

    if (!isElementInViewport(parent)) {
      scrollTo(parent);
    }
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
