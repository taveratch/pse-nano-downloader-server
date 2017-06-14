import jwt from 'jsonwebtoken';
import express from 'express';
import sha512 from 'sha512';
import {graphql, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull} from 'graphql';
import secret from 'src/constants/secret';
import AuthController from 'src/controllers/auth-controller';
import User from 'src/schema/graphql/User';

let auth = express();
auth.set('secret', secret['secret']);

/*
  Query object for being called in graphql()
*/
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: User,
      args: { // arguments
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(parent,{username, password}) {
        return await AuthController.signin(username, password);
      }
    }
  })
});

/*
  Schema object
*/
const Schema = new GraphQLSchema({
  query: Query
});

/*
  Query language, querying a user from username and password
  @return : object of a user.
*/
function getAccountSchema(username, password) {
  return graphql(Schema, `{
    user(username: "${username}", password: "${password}") {
      id,
      username,
      admin,
      site {
        id,
        name,
        url
      }
    }
  }`);
}

/*
  Creat token from user object.
*/
function createToken(user) {
  return jwt.sign(user, auth.get('secret'), {
    expiresIn: 1440*60 //24 hours
  });
}

auth.post('/authenticate', async (req, res) => {
  let token = req.body.token;
  /*If there is a token in a request, then start verify it*/
  if(token) {
    /*verify token*/
    jwt.verify(token, auth.get('secret'), (err, decoded) => {
      /* if token is invalided or expired then return error*/
      if(err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }else { /* otherwise, return the user*/
        return res.json({
          success: true,
          user: decoded
        });
      }
    });
  }else {
    /* return 403 status if there is no token in a request*/
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

/* Route for sign in with username and password*/
/* @return : a object that contains user and token*/
auth.post('/signin', async (req, res) => {
  /* Get parameter from a request */
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex'); //use sha512 to hash the password before checking
  let result = await getAccountSchema(username, password); //calling graphql to get user from database
  let user = result.data.user;
  /* If user exists, create a token */
  if(user) {
    let token = createToken(user);
    res.send({
      success: true,
      token: token,
      user: user
    });
  }else { /* Otherwise, send an error */
    res.send({
      success: false,
      message: 'Incorrect username or password'
    });
  }
});

/*
  Route for signup.
  @return: a object that contains token and user.
*/
auth.post('/signup', async (req ,res) => {
  /*Get parameters from a request */
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex'); // hash pass with sha512
  let site_id = parseInt(req.body.site_id);
  let admin = Boolean(req.body.admin);
  /* Call signup() from auth-controller. */
  try{
    let user = await AuthController.signup({username, password, site_id, admin});
    /*If able to create new user, then call graphql to get the user that has created. */
    let result = await getAccountSchema(user.username, user.password);
    let userResult = result.data.user;
    let token = createToken(user);
    res.send({
      success: true,
      token: token,
      user: userResult
    });
  }catch (err) {
    res.send({
      success: false,
      message: err
    });
  }
});

export default auth;
