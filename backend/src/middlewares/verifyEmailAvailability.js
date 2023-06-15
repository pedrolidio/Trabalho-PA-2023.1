const connection = require('../database/connection');

const verifyEmailAvailability = async (request, response, next) => {
    const { email } = request.body;

    if(!email)
        return response.status(401).json({ error: "No e-mail received"});

    const user = await connection('users').select('email').where('email', email).first();
    const available = user ? false : true;
    request.isEmailAvailable = available;

    next();
}

module.exports = verifyEmailAvailability;