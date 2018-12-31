export class StatePersistor {

  constructor(commentsStorage) {
    this.commentsStorage = commentsStorage;
  }

  initState(newState) {
    this.state = newState || {
      commentHidePersistor: {},
    };
  }

  hideComments(aElem, parent, articleId, commentId) {
    aElem.textContent = '[+]';
    parent.classList.add('collapsed');
    this.state.commentHidePersistor[articleId] = this.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    this.state.commentHidePersistor[articleId].collapsedThings[commentId] = true;
    this.commentsStorage.saveAll(this.state);

    if (!this.isElementInViewport(parent)) {
      this.scrollToParent(parent);
    }
  }

  showComments(aElem, parent, articleId, commentId) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    this.state.commentHidePersistor[articleId] = this.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    delete this.state.commentHidePersistor[articleId].collapsedThings[commentId];
    this.commentsStorage.saveAll(this.state);
  }

  isCommentHidden(articleId, commentId) {
    return this.state.commentHidePersistor[articleId] &&
        this.state.commentHidePersistor[articleId].collapsedThings &&
        this.state.commentHidePersistor[articleId].collapsedThings[commentId];
  }

  scrollToParent(parent) {
    parent.scrollIntoView();
    window.scrollBy(0, -50);
  }

  isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    const wh = (window.innerHeight || document.documentElement.clientHeight);

    const cond1 = rect.bottom > 0 && rect.bottom < wh;
    const cond2 = rect.top < wh && rect.bottom > 0;

    return (cond1 || cond2);
  }

}
