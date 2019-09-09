exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isLogin: true,
      pageStyles: ['forms', 'auth']
    });
  };
  