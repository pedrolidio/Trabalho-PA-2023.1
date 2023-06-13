const express = require('express');
const bcrypt = require('bcrypt');

const connection = require('./database/connection');

const routes = express.Router();

routes.get('/users', async (request, response) => {
    const users = await connection('users').select('*');

    console.log(users);

    return response.json();
})

routes.post('/check/email', async (request, response) => {
    const { email } = request.body;
    const user = await connection('users').select('*').where('email', email);

    console.log(user);

    return response.json({
        available: user.length > 0 ? false : true
    });
})

routes.post('/users', async (request, response) => {
    const { name, email, whatsapp } = request.body;
    let { password } = request.body;

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    await connection('users').insert({
        name,
        email,
        whatsapp,
        password
    })

    console.log({
        name, email, whatsapp, password
    });

    return response.json();
})

routes.post('/sessions', async (request, response) => {
    const { email, password } = request.body;

    const user = await connection('users').select('*').where('email', email).first();

    console.log(user)

    if(!user) {
        return response.status(400).json({ error: "No user found with this e-mail address"});
    }

    bcrypt.compare(password, user.password).then(function(result) {
        if(result == true) { // GRAVAR OS COOKIES INDICANDO QUE INICIOU A SESSÃO
            return response.json({
                token: "123456789",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    whatsapp: user.whatsapp
                }
            });
        } else {
            return response.status(401).json({ error: "Invalid user credentials"});
        }
    });
})

module.exports = routes;
