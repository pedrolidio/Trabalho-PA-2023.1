const express = require('express');

const verifyJWT = require('./middlewares/verifyJWT');
const verifyEmailAvailability = require('./middlewares/verifyEmailAvailability');

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const FormController = require('./controllers/FormController');

const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/users', verifyEmailAvailability, UserController.create);
routes.post('/verify/email', verifyEmailAvailability, FormController.verifyEmailAvailability);
routes.post('/sessions', SessionController.create);

// Rotas que necessitam de autenticação do usuário.

routes.use(verifyJWT);
routes.get('/sessions', SessionController.verify);
routes.delete('/sessions', SessionController.end);

module.exports = routes;
