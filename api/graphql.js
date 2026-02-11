import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@apollo/server/standalone';

// Sample data
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Schema
const typeDefs = `
type User { id: ID! name: String! email: String! }
type Query { users: [User!]! }
`;

// Resolvers
const resolvers = {
  Query: { users: () => users }
};

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Export as Vercel serverless
export default startServerAndCreateNextHandler(server);
