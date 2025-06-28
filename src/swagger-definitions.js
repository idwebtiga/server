const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for the project',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/api/public/version': {
      get: {
        summary: 'Retrieve the API version',
        tags: ['Public'],
        responses: {
          200: {
            description: 'The current API version',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: {
                      type: 'string',
                      description: 'The API version',
                      example: '1.0.0',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/messages': {
      get: {
        summary: 'Retrieve all messages',
        tags: ['Messages'],
        responses: {
          200: {
            description: 'A list of messages with pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalItems: {
                      type: 'integer',
                      description: 'The total number of messages',
                      example: 0,
                    },
                    items: {
                      type: 'array',
                      description: 'The list of messages',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                            description: 'The message ID',
                            example: 1,
                          },
                          message: {
                            type: 'string',
                            description: 'The content of the message',
                            example: 'This is a sample message.',
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The creation timestamp of the message',
                            example: '2023-04-27T12:34:56Z',
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The last update timestamp of the message',
                            example: '2023-04-27T12:34:56Z',
                          },
                        },
                      },
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'The total number of pages',
                      example: 0,
                    },
                    currentPage: {
                      type: 'integer',
                      description: 'The current page number',
                      example: 0,
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new message',
        tags: ['Messages'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'The content of the message',
                    example: 'This is a new message.',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Message created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      description: 'The ID of the created message',
                      example: 1,
                    },
                    message: {
                      type: 'string',
                      description: 'The content of the created message',
                      example: 'This is a new message.',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'The creation timestamp of the message',
                      example: '2023-04-27T12:34:56Z',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'The last update timestamp of the message',
                      example: '2023-04-27T12:34:56Z',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input, message is required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/users/auth': {
      post: {
        summary: 'Authenticate a user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userName: {
                    type: 'string',
                    description: 'The username of the user',
                  },
                  password: {
                    type: 'string',
                    description: 'The password of the user',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authentication successful',
          },
          401: {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/users/profile': {
      get: {
        summary: 'Retrieve the user\'s profile',
        tags: ['Users'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'The user\'s profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      description: 'The user ID',
                    },
                    userName: {
                      type: 'string',
                      description: 'The username of the user',
                    },
                    walletAddress: {
                      type: 'string',
                      description: 'Wallet address of the user',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;