export interface CommentsHiderModuleState {
  commentHidePersistor: {
    [articleId: string]: {
      lastUpdate?: number;
      collapsedThings: {
        [commentId: string]: boolean
      }
    }
  };
}
