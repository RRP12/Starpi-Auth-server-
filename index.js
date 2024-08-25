import { ApolloServer, gql } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define a constant or environment variable for the secret key
const JWT_SECRET = "ssalamhayak"; // or process.env.JWT_SECRET

// Mock database
let users = [];

// Type Definitions (Schema)
const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		email: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	input UsersPermissionsRegisterInput {
		username: String!
		email: String!
		password: String!
	}

	type Query {
		users: [User!]!
		user(id: ID!): User
	}
	type Mutation {
		register(input: UsersPermissionsRegisterInput!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!
	}
`;

// Resolvers
const resolvers = {
	Query: {
		users: () => {
			return users;
		},
	},
	Mutation: {
		register: async (_, { input }) => {
			const { username, email, password } = input;

			const existingUser = users.find((user) => user.email === email);
			if (existingUser) {
				throw new Error("User already exists");
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const user = {
				id: users.length + 1,
				username,
				email,
				password: hashedPassword,
			};
			users.push(user);

			// Generate JWT with a properly defined secret key
			const token = jwt.sign({ userId: user.id }, JWT_SECRET);

			return {
				token,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			};
		},
		login: async (_, { email, password }) => {
			const user = users.find((user) => user.email === email);
			if (!user) {
				throw new Error("User not found");
			}

			const valid = await bcrypt.compare(password, user.password);
			if (!valid) {
				throw new Error("Incorrect password");
			}

			// Generate JWT with a properly defined secret key
			const token = jwt.sign({ userId: user.id }, JWT_SECRET);

			return {
				token,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			};
		},
	},
};

// Create Apollo Server
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Start the server
if (process.argv[1] === new URL(import.meta.url).pathname) {
	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	});
}
