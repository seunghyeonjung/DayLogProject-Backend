"use strict"

const db=require("../../config/db");


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
                else {
                    //기록하고 카운트하기 성공..... 
                    console.log("-------------");
                    const query4 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query4, [id, 4]);
                    console.log("-------------");
                    const query5 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query5, [id, 5]);
                    console.log("-------------");
                    const query6 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query6, [id, 6]);
     
                                /*
                                     let new_goal = 0 ;
                                if ((old_goal.goal_count)===NaN) {
                                    console.log("진입");
                                    const query3 = "UPDATE goal_count SET count = count + 1 WHERE member_id=? and badge_no=?";
                                    db.query(query3, [id, 4]);}
                                else {
                                    console.log(old_goal.goal_count);
                                    console.log("진입2");
                                    let old = old_goal.goal_count;
                                    new_goal = old;
    
                                    const query3 = "UPDATE goal_count SET count = count + 1 WHERE member_id=? and badge_no=?";
                                    db.query(query3, [id, 4]);
                                    //new_goal = (old_goal.goal_count+1);
                                }
                                
                                console.log("도달치", new_goal);
                                const query_badge="UPDATE asas.memberbadge SET goal_count=? WHERE member_id=? and badge_no=?";
                                db.query(query_badge, [new_goal, id, 4]);
                                */
       
    
                        resolve({success : true});
                    }
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