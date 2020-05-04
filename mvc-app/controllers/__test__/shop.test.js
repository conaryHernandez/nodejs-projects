const shopController = require('../shop');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product');

describe('shop controller', () => {
  beforeAll(async() => {
      const MONGODB_URI = `mongodb://tester:testerpass@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/test-nodejs-sandbox?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority`;

      connection = await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  });

  afterAll(async () => {
      return mongoose.disconnect();
  });

  describe('POST Cart Controller', () => {
    it('product should be added to the cart and redirect', (done) => {
      const req = {
        body: {
          productId: '5c0f66b979af55031b34727a',
        },
        user: {
          addToCart: jest.fn(),
        }
      };
      const res = {
        redirect: jest.fn(),
      };
      Product.findById = jest.fn().mockResolvedValue(() => {
        return {
          _id: '5c0f66b979af55031b34727a',
        }
      });

      shopController.postCart(req, res, () => {}).then(() => {
        expect(req.user.addToCart).toBeCalled();
        expect(res.redirect).toBeCalled();
        done();
      });
      Product.findById.mockReset();
    });

    it('should throw error "No product found!" if product doesnt not exists', (done) => {
      const req = {
        body: {}, // no product found
        user: {
          addToCart: jest.fn(),
        }
      };
      const res = {
        redirect: jest.fn(),
      };
      Product.findById = jest.fn().mockRejectedValue(() => {
        return null;
      });

      shopController.postCart(req, res, () => {}).then((result) => {
        console.log('result', result);

        expect(req.user.addToCart).not.toBeCalled();
        expect(res.redirect).not.toBeCalled();
        done();
      });
      Product.findById.mockReset();
    });
  });
});