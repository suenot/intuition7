import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

const main = async () => {
  // Create an Express app
  const app = express();

  // Define your GraphQL schema and resolvers
  const typeDefs = `
    type Book {
      title: String
      author: String
    }

    type Query {
      books: [Book]
    }
  `;

  const resolvers = {
    Query: {
      books: () => [
        { title: 'Book 1', author: 'Author 1' },
        { title: 'Book 2', author: 'Author 2' },
      ],
    },
  };

  // Create an Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });

  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();

  // Specify the path where we'd like to mount our server
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

main();
