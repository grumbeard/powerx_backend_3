# Assignment: Backend Development (Session 3)

:point_right: Homework-Authorization
The endpoints for this project can be tested via Postman.

## Features

### Retrieve all Items created by User

`GET /users/:id` where id parameter is the id of target user.

### Update Items (Authorized for logged in user who created target item)

`PUT /items/:id` where id parameter is the id of target item.
NOTE: Other logged in users may still:

- View all items created by all users
- Delete any item created by any user
  ==> Middleware can be built if such behavior should be prevented.

## Approach

Tried to rebuild app's CRUD API (w/o DB), refactorize code for Dependency Injection, and implement Authentication through use of JWT, before attempting assignment.

## Learnings

- Class instances can be instantiated successfully without arguments for all defined parameters
- Defining custom error handlers (they need to be declared after the applicable routes)
- Merging exports with spread operator (merging of object's key-values)
- Utilizing JsonWebToken + Bcrypt APIs
- Environment variables are strings by default and require appropriate casting before use
- Not all supported request attributes are specified in the Express Documentation

Improvements needed: Simpler and more consistent approach to error handling
