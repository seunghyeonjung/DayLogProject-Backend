"use strict"

const db=require("../config/db");


class TodoStorage{
    static getTodo(id, where){
        return new Promise((resolve, reject)=>{
            //console.log(where);
            const query="SELECT *, DATE_FORMAT(todo_date,'%Y-%m-%d') AS todo_date, IF(todo_checked, 'true', 'false') as todo_checked FROM capstone_design.todo " + where;
            //console.log(query);
            db.query(query, [id] ,(err, data)=>{
                //console.log(data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    /*static getCheck(index){
        return new Promise((resolve, reject)=>{
            console.log(index);
            const query="SELECT *, DATE_FORMAT(todo_date,'%Y-%m-%d') AS todo_date, IF(todo_checked, 'true', 'false') as todo_checked FROM capstone_design.todo WHERE todo_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data[0]);
            });
        });
    }*/

    static saveTodo(id, content, date){
        return new Promise((resolve, reject)=>{
            console.log(id+", "+content+", "+date);
            const query="INSERT INTO capstone_design.todo(member_id, todo_content, todo_date) VALUES(?, ?, ?)";
            db.query(query, [id, content, date] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static removeTodo(index){
        return new Promise((resolve, reject)=>{
            console.log(index);
            const query="DELETE FROM capstone_design.todo WHERE todo_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyTodo(change, index){
        return new Promise((resolve, reject)=>{
            console.log(change+", "+index);
            const query="UPDATE capstone_design.todo SET todo_checked=? WHERE todo_no=?";
            db.query(query, [change, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }
}

module.exports=TodoStorage;