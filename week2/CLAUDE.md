# Context 
This is week2 of the AI Dev tools zoomcamp course.

## Objective
The objective is to implement a platform for online coding interviews.

Following are the functionalities needed:
1. Create a link and share it with candidates
2. Allow everyone who connects to edit code in the code panel
3. Show real-time updates to all connected users
4. Support syntax highlighting for multiple languages
5. Execute code safely in the browser

## Technologies to be used
1. ReactJS for frontend
2. ExpressJS for backend

## Question 1: Initial Implementation
Implement both frontend and backend - in one prompt. The steps for implementing would be

1. Implement the Frontend using ReactJS in the `frontend` directory with mock backend APIs. 
2. Implement the OpenAPI specs for the backend APIs needed by the frontend.
3. Implement the Backend using ExpressJS in the `backend` directory based on the OpenAPI specs.

What's the initial prompt you gave to AI to start the implementation? 
Copy and paste it in the homework form.

## Question 2: Integration Tests

It's always a good idea to cover the application with integration tests before trying to run it. This is a 
good practice and surfaces all the integration issues early on.

Objective is to 
  1. Write integration tests that check that the interaction between client and server works. 
  2. Validate the README.md file with all the commands for running and testing the application.

What's the terminal command you use for executing tests?

## Question 3: Running Both Client and Server
Now let's make it possible to run both client and server at the same time. 
Use `concurrently` for that.

What's the command you have in `package.json` for npm dev for running both?

## Question 4: Syntax Highlighting
Let's now add support for syntax highlighting for JavaScript and Python.
Which library did AI use for it?

## Question 5: Code Execution
Now let's add code execution.
For security reasons, we don't want to execute code directly on the server. 
Instead, let's use WASM to execute the code only in the browser.

Which library did AI use for compiling Python to WASM?

## Question 6: Containerization
Now let's containerize our application. 
Ask AI to help you create a Dockerfile for the application. 
Put both backend and frontend in one container.

What's the base image you used for your Dockerfile?

## Question 7: Deployment
Now let's deploy it. Choose a service to deploy your application.
If the render free service (https://render.com/) is to be used, what are the steps ?