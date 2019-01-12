export function getCommentDate(comment: Element): Date {
  const timeElement = comment.querySelector('.author .affect>time[datetime]');
  const datetime = timeElement.attributes.getNamedItem('datetime').value;
  return new Date(datetime);
}

export function getCommentId(comment: Element): string {
  const dataElement = comment.querySelector('.wblock.dC[data-id]');
  // @ts-ignore
  return dataElement.dataset.id;
}

export function getArticleId(): string {
  if (!location.pathname.startsWith('/link')) {
    return 'mikroblog';
  }

  return location.pathname.split('/')[2];
}
