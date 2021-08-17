const { createUser, getUserById, getUsers, updateUsers, deleteUser, login } = require("./user.controller");
const express = require("express");
const router = express.Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/", checkToken, createUser);
router.get('/', checkToken, getUsers);
router.get('/:id', checkToken, getUserById);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);
router.post("/login", login);

module.exports = router;