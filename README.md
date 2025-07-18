# 🖥️ Workasana — Backend

This is the backend service for **Workasana**, a full-stack task & team management system with JWT authentication, URL-based filters, and insightful reports.

---

## 🚀 Features

✅ JWT Authentication  
✅ Users, Projects, Teams, and Tasks CRUD APIs  
✅ URL-based filtering on tasks  
✅ Reports & Aggregations:
- Tasks completed in the last week
- Pending work grouped by projects
- Closed tasks grouped by team

✅ MongoDB with Mongoose  
✅ Password hashing with bcrypt  
✅ CORS configured for frontend

---

## 🛠️ Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Server      | Node.js, Express   |
| Database    | MongoDB, Mongoose |
| Auth        | JWT, bcrypt        |

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd backend
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Environment Variables
```bash
MONGO_URI=mongodb://your_mongo_url
JWT_SECRET=your_jwt_secret
```
### 4️⃣ Run the server
```bash
# for development with auto-reload
npm run dev

# or normal start
npm start
```
## 🔷 API Endpoints

🔑 Auth

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/auth/signup` | Register a new user       |
| POST   | `/auth/login`  | Login & receive JWT       |
| GET    | `/users`       | Get all users (protected) |

📂 Projects

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | `/projects`     | Create a project |
| GET    | `/projects`     | Get all projects |
| DELETE | `/projects/:id` | Delete a project |

👥 Teams

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| POST   | `/teams`     | Create a team |
| GET    | `/teams`     | Get all teams |
| DELETE | `/teams/:id` | Delete a team |

📝 Tasks

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| POST   | `/tasks`     | Create a task                       |
| POST   | `/tasks/:id` | Update a task                       |
| GET    | `/tasks`     | Get all tasks with optional filters |
| DELETE | `/tasks/:id` | Delete a task                       |

📊 Reports

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/report/last-week`    | Tasks completed in the last 7 days |
| GET    | `/report/pending-work` | Pending tasks grouped by project   |
| GET    | `/report/closed-tasks` | Completed tasks grouped by team    |

🔒 Authentication
Protected routes require a JWT token:
```bash
Authorization: Bearer <token>
```

## 🧪 Development

- Use npm run dev to auto-reload with nodemon
- Logs errors to the console
- CORS is enabled for frontend at:
```bash
https://workasana-frontend-sable.vercel.app
```
