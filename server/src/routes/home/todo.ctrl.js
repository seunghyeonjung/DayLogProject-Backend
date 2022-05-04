"use strict";

const { json } = require("body-parser");
const Todo = require("../../model/Todo/Todo");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    getTodo : async function(request, response){
        const todo=new Todo(request);
        const month_todos=await todo.getTodo();
        //console.log(todos);
        return response.json(month_todos);
    },

    saveTodo : async function(request, response){
        const todo=new Todo(request);
        const month_todos=await todo.saveTodo();
        //console.log(month_todos);
        return response.json(month_todos);
    },

    removeTodo : async function(request, response){
        const todo=new Todo(request);
        const month_todos=await todo.removeTodo();
        //console.log(month_todos);
        return response.json(month_todos);
    },

    modifyTodo : async function(request, response){
        const todo=new Todo(request);
        const month_todos=await todo.modifyTodo();
        //console.log(month_todos);
        return response.json(month_todos);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};