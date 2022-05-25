"use strict";

const { json } = require("body-parser");
//뱃지 정보

class QAInfo {
static Info(){
        let list = [];
        let a =  { QAInfo : "지금 기분은 어떠신가요 ?", 
                A1 : "좋아! ", A2 : "그냥그래", A3: "최악이야.." ,
                I1 : 1, I2 : 2, I3: 3};

        let b = { QAInfo : "지금 피곤하진 않으신가요?", 
                A1 : "완전 피곤해", A2 : "괜찮아", A3: "좋아 !" ,
                I1 : 1, I2 : 2, I3: 3};

        let c = { QAInfo : "할 일은 잘 되어가시나요?", 
                A1 : "잘 되어가는 중 !", A2 : "그럭저럭...", A3: "아니 힘들어" ,
                I1 : 1, I2 : 2, I3: 3};

        let d = { QAInfo : "오늘 건강 상태는 어떠신가요?", 
                A1 : "건강해", A2 : "그저그래", A3: "아파..." ,
                I1 : 1, I2 : 2, I3: 3};

        let e = { QAInfo : "요즘 재미있는 일이 있나요?", 
                A1 : "완전 많아!", A2 : "있어!", A3: "하나도 없어" ,
                I1 : 1, I2 : 2, I3: 3};

        let f = { QAInfo : "오늘 하루도 힘내세요!", 
                A1 : "화이팅!", A2 : "아자 아자 !", A3: "싫어" ,
                I1 : 1, I2 : 2, I3: 3};

        let g = { QAInfo : "요즘 소화 상태는 어떠신가요?", 
                A1 : "잘 먹고 소화도 잘 돼", A2 : "소화불량", A3: "잘 안먹어" ,
                I1 : 1, I2 : 2, I3: 3};

        let h = { QAInfo : "요즘 운동 하고 계신가요?", 
                A1 : "매일 운동하고 있어", A2 : "가끔씩 하는 중", A3: "전혀 안 해" ,
                I1 : 1, I2 : 2, I3: 3};

        let i = { QAInfo : "좋아하고 있는 것이 있나요?", 
                A1 : "완전 사랑하는 중!", A2 : "관심이 가는 건 있어", A3: "없어" ,
                I1 : 1, I2 : 2, I3: 3};


        
        
        list.push(a);
        list.push(b);
        list.push(c);
        list.push(d);
        list.push(e);
        list.push(f);
        list.push(g);
        list.push(h);
        list.push(i);


        return list;

    }

}


//hello: hello와 동일하게 저장된 것
module.exports= QAInfo;