import 'reflect-metadata';
import { AppEvents } from './services/events';
import { AppModuleChild, MODUELS } from './modules';
import { Container } from 'typedi';
import { getEntries } from './utils/queries';

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
  const instance = Container.get(module);
  if (!instance.isTurnedOn()) {
    console.log(`Module ${(module as any).MODULE_NAME} is turned off`);
    return;
  }
  return instance.init();
}

async function initEvents(appEvents: AppEvents) {
  appEvents.onItemsLoaded.next({isInitial: true, data: getEntries()});
}
