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
router.get("/users", getAllUsers);

//Route to create a new User
router.post("/users", createUser);

//Route do get a single User by ID
router.get("/users/:id", getUserById);

//Route do update a User
router.put("/users/:id", updateUser);

//Route to delete a User
router.delete("/users/:id", deleteUser);

//Route to deposit cash to a User
router.put("/transactions/deposit-cash/:id", depositCashToUser);

//Route to Update User Credit
router.put("/transactions/deposit-credit/:id", updateUserCredit);

//Route Transfer money to another User
router.put("/:id&id", transferMoneyFromUserToAnotherUser);

//Route to filter Users by amount of cash they have
router.get("/", filterUsersByAmountOfCash);

export default router