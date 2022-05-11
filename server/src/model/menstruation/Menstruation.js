"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const MenstruationStorage=require("./MenstruationStorage");
const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET_KEY;
const moment = require("moment");
const { format } = require("../../config/db");
const { all } = require("../../routes/home");
// https://millo-l.github.io/Nodejs-moment-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/ moment 사용법


//예정일 계산기
function duedate(start, cycle){
    //console.log(start[0].cycle_start_date); // 배열로 오니까 [0](첫번째).데이터명
    //let s = start[0].cycle_start_date+30 => 문자열로 인식되어서 뒤에 30이 붙음 <- 해결
    let startdate = moment(start[0].date);
    //console.log(cycle[0].menstruation_cycle); //이건 오는거 확인.... 주기 가져오는건 수정x
    //console.log("시작일은" + startdate.format("YYYY-MM-DD"));
    //예정일 계산 -> for문으로 배열에 예정일 12개 저장
    
    //console.log("예정일은" + duedate.format("YYYY-MM-DD"));
    let due = startdate.format("YYYY-MM-DD");
    let due_list=[];
    for(var i = 1 ; i < 6 ; i ++){
        due = moment(startdate.format("YYYY-MM-DD")).add(cycle[0].cycle*(i), "days"); // 시작일 + 주기*n
        //console.log(item.format("YYYY-MM-DD"));
        
        let item = { type : 'DUE_DATE', date : due.format("YYYY-MM-DD")};
        due_list.push(item);
        //console.log(due_list[i]);
    }

    return due_list;
};


function list(cycle, dates_start, dates_due){
    console.log("잘 왔는지 확인 ", dates_start, dates_due);

    let due = [] ;
    due.push(dates_due);

    let dates = []; //시작 예정 합치기

    //시작일이 리스트에 존재할경우
    for(let i = 0 ; i < dates_start.length ; i++){
        const s = {type : dates_start[i].type , date : dates_start[i].date};
        dates.push(s);

        if(i === dates_start.length-1){

            if(dates_due.length > 0){
                for(let j = 0 ; j < dates_due.length ; j++){
                    const d = {type : dates_due[j].type , date : dates_due[j].date};
                    dates.push(d);
                }
            }
            else{
                dates.push(dates_due);
            }
            
        }
    }

    //시작일이 존재하지 않을경우 예정일만 담기
    if(dates_start.length === 0){
        for(let j = 0 ; j < dates_due.length ; j++){
            const d = {type : dates_due[j].type , date : dates_due[j].date};
            dates.push(d);
        }
    }

    console.log("확인2", dates);
    
    const cy = {cycle : cycle[0].cycle};
    const da = {dates : dates};
    const res1 = Object.assign(cy, da);
    const res = { cycle_data : res1}; //전부 객체로 보내기
    //let res = [];
    console.log("res : ", res);

    return res;
};


function getlist(cycle, dates_start, dates_due){
    console.log("잘 왔는지 확인 ", dates_start, dates_due);

    let due = [] ;
    due.push(dates_due);

    let dates = []; //시작 예정 합치기

    //시작일이 리스트에 존재할경우
    for(let i = 0 ; i < dates_start.length ; i++){
        const s = {type : dates_start[i].type , date : dates_start[i].date};
        dates.push(s);

        if(i === dates_start.length-1){

            if(dates_due.length > 0){
                for(let j = 0 ; j < dates_due.length ; j++){
                    const d = {type : dates_due[j].type , date : dates_due[j].date};
                    dates.push(d);
                }
            }
            else{
                dates.push(dates_due);
            }
            
        }
    }

    //시작일이 존재하지 않을경우 예정일만 담기
    if(dates_start.length === 0){
        for(let j = 0 ; j < dates_due.length ; j++){
            const d = {type : dates_due[j].type , date : dates_due[j].date};
            dates.push(d);
        }
    }

    console.log("확인2", dates);

    const cy = {cycle : cycle[0].cycle};
    const da = {dates : dates};
    const res1 = Object.assign(cy, da);
    const res = { message : "FILL" , cycle_data : res1}; //전부 객체로 보내기
    //let res = [];
    console.log("res : ", res);

    return res;
};


