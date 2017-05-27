/*---------REQUIRED------------------


*/


const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const passport = require('./config/passport');
const database = require('./database');

//-------DATABASE MODELS HERE-----------
// const User = require('./models').User;
// const Account = require('./models').Account;

const app = express();

app.engine('html', consolidate.nunjucks);
//------------ROUTING------------------
app.set('views', './templates');
app.set('routes','./routes');
app.use('/static', express.static('./static'));
app.use(require('./routes/auth-routes'));


app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());
app.use(passport.initialize());

//--------DO NOT DELETE ^ --------//

app.get('/', function(req, res) {
	console.log('body of render.');
	res.render('index.html');

});
 // signIn middleware

var retrieveSignedInUser = function(req, res, next) {
	const email = req.session.currentUser;

    User.findOne({ where: { email:email } }).then(function(user) {
    	console.log("retrieveSignedInUser" + user);
    	
    	console.log("retrieveSignedInUser2" + req.session.currentUser);
    	console.log("retrieveSignedInUser3" + req.session.currentUser);
    	req.user = user;
    	next();
    });
}
app.get('/profile', requireSignedIn, retrieveSignedInUser, function(req, res) {
	const email = req.user;
	const name = req.user;
	console.log("PROFILE" + email);
		res.render('profile.html', {
			user: req.user
		}); 
});

app.post('/transfer', requireSignedIn, retrieveSignedInUser, function(req, res) {
	//console.log("transfer" + req.user);
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);
	const user = req.user;
	console.log("TRANSFER" + user.id);
	const email = req.session.currentUser;
	const id = user.id;
	
	User.findOne({where:{email:recipient}}).then(function(senderAccount) {
			Account.findOne({ where: { user_id: id, user_id:senderAccount.id}}).then(function(receiverAccount) {
		
			console.log("RECEIVER" + Account);
				// Account.findOne({ where: { user_id: receiver.id } }).then(function(receiverAccount) {
					database.transaction(function(t) {
						return senderAccount.update({
							balance: senderAccount.balance - amount
						}, { transaction: t }).then(function() {
							return receiverAccount.update({
								balance: receiverAccount.balance + amount
							}, { transaction: t });
						});
					}).then(function() {
						req.flash('statusMessage', 'Transferred ' + amount + ' to ' + recipient);
						res.redirect('/profile');
					});
	});
	
	 
});

});
app.post('/deposit', requireSignedIn,  retrieveSignedInUser, function(req, res){
	const amount = parseInt(req.body.amount, 10);
	const sender =  req.user.id;
	console.log("DEPOSIT");

	
		Account.findOne({ where: { user_id: sender } }).then(function(senderAccount) {
			database.transaction(function(t) {
				return senderAccount.update({
					balance: senderAccount.balance + amount
				}, { transaction: t });
			}).then(function() {
				req.flash('statusMessage', 'Deposit of ' + amount + ' is succesful');
				res.redirect('/profile');
			});
		});
	});


app.post('/withdraw', requireSignedIn,retrieveSignedInUser, function(req, res){
	const amount = parseInt(req.body.amount, 10);
	const sender = req.user.id

	//User.findOne({ where: { email: email } }).then(function(sender) {
		Account.findOne({ where: { user_id: sender } }).then(function(senderAccount) {
			database.transaction(function(t) {
				return senderAccount.update({
					balance: senderAccount.balance - amount
				}, { transaction: t });
			}).then(function() {
				req.flash('statusMessage', 'Withdrawal of ' + amount + ' is succesful');
				res.redirect('/profile');
			});
		});
	
});

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
