import STATUS_CODE from "../constants/httpStatusCodes.js";
import {
  readBankUsersFromFile,
  writeBankUsersToFile,
} from "../models/bankModels.js";
import uniqid from "uniqid";

// @des Get all Users
// @route GET /api/v1/users
// @access GET /api/v1/users
export const getAllUsers = async (req, res, next) => {
  const users = readBankUsersFromFile();
  try {
    res.status(STATUS_CODE.OK).send(users);
  } catch (error) {
    next(error);
  }
};

// @des Get  User by id
// @route GET /api/v1/users/
// @access GET /api/v1/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const user = users.find((usr) => usr.id === req.params.id);

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// @des create a User
// @route post /api/v1/users
// @access GET /api/v1/users
export const createUser = async (req, res, next) => {
  try {
    const { name, cash, credit } = req.body;

    if (!name || !cash || !credit) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Error: All fields name, cash and credit  are required");
    }

    const users = readBankUsersFromFile();
    //check for name duplicate
    if (users.some((user) => user.name === name)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("user with the same name is already exist");
    }

    const newUser = { id: uniqid(), name, cash, credit };
    users.push(newUser);
    writeBankUsersToFile(users);
    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

// @des update User
// @route put /api/v1/users/:id
// @access GET /api/v1/users
export const updateUser = async (req, res, next) => {};

// @des delete a User
// @route Delete /api/v1/users/:id
// @access GET /api/v1/users
export const deleteUser = async (req, res, next) => {};

// @des Deposit Cash to a User
// @route GET /api/v1/users/:id
// @access GET /api/v1/users
export const depositCashToUser = async (req, res, next) => {};
// @des Update User Credit
// @route GET /api/v1/users/:id
// @access GET /api/v1/users
export const updateUserCredit = async (req, res, next) => {};
// @des transferMoneyFromUserToAnotherUser
// @route GET /api/v1/users/:id
// @access GET /api/v1/users
export const transferMoneyFromUserToAnotherUser = async (req, res, next) => {};
// @des filterUsersByAmountOfCash
// @route GET /api/v1/users/:amoutOfCash
// @access GET /api/v1/users
export const filterUsersByAmountOfCash = async (req, res, next) => {};
