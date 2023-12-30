import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  depositCashToUser,
  updateUserCredit,
  withdrawFromAccount,
  getActiveAccountUsers,
  getInActiveAccountUsers
  
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
router.put("/transactions/update-credit/:id", updateUserCredit);
//Route to Withdraw money 
router.put("/transactions/withdraw/:id", withdrawFromAccount);

//filter according Active users
router.get("/accounts/active-accounts",getActiveAccountUsers)
//filter according inActive users
router.get("/accounts/inactive-accounts",getInActiveAccountUsers)



export default router