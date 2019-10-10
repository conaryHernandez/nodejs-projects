const shopController = require('../shop');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product');

describe('shop controller', () => {
  beforeAll(async() => {
      const MONGODB_URI = `mongodb://conaryh:O0uDbWzvy9luBLw3@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/test-nodejs-sandbox?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority`;

      connection = await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
      const user = new User({
          email: 'test@test.com',
          password: 'test',
          resetToken: null,
          resetTokenExpiration: null,
          cart: { items: []},
          _id: '5c0f66b979af55031b34727a'
      })

      return user.save();
  });

  afterAll(async () => {
      await User.deleteOne({_id: '5c0f66b979af55031b34727a'});
      // await Post.deleteMany({ _id: { $nin: '5d9bf3e53d4e6e3568a4d6a4' } });

      return mongoose.disconnect();
  });

  it('post cart controller', (done) => {
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


  });
});