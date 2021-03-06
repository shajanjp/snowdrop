const express = require('express');
const ejs = require('ejs');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const activeModules = require('./modules.js').activeModules;

const apiRoutes = express.Router(); // eslint-disable-line new-cap
const uiRoutes = express.Router(); // eslint-disable-line new-cap

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');
require('../app/users/models/users.server.model.js');
const userController = require('../app/users/controllers/users.server.controller.js');

module.exports = function() {
  const app = express();
  
  app.set('view engine', 'ejs');
  app.set('views', './app');

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/',userController.authUser);

  console.log('loading UI routes...');
  activeModules.forEach((module) => {
    const moduleRoutes = require(`../app/${module.name}/config/${module.name}.config.json`).uiRoutes;
    if (moduleRoutes !== undefined) {
      moduleRoutes.forEach((routeFile) => {
        uiRoutes.use(module.root, require(`../app/${module.name}/routes/${routeFile}`));
        console.log(`loading ${routeFile}`);
      });
    }
  });

  app.use('/', uiRoutes);

  console.log('loading API routes...');

  activeModules.forEach((module) => {
    const moduleAPIRoutes = require(`../app/${module.name}/config/${module.name}.config.json`).apiRoutes;
    if (moduleAPIRoutes !== undefined) {
      moduleAPIRoutes.forEach((routeFile) => {
        apiRoutes.use(module.root, require(`../app/${module.name}/routes/${routeFile}`));
        console.log(`loading ${routeFile}`);
      });
    }
  });

  app.use('/api', apiRoutes);
  
  return app;
};
