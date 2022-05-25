"use strict";

const { json } = require("body-parser");
const Badge = require("../../model/Badge/Badge");

const process={
    getBadge : async function(request, response){
        const badge=new Badge(request);
        const month_badge=await badge.getBadge();
        console.log(month_badge);
        return response.json(month_badge);
    },


    modifyBadge : async function(request, response){
        const badge=new Badge(request);
        const month_badge=await badge.modifyBadge();
        console.log(month_badge);
        return response.json(month_badge);
    },

    checkBadge : async function(request, response){
        const badge=new Badge(request);
        const month_badge=await badge.checkBadge();
        console.log(month_badge);
        return response.json(month_badge);
    }

}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};