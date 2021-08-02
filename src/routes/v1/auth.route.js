const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

//"/v1/auth/login" routes with request validation
router.post("/login", validate(authValidation.login), authController.login);

module.exports = router;
