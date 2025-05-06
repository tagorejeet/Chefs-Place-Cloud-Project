import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import 'dotenv/config';

const client = jwksClient({
  jwksUri: `${process.env.REACT_APP_APPID_DISCOVERY_ENDPOINT.replace('.well-known/openid-configuration', 'publickeys')}`
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err });
    }
    req.user = decoded;
    next();
  });
};

// You might still need appIDSetup for the initial App ID configuration
import session from 'express-session';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';

const appIDSetup = (app) => {
  if (!app || typeof app.use !== 'function') {
    throw new Error("Expected an Express app instance in appIDSetup()");
  }

  app.use(session({
    secret: 'your-strong-secret',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('appid', new OAuth2Strategy({
    authorizationURL: 'https://eu-de.appid.cloud.ibm.com/oauth/v4/b839377b-e3a7-4f85-9b5d-223e7c18712c/authorize',
    tokenURL: 'https://eu-de.appid.cloud.ibm.com/oauth/v4/b839377b-e3a7-4f85-9b5d-223e7c18712c/token',
    clientID: '3fdd086a-7ea1-4732-91f3-8f211feea577',
    callbackURL: 'http://localhost:4000/appid/callback',
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

export default appIDSetup;