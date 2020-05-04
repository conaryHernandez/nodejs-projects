const authMiddleware = require('../is-auth');
const jwt = require('jsonwebtoken');

describe('is auth middleware', () => {
    it('should throw an error if authorization middleware is not present', () => {
        const req = {
            get: function() {
                return null;
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).toThrow('Not authenticated');
    });
    
    it('should throw an error if authorization header is only one string', () => {
        const req = {
            get: function() {
                return 'xyz';
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).toThrow();
    });

    it('should yield a userId after decoding token', () => {
        const req = {
            get: function() {
                return 'Bearer aslklkfnrekdsjdk';
            }
        }

        jwt.verify = jest.fn(() => {
            return {
                userId: 'user1',
            } 
        });
    
        authMiddleware(req, {}, () => {});
        expect(req).toHaveProperty('userId');
        expect(jwt.verify).toBeCalled();
        jwt.verify.mockReset();
    });

    it('should throw an error if authorization token is invalid', () => {
        const req = {
            get: function() {
                return 'Bearer xyz';
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).toThrow();
    });
});
