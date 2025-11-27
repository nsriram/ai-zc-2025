# Context 
This is week1 of the AI Dev tools zoomcamp course.
The project is setup using uv.

## Objective
This week we will build a Todo application that can do the following:
- Create, edit and delete TODOs
- Assign due dates
- Mark TODOs as resolved

As we build the application using AI tools via vibe coding, following questions will be answered

## Question 1
What is the command to install Django ?


## Question 2
Objective is to create the project and the app.
1. Provide the steps to create the Django App
2. Provide the steps to create the Django Project
3. How to include the app in the project ? 
4. What is the file that needs to be edited to include the app in the project ?


## Question 3
Objective of this question is to create the Django models for the TODO app. 
The models are the mapping from python object to relational database tables.
1. Provide the steps for implementing the models needed for the TODO app.
2. Which step is needed from the following ?
     - Run the application
     - Add the models to the admin panel
     - Run migrations
     - Create a makefile


## Question 4
Objective of this question is to implement the logic for the TODO app.
1. Provide the steps needed to implement the logic for the TODO app. 
Also provide the complete code snippets needed for the logic implementation.
2. Where should this logic be put among the following ?
    - views.py
    - urls.py
    - admin.py
    - tests.py


## Question 5
Objective of this question is to create the templates for the TODO app.
At least 2 templates are needed. First being the Base Template and the second the Home Template.
Base template will be named base.html and home template will be named home.html.
The home template should have the functionality of the TODO app.
1. Provide the steps needed to create the templates for the TODO app.
Also provide the complete code snippets needed for the templates creation.
2. Where should the directory with the templates be registered among the following ?
   - `INSTALLED_APPS` in project's `settings.py`
   - `TEMPLATES['DIRS']` in project's `settings.py`
   - `TEMPLATES['APP_DIRS']` in project's `settings.py`
   - In the app's `urls.py`


## Question 6
Objective of this question is to cover the functionality with tests.
1. Provide the scenarios to cover
2. Validate the scenarios provided by you are covered with tests.
3. Provide the code implementation for the tests
4. Provide the steps to run the tests
5. What is the command to run the tests from the following ?
  - `pytest`
  - `python manage.py test`
  - `python -m django run_tests`
  - `django-admin test`
