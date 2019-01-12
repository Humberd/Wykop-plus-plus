export interface CommentsDarkenerModuleState {
  [articleId: string]: {
    lastVisit?: number;
    visitedComments: {
      [commentId: string]: boolean;
    }
  };
}
