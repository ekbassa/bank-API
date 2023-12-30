import fs from "fs";
import { filePath } from "../utils/dataFilePath.js";

const readBankUsersFromFile = () => {
  try {
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
        const dataJson = JSON.stringify(users);
        fs.writeFileSync(filePath,dataJson,'utf-8')
        
    } catch (error) {
        throw new Error('Error: Failed to write on the users file')
    }
}

export {readBankUsersFromFile, writeBankUsersToFile}