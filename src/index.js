import './styles/index.scss';

const commentsParent = document.querySelectorAll('#itemsStream > .iC');

console.log(`There are ${commentsParent.length} comment parents`);
for (const commentBlock of commentsParent) {
  const aElem = document.createElement('a');
  aElem.setAttribute('href', 'javascript:void(0)');
  aElem.className = 'comment-expand';
  expand(aElem, commentBlock);

  aElem.onclick = () => {
    if (isCollapsed(commentBlock)) {
      expand(aElem, commentBlock);
    } else {
      collapse(aElem, commentBlock);
    }
  };

  commentBlock.prepend(aElem);
}

function collapse(aElem, parent) {
  aElem.textContent = '[+]';
  parent.classList.add('collapsed');
  parent.dataset.collapsed = 'true';
}

function expand(aElem, parent) {
  aElem.textContent = '[-]';
  parent.classList.remove('collapsed');
  parent.dataset.collapsed = 'false';
}

function isCollapsed(parent) {
  return parent.dataset.collapsed === 'true';
}
