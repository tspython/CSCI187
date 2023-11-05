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

//custom modules
const uber = require('./uber');

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

app.get('/dashboard', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const uberAccessToken = req.user.uberAccessToken; // Assuming you have stored the Uber access token during authentication
    const rideInfo = await uber.getCurrentRide(uberAccessToken);
    const estimatedTimeRemaining = rideInfo.eta; // Modify this based on the actual structure of the Uber API response
    res.json({ message: 'Welcome to your dashboard!', email: req.user.email, remainingTime: estimatedTimeRemaining });
  }
  catch (error) {
    res.status(500).send('Error fetching ride information from Uber API');
  }
});

// UBER
passport.use('uber', new passportOAuth2.Strategy({
  authorizationURL: 'https://login.uber.com/oauth/v2/authorize',
  tokenURL: 'https://login.uber.com/oauth/v2/token',
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'http://your-callback-url.com/auth/uber/callback', // Update this URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Assuming the profile contains an identifier such as 'id'
    const uberId = profile.id;

    // Try to find the user in the database
    let user = await prisma.user.findUnique({
      where: { uberId }
    });

    if (user) {
      // User exists, update their Uber access tokens
      user = await prisma.user.update({
        where: { uberId },
        data: {
          uberAccessToken: accessToken,
          uberRefreshToken: refreshToken,
        },
      });
    } else {
      // User does not exist, create a new user with the Uber profile info
      user = await prisma.user.create({
        data: {
          uberId: uberId,
          uberAccessToken: accessToken,
          uberRefreshToken: refreshToken,
          // You can store other profile information here
          // e.g. email: profile.email
        },
      });
    }
    
    // Pass the user object to the done function which will be utilized by the next middleware or route handler
    return done(null, user);

  } catch (error) {
    return done(error, null);
  }
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