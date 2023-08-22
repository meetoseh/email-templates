import { Route } from './lib/route';
import managementRoutes from './management/router';

const routes: {
  [prefix: string]: Route[];
} = {};
routes['/api/3/management'] = managementRoutes;

export default routes;
