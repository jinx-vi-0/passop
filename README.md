# PassOP

A simple and secure password manager application built with React that allows users to save, view, edit, and delete their passwords with ease. PassOP helps you manage your passwords efficiently while keeping them safe.

This project is a part of the **Girl Script Summer of Code (GSSOC)** and **Hacktoberfest**.

## Features

- **Add Password**: Save a new password with a website URL, username, and password.
- **Edit Password**: Update an existing password.
- **Delete Password**: Remove a saved password.
- **Copy to Clipboard**: Easily copy website URLs, usernames, and passwords to the clipboard.
- **Show/Hide Password**: Toggle visibility of the password field.

## Getting Started

Follow these instructions to run the PassOP project on your local machine.

### Prerequisites

Ensure you have the following installed:

- Node.js (version 14.x or higher)
- npm (Node package manager)
- Vite (for running the React front-end)
- MongoDB (you'll need a MongoDB instance, either locally or on the cloud)

### Installation

#### 1. Clone the Repository:

```bash
git clone https://github.com/<your-username>/PassOP.git
cd PassOP
```

#### 2. Setting Up the Backend:

- Navigate to the backend folder:

```bash
cd backend
```

- Install the required dependencies:

```bash
npm install
```

- Set up your environment variables. Create or edit the `.env` file in the backend folder with the following:
  ```env
  MONGO_URI=<your-mongodb-connection-string>
  DB_NAME=<your-database-name>
  ```
- Run the backend server:

```bash
node server.js
```

#### 3. Setting Up the Frontend:

- Move back to the root directory:

```bash
cd ..
```

- Install the front-end dependencies:

```bash
npm install
```

- Run the React application using Vite:

```bash
npm run dev
```

#### 4. Access the Application:

- Open your browser and go to:
  [http://localhost:3000](http://localhost:3000)

Now your password manager should be running locally!

## Folder Structure

```
PassOP/
├── backend/ # Backend Node.js application
│   ├── server.js # Main server file
│   ├── .env # Environment configuration (not included in repo)
│   ├── package.json # Backend dependencies
│   └── ... # Other backend files
├── frontend/ # React frontend application (using Vite)
│   ├── src/ # React components and files
│   ├── public/ # Public static files
│   ├── package.json # Frontend dependencies
│   └── vite.config.js # Vite configuration file
├── README.md # This file
└── ...
```

## Contributing

For contribution guidelines and instructions, please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## Code of Conduct

Please make sure to review and follow the project's [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing.
