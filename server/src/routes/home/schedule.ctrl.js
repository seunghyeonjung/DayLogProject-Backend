"use strict";

const { json } = require("body-parser");
const Schedule = require("../../model/Schedule");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    getSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const month_schedules=await schedule.getSchedule();
        console.log(month_schedules);
        return response.json(month_schedules);
    },

    saveSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const month_schedules=await schedule.saveSchedule();
        console.log(month_schedules);
        return response.json(month_schedules);
    },

    removeSchedule : async function(request, response){
        const schedule=new Schedule(request);
        const month_schedules=await schedule.removeSchedule();
        console.log(month_schedules);
        return response.json(month_schedules);
    },

    modifySchedule : async function(request, response){
        const schedule=new Schedule(request);
        const month_schedules=await schedule.modifySchedule();
        console.log(month_schedules);
        return response.json(month_schedules);
    },



}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};