const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimeType.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: 'that filetype isn\'t allowed' }, false);
		}
	}
}
/* exports.myMiddleWare = (req, res, next) => {
	req.name = 'wes';
	//res.cookie('name', 'conary', {maxAge: 1000});
	if (req.name === 'wes') {
		throw Error('stupid name');
	}
	next();
} */

export.upload = multer(multerOptions).single('photo');

exports.homePage = (req, res) => {
	console.log(req.name);
	// req.flash('error', 'something happened');
	// req.flash('info', 'something happened');
	// req.flash('warning', 'something happened');
	// req.flash('success', 'something happened');
	res.render('index');
}

exports.addStore = (req, res) => {
	res.render('editStore', { title: 'Add Store'} );
}

exports.createStore = async(req, res) => {
	/*try {
		const store = new Store(req.body);

		await store.save();
		console.log('saved');
		res.redirect('/');

	} catch(e) {
		// statements
		console.log(e);
	} */
	
	/*store
		.save()
		.then(store => {
			return Store.find()
		})
		.then(stores => {
			res.render('store list', {stores: stores})
		})
		.catch(err => {
			throw Error(err);
		})
	*/
		const store = await (new Store(req.body)).save();

		req.flash('success', `successfully created ${store.name}. Care to leave a review`);
		res.redirect(`/store/${store.slug}`);	
	//res.json(req.body);
}

exports.getStores = async(req, res) => {
	// 1. query database for a list of all stores
	const stores = await Store.find();

	console.log(stores);

	res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async(req, res) => {
	// 1. find the store
	const store = await Store.findOne({ _id: req.params.id});
	
	//res.json(store);

	// 2. confirme the owner of the store
	// 3. render out the edit form so the user can update their store
	res.render('editStore', { title: `Edit ${store.name}`, store});
}

exports.updateStore = async(req, res) => {
	//find and update the store
	req.body.location.type = "Point";

	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
		new: true, //return the new store
		runValidators: true,
	}).exec();
	req.flash('sucess', `successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store </a>`);
	res.redirect(`/stores/${store._id}/edit`);
	//redirect them the store
};