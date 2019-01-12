import 'reflect-metadata';
import { AppEvents } from './events';
import { AppModuleChild, MODUELS } from './modules';
import { Container } from 'typedi';

(async function () {
  await loadModules(MODUELS);

  await initEvents(Container.get<AppEvents>(AppEvents));

})();

async function loadModules(modules: AppModuleChild[]) {

  let successCounter = 0;

  for (const module of modules) {

    try {
      await loadModule(module);
      successCounter++;
      console.log(`Module ${(module as any).MODULE_NAME}: OK`);
    } catch (e) {
      console.error(`Module ${(module as any).MODULE_NAME}: initialization FAILED`, e);
    }

  }

  console.log(`--- Loaded ${successCounter}/${modules.length} modules ---`);
}

async function loadModule(module: AppModuleChild) {
  return Container.get(module).init();
}

async function initEvents(appEvents: AppEvents) {
  appEvents.onItemsLoaded.next({isInitial: true});
}
