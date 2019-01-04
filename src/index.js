import './styles/index.scss';
import {CommentsHiderModule} from './modules/comments-hider/comments-hider.module';
import {ChildrenCounterModule} from './modules/children-counter/children-counter.module';
import {InfiniteScrollModule} from './modules/infinite-scroll/infinite-scroll.module';
import {FooterRemoverModule} from './modules/footer-remover/footer-remover.module';

(async function() {
  await new CommentsHiderModule().init();
  await new ChildrenCounterModule().init();
  await new InfiniteScrollModule().init();
  await new FooterRemoverModule().init();
})();
