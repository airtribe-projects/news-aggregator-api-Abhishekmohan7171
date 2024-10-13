# News Aggregator

This project is an Node.js application that connects to a MongoDB database. It provides API endpoints for managing users, preferences, and news.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=3000
MONGO=your_mongodb_connection_string

Replace your_mongodb_connection_string with your actual MongoDB connection string.
```

## Usage
### Start the server:

The server will start on the port specified in the .env file or default to port 3000.

## API Endpoints:
### Users
GET /api/v1/users - Get all users<br>
POST /api/v1/users - Create a new user<br>
GET /api/v1/users/:id - Get a user by ID<br>
PUT /api/v1/users/:id - Update a user by ID<br>
DELETE /api/v1/users/:id - Delete a user by ID<br>

### Preferences
GET /api/v1/preferences - Get all preferences<br>
POST /api/v1/preferences - Create a new preference<br>
GET /api/v1/preferences/:id - Get a preference by ID<br>
PUT /api/v1/preferences/:id - Update a preference by ID<br>
DELETE /api/v1/preferences/:id - Delete a preference by ID<br>

### News
GET /api/v1/news - Get all news<br>
POST /api/v1/news - Create a new news item<br>
GET /api/v1/news/:id - Get a news item by ID<br>
PUT /api/v1/news/:id - Update a news item by ID<br>
DELETE /api/v1/news/:id - Delete a news item by ID<br>

## Middleware
### Logger
The application uses a custom logger middleware located in ./middleware/logger.js. This middleware logs incoming requests to the console.

### Validate JWT
This middleware decodes the token , and authoroses the user.

### Contributing
Fork the repository<br>
Create a new branch (git checkout -b feature-branch)<br>
Commit your changes (git commit -am 'Add new feature')<br>
Push to the branch (git push origin feature-branch)<br>
Create a new Pull Request<br>




Make sure to replace https://github.com/yourusername/your-repo.git with the actual URL of your repository.