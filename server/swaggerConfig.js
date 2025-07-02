import swaggerJSDoc from 'swagger-jsdoc'; // Import the swagger-jsdoc module (generates Swagger spec from JSDoc comments)

const options = { // Define Swagger configuration options

  definition: { // This section defines the structure of the OpenAPI documentation

    openapi: '3.0.0', // Specifies OpenAPI version (3.0.0 is standard for Swagger UI)
    info: {
      title: 'Saltwater Reef E-commerce API', // Title that appears at the top of Swagger UI
      version: '1.0.0',                       // Version of your API documentation
      description: 'API documentation for the saltwater reef creature e-commerce store.', // Description shown under the title
    },
    servers: [
      {
        url: 'http://localhost:5000', // Defines base URL of your API — all routes will be relative to this
      },
    ],
  },
  apis: ['./routes/*.js'], // Tells swagger-jsdoc where to look for route files containing Swagger comments
};

const swaggerSpec = swaggerJSDoc(options); // Generate Swagger specification based on above options

export default swaggerSpec; // Export spec so it can be used in server.js to set up Swagger UI
