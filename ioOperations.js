const fs = require("fs").promises

const { FILE_NAME } = require("./constants")


async function createFile(){
    return fs.writeFile(FILE_NAME, "")
}

async function readFile(){
    try {
        const file = await fs.readFile(FILE_NAME, {
            encoding: "utf8",
            flag: "r"
        })
        const fileContent = JSON.parse(file)
        return fileContent
    } catch (error) {
        return []
    }
}

async function updateFile(payload){
    return fs.writeFile(FILE_NAME, JSON.stringify(payload))
}



module.exports = {
    createFile,
    readFile,
    updateFile
}