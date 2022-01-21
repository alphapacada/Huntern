/*---------REQUIRED------------------*/

const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const multer = require('multer');
// const passport = require('./config/passport');
const passport = require('passport');
const database = require('./database');

//-------DATABASE MODELS HERE-----------
const Company = require('./database').Company;
const Admin = require('./database').Admin;
const Student = require('./database').Student;

const app = express();

app.engine('html', consolidate.nunjucks);
//------------ROUTING------------------
app.set('views', './templates');
app.set('routes', './routes');
app.use('/static', express.static('./static'));
//app.use(require('./routes/auth-routes'));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());
// app.use(passport.initialize());

app.use('./static', express.static('./static'));
app.use('/logo', express.static('./uploads'));
//app.use(require('./auth-routes'));


//--------DO NOT DELETE ^ --------//

app.get('/', function (req, res) {
	console.log('body of render.');
	res.render('index.html');
});

app.get('/signup.html', function (req, res) {
	res.render('signup.html');
})

var retrieveSignedInUser = function (req, res, next) {
	const email = req.session.currentUser;

	User.findOne({ where: { email: email } }).then(function (user) {
		console.log("retrieveSignedInUser" + user);
		req.user = user;
		next();
	});
}

app.post('/signup', function (req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const confirmpassword = req.body.confirmpassword;

	if (password !== confirmpassword) {
		return res.redirect('/');
	}

	Student.findOne({
		where: { email: email },
		attributes: ['email']
	}
	).then(function (student) {
		if (student !== null) {
			console.log('Email is already in use');
			return res.redirect('/');
		}

		Student.create({ email: email, password: password, name: name }).then(function () {
			console.log('Signed Up Successfully!');
			res.redirect('forms.html');
		});
	});
});

app.get('/forms.html', function (req, res) {
	res.render('forms.html');
})

app.get('/signup.html', function (req, res) {
	res.render('signup.html');
})

app.get('/adminlogin.html', function (req, res) {
	res.render('adminlogin.html');
});

app.post('/signin', retrieveSignedInUser, function (req, res) {
	const email = req.body.email;
	const password = req.body.pasword;

	Admin.findOne({ where: { email: email, password: password } }).then(function (user) {

	});
});


////////
// router.post('/signin', function(req, res) {
// 	const email = req.body.email;
//   const password = req.body.password;
// 	const remember = req.body.remember;
//
// 	User.findOne({ where: { email: email } }).then(function(user) {
//         if (user === null) {
//             req.flash('signInMessage', 'Incorrect email.');
//             return res.redirect('/');
//         }
//
// 		const match = bcrypt.compareSync(password, user.password);
// 		if (!match) {
// 			req.flash('signInMessage', 'Incorrect password.')
// ;			return res.redirect('/');
// 		}
//
//         req.flash('statusMessage', 'Signed in successfully!');
//         req.session.currentUser = user.email;
//         req.user = user;
// 		if (remember) {
// 			req.session.cookie.maxAge = 1000 * 60 * 60;
// 		}
// 		res.redirect('/profile');
//     });
// });

app.post('/companydetails', retrieveSignedInUser, function (req, res) {
	const companyName = req.body.companyName;
	const companyAbout = req.body.companyAbout;
	const location = req.body.location;
	const email = req.body.email;
	const website = req.body.website;
	const number = req.body.number;
	const program = req.body.program;
	const category = req.body.category;

	Company.create({
		companyName: companyName,
		companyAbout: companyAbout,
		location: location,
		email: email,
		website: website,
		number: number,
		program: program,
		category: category
	}).then(function () {
		console.log('Details Updated Successfully!');
		res.redirect('forms.html'); //html to alpha's forms 2
	});

});

// const upload = multer({ dest: "./uploads"});

// app.post('/upload-logo', upload.single('logo'), function(req, res){
//
// 	const id = res.session.currentUser;
// 	User.findOne({where {id:id}}).then(function(user){
// 			user.update({logo: '/logo/' + req.file.filename});
// 			res.redirect('/profile'); //
// 	});
// });

app.listen(3000, function () {
	console.log('Server is now running at port 3000');
});
