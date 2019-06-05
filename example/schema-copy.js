/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const businesses = {};

// Test Schema
const TestEnum = new GraphQLEnumType({
  name: 'TestEnum',
  values: {
    RED: { description: 'A rosy color' },
    GREEN: { description: 'The color of martians and slime' },
    BLUE: { description: 'A feeling you might have if you can\'t use GraphQL' },
  }
});

const TestInputObject = new GraphQLInputObjectType({
  name: 'TestInput',
  fields: () => ({
    string: {
      type: GraphQLString,
      description: 'Repeats back this string'
    },
    int: { type: GraphQLInt },
    float: { type: GraphQLFloat },
    boolean: { type: GraphQLBoolean },
    id: { type: GraphQLID },
    enum: { type: TestEnum },
    object: { type: TestInputObject },
    // List
    listString: { type: new GraphQLList(GraphQLString) },
    listInt: { type: new GraphQLList(GraphQLInt) },
    listFloat: { type: new GraphQLList(GraphQLFloat) },
    listBoolean: { type: new GraphQLList(GraphQLBoolean) },
    listID: { type: new GraphQLList(GraphQLID) },
    listEnum: { type: new GraphQLList(TestEnum) },
    listObject: { type: new GraphQLList(TestInputObject) },
  })
});

const TestInterface = new GraphQLInterfaceType({
  name: 'TestInterface',
  description: 'Test interface.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'Common name string.'
    }
  }),
  resolveType: check => {
    return check ? UnionFirst : UnionSecond;
  }
});

const UnionFirst = new GraphQLObjectType({
  name: 'First',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'Common name string for UnionFirst.'
    },
    first: {
      type: new GraphQLList(TestInterface),
      resolve: () => { return true; }
    }
  }),
  interfaces: [ TestInterface ]
});

const UnionSecond = new GraphQLObjectType({
  name: 'Second',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'Common name string for UnionFirst.'
    },
    second: {
      type: TestInterface,
      resolve: () => { return false; }
    }
  }),
  interfaces: [ TestInterface ]
});

const TestUnion = new GraphQLUnionType({
  name: 'TestUnion',
  types: [ UnionFirst, UnionSecond ],
  resolveType() {
    return UnionFirst;
  }
});

const BusinessType = new GraphQLObjectType({
  name: 'Business',
  fields: () => ({
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The name of the business',
      resolve: (business, args) => business.name,
    },
    street: {
      type: GraphQLString,
      description: 'The street where the business is located',
      resolve: (business, args) => business.street,
    },
    house_number: {
      type: GraphQLInt,
      description: 'The house number of the address',
      resolve: (business, args) => business.house_number,
    },
    house_number_addition: {
      type: GraphQLString,
      description: 'The addition to the house number (eg A in the number 23A)',
      resolve: (business, args) => business.house_number_addition,
    },
  })
})

const TestType = new GraphQLObjectType({
  name: 'Test',
  fields: () => ({
    test: {
      type: TestType,
      description: '`test` field from `Test` type.',
      resolve: () => ({})
    },
    union: {
      type: TestUnion,
      description: '> union field from Test type, block-quoted.',
      resolve: () => ({})
    },
    id: {
      type: GraphQLID,
      description: 'id field from Test type.',
      resolve: () => 'abc123',
    },
    isTest: {
      type: GraphQLBoolean,
      description: 'Is this a test schema? Sure it is.',
      resolve: () => {
        return true;
      }
    },
    hasArgs: {
      type: GraphQLString,
      resolve(value, args) {
        return JSON.stringify(args);
      },
      args: {
        string: { type: GraphQLString },
        int: { type: GraphQLInt },
        float: { type: GraphQLFloat },
        boolean: { type: GraphQLBoolean },
        id: { type: GraphQLID },
        enum: { type: TestEnum },
        object: { type: TestInputObject },
        // List
        listString: { type: new GraphQLList(GraphQLString) },
        listInt: { type: new GraphQLList(GraphQLInt) },
        listFloat: { type: new GraphQLList(GraphQLFloat) },
        listBoolean: { type: new GraphQLList(GraphQLBoolean) },
        listID: { type: new GraphQLList(GraphQLID) },
        listEnum: { type: new GraphQLList(TestEnum) },
        listObject: { type: new GraphQLList(TestInputObject) },
      }
    },
    business: {
      type: BusinessType,
      resolve(value, args) {
        if (args.name) {
          return businesses[args.name];
        }

        // Search by street
        const result = [];
        for (const business in businesses) {
          if (businesses.hasOwnProperty(business)) {
            const element = businesses[business];
            if (element.street == args.street) {
              result.push(element);
            }
          }
        }

        return result;
      },
      args: {
        name: { type: GraphQLString },
        street: { type: GraphQLString },
      },
      constraints: [
        {
          name: 'XOR',
          leftSide: 'name',
          rightSide: 'street',
        },
      ],
    },
  })
});

const TestMutationType = new GraphQLObjectType({
  name: 'MutationType',
  description: 'This is a simple mutation type',
  fields: {
    create_business: {
      type: GraphQLBoolean,
      description: 'Creates a new business',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        street: { type: GraphQLString },
        house_number: { type: GraphQLInt },
        house_number_addition: { type: GraphQLString },
      },
      constraints: [
        {
          name: 'WITH',
          leftSide: 'street',
          rightSide: 'house_number'
        },
        {
          name: 'THEN',
          leftSide: 'house_number_addition',
          rightSide: 'house_number',
        }
      ],
      resolve(prev, args) {
        console.log(args);
        
        // Each business has a unique name
        if (businesses[args.name]) {
          return false;
        }

        // Add the business
        businesses[args.name] = args;

        return true;
      }
    }
  }
});

const TestSubscriptionType = new GraphQLObjectType({
  name: 'SubscriptionType',
  description: 'This is a simple subscription type',
  fields: {
    subscribeToTest: {
      type: TestType,
      description: 'Subscribe to the test type',
      args: {
        id: { type: GraphQLString }
      }
    }
  }
});

const myTestSchema = new GraphQLSchema({
  query: TestType,
  mutation: TestMutationType,
  subscription: TestSubscriptionType
});

module.exports = myTestSchema;
