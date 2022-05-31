"use strict";

const { json } = require("body-parser");
const Diary = require("../../model/Diary/Diary");

const process={
    getDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.getDiary();
        //console.log(month_diaries);
        return response.json(month_diaries);
    },

    saveDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.saveDiary();
        console.log(month_diaries);
        if(month_diaries.success) return response.json(month_diaries);
        else return response.status(month_diaries.status).send({message : "동일한 날짜에 일기가 있습니다"});
    },

    saveImage : async function(request, response){
        const diary=new Diary(request);
        const res=await diary.saveImage();
        console.log(res);
        if(res.success==true) return response.send({message : true});
        else return response.status(401).send({message : "데이터베이스 저장 실패"});
        
    },

    removeDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.removeDiary();
        console.log(month_diaries);
        return response.json(month_diaries);
    },

    modifyDiary : async function(request, response){
        const diary=new Diary(request);
        const edited_diary=await diary.modifyDiary();
        console.log(edited_diary);
        return response.json(edited_diary);
    },

    modifyImage : async function(request, response){
        const diary=new Diary(request);
        const res=await diary.modifyImage();
        console.log(res);
        if(res.success==true) response.json({message : true});
        return response.status(401);
    },

    modifyShare : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.modifyShare();
        //console.log(month_diaries);
        return response.json(month_diaries);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};