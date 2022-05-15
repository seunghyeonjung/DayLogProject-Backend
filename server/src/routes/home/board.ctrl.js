"use strict";

const { json } = require("body-parser");
const Board = require("../../model/Board/Board");

const process={
    getBoardLastest : async function(request, response){
        const board=new Board(request);
        const latest_diary=await board.getBoardLatest();
        //console.log(month_diaries);
        return response.json({latest_diary});
    },

    getBoardHeart : async function(request, response){
        const board=new Board(request);
        const heartest_diary=await board.getBoardHeart();
        //console.log(month_diaries);
        return response.json({heartest_diary});
    },

    saveDiary : async function(request, response){
        const diary=new Diary(request);
        const month_diaries=await diary.saveDiary();
        //console.log(month_diaries);
        return response.json(month_diaries);
    },

    saveImage : async function(request, response){
        const diary=new Diary(request);
        const res=await diary.saveImage();
        console.log(res);
        if(res.success==true) return response.send({message : true});
        else return response.status(400).send({message : "데이터베이스 저장 실패"});
        
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