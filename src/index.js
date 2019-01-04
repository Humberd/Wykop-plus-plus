import './styles/index.scss';
import {CommentsHiderModule} from './modules/comments-hider/comments-hider.module';
import {ChildrenCounterModule} from './modules/children-counter/children-counter.module';
import {InfiniteScrollModule} from './modules/infinite-scroll/infinite-scroll.module';
import {FooterRemoverModule} from './modules/footer-remover/footer-remover.module';

const MODULES = (() => {
  const commentsHiderModule = new CommentsHiderModule();
  const childrenCounterModule = new ChildrenCounterModule();
  const footerRemoverModule = new FooterRemoverModule();
  const infiniteScrollModule = new InfiniteScrollModule(commentsHiderModule);

  return [
    commentsHiderModule,
    childrenCounterModule,
    footerRemoverModule,
    infiniteScrollModule,
  ];
})();

(async function() {
  let successCounter = 0;
  for (const module of MODULES) {
    const moduleName = module.moduleName;
    try {
      await module.init();
      console.log(`Loading Module ${moduleName}: OK`);
      successCounter++;
    } catch (e) {
      console.error(`Module ${moduleName} initialization FAILED`, e);
    }
  }

  console.log(
      `--- Loaded Successfully: ${successCounter}. Fails: ${MODULES.length -
      successCounter} ---`);

})();
