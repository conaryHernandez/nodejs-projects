const User = require('../../models/user');
const authController = require('../auth');

describe('Auth Controller - Login', () => {
    it('it should throw an error with code 500 if accessing databse fails' , (done) => {
        User.findOne = jest.fn().mockRejectedValue(new Error('error')); // - Connection Error 

        const req = {
            body: {
                email: 'test@test.com',
                password: 'test',
            }
        };

        authController.login(req, {}, () => {}).then(result => {
            expect(result).toHaveProperty('statusCode', 500);
            done();
        });

        User.findOne.mockReset();
    });

    it('it should throw an error with code 401 if accessing user is not valid' , (done) => {
        // User.findOne = jest.fn().mockImplementation(() => Promise.reject(new Error())); - Connection Error
        // User.findOne = jest.fn().mockRejectedValue(new Error('error')); // - Connection Error 
        User.findOne = jest.fn(); // - Invalid User error

        const req = {
            body: {
                email: 'test@test.com',
                password: 'test',
            }
        };

        authController.login(req, {}, () => {}).then(result => {

            expect(result).toHaveProperty('statusCode', 401);
            done();
        });

        User.findOne.mockReset();
    });
});