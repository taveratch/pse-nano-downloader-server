import {GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType} from 'graphql';
import SiteController from 'src/controllers/site-controller';
import Site from './Site';

export default new GraphQLObjectType({
  name: 'users',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    admin: {
      type: GraphQLBoolean
    },
    site: {
      type: Site,
      async resolve(parent) {
        return await SiteController.get(parent.site_id);
      }
    }
  })
});
