import { AppModule } from './modules/app-module';
import { CommentsHiderModule } from './modules/comments-hider/comments-hider.module';
import { ChildrenCounterModule } from './modules/children-counter/children-counter.module';
import { FooterRemoverModule } from './modules/footer-remover/footer-remover.module';
import { InfiniteScrollModule } from './modules/infinite-scroll/infinite-scroll.module';
import { CommentsDarkenerModule } from './modules/comments-darkener/comments-darkener-module';
import { AppEvents } from './events';

export type AppModuleChild = new (...args: any[]) => AppModule;
export type ServiceType = new (...args: any[]) => any;

export const SERVICES: ServiceType[] = [
  AppEvents
];

export const MODUELS: AppModuleChild[] = [
  CommentsHiderModule,
  ChildrenCounterModule,
  FooterRemoverModule,
  InfiniteScrollModule,
  CommentsDarkenerModule
];

