const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// makes url friendly
const slug = require('slugs');

//strict schema
const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a store name',	
	},
	slug: String,
	description: {
		type: String,
		trim: true,
	},
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type:	String,
			default: 'Point'
		},
		coordinates: [{
			type: Number,
			required: 'You must supply coordinates!'
		}],
		address: {
			type: String,
			required: 'You must supply an address!',
		}
	}
});


// implicit binding, equals to the owner object
storeSchema.pre('save', function(next) {
	if (!this.isModified('name')) {
		next(); //skip it

		return; // stop this function from running
	}

	this.slug = slug(this.name);
	next();
	//to do make more
});

module.exports = mongoose.model('Store', storeSchema);