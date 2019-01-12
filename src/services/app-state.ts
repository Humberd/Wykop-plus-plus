import { getArticleId } from '../utils/extractors';
import { Service } from 'typedi';

@Service()
export class AppState {
  get articleId(): string {
    return this._articleId;
  }

  private _articleId: string;

  constructor() {
    this._articleId = getArticleId();
  }

}
