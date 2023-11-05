const express = require('express');
const passport = require('passport');
const passportOAuth2 = require('passport-oauth2');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const SECRET = '2c06c934f5f3047e4366794f2b89cfe0f7b6a93d708f502d69a09fbfd3451f5eb392112bf2336376d6fc225e6880d73a95c3b0c2f8fe2af600a5a47657b4e2b1';

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
}, async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
        },
    });
    res.json({ message: 'Registration successful!' });
} catch (error) {
    if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
        res.status(400).json({ error: 'Email already in use.' });
    } else {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // User is authenticated, let's generate a token for them
    const tokenPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, SECRET, { expiresIn: '1h' });
    res.json({ token });
    
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

function ensureAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send('Not authenticated');
    req.user = user;
    next();
  })(req, res, next);
}

app.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Welcome to your dashboard!', email: req.user.email });
});

// UBER
passport.use('uber', new passportOAuth2.Strategy({
  authorizationURL: 'https://login.uber.com/oauth/v2/authorize',
  tokenURL: 'https://login.uber.com/oauth/v2/token',
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'http://your-callback-url.com/auth/uber/callback', // Update this URL
}, async (accessToken, refreshToken, profile, done) => {
  // Here, you can handle the user data received from Uber
  // You can save the user data to your database or use it as needed
  // For example, you can create a new user in your database or find an existing user based on the profile data.

  // In the end, call done(null, user) to indicate successful authentication.

  // Example:
  // const user = await findOrCreateUser(profile);
  // done(null, user);
}));

app.get('/user/uber', passport.authenticate('uber'));

app.get('auth/uber/callback',
        passport.authenticate('uber', { faiureRedirect: '/login' }),
        (req, res) => {
          res.redirect('/dashbaord');
        }
       );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

