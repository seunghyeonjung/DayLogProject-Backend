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

    getBoard : async function(request, response){
        const board=new Board(request);
        const selected=await board.getBoard();
        //console.log(month_diaries);
        return response.json({selected});
    },

    getProfile : async function(request, response){
        const board=new Board(request);
        const res=await board.getProfile();
        //console.log(month_diaries);
        return response.json(res);
    },

    modifyLike : async function(request, response){
        const board=new Board(request);
        const res=await board.modifyLike();
        //console.log(res);
        if(res.success==true) return response.json({selected :res.selected});
        else return response.status(400);
    },

    modifyScrap : async function(request, response){
        const board=new Board(request);
        const res=await board.modifyScrap();
        //console.log(res);
        if(res.success==true) return response.json({selected :res.selected});
        else return response.status(400);
        
    },

    mypageSecret : async function(request, response){
        const board=new Board(request);
        const res=await board.getSecret();
        //console.log(res);
        return response.json(res);
        
    },

    mypageShare : async function(request, response){
        const board=new Board(request);
        const res=await board.getShare();
        //console.log(res);
        console.log("return");
        return response.json(res);
        
    },

    mypageScrap : async function(request, response){
        const board=new Board(request);
        const res=await board.getScrap();
        //console.log(res);
        console.log("return");
        return response.json(res);
        
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};