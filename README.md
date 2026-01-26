# Money Jar

This is a full-stack application to manage personal and group expenses.

## Current Status

### Backend

The backend is built with [NestJS](https://nestjs.com/) and is in a good state. It includes the following features:

*   User authentication (login and registration) with JWT.
*   Create, read, update, and delete operations for categories, groups, and transactions.
*   Add and remove members from groups.
*   View transaction summaries.

### Frontend

Frontend is built with React Vite

## Technologies Used

### Backend

*   **Framework:** [NestJS](https://nestjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [TypeORM](https://typeorm.io/)
*   **Authentication:** [Passport](http://www.passportjs.org/) with [JWT](https://jwt.io/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [PostgreSQL](https://www.postgresql.org/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2.  **Navigate to the `server` directory and install dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Create a `.env` file in the `server` directory and add the following environment variables:**

    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    DB_DATABASE=money_jar
    JWT_SECRET=your_secret
    ```

### Running the Application

1.  **Run the backend development server:**

    ```bash
    cd server
    npm run start:dev
    ```
