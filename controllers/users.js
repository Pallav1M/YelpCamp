const User = require('../models/user');

// RENDER USER REGISTER
module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs')
};

// REGISTER NEW USER
module.exports.registerNewUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // this ensures that you login after you register
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

// RENDER USER LOGIN PAGE
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
};

// LOGIN
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    // This takes you to the same page where it requests you to login
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
};

// LOGOUT
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/campgrounds');
};