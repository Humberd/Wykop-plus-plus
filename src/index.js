import './styles/index.scss';
import {CommentsStorage} from './storage';
import {StatePersistor} from './state-persistor';

const commentsStorage = new CommentsStorage();
const statePersistor = new StatePersistor(commentsStorage);

(async function() {
  console.log(await commentsStorage.readAll());
  statePersistor.initState(await commentsStorage.readAll());

  const articleId = getArticleId();

  const commentsParent = document.querySelectorAll('#itemsStream > .iC');

  for (const commentBlock of commentsParent) {
    const aElem = document.createElement('a');
    aElem.setAttribute('href', 'javascript:void(0)');
    aElem.className = 'comment-expand';

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
      }
    };

    commentBlock.prepend(aElem);
  }

  lazyLoadImages();

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

})();

