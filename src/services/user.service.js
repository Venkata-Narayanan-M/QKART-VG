const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { http } = require("../config/logger");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    return await User.findById(id).exec();
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
  }
};

// Implement getUserAddressById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user address
 * @param {String} id
 * @returns {Object<User.Address>}
 */

// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id) => {
  try {
    return await User.findOne({ _id: id }, { email: 1, address: 1 });
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
  }
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */

const getUserByEmail = async (email) => {
  //   User.find({ email: email }, function (err, document) {
  //     if (err) return err;
  //     else if (document === null) {
  //       console.log("Document not found");
  //       return null;
  //     } else return document;
  //   });
  try {
    return await User.findOne({ email: email });
  } catch (err) {
    throw err;
  }
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
// const createUser = async (user) => {
//   if (await User.isEmailTaken(user.email)) {
//     throw new ApiError(httpStatus.OK, "Email Already Taken");
//   } else {
//     return await User.create(user);
//   }
// };
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.OK, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();
  return user.address;
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getUserAddressById,
  setAddress,
};
