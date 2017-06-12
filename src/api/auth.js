import jwt from 'jsonwebtoken';
import express from 'express';
import sha512 from 'sha512';
import {graphql, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull} from 'graphql';
import secret from 'src/constants/secret';
import AuthController from 'src/controllers/auth-controller';
import User from 'src/schema/graphql/User';

let auth = express();
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: User,
      args: {
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

const Schema = new GraphQLSchema({
  query: Query
});

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

function createToken(user) {
  return jwt.sign(user, secret['secret'], {
    expiresIn: 1440*60 //24 hours
  });
}

auth.post('/signin', async (req, res) => {
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex');
  let result = await getAccountSchema(username, password);
  let user = result.data.user;
  if(user) {
    let token = createToken(user);
    res.send({
      success: true,
      token: token,
      user: user
    });
  }else {
    res.send({
      success: false,
      message: 'Incorrect username or password'
    });
  }
});

auth.post('/signup', async (req ,res) => {
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex');
  let site_id = parseInt(req.body.site_id);
  let admin = Boolean(req.body.admin);
  try{
    let user = await AuthController.signup({username, password, site_id, admin});
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
