import { PendingRoute } from './lib/route';
import managementRoutes from './management/router';
import templateRoutes from './email/router';
import docsRoute from './openapi/routes/docs';

const routes: {
  [prefix: string]: PendingRoute[];
} = {};
routes['/management'] = managementRoutes;
routes['/templates'] = templateRoutes;
routes[''] = [docsRoute];

export default routes;
