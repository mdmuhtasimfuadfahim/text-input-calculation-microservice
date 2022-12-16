const express = require('express');
const resultRoute = require('./result.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/result',
    route: resultRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
