const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const ticketRoute = require('./ticket.route');
const busRoute = require('./bus.route');
const boRoute = require('./bo.route');
const bsRoute = require('./bs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/bus',
    route: busRoute,
  },
  { path: '/admin', route: adminRoute },
  { path: '/ticket', route: ticketRoute },
  { path: '/bus-operator', route: boRoute },
  { path: '/bus-station', route: bsRoute },
];

const devRoutes = [
  // routes available only in development mode
  // {
  //   path: '/docs',
  //   route: docsRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
