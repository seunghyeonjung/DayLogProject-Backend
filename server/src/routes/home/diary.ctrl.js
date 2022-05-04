"use strict";

const { json } = require("body-parser");
const Diary = require("../../model/Diary/Diary");

const process={
    getDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.getDiary();
        console.log(month_diaries);
        return response.json(month_diaries);
    },

    saveDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.saveDiary();
        console.log(month_diaries);
        return response.json(month_diaries);
    },

    removeDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.removeDiary();
        console.log(month_diaries);
        return response.json(month_diaries);
    },

    modifyDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.modifyDiary();
        console.log(month_diaries);
        return response.json(month_diaries);
    },

    modifyShare : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.modifyShare();
        console.log(month_diaries);
        return response.json(month_diaries);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};