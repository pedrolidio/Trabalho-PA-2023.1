const verifyRole = (...allowedRoles) => {
    return (request, response, next) => {
        if(!request.userRole || !allowedRoles.includes(request.userRole))
            return response.status(401).json({ error: "User does not have sufficient permissions for this request"});
        
        next();
    }
}

module.exports = verifyRole;