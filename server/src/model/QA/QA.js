"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const QAStorage=require("./QAStorage");

const QAInfo = require("./QAInfo.js");


function QAlist (Info){
    //렌덤으로 하나 선정하기
    const rand = Math.floor(Math.random() * 9); //질문수  + 1 만큼 곱하기

    let Ans = [];


    let a1 = { text : Info[rand].A1 , index : Info[rand].I1};
    let a2 = { text : Info[rand].A2 , index : Info[rand].I2};
    let a3 = { text : Info[rand].A3 , index : Info[rand].I3};
    Ans.push(a1);
    Ans.push(a2);
    Ans.push(a3);

    let dayQA = {question : Info[rand].QAInfo, choice : Ans};
    
    console.log(dayQA);
    return dayQA;
};

class QA{
    constructor(body){
        this.body=body;
    }

    //질문 + 선택지(설명과 인덱스)
    async getQA(){
        try{
            const Info = await QAInfo.Info(); // QA 정보 : QAInfo / A1 A2 A3

            
            const dayQA = new QAlist(Info);
            return dayQA

        }
            
        catch(Err){
            return{succes : false, message : Err}
        }
    }


    //선택 정보 저장하기 (날짜이모지 보내기)
    async saveQA(){
        try{

            const save = await QAStorage.saveQA(this.body.userId,this.body.query.date, this.body.query.index);

            
            const now = new Date();	// 현재 날짜 및 시간
            //console.log(now);
            const m = (now.getMonth()+1); //getMonth()로 월을 구하면 원래 월의 -1 된 값이 나옵니다. 
            //console.log(m);

            const qachoice = await QAStorage.getQA(this.body.userId); //현재달 정보 가져와야함

            let nowmonth = [];

            for(let i = 0 ; i < qachoice.length ; i++){
                let d = moment(qachoice[i].date); //시작일 달


            }




           
  
                  

        }
            
        catch(Err){
            return{succes : false, message : Err}
        }
    }

    //
    async getQAcalendar(){
        try{
           
  
                  

        }
            
        catch(Err){
            return{succes : false, message : Err}
        }
    }


    
}


module.exports=QA;





