import 'reflect-metadata';
import { AppEvents } from './events';
import { Container } from 'inversify';
import { AppModuleChild, MODUELS, SERVICES, ServiceType } from './modules';

(async function () {
  const container = new Container();
  loadServices(container, SERVICES);

  await loadModules(container, MODUELS);

  await initEvents(container.get<AppEvents>(AppEvents));

})();

function loadServices(container: Container, services: ServiceType[]) {
  for (const service of services) {
    container.bind(service).toSelf().inSingletonScope();
  }
}

async function loadModules(container: Container, modules: AppModuleChild[]) {

  let successCounter = 0;

  for (const module of modules) {

    try {
      await loadModule(container, module);
      successCounter++;
      console.log(`Module ${(module as any).MODULE_NAME}: OK`);
    } catch (e) {
      console.error(`Module ${(module as any).MODULE_NAME}: initialization FAILED`, e);
    }

  }

  console.log(`--- Loaded ${successCounter}/${modules.length} modules ---`);
}

async function loadModule(container: Container, module: AppModuleChild) {
  return container.resolve(module).init();
}

async function initEvents(appEvents: AppEvents) {
  appEvents.onItemsLoaded.next({isInitial: true});
}
