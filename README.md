# STAR Advisement Tool

The STAR Advisement Tool is a Node.js server application using Express.js, designed to provide academic advisement and guidance. The application uses MongoDB as its database to store and manage data.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features
- CRUD operations for advisement records
- Secure data storage with MongoDB
- RESTful API endpoints using Express.js
- Input validation and error handling

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js installed (version 14.x or later)
- MongoDB installed and running
- npm (Node Package Manager) installed

## Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:pcparagc/STAR-advisement-tool-backend.git
   cd star-advisement-tool
   
2. Install the dependencies:
   ```sh
   npm install
3. Set up MongoDB:
- Ensure you have a MongoDB instance running.
- Replace the `mongoURL` in `server.js` with your MongoDB connection string if different.


## Configuration
- The server uses CORS to allow requests from http://localhost:5173. If your frontend is hosted elsewhere, update the corsOptions in server.js accordingly.

## Running the server
   ```sh
   node server.js
   ```
- The server will be running at `http://localhost:3001`.

## API Endpoints

### Root Endpoint

#### GET `/`
- Returns a welcome message.

### Institutes

#### GET `/fetch-institutes`
- Fetches all institutes.

### Programs

#### GET `/fetch-programs`
- Fetches programs based on `collegeId` query parameter.

### CSULA Courses

#### GET `/fetch-csula-courses`
- Fetches CSULA courses based on `dept` query parameter and organizes them by block type.

#### GET `/fetch-all-csula-courses`
- Fetches all CSULA courses based on `dept` query parameter.

### General Courses

#### GET `/fetch-courses`
- Fetches courses based on `sid` query parameter.

### Course Types

#### GET `/course-types`
- Fetches all course types.

### Department Requirement Blocks

#### GET `/fetch-req-block-details`
- Fetches department requirement blocks based on `dept` query parameter.

## Models

### Schools
- Schema: `{ name: String, location: String }`

### Programs
- Schema: `{ s_id: String, name: String, department: String }`

### CSULA_Courses
- Schema: `{ course_code: Array, course_name: String, department: Array, credits: Number, category: String, block_type: String }`

### Courses
- Schema: `{ course_code: Array, course_name: String, department: Array, credits: Number, category: String }`

### CourseTypes
- Schema: `{ types: [{ id: String, name: String }] }`

### DeptReqBlocks
- Schema: `{ name: String, dept_id: String, blocks: Array }`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
