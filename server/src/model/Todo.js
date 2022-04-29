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
            let today=new Date();
            let year=today.getFullYear();
            let res;
            let where;
            let last_day;

            switch(this.req.query.month){
                case "01" : last_day=new Date(year, 1, 0).getDate(); 
                break;
                case "02" : last_day=new Date(year, 2, 0).getDate(); 
                break;
                case "03" : last_day=new Date(year, 3, 0).getDate(); 
                break;
                case "04" : last_day=new Date(year, 4, 0).getDate(); 
                break;
                case "05" : last_day=new Date(year, 5, 0).getDate(); 
                break;
                case "06" : last_day=new Date(year, 6, 0).getDate(); 
                break;
                case "07" : last_day=new Date(year, 7, 0).getDate(); 
                break;
                case "08" : last_day=new Date(year, 8, 0).getDate(); 
                break;
                case "09" : last_day=new Date(year, 9, 0).getDate(); 
                break;
                case "10" : last_day=new Date(year, 10, 0).getDate(); 
                break;
                case "11" : last_day=new Date(year, 11, 0).getDate(); 
                break;
                case "12" : last_day=new Date(year, 0, 0).getDate(); 
                break;
            }
            //console.log(year+", "+last_day);
            //console.log(this.req.userId+", "+this.req.query.date);
            //console.log(this.req.userId+", "+this.req.query.month);
            
            if(this.req.query.date===undefined) {
                where="WHERE member_id=? AND (DATE(todo_date) BETWEEN '"+year+"-"+this.req.query.month+"-01' AND '"+year+"-"+this.req.query.month+"-"+last_day+"')";
                res=await TodoStorage.getTodo(this.req.userId, where);
            }
            else{
                where="WHERE member_id=? AND DATE(todo_date)="+"'"+this.req.query.date+"'";
                res=await TodoStorage.getTodo(this.req.userId, where);
            }
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