"use strict";

const { json } = require("body-parser");
const Todo = require("../../model/Todo");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    getTodo : async function(request, response){
        const todo=new Todo(request);
        const res=await todo.getTodo();
        console.log(res);
        return response.json(res);
    },

    saveTodo : async function(request, response){
        const todo=new Todo(request);
        const res=await todo.saveTodo();
        console.log(res);
        return response.json(res);
    },

    removeTodo : async function(request, response){
        const todo=new Todo(request);
        const res=await todo.removeTodo();
        console.log(res);
        return response.json(res);
    },

    modifyTodo : async function(request, response){
        const todo=new Todo(request);
        const res=await todo.modifyTodo();
        console.log(res);
        return response.json(res);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};