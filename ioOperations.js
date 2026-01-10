const fs = require("fs")

const { FILE_NAME } = require("./constants")


function createFile(){
    return fs.writeFileSync(FILE_NAME, "")
}

function readFile(){
    try {
        const file = fs.readFileSync(FILE_NAME, {
            encoding: "utf8",
            flag: "r"
        })
        const fileContent = JSON.parse(file)
        return fileContent
    } catch (error) {
        return []
    }
}

function updateFile(payload){
    console.log(payload)
    return fs.writeFileSync(FILE_NAME, JSON.stringify(payload))
}



module.exports = {
    createFile,
    readFile,
    updateFile
}