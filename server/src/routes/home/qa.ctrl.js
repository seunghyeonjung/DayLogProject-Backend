"use strict";

const { json } = require("body-parser");
const QA = require("../../model/QA/QA");

const process={
    getQA : async function(request, response){
        const qa=new QA(request);
        const month_qa=await qa.getQA();
        console.log(month_qa);
        return response.json(month_qa);
    },


    saveQA : async function(request, response){
        console.log("??");
        const qa=new QA(request);
        const month_qa=await qa.saveQA();
        console.log(month_qa);
        return response.json(month_qa);
    },

    getQAcalendar : async function(request, response){
        const qa=new QA(request);
        const month_qa=await qa.getQAcalendar();
        console.log(month_qa);
        return response.json(month_qa);

    }
}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};