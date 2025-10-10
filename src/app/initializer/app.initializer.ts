import { SessionInitializerService } from '../services/transactional/session-initializer.service';

export function appInitializerFactory(sessionInitializerService: SessionInitializerService) {
  return () => sessionInitializerService.validate();
}
