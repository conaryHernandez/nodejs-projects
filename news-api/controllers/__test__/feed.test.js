const User = require('../../models/User');
const Post = require('../../models/Post');
const feedController = require('../feed');
const mongoose = require('mongoose');

describe('Feed Controller - Get User status', () => {
    let connection;
  
    beforeAll(async() => {
        const MONGODB_URI = `mongodb://conaryh:k9X9MpdWnfHYcqMC@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/test-messages?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority`;

        connection = await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        const user = new User({
            email: 'test@test.com',
            password: 'test',
            name: 'test',
            posts: [],
            _id: '5c0f66b979af55031b34727a'
        })

        return user.save();
    });
  
    afterAll(async () => {
        await User.deleteOne({_id: '5c0f66b979af55031b34727a'});
        await Post.deleteMany({ _id: { $nin: '5d9bf3e53d4e6e3568a4d6a4' } });

        return mongoose.disconnect();    
    });
    
    it('should send a response with a valid user status for existing user', (done) => {

        const req = { userId: '5c0f66b979af55031b34727a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;

                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };

        feedController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).toEqual(200);
            expect(res.userStatus).toEqual('new');
            done();
        });
    });

    it('should add a create post to the posts of the creator', (done) => {
        const req = {
            body: {
                title: 'a testing post',
                content: 'this is a test',    
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34727a',
        };
        const res = {
            status: jest.fn(function() {return this}),
            json: jest.fn(),
        };

        return feedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).toHaveProperty('posts');
            expect(savedUser.posts).toHaveLength(1);
            done();
        });
    });

    it('should retrive all post from databse, in this case 2', (done) => {
        const req = {
            query: {
                page: 1,
            },
            userId: '5c0f66b979af55031b34727a',
        };
        const res = {
            statusCode: 500,
            message: null,
            posts: [],
            totalItems: 0,
            status: function(code) {
                this.statusCode = code;

                return this;
            },
            json: function(data) {
                this.message = data.message;
                this.posts = data.posts;
                this.totalItems = data.totalItems;
            }
        };

        feedController.getPosts(req, res, () => {}).then(() => {
            expect(res.statusCode).toEqual(200);
            expect(res.posts).toHaveLength(2);
            done();
        });
    });

    it('should retrieve a single post', (done) => {
        const req = {
            params: {
                postId: '5d9bf3e53d4e6e3568a4d6a4', 
            }
        };
        const res = {
            statusCode: 500,
            message: null,
            post: [],
            status: function(code) {
                this.statusCode = code;

                return this;
            },
            json: function(data) {
                this.post = data.post;
            }
        };

        feedController.getPost(req, res, () => {}).then(() => {
            expect(res.statusCode).toEqual(200);
            expect(res.post._doc).toHaveProperty('_id');
            done();
        });
    });
});