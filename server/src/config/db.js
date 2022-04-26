const mysql=require("mysql");

const db=mysql.createConnection({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWD,
    database : process.env.DB_DATABASE,
});

db.connect((err)=>{
    if(err) throw err;
});

/*const query="SELECT * FROM capstone_design.member";
            db.query(query ,(err, data)=>{
                console.log(data[1]);
            });*/

module.exports=db;