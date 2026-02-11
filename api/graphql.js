import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/vercel';

// Sample data
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

let posts = [
  { id: '1', title: 'Hello World', content: 'This is my first post', authorId: '1', createdAt: new Date().toISOString() },
  { id: '2', title: 'GraphQL Rocks', content: 'GraphQL is awesome!', authorId: '2', createdAt: new Date().toISOString() },
];

let comments = [
  { id: '1', text: 'Nice post!', postId: '1', authorId: '2', createdAt: new Date().toISOString() },
];

// GraphQL Schema
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    createdAt: String!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    createComment(text: String!, authorId: ID!, postId: ID!): Comment!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id),
    posts: () => posts,
    post: (_, { id }) => posts.find(p => p.id === id),
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
  User: {
    posts: (user) => posts.filter(p => p.authorId === user.id),
  },
  Post: {
    author: (post) => users.find(u => u.id === post.authorId),
    comments: (post) => comments.filter(c => c.postId === post.id),
  },
  Comment: {
    author: (comment) => users.find(u => u.id === comment.authorId),
    post: (comment) => posts.find(p => p.id === comment.postId),
  }
};

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Export as Vercel serverless function
export default startServerAndCreateNextHandler(server);
