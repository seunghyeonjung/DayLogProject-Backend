"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const TodoStorage=require("./TodoStorage");
const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET_KEY;

class Todo{
    constructor(req){
        this.req=req;
    }

    async getTodo(){
        try{
            console.log(this.req.userId+", "+this.req.query.date);
            const res=await TodoStorage.getTodo(this.req.userId, this.req.query.date);
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.body.content+", "+this.req.body.date);
            const res=await TodoStorage.saveTodo(this.req.userId, this.req.body.content, this.req.body.date);
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.query.index);
            const res=await TodoStorage.removeTodo(this.req.query.index);
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.query.index);
            const index=this.req.query.index;
            let change;
            let res;
            const check=await TodoStorage.getCheck(index);
            console.log(check);
            console.log(check.todo_checked);
            if(check.todo_checked===0){
                change=1;
                res=await TodoStorage.modifyTodo(change, index);
            }
            else{
                change=0;
                res=await TodoStorage.modifyTodo(change, index);
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Todo;