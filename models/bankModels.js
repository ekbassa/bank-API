import fs from "fs";
import { filePath } from "../utils/dataFilePath.js";

const initializeUsersFile = () => {
  if (!fs.existsSync(filePath)){
    fs.writeFileSync(filePath,JSON.stringify([]),'utf8')
  }
}

const readBankUsersFromFile = () => {
  try {
    initializeUsersFile();
    if (!fs.existsSync(filePath)){
      throw new Error (`File not found: ${filePath}`)
    }

    const usersFileData = fs.readFileSync(filePath,'utf-8');
    return JSON.parse(usersFileData);

  } catch (error) {
    throw new Error('Failed to Read file...')
    
  }

};

const writeBankUsersToFile = (users)=>{
    try {
      initializeUsersFile();
        const dataJson = JSON.stringify(users);
        fs.writeFileSync(filePath,dataJson,'utf-8')
        
    } catch (error) {
        throw new Error('Error: Failed to write on the users file')
    }
}

export {readBankUsersFromFile, writeBankUsersToFile}