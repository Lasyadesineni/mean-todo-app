# MEAN Stack Todo List Application

A simple, modern Todo List application with CRUD operations built using the **MEAN stack** (MongoDB, Express.js, Angular 19+, Node.js).

## 🚀 Features

- **Create**: Add new todo tasks easily.
- **Read**: Fetch and display todos from MongoDB / API.
- **Update**: 
  - Toggle completion status.
  - Inline title editing.
- **Delete**: Remove todo items.
- **Modern UI**: Dark glassmorphic design built with Vanilla CSS and Angular Signals.

## 🛠️ Stack Overview

- **Frontend**: Angular 19 (Standalone Components, Signals, HttpClient)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose ORM & active API fallback)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Optional local instance on port `27017`)

### Installation & Running

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *Runs on `http://localhost:3000`*

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npx ng serve
   ```
   *Runs on `http://localhost:4200`*
