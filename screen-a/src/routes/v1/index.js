const express = require('express');
const calculationRoute = require('./calculation.route');
const microserviceRoute = require('./microservice.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/calculation',
    route: calculationRoute,
  },
  {
    path: '/microservice/calculation',
    route: microserviceRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
