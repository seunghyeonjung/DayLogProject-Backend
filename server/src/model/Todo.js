"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const TodoStorage=require("./TodoStorage");
const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET_KEY;

function getDay(year,month){
    let last_day;

    //console.log("getDay : "+year+", "+month);

    switch(month){
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

    return last_day;
};

async function oneDayData(year, month, last_day, id){
    let month_todos=[];

    for(var i=1; i<=last_day; i++){
        if(i<10){
            let where="WHERE member_id=? AND DATE(todo_date)='"+year+"-"+month+"-0"+i+"'";
            let res=await TodoStorage.getTodo(id, where);
            if(!(res.length==0)){
                const item={date : res[0].todo_date, todos : res};
                console.log(item);
                month_todos.push(item);
            }
        }
        else{
            let where="WHERE member_id=? AND DATE(todo_date)='"+year+"-"+month+"-"+i+"'";
            let res=await TodoStorage.getTodo(id, where);
            if(!(res.length==0)){
                const item={date : res[0].todo_date, todos : res};
                console.log(item);
                month_todos.push(item);
            }
        }
    }

    return month_todos;
}

class Todo{
    constructor(req){
        this.req=req;
    }

    async getTodo(){
        try{
            let month_todos=[];
            const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            let last_day=getDay(this.req.query.year, month);
            
            console.log(typeof(month), typeof(this.req.query.year));
            
            console.log(this.req.userId+", "+month+", "+this.req.query.year);

            month_todos=oneDayData(this.req.query.year, month, last_day, this.req.userId);
            //console.log(month_todos);
            
            return month_todos;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            //console.log(this.req.body.content+", "+this.req.body.date);
            const date=this.req.body.date;
            const year=date.substr(0,4);
            const month=date.substr(5,2);

            let last_day=getDay(year, month);
            let month_todos=[];

            const res=await TodoStorage.saveTodo(this.req.userId, this.req.body.content, this.req.body.date);

            //console.log(res);
            //console.log(last_day);

            if(res.success==true){
                month_todos=oneDayData(year, month, last_day, this.req.userId);
                return month_todos;
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            const index=this.req.query.no;
            let where="WHERE member_id=? AND todo_no="+index;
            const result=await TodoStorage.getTodo(this.req.userId, where);
            const year=(result[0].todo_date).substr(0,4);
            const month=(result[0].todo_date).substr(5,2);
            let last_day=getDay(year, month);
            let month_todos=[];
            
            const res=await TodoStorage.removeTodo(index);
            
            if(res.success==true){
                month_todos=oneDayData(year, month, last_day, this.req.userId);
                return month_todos;
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyTodo(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            //console.log(this.req.query.no);
            const index=this.req.query.no;
            let change;
            let res;
            let month_todos=[];
            let where="WHERE member_id=? AND todo_no="+index;
            const result=await TodoStorage.getTodo(this.req.userId, where);
            const year=(result[0].todo_date).substr(0,4);
            const month=(result[0].todo_date).substr(5,2);
            let last_day=getDay(year, month);
            

            //console.log(check);
            //console.log(check.todo_checked);
            if(result[0].todo_checked==="false"){
                //console.log("check");
                change=1;
                res=await TodoStorage.modifyTodo(change, index);
            }
            else{
                //console.log("check");
                change=0;
                res=await TodoStorage.modifyTodo(change, index);
            }
            
            if(res.success==true){
                month_todos=oneDayData(year, month, last_day, this.req.userId);
                return month_todos;
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Todo;