# Week 4: MERN Stack Blog Application

🚀 A full-stack blog application built with MongoDB, Express, React, and Node.js demonstrating seamless frontend-backend integration.

## Features

### Core Functionality
- ✅ User authentication (Login/Signup)
- ✅ Create, Read, Update, Delete blog posts
- ✅ Post categories with filtering
- ✅ Search functionality
- ✅ Responsive design for all devices

### Technical Implementation
- 🛠️ RESTful API with Express.js
- 🗄️ MongoDB database with Mongoose ODM
- ⚛️ React frontend with Vite
- 🔄 State management with React Hooks
- 🛡️ Form validation
- 🔍 Search and filtering

## Project Structure

## API Endpoints

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | /api/posts          | Get all blog posts              |
| GET    | /api/posts/:id      | Get single blog post            |
| POST   | /api/posts          | Create new blog post            |
| PUT    | /api/posts/:id      | Update existing blog post       |
| DELETE | /api/posts/:id      | Delete blog post                |
| GET    | /api/categories     | Get all categories              |
| POST   | /api/categories     | Create new category             |
| POST   | /api/auth/login     | User login                      |
| POST   | /api/auth/signup    | User registration               |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/week4.git
   cd week4