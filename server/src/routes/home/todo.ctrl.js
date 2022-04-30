"use strict";

const { json } = require("body-parser");
const Todo = require("../../model/Todo");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    getTodo : async function(request, response){
        const todo=new Todo(request);
        const todos=await todo.getTodo();
        //console.log(todos);
        return response.json(todos);
    },

    saveTodo : async function(request, response){
        const todo=new Todo(request);
        const todos=await todo.saveTodo();
        console.log(todos);
        return response.json(todos);
    },

    removeTodo : async function(request, response){
        const todo=new Todo(request);
        const todos=await todo.removeTodo();
        console.log(todos);
        return response.json(todos);
    },

    modifyTodo : async function(request, response){
        const todo=new Todo(request);
        const todos=await todo.modifyTodo();
        //console.log(todos);
        return response.json(todos);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};