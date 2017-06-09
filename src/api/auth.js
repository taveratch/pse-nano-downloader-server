import express from 'express';
import sha512 from 'sha512';
import {graphql, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull} from 'graphql';
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

auth.post('/signin', async (req, res) => {
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex');
  let result = await getAccountSchema(username, password);
  res.send(result.data);
});

auth.post('/signup', async (req ,res) => {
  let username = req.body.username;
  let password = sha512(req.body.password).toString('hex');
  let site_id = parseInt(req.body.site_id);
  let admin = Boolean(req.body.admin);
  let user = await AuthController.signup({username, password, site_id, admin});
  let result = await getAccountSchema(user.username, user.password);
  res.send(result.data);
});

export default auth;
