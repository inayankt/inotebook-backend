# iNoteBook

This is the backend part of iNoteBook project.

## About

A web app where notes can be saved and retrieved from on the go. Users need to signin/signup with their account and can start saving notes.

## Tech Stack

- NodeJS
- ExpressJS
- MongoDB
- JSON Web Token

## How to run the Express Rest API

### Prerequisites

- NodeJS should be installed on your computer. Download it from [here](https://nodejs.org/en/download).
- MongoDB should be installed on your computer. Downlaod it from [here](https://www.mongodb.com/try/download/community) (select `Community Server` and download).
- Visual Studio Code is preferred for this guide. Download it from [here](https://code.visualstudio.com/download).

### Getting started

Open terminal in your computer and run the following commands
```
git clone https://github.com/inayankt/inotebook-backend/
cd inotebook-backend
npm install
code .
```

The project folder will open in VS code. Make a new `.env` file which will contain the environment variables in the same format as given in `.env.example` file.

### Starting the server

```
node index.js
```

The backend is now up and running on port `5000`. You can now start to setup the frontend part from [here](https://github.com/inayankt/inotebook-frontend/).