class Menstruation{
    constructor(body){
        this.body=body;
    }
    // 시작날짜,주기 저장
    async saveMenstruation(){
        try{
            //console.log(this.body);
            const now = new Date();	// 현재 날짜 및 시간
            //console.log(now);
            const m = (now.getMonth()+1); //getMonth()로 월을 구하면 원래 월의 -1 된 값이 나옵니다. 
            //console.log(m);
            const y = now.getFullYear();
            console.log("주기 뭐가 왓나",this.body.body.cycle);


            const all_start = await MenstruationStorage.getAllStart(this.body.userId); // 시작일 모두 가져와서 이전달로 예정일 구해서 현재달꺼만 빼기
            //하나라도 있으면 중복확인 -> 메시지 보내기
            if(all_start.length > 0){
                for(let i = 0 ; i < all_start.length ; i++){
                    if(this.body.body.start === all_start[i].date){
                        console.log("중복");
                        
                        return {success : false , message : "동일한 시작일이 존재합니다."}
                    }
                }
            }
            const insert1 = await MenstruationStorage.saveStart(this.body.userId, this.body.body.start); //시작일 저장
            const insert2 = await MenstruationStorage.saveCycle(this.body.userId, this.body.body.cycle); //주기 저장

            //갱신
            const new_start = await MenstruationStorage.getStart(this.body.userId);// 최신 아마도 현재달 시작일 구해짐
            const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기 보내기
            
            // 1. 처음 입력일 경우
            if(all_start.length===0){ 

                console.log("첫입력");
                //주기+이번달시작일+예정일
                const due = new duedate(new_start, cycle);
                let a = moment(due[0].date);
                let b = moment(new_start[0].date);
                
                if(a.month() === b.month()){
                    //주기가 짧아서 같은 달일 경우 예정일을 2개 보내줘야함
                    let due2 = [];
                    due2.push(due[0]);
                    due2.push(due[1]);

                    const res = new list(cycle, new_start, due2);
                    const month_cycle = {res : res};
                    return month_cycle
                }

                else {
                    const res = new list(cycle, new_start, due[0]);
                    const month_cycle = {res : res};
                    return month_cycle
                }
            }
            // 2. 처음 입력이 아닐 경우
            else if(all_start.length>0){
                const all_start = await MenstruationStorage.getAllStart(this.body.userId); // 시작일 모두 가져와서 이전달로 예정일 구해서 현재달꺼만 빼기
                // 이전달의 시작일(있다면) + 현재달의 시작일 + 예정일
                console.log("첫입력x 이전달에 시작일 o");
                let start_list = [];
                let due_list = [];

                //예정일
                const due = new duedate(new_start, cycle);
                let a = moment(due[0].date);
                let b = moment(new_start[0].date);

                if(a.month() === b.month()){
                    //주기가 짧아서 같은 달일 경우 예정일을 2개 보내줘야함
                    due_list.push(due[0]);
                    due_list.push(due[1]);
                }
                else{
                    due_list.push(due[0]);
                }

                // 이전달 시작일 있는지 파악 + 같은달일수도있음 // 문제가 시작일은 현재만 입력하니까... 과거는 생각 안함...
                for(let i = 0 ; i < all_start.length ; i++){
                    let c = moment(all_start[i].date); //시작일 달

                    if((c.month()+2===m) || (c.month()+1 ===m)){ 

                        // 현재달보다 이전 달이라면 현재달 5월이면 m=5 c가 이전달이면 4월이여야하는데 3으로 나옴 그래서 +2
                        let s = { type : all_start[i].type, date : all_start[i].date};
                        start_list.push(s);
                    }
                   
                }
                const res = new list(cycle, start_list, due_list);
                const month_cycle = {res : res};
                return month_cycle

            }
            
        }catch(Err){
            return{succes : false, message : Err}
        }
    }

