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

    modifyLike : async function(request, response){
        const board=new Board(request);
        const selected=await board.modifyLike();
        //console.log(month_diaries);
        return response.json({selected});
    },

    modifyScrap : async function(request, response){
        const board=new Board(request);
        const selected=await board.modify();
        //console.log(month_diaries);
        return response.json({selected});
        
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};