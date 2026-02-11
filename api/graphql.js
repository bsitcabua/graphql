// api/graphql.js
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@apollo/server/standalone';

// Sample data initialized inside the handler
let users = [];
let posts = [];
let comments = [];

const typeDefs = `
type User { id: ID! name: String! email: String! }
type Post { id: ID! title: String! content: String! authorId: ID! createdAt: String! }
type Comment { id: ID! text: String! postId: ID! authorId: ID! createdAt: String! }

type Query {
  users: [User!]!
  posts: [Post!]!
  comments: [Comment!]!
}
type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, content: String!, authorId: ID!): Post!
  createComment(text: String!, authorId: ID!, postId: ID!): Comment!
}
`;

const resolvers = {
  Query: {
    users: () => users,
    posts: () => posts,
    comments: () => comments,
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(users.length + 1), name, email };
      users.push(user);
      return user;
    },
    createPost: (_, { title, content, authorId }) => {
      const post = { id: String(posts.length + 1), title, content, authorId, createdAt: new Date().toISOString() };
      posts.push(post);
      return post;
    },
    createComment: (_, { text, authorId, postId }) => {
      const comment = { id: String(comments.length + 1), text, authorId, postId, createdAt: new Date().toISOString() };
      comments.push(comment);
      return comment;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// Export as Vercel serverless
export default startServerAndCreateNextHandler(server);
