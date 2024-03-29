const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const register = catchAsync(async (req, res) => {
  // CRIO_SOLUTION_START_MODULE_AUTH
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
  // CRIO_SOLUTION_END_MODULE_AUTH
});
/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync(async (req, res) => {
  // CRIO_SOLUTION_START_MODULE_AUTH
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
  // CRIO_SOLUTION_END_MODULE_AUTH
});

module.exports = {
  register,
  login,
};
// const httpStatus = require("http-status");
// const catchAsync = require("../utils/catchAsync");
// const { authService, userService, tokenService } = require("../services");
// const ApiError = require("../utils/ApiError");
// const { response } = require("express");

// /**
//  * Perform the following steps:
//  * -  Call the userService to create a new user
//  * -  Generate auth tokens for the user
//  * -  Send back
//  * --- "201 Created" status code
//  * --- response in the given format
//  *
//  * Example response:
//  *
//  * {
//  *  "user": {
//  *      "_id": "5f71b31888ba6b128ba16205",
//  *      "name": "crio-user",
//  *      "email": "crio-user@gmail.com",
//  *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
//  *      "createdAt": "2020-09-28T09:55:36.358Z",
//  *      "updatedAt": "2020-09-28T09:55:36.358Z",
//  *      "__v": 0
//  *  },
//  *  "tokens": {
//  *      "access": {
//  *          "token": "eyJhbGciOiJIUz....",
//  *          "expires": "2020-10-22T09:29:01.745Z"
//  *      }
//  *  }
//  *}
//  *
//  */
// const register = catchAsync(async (req, res) => {
//   let user = {
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   };

//   const userData = await userService.createUser(user);
//   const accessToken = await tokenService.generateAuthTokens(userData);

//   const response = {
//     user: userData,
//     tokens: accessToken,
//   };

//   if (response == null || response == undefined) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Error creating user");
//   } else {
//     res.status(httpStatus.CREATED).send(response);
//   }
// });

// /**
//  * Perform the following steps:
//  * -  Call the authservice to verify is password and email is valid
//  * -  Generate auth tokens
//  * -  Send back
//  * --- "200 OK" status code
//  * --- response in the given format
//  *
//  * Example response:
//  *
//  * {
//  *  "user": {
//  *      "_id": "5f71b31888ba6b128ba16205",
//  *      "name": "crio-user",
//  *      "email": "crio-user@gmail.com",
//  *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
//  *      "createdAt": "2020-09-28T09:55:36.358Z",
//  *      "updatedAt": "2020-09-28T09:55:36.358Z",
//  *      "__v": 0
//  *  },
//  *  "tokens": {
//  *      "access": {
//  *          "token": "eyJhbGciOiJIUz....",
//  *          "expires": "2020-10-22T09:29:01.745Z"
//  *      }
//  *  }
//  *}
//  *
//  */
// const login = catchAsync(async (req, res) => {
//   const user = await authService.loginUserWithEmailAndPassword(
//     req.body.email,
//     req.body.password
//   );

//   const accessTokens = await tokenService.generateAuthTokens(user);

//   const response = {
//     user: user,
//     tokens: accessTokens,
//   };

//   res.status(httpStatus.CREATED).send(response);
// });

// module.exports = {
//   register,
//   login,
// };
