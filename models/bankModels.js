import fs from "fs";
import { filePath } from "../utils/dataFilePath.js";

const readBankUsersFromFile = () => {
  try {
    const usersFileData = fs.readFileSync(filePath,'utf-8');
    return JSON.parse(usersFileData);

  } catch (error) {
    console.log(" ", error);
    throw new Error('Error: failed to ready users file!')
  }
};

const writeBankUsersToFile = (users)=>{

    try {
        const dataJson = JSON.stringify(users);
        fs.writeFileSync(filePath,dataJson,'utf-8')
        
    } catch (error) {
        throw new Error('Error: Failed to write on the users file')
    }
}

export {readBankUsersFromFile, writeBankUsersToFile}