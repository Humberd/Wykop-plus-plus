import './styles/index.scss';
import {CommentsStorage} from './storage';

const commentsStorage = new CommentsStorage();

(async function () {
  const state = await commentsStorage.readAll() || {
    comments: {},
  };

  const commentsParent = document.querySelectorAll('#itemsStream > .iC');

  console.log(`There are ${commentsParent.length} comment parents`);

  for (const commentBlock of commentsParent) {
    const aElem = document.createElement('a');
    aElem.setAttribute('href', 'javascript:void(0)');
    aElem.className = 'comment-expand';

    const commentId = commentBlock.querySelector(".dC").dataset.id;
    state.comments[commentId] = state.comments[commentId] || {};

    if (state.comments[commentId].isCollapsed) {
      collapse(aElem, commentBlock, commentId);
    } else {
      expand(aElem, commentBlock, commentId);
    }

    aElem.onclick = () => {
      if (isCollapsed(commentBlock)) {
        expand(aElem, commentBlock, commentId);
      } else {
        collapse(aElem, commentBlock, commentId);
      }
    };

    commentBlock.prepend(aElem);
  }

  function collapse(aElem, parent, commentId) {
    aElem.textContent = '[+]';
    parent.classList.add('collapsed');
    parent.dataset.collapsed = 'true';
    state.comments[commentId].isCollapsed = true;
    commentsStorage.saveAll(state);
  }

  function expand(aElem, parent, commentId) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    parent.dataset.collapsed = 'false';
    state.comments[commentId].isCollapsed = false;
    commentsStorage.saveAll(state);
  }

  function isCollapsed(parent) {
    return parent.dataset.collapsed === 'true';
  }

})();

