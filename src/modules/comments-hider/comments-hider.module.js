import {Storage} from '../../storage';
import {CommentsState} from './comments-state';
import {isElementInViewport, lazyLoadImages, scrollTo} from '../../utils';
import {getEntries} from '../../queries';

const STORAGE_KEY = 'comments-state';

export class CommentsHiderModule {
  constructor() {
    const storage = new Storage(STORAGE_KEY);
    this.statePersistor = new CommentsState(storage);
  }

  async init() {
    await this.statePersistor.initState();

    const articleId = this.getArticleId();

    for (const commentBlock of getEntries()) {
      const aElem = this.createHideButton(commentBlock);

      const commentId = commentBlock.querySelector('.dC').dataset.id;

      if (this.isCommentHidden(articleId, commentId)) {
        this.hideComments(aElem, commentBlock, articleId,
            commentId);
      } else {
        this.showComments(aElem, commentBlock, articleId,
            commentId);
      }

      aElem.onclick = () => {
        if (this.isCommentHidden(articleId, commentId)) {
          this.showComments(aElem, commentBlock, articleId,
              commentId);
        } else {
          this.hideComments(aElem, commentBlock, articleId,
              commentId);
          lazyLoadImages();
        }
      };
    }
  }

  getArticleId() {
    if (!location.pathname.startsWith('/link')) {
      return 'mikroblog';
    }

    return location.pathname.split('/')[2];
  }

  createHideButton(elem) {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');

    elem.prepend(a);

    return a;
  }

  hideComments(aElem, parent, articleId, commentId) {
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

  showComments(aElem, parent, articleId, commentId) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    delete this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
    this.statePersistor.save();
  }

  isCommentHidden(articleId, commentId) {
    return this.statePersistor.state.commentHidePersistor[articleId] &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
  }

}