    // 예정일 출력, 시작일 출력
    async getMenstruation(){
        
        try{

            const all_start = await MenstruationStorage.getAllStart(this.body.userId); // 시작일 모두 가져와서 이전달로 예정일 구해서 현재달꺼만 빼기
            const new_start = await MenstruationStorage.getStart(this.body.userId);// 최신 아마도 현재달 시작일 구해짐
            const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기 보내기

            console.log("주기확인",cycle);

            // 요청받은 년도와 달을이용하기
            const m = this.body.query.month;
            console.log("요청받은 달", this.body.query.month);
            const y = this.body.query.year;
            console.log("요청받은 년", this.body.query.year);

            //3달치보내줘야함
/*
            if(cycle === NULL){
                //주기없음
                const month_cycle = {message: "EMPTY"};
                return month_cycle;
            }
*/
            console.log("-----");

            //1 이번달
            let start_list = [];
            let due_list = [];
            console.log("시작일");
            if(all_start.length>0){
                for(let i = 0 ; i < all_start.length ; i++){
                    let c = moment(all_start[i].date); //시작일 달
                    console.log("시작일",all_start[i]);
                    console.log(c.month(), m);
                    if((c.month()+1)===Number(m) || (c.month()+2)===Number(m) || (c.month()===Number(m))){ //이전달 현재달 
                       
                        let s = { type : all_start[i].type, date : all_start[i].date};
                        
                        start_list.push(s);
                    }
                }
                
                console.log(start_list);

                const due = new duedate(new_start, cycle);
                for(let i = 0 ; i < due.length ; i++){
                    let d = moment(due[i].date); //시작일 달


                    if((d.month()+1)===Number(m) || (d.month()+2)===Number(m)|| (d.month())===Number(m)){ //이전달 현재달 
                        
                        let s = { type : due[i].type, date : due[i].date};
                        due_list.push(s);
                    }
                }

                const res = new getlist(cycle, start_list, due_list);
                //const month_cycle = {res : res};
                return res;
                
            }
            



/*
            const all_start = await MenstruationStorage.getAllStart(this.body.userId); // 시작일 모두 가져와서 이전달로 예정일 구해서 현재달꺼만 빼기
            const new_start = await MenstruationStorage.getStart(this.body.userId);// 최신 아마도 현재달 시작일 구해짐
            const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기 보내기

            let month_menstruation=[]; //리스트로 보내야함
            //console.log("달",this.body.query.month);

            const now = new Date();	// 현재 날짜 및 시간
            //console.log(now);
            const m = (now.getMonth()+1); //getMonth()로 월을 구하면 원래 월의 -1 된 값이 나옵니다. 
            //console.log(m);
            const y = now.getFullYear();


    //1.현재달 -> 현재달에 시작일이 있다면은 이전달의시작일+현재달시작일+예정일1~2개
            //-> 현재달에 시작일이 없다면 이전달의시작일 + 이전시작일의 예정일 + 다음달까지 줘야함

            if(this.body.query.month == m && this.body.query.year == y){ 
                console.log("현재달입니다");
                let start_list = [];
                let due_list = [];
                let a = moment(new_start.date);

                if(a.month()+1 === m){
                    console.log("현재달에 시작일이 있습니다.");
                    for(let i = 0 ; i < all_start.length ; i++){
                        //이전달 시작일을 찾아야함
                        let b = moment(all_start[i].date);
                        if(b.month()+2 === m){
                            console.log("이전달 시작일 찾음" , all_start[i])
                            start_list.push(all_start[i]); 
                            break;
                        }
                    }
                    start_list.unshift(new_start); //시작일 2개 다 넣음

                    //예정일 계산 1~2만 넣으면 됌
                    let due = new duedate(new_start, cycle);
                    due_list.push(due[0]);
                    due_list.push(due[1]);
                    const res = new list(cycle, start_list, due_list);

                    return res;

                }

                else {
                    console.log("현재달에 시작일이 없습니다.");
                    start_list.push(new_start);

                    let due = new duedate(new_start, cycle); //3개까지 넣으면 다음달까지 갈듯
                    due_list.push(due[0]);
                    due_list.push(due[1]);
                    due_list.push(due[2]);

                    const res = new list(cycle, start_list, due_list);

                    return res;

                
            }


        }


            if(this.body.query.month == m && this.body.query.year == y){ //현재 달에 현재 년도면 주기 + 시작일 + 예정일
                console.log("현재");
                //현재 달 + 시작일
                const now_start = await MenstruationStorage.getStart(this.body.userId);// 최신 아마도 현재달 시작일 구해짐
                //console.log("시작일 :" , now_start[0].cycle_start_date);
                const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기
                //console.log("주기 :" , cycle[0].menstruation_cycle);
                const due_list = new duedate(now_start,cycle); //예정일 구하기
                month_menstruation = due_list;

                let st = {type : 'START_DATE', date : now_start[0].cycle_start_date};
                due_list.unshift(st);
                console.log("due_list 출력:" , due_list);
                
                var sJson = JSON.stringify(due_list);


                return { message : "FILL", 
                        cycle_data : {
                            cycle : cycle[0].menstruation_cycle, 
                            dates : sJson } 
                        };

            }
            else if(this.body.query.year == y && this.body.query.month<m){ //년도 같고 현재 달보다 이전이면 이전달 시작일만
                console.log("이전");
                const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기
                const allstart = await MenstruationStorage.getAllStart(this.body.userId); // 모든 시작일 받아옴
                console.log(allstart);
                let start_list = [];
                
                // 주어진 달 이전까지의 시작일만 
                for(var i = 0 ; i < allstart.length ; i++){
                    let mon = moment(allstart[i].cycle_start_date);
                    if( (mon.month()+1) == this.body.query.month || (mon.month()+1) == (Number(this.body.query.month)-1) || (mon.month()+1) == (Number(this.body.query.month)+1)){
                        let item = {type : 'START_DATE', date : allstart[i].cycle_start_date};
                        start_list.push(item);
                    } 
                }
                console.log(start_list);

                month_menstruation = start_list;
                var sJson = JSON.stringify(start_list);
                return { message : "FILL",
                        cycle_data : {
                            cycle : cycle[0].menstruation_cycle, 
                            dates : sJson
                        }
                    
                }

            }
            else if(this.body.query.year == y && this.body.query.month>m){ //년도 같고 현재 달보다 이후이면 최신 시작일 + 예정일
                console.log("이후");
                const cycle = await MenstruationStorage.getCycle(this.body.userId); //주기

                //이후는 시작일이 없음 그러므로 최신시작일만 보냄
                const now_start = await MenstruationStorage.getStart(this.body.userId);// 최신 아마도 현재달 시작일 구해짐 안쓸수도있는데 걍 보냄
                //이후 예정일 보내기 
                const due_list = new duedate(now_start,cycle); //예정일 구하기

                for(var i = 0 ; i < 12 ; i++){
                    let mon = moment(due_list[i].date);
                    if( (mon.month()+2) >= this.body.query.month && (mon.year() ==this.body.query.year)){ // 주어진달,이전달,미래쭉 예정일 보내기
                        let item = {type : 'DUE_DATE', date : due_list[i].date};
                        month_menstruation.push(item);
                    } 
                }
                let st = {type : 'START_DATE', date : now_start[0].cycle_start_date}; //시작일 맨 앞에넣기

                month_menstruation.unshift(st);
                console.log(month_menstruation);
                var sJson = JSON.stringify(month_menstruation);

                return { message : "FILL",
                    cycle_data : {
                    cycle : cycle[0].menstruation_cycle, 
                    dates : sJson
                    }
                }
            }
            
           */

        
        }catch(err){
            return{succes : false, message : err}
        }
    }
    

}

module.exports=Menstruation;