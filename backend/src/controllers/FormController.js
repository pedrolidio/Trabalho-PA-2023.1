module.exports = {
    async verifyEmailAvailability(request, response) {
        const available = request.isEmailAvailable;

        return response.json({ available });
    }
};
