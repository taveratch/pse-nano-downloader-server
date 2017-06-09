import {GraphQLID, GraphQLString, GraphQLObjectType} from 'graphql';

export default new GraphQLObjectType({
  name: 'sites',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    }
  })
});
