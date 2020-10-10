export interface InMemoryCacheState {
  comments: HTMLElement;
}

export class InMemoryCommentsCache<State = InMemoryCacheState> {
  private readonly state = new Map<string, State>();

  isCached(commentId: string): boolean {
    return this.state.has(commentId);
  }

  setCache(commentId: string, state: State): void {
    this.state.set(commentId, state);
  }

  getCached(commentId: string): State {
    return this.state.get(commentId);
  }

  remove(commentId: string): void {
    this.state.delete(commentId);
  }
}
