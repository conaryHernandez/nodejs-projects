exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')
    .split(';')[0]
    .trim()
    .split('=')[1]

  console.log('isLoggedIn', isLoggedIn);

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLogin: true,
    pageStyles: ['forms', 'auth'],
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'isLoggedIn=true');
  res.redirect('/');
};