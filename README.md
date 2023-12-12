# Product Management Dashboard

Product Management Dashboard is a web application that allows users to manage and track products. It consists of two parts: a client-front developed with Angular, and an admin-front developed with React. The backend is built using Express, TypeORM, and MongoDB for the client, and Express, TypeORM, and MySQL for the admin.

The application employs RabbitMQ for implementing an Event-Driven Architecture, enabling communication between the client and admin parts.

## Features

- Create, Read, Update, and Delete (CRUD) operations for products
- Increase likes for a product
- Event-Driven Architecture for real-time updates between client and admin

## Technologies Used

- **Client-Front (Angular):**

  - Angular
  - TypeScript
  - Bootstrap
  - RabbitMQ for event communication

- **Client-backend (Express, TypeORM, MongoDB):**

  - Express
  - TypeORM
  - MongoDB
  - RabbitMQ for event communication

- **Admin-Front (React):**

  - React
  - TypeScript
  - Bootstrap
  - RabbitMQ for event communication

- **Admin-Backend (Express, TypeORM, MySQL):**
  - Express
  - TypeORM
  - MySQL
  - RabbitMQ for event communication

## How to Use

### Prerequisites

- Node.js and npm installed
- MongoDB and MySQL databases set up
- RabbitMQ server running

### Installation

1. Clone the repository for the client and admin:

   ```bash
   git clone <repo-url>
   ```

# In client-front directory

cd client-front
npm install
npm start

# In admin-front directory

cd admin-front
npm install
npm start

# In client-backend directory

cd client-backend
npm install
npm start

# In admin-backend directory

cd admin-backend
npm install
npm start

# Access the applications in your browser:

Client: http://localhost:8002
Admin: http://localhost:8001

## RabbitMQ Configuration

This project utilizes RabbitMQ for implementing an Event-Driven Architecture. To set up RabbitMQ for your local development environment, follow these steps:

1. Sign up for a CloudAMQP account: [https://www.cloudamqp.com/](https://www.cloudamqp.com/)

2. Create a new RabbitMQ instance within your CloudAMQP dashboard.

3. Retrieve the connection details (URL) and API key from your RabbitMQ instance.

4. Replace the RabbitMQ connection details in the relevant parts of the project code:
   - [client-backend/src/app.ts](client-backend/src/app.ts)
   - [admin-backend/src/index.ts](admin-backend/src/index.ts)
