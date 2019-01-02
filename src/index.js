import './styles/index.scss';
import {CommentsHiderModule} from './modules/comments-hider/comments-hider.module';
import {ChildrenCounterModule} from './modules/children-counter/children-counter.module';

(async function() {
  await new CommentsHiderModule().init();
  await new ChildrenCounterModule().init();
})();

