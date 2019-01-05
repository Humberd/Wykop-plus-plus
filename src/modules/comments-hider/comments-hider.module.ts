import { AppStorage } from '../../appStorage';
import { CommentsState } from './comments-state';
import { isElementInViewport, lazyLoadImages, scrollTo } from '../../utils';
import { getEntries } from '../../queries';
import { AppModule } from '../app-module';

export class CommentsHiderModule extends AppModule {
  private static readonly STORAGE_KEY = 'comments-state';
  private statePersistor: CommentsState;
  private articleId: string;

  constructor() {
    super('CommentsHiderModule');

    const storage = new AppStorage(CommentsHiderModule.STORAGE_KEY);
    this.statePersistor = new CommentsState(storage);

    this.articleId = this.getArticleId();

  }

  async init() {
    await this.statePersistor.initState();

    this.addCommentButtons();
  }

  addCommentButtons() {
    for (const commentBlock of getEntries()) {
      if (commentBlock.classList.contains('commen-hider-applied')) {
        continue;
      }

      const aElem = this.createHideButton(commentBlock);
      commentBlock.classList.add('comment-hider-applied');

      // @ts-ignore
      const commentId = commentBlock.querySelector('.dC').dataset.id;

      if (this.isCommentHidden(this.articleId, commentId)) {
        this.hideComments(aElem, commentBlock, this.articleId,
            commentId);
      } else {
        this.showComments(aElem, commentBlock, this.articleId,
            commentId);
      }

      aElem.addEventListener('click', () => {
        if (this.isCommentHidden(this.articleId, commentId)) {
          this.showComments(aElem, commentBlock, this.articleId,
              commentId);
        } else {
          this.hideComments(aElem, commentBlock, this.articleId,
              commentId);
          lazyLoadImages();
        }
      });
    }

    lazyLoadImages();
  }

  getArticleId() {
    if (!location.pathname.startsWith('/link')) {
      return 'mikroblog';
    }

    return location.pathname.split('/')[2];
  }

  createHideButton(elem: Element): Element {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');

    elem.prepend(a);

    return a;
  }

  hideComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
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

  showComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    delete this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
    this.statePersistor.save();
  }

  isCommentHidden(articleId: string, commentId: string): boolean {
    return this.statePersistor.state.commentHidePersistor[articleId] &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
  }

}
