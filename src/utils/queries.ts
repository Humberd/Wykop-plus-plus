/* Mikroblog posts */
export function getEntries(doc = document) {
  return doc.querySelectorAll('#itemsStream > .iC:not(.link)');
}

export function getAllComments(doc = document) {
  return doc.querySelectorAll('#itemsStream .wblock.dC');
}

/* Entries + links */
export function getAllItems(doc = document) {
  return doc.querySelectorAll('#itemsStream > .iC');
}

export function getAllItemsParent() {
  return document.querySelector('#itemsStream');
}

export function getPager(doc = document) {
  return doc.querySelector('.pager');
}

export function getFooter() {
  return document.querySelector('#footer');
}

export function getSite() {
  return document.querySelector('#site');
}
