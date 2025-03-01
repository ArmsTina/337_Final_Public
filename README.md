# 337_Final_Public

https://csc337final.duckdns.org/ Hosted By DigitalOcean

This project was developed as part of the University of Arizona's CSC 337 Web Programming course group project with [Akhond](https://github.com/akhondsaif7) and [Wardah](https://github.com/wardahali7).

It serves as the backend server and front-end server for a Wordle-based game platform, handling user authentication, game state management, leaderboard functionalities, and hosting the React front-end.

You can see my introduction video of the website on [Youtube](https://youtu.be/XzdDhWj5_xU)

This README is generated by Chat-GPT, revised by Dongyoung Yang.

---

## **I worked on...**

- **Node.js**: Runtime environment for JavaScript.
- **Express.js**: Web framework for handling routes and middleware.
- **React**: Reviewed and improved team members' code for better functionality and readability. Implemented fetch-based logic for API calls to communicate with the backend.
- **MongoDB**: NoSQL database for storing user data and game state.
- **Mongoose**: ODM (Object Document Mapping) library for MongoDB.
- **Passport.js**: Authentication middleware for handling login and sessions.
- **bcrypt**: Library for hashing passwords.
- **CORS**: Middleware for handling cross-origin requests.
- **dotenv**: Loads environment variables from `.env` file.

---

## **Project Contributions**

As part of the group project, my primary contributions included:

- **Developing a platform for Wordle**, featuring dynamic game state management and leaderboards.
- **Building backend services with Express** and managing game/user data with **MongoDB**.
- **Deploying the webpage on DigitalOcean**, securing it with **HTTPS** and implementing password security using **bcrypt**.

---

## **Setup Instructions**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArmsTina/337_Final_Public/
   cd <repo-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and provide the following variables:
   ```env
   DBURL = "mongodb+srv://<username>:<password>@<cluster>/GameHub"
   SECRET = "yourSecretKeyHere"
   ```

4. **Run the Server:**
   ```bash
   node server.js
   ```
   The server runs on **port 5000**.

---

## **Core Features**

### **1. User Authentication**

- **Libraries**: `passport`, `express-session`, `bcrypt`
- **Endpoints**:
  - `POST /create-account`: Create a new user account with hashed password.
  - `POST /`: User login with username and password.
  - `POST /logout`: Logs out the current session.
  - `POST /check-login-status`: Checks if a user is logged in.
- **Session Management**: Uses cookies to store session info for 1 hour.

---

### **2. Game State Management**

- **Purpose**: Saves the game state and user progress.
- **Endpoints**:
  - `POST /update/user/wordle`: Updates the Wordle game state and generates new words.
  - `POST /board`: Fetches user-specific data for the game state.
- **Database**:
  - **users** collection:
    - `username`, `email`, `password`, `gameState` (grid), `score`, and `word`.

---

### **3. Leaderboard Management**

- **Purpose**: Stores and retrieves the top 10 player scores.
- **Endpoints**:
  - `PUT /update-ranking`: Updates the `rankings` collection with the top 10 players.
  - `POST /leaderboard`: Fetches the leaderboard (top 10 users).
- **Database**:
  - **rankings** collection:
    - `username`, `score`.

---

### **4. Account Management**

- **Endpoints**:
  - `POST /account-settings`: Retrieves user profile details (`username`, `email`).
  - `PUT /account-settings`: Updates the user's password securely.

---

### **5. Static File Hosting**

- Hosts the React frontend build files from the `/build` directory.
- **Routes**:
  - `GET /`: Serves the main React app.
  - `GET *`: Redirects all unhandled routes to React Router.

---

## **Middleware**

- **CORS**: Enables cross-origin requests.
- **Body-Parser**: Parses incoming JSON and URL-encoded data.
- **Method Override**: Allows support for `PUT` and `DELETE` requests.
- **checkLogin**: Custom middleware to protect routes requiring authentication.

---

## **Port and Endpoint Access**

- **Port**: `5000`
- **Frontend Access**: Ensure the React frontend is configured to connect to this backend server.
