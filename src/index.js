import './styles/index.scss';
import {CommentsStorage} from './storage';
import {StatePersistor} from './state-persistor';

const commentsStorage = new CommentsStorage();
const statePersistor = new StatePersistor(commentsStorage);

(async function() {
  statePersistor.initState(await commentsStorage.readAll());

  const articleId = getArticleId();

  const commentsParent = document.querySelectorAll('#itemsStream > .iC');

  for (const commentBlock of commentsParent) {
    createChildCounter(commentBlock);
    const aElem = createHideButton(commentBlock);

    const commentId = commentBlock.querySelector('.dC').dataset.id;

    if (statePersistor.isCommentHidden(articleId, commentId)) {
      statePersistor.hideComments(aElem, commentBlock, articleId, commentId);
    } else {
      statePersistor.showComments(aElem, commentBlock, articleId, commentId);
    }

    aElem.onclick = () => {
      if (statePersistor.isCommentHidden(articleId, commentId)) {
        statePersistor.showComments(aElem, commentBlock, articleId, commentId);
      } else {
        statePersistor.hideComments(aElem, commentBlock, articleId, commentId);
        lazyLoadImages()
      }
    };
  }

  lazyLoadImages();

  /* Images would not load when we hide an image.
   * This script does not have access to page context, so as a workaround
   * we have to create a script, append it to the page and then
   * execute it in the page context. */
  function lazyLoadImages() {
    // language=JavaScript
    var actualCode = `wykop.bindLazy()`;

    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  function getArticleId() {
    if (!location.pathname.startsWith('/link')) {
      return 'mikroblog';
    }

    return location.pathname.split('/')[2];
  }

  function createHideButton(elem) {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');

    elem.prepend(a);

    return a;
  }

  function createChildCounter(elem) {
    const span = document.createElement('span');
    span.classList.add('child-counter');

    const moreElem = elem.querySelector('.sub .more a');

    let childCount;
    if (!moreElem) {
      childCount = elem.querySelectorAll('.sub > li').length;
    } else {
      try {
        childCount = Number(/\((\d+)\)/g.exec(moreElem.textContent)[1]) + 2;
      } catch (e) {
        childCount = elem.querySelectorAll('.sub > li').length;
      }
    }

    span.textContent = `(${childCount} dzieci)`;

    //add children count only to mikroblog posts
    if (!elem.classList.contains('link')) {
      elem.querySelector('.author .affect').appendChild(span);
    }

    return span;
  }

})();

