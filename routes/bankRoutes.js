import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  depositCashToUser,
  transferMoneyFromUserToAnotherUser,
  updateUserCredit,
  filterUsersByAmountOfCash
} from "../controllers/bankController.js";

const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

//Route do get a single User by ID
router.get("/:id", getUserById);

//Route to create a new User
router.post("/", createUser);

//Route do update a User
router.put("/:id", updateUser);

//Route to delete a User
router.delete("/:id", deleteUser);

//Route to deposit cash to a User
router.put("/:id", depositCashToUser);

//Route to Update User Credit
router.put("./:id", updateUserCredit);

//Route Transfer money to another User
router.put("/:id&id", transferMoneyFromUserToAnotherUser);

//Route to filter Users by amount of cash they have
router.get("/", filterUsersByAmountOfCash);

export default router