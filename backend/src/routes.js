const express = require('express');

const verifyJWT = require('./middlewares/verifyJWT');
const verifyEmailAvailability = require('./middlewares/verifyEmailAvailability');

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const FormController = require('./controllers/FormController');
const orderCake = require('./controllers/OrderCake');
const sendTables = require('./controllers/SendTables');
const addressCake = require('./controllers/AddressCake');

const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/users', verifyEmailAvailability, UserController.create);
routes.post('/verify/email', verifyEmailAvailability, FormController.verifyEmailAvailability);
routes.post('/sessions', SessionController.create);

// Rotas que necessitam de autenticação do usuário.

routes.use(verifyJWT);
routes.get('/sessions', SessionController.verify);
routes.delete('/sessions', SessionController.end);

routes.get('/cakes/props',sendTables.send_values)

routes.post('/order', orderCake.create_order);
routes.get('/orders/pending', orderCake.list_all_orders); 
routes.get('/orders/:id', orderCake.list_user);
routes.post('/order/:id', orderCake.update_order);

routes.post('/address', addressCake.create_address); 
routes.get('/address/:id', addressCake.list_address_user);

module.exports = routes;
