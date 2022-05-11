"use strict";

const { json } = require("body-parser");
const Menstruation = require("../../model/menstruation/Menstruation.js");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={

    //시작일, 주기 저장
    saveMenstruation : async function(request, response){
        const menstruation=new Menstruation(request);
        const month_cycles=await menstruation.saveMenstruation();

        if(month_cycles.success === false){
            return response.status(400).send(
                month_cycles.message
            );
        }
        
        console.log(month_cycles.res);
        return response.json(month_cycles.res)

    },

    //조회
    getMenstruation : async function(request,response){
        const menstruation=new Menstruation(request);
        const month_cycles=await menstruation.getMenstruation();
        console.log("조회확인");
        console.log(month_cycles);
        return response.json(month_cycles)
    }


}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};