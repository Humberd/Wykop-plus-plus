/* Mikroblog posts */
export function getEntries() {
  return document.querySelectorAll('#itemsStream > .iC:not(.link)');
}

/* Entries + links */
export function getAllItems(doc = document) {
  return doc.querySelectorAll('#itemsStream > .iC');
}

export function getAllItemsParent() {
  return document.querySelector('#itemsStream');
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
