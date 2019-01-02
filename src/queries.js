/* Mikroblog posts */
export function getEntries() {
  return document.querySelectorAll('#itemsStream > .iC:not(.link)');
}

export function getPager() {
  return document.querySelector('.pager');
}

export function getFooter() {
  return document.querySelector('#footer');
}

export function getSite() {
  return document.querySelector('#site');
}
