#!/usr/bin/env node
const argument = process.argv
const { createFile, updateFile, readFile} = require("./ioOperations")

const taskIdGenerator = (fileContent) => {
    return Math.max(...fileContent.map(t => t.id)) + 1
}

const handleAddTask = async (argument, retries = 0) => {
    const { content } = argument
    try{
        const fileContent = await readFile()
        const taskFileExists = fileContent.length === 0
        let payload = fileContent
        if(taskFileExists) {
            payload =  [
                {
                    id: 1,
                    content,
                }
            ]
        } else{
            const obj = {}
            obj["id"] = taskIdGenerator(fileContent)
            obj["content"] = content
            payload.push(obj)
        }

        updateFile(payload)
        return 
    }catch(e){
        console.log(e)
        createFile()
        if(retries === 0)handleAddTask(argument, 1)
    }
}

const handleListTasks = async (argument) => {
     
    const allTasks = await readFile()
    let filteredTasks = null
    
    if(argument.status){
        filteredTasks = allTasks.filter(t => t?.status === argument?.status)
    }

    console.log(filteredTasks || allTasks)
    return allTasks
}

const handleDeleteTask = async (argument) => {
    const { id } = argument
    const allTasks = await readFile()
    const filteredTasks = allTasks.filter(t => t.id != id)
    updateFile(filteredTasks)
    return
}

const handleUpdateTask = async (argument) => {
    const { id, content } = argument
    const allTasks = await readFile()
    const taskToBeUpdated = allTasks.map( t => 
        t.id === parseInt(id) ?
        { ...t, content}
        : t
    )
    updateFile(taskToBeUpdated)
    return
} 

const resetTasks = () => {
    
}

const markTask = async (argument) => {
    const { id, status } = argument
    const allTasks = await readFile()
    const taskToBeUpdated = allTasks.map( t => 
        t.id === parseInt(id) ?
        { ...t, status}
        : t
    )
    updateFile(taskToBeUpdated)
    return
}

const argumentParser = (argument) => {
    const operation = argument[2]
    switch (operation) {
        case "add":
            return {
                operation,
                content: argument[3]
            }
        case "update":
            return {
                operation,
                id: argument[3],
                content: argument[4]
            }
        case "delete":
            return {
                operation,
                id: argument[3]
            }
        case "list":
            return{
                operation,
                status: argument[3]
            }
        default:
            return {
                operation,
                id: argument[3],
                status: operation.replace("mark-", "")
            }
    }
}

async function main(argument) {
    const argumentMapper = argumentParser(argument)
    const { operation } = argumentMapper

    if(operation === "add") await handleAddTask(argumentMapper)
    if(operation === "update") await handleUpdateTask(argumentMapper)
    if(operation === "delete") await handleDeleteTask(argumentMapper)
    if(operation.includes("mark")) await markTask(argumentMapper)
    if(operation === "list") await handleListTasks(argumentMapper)
}

main(argument)