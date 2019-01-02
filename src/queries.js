/* Mikroblog posts */
export function getEntries() {
  return document.querySelectorAll('#itemsStream > .iC:not(.link)');
}