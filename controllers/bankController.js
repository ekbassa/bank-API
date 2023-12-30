import { parse } from "dotenv";
import STATUS_CODE from "../constants/httpStatusCodes.js";
import {
  readBankUsersFromFile,
  writeBankUsersToFile,
} from "../models/bankModels.js";
import uniqid from "uniqid";

// @des Get all Users
// @route GET /api/v1/users
// @access Public
export const getAllUsers = async (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    res.status(STATUS_CODE.OK).send(users);
  } catch (error) {
    next(error);
  }
};

// @des create a User
// @route post /api/v1/users
// @access Public
export const createUser = async (req, res, next) => {
  try {
    const { name, cash, credit,isActive } = req.body;

    if (!name || cash === undefined || credit === undefined || isActive === undefined) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Error: All fields name, cash, credit and isActive are required");
    }

    const users = readBankUsersFromFile();
    //check for name duplicate
    if (users.some((user) => user.name === name)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("user with the same name is already exist");
    }

    const newUser = { id: uniqid(), name, cash, credit,isActive };
    users.push(newUser);
    writeBankUsersToFile(users);
    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

// @des Get  User by id
// @route GET /api/v1/users/
// @access public
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

// @des update User
// @route put /api/v1/users/:id
// @access public
export const updateUser = async (req, res, next) => {
  try {
    const { name, cash, credit, isActive } = req.body;

    if (!name || cash === undefined || credit === undefined || isActive === undefined) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Error: All fields name, cash and credit  are required");
    }

    const users = readBankUsersFromFile();
    const index = users.findIndex((usr) => usr.id === req.params.id);
    if (index === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found ");
    }
    const lastIndex = users.findLastIndex((usr) => usr.name === name);
    if (lastIndex != -1 && lastIndex != index) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "cannot edit user, user with such name is already exists!"
      );
    }
    const updatedUser = { ...users[index], name, cash, credit,isActive };
    users[index] = updatedUser;
    writeBankUsersToFile(users);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @des delete a User
// @route Delete /api/v1/users/:id
// @access public
export const deleteUser = async (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const newUsersList = users.filter((user) => user.id !== req.params.id);

    //check if a user was deleted by comparing the length of the two arrays
    if (users.length > newUsersList.length) {
      writeBankUsersToFile(newUsersList);
      res
        .status(STATUS_CODE.OK)
        .send(`User with id ${req.params.id} was deleted successfully`);
    } else {
      // user was not found
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found!");
    }
    // res.send(users);
  } catch (error) {
    next(error);
  }
};

// @des Deposit Cash to a User
// @route Put /api/v1/transactions/deposit-cash/:id
// @access public /api/v1/users
export const depositCashToUser = (req, res, next) => {
  try {
    const { name, cash, credit,isActive } = req.body;
    if (!name || cash === undefined || credit === undefined || isActive === undefined) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Error: All fields name, cash ,credit and isActive are required");
    }
    const users = readBankUsersFromFile();

    //find the specific user
    const userIndex = users.findIndex((usr) => usr.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was  not found ");
    }
    const originalUser = users[userIndex];
    const originalUserCash = originalUser.cash;
    const newUserCash = originalUserCash + cash;

    const updatedUser = {
      ...users[userIndex],
      name,
      cash: newUserCash,
      credit,
      isActive,
    };
    console.log(updatedUser);
    users[userIndex] = updatedUser;

    writeBankUsersToFile(users);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};
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
