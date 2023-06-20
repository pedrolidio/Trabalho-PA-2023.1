const express = require('express');

const verifyJWT = require('./middlewares/verifyJWT');
const verifyRole = require('./middlewares/verifyRole');
const verifyEmailAvailability = require('./middlewares/verifyEmailAvailability');

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const FormsController = require('./controllers/FormsController');
const OrderController = require('./controllers/OrderController');
const AddressController = require('./controllers/AddressController');

const routes = express.Router();

routes.post('/users', verifyEmailAvailability, UserController.create);
routes.post('/verify/email', verifyEmailAvailability, FormsController.verifyEmailAvailability);
routes.post('/sessions', SessionController.create);

// Rotas que necessitam de autenticação do usuário.

routes.use(verifyJWT);
routes.get('/sessions', SessionController.verify);
routes.delete('/sessions', SessionController.end);

routes.get('/order/form', FormsController.getOrderFormProps); 
routes.post('/order', OrderController.create);

// Lembrete: verificar compatibilidade destas funções/adicionar recepção do id a partir do token
routes.get('/orders/pending', verifyRole("admin", "manager"), OrderController.list_all_orders); 
routes.get('/orders/:id', OrderController.list_user);
routes.post('/order/:id', OrderController.update_order);
routes.post('/address', AddressController.create); 
routes.get('/addresses', AddressController.getAddressesByUser);

// Rotas que necessitam de permissão de manager/admin.
routes.use(verifyRole("admin"));
routes.get('/users', UserController.index);


module.exports = routes;
