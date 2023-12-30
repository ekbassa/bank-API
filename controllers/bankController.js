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
    const { userName, cash, credit, isActive } = req.body;

    if (
      !userName ||
      cash === undefined ||
      credit === undefined ||
      isActive === undefined
    ) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "Error: All fields name, cash, credit and isActive are required"
      );
    }

    const users = readBankUsersFromFile();
    //check for name duplicate
    if (users.some((user) => user.name === userName)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("user with the same name is already exist");
    }

    const newUser = { id: uniqid(), userName, cash, credit, isActive };
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
    const { userName, cash, credit, isActive } = req.body;

    if (
      !userName ||
      cash === undefined ||
      credit === undefined ||
      isActive === undefined
    ) {
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
    const lastIndex = users.findLastIndex((usr) => usr.name === userName);
    if (lastIndex != -1 && lastIndex != index) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "cannot edit user, user with such name is already exists!"
      );
    }
    const updatedUser = { ...users[index], userName, cash, credit, isActive };
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
// @access public
export const depositCashToUser = (req, res, next) => {
  try {
    const { userName, cash, credit, isActive } = req.body;
    if (
      // !userName ||
      cash === undefined ||
      credit === undefined ||
      isActive === undefined
    ) {
      //change the code status
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Error: All fields name, cash and credit  are required");
    }

    if (cash < 0) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("Deposit amount should be greater than Zero");
    }

    const users = readBankUsersFromFile();

    //find the specific user
    const userIndex = users.findIndex((usr) => usr.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was  not found ");
    }

    // check if the user account is active
    if (!users[userIndex].isActive) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("User Account is Inactive, cannot perform a deposit!");
    }

    const originalUser = users[userIndex];
    const originalUserCash = originalUser.cash;
    const newUserCash = originalUserCash + cash;

    const updatedUser = {
      ...users[userIndex],
      userName,
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
// @route PUT /api/v1/users/transactions/deposit-credit/:id
// @access Public
export const updateUserCredit = (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const userIndex = users.findIndex((usr) => usr.id === req.params.id);
    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found!");
    }
    if (req.query.credit < 0) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("Failed to update the credit, credit must be positive!");
    }
    if (!users[userIndex].isActive) {
      // throw an error
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error(
        "The User account is Inactive, cannot Update the credit!"
      );
    } else {
      const updatedUser = {
        ...users[userIndex],
        credit: +req.query.credit,
      };
      users[userIndex] = updatedUser;
      writeBankUsersToFile(users);
      res.send(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};

//@des withdraw money from the user account
// @route PUT /api/v1/users/transactions/withdraw/:id
export const withdrawFromAccount = (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const userIndex = users.findIndex((usr) => usr.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found!");
    }

    const withdrawalAmount = req.query.withdraw;
    const currentCash = users[userIndex].cash;
    const currentCredit = users[userIndex].credit;

    if (currentCash + currentCredit < withdrawalAmount) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("Not enough coverage in the account!   ");
    }
    //check id the account is active
    if (users[userIndex].isActive) {
      if (currentCash >= withdrawalAmount) {
        const updatedUser = {
          ...users[userIndex],
          cash: currentCash - withdrawalAmount,
        };

        users[userIndex] = updatedUser;
        writeBankUsersToFile(users);
        res.send(updatedUser);
      }
      if (withdrawalAmount > currentCash) {
        const updatedUser = {
          ...users[userIndex],
          cash: 0,
          credit: currentCredit - (withdrawalAmount - currentCash),
        };
        users[userIndex] = updatedUser;
        writeBankUsersToFile(users);
        res.send(updatedUser);
      }
    }
    //there is enough money in the credit balance
  } catch (error) {
    next(error);
  }
};
// @des getActiveAccountUsers
// @route GET /api/v1/accounts/active-users
// @access Public
export const getActiveAccountUsers =  (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const activeUserAccount = users.filter((user)=> user.isActive);
   
   if (activeUserAccount.length > 0){
    res.send(activeUserAccount)
   }
   else{
    res.status(STATUS_CODE.NO_CONTENT)
    throw new Error('No Active Account Were Found!')
   }

  } catch (error) {
    next(error)
  }
};



// @des filter according inactive accounts
// @route GET /api/v1/users/accounts/inactive-accounts
// @access Public
export const getInActiveAccountUsers =  (req, res, next) => {
  try {
    const users = readBankUsersFromFile();
    const inActiveAccounts = users.filter((user)=>user.isActive === false);

    if (inActiveAccounts.length > 0){
      res.send(inActiveAccounts)
     }
     else{
      res.status(STATUS_CODE.NO_CONTENT)
      throw new Error('No Active Account Were Found!')
     }

    
  } catch (error) {
    next(error);
  }
};
