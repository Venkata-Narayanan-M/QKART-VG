const Joi = require("joi");
const { email, password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
// const register = {
//   params: Joi.object().keys({
//     email: Joi.string().custom(email).required(),
//     password: Joi.string().custom(password).required(),
//     name: Joi.string().required(),
//   }),
// };

// /**
//  * Check request *body* for fields (all are *required*)
//  * - "email" : string and satisyfing email structure
//  * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
//  */
// const login = {
//   params: Joi.object().keys({
//     email: Joi.string().custom(email).required(),
//     password: Joi.string().custom(password).required(),
//   }),
// };

const register = {
  // CRIO_SOLUTION_START_MODULE_AUTH
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
  // CRIO_SOLUTION_END_MODULE_AUTH
};
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  // CRIO_SOLUTION_START_MODULE_AUTH
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  // CRIO_SOLUTION_END_MODULE_AUTH
};

module.exports = {
  register,
  login,
};
