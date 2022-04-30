"use strict";

const { json } = require("body-parser");
const Schedule = require("../../model/Schedule");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    getSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const schedules=await schedule.getSchedule();
        console.log(schedules);
        return response.json(schedules);
    },

    saveSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const schedules=await schedule.saveSchedule();
        console.log(schedules);
        return response.json(schedules);
    },

    removeSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const schedules=await schedule.removeSchedule();
        console.log(schedules);
        return response.json(schedules);
    },

    modifySchedule : async function(request, response){
        const schedule=new Schedule(request);
        const schedules=await schedule.modifySchedule();
        console.log(schedules);
        return response.json(schedules);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};