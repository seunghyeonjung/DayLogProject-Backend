"use strict";

const { json } = require("body-parser");
//뱃지 정보

class QAInfo {
static Info(){
        let list = [];
        let a =  { QAInfo : "지금 기분은 어떠신가요 ?", 
                A1 : "좋아 ! ", A2 : "그냥그래", A3: "최악이야.." ,
                I1 : 1, I2 : 2, I3: 3};

        let b = { QAInfo : "지금 피곤하진 않으신가요?", 
                A1 : "완전 피곤해", A2 : "괜찮아", A3: "좋아 !" ,
                I1 : 1, I2 : 2, I3: 3};

        let c = { QAInfo : "할 일은 잘 되어가시나요?", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let d = { QAInfo : "오늘 건강 상태는 어떠신가요?", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let e = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let f = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let g = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let h = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let i = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let j = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let k = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
                I1 : 1, I2 : 2, I3: 3};

        let l = { QAInfo : "질문해", 
                A1 : "대답1", A2 : "대답2", A3: "대답3" ,
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
        list.push(j);
        list.push(k);
        list.push(l);

        return list;

    }

}


//hello: hello와 동일하게 저장된 것
module.exports= QAInfo;