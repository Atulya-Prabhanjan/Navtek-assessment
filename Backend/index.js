var express = require("express");
var mysql = require("mysql");
const prompt = require("prompt-sync")({ sigint: true });
const app = express();
const port = 5000;
var connection = mysql.createConnection({
    user: "nav",
    host: "localhost",
    database:"navtek",
    password: "server@123",
    port: 3306
});

app.listen(port,(error) => {
    if(error)
        console.log('error: '+error);
    else{
        console.log('Up and Running!');
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
        initial()
    }
});

function initial(){
    const username = prompt("Enter your user-name: ");
    const password = prompt("Enter your password: ");
    validate(username,password);
}

function validate(username,password) {
    console.log("username: "+username+" password: "+password);
    sql="SELECT position FROM users WHERE username = '"+username+"' AND Pass = '"+password+"'";
    connection.query(sql,async function(error, results) {
        let res;
        if (error) {
            console.log("Error detected");
            throw error;
        } else {
            res=JSON.stringify(results[0].position).replaceAll('"', '');;
            console.log("role: "+res);
            if(res=="super-admin"){
                console.log("You are allowed to create new admins!");
                const username = prompt("Enter the admin's user-name: ");
                const pass = prompt("Enter the admin's password: ");
                createAdmin(username,pass)
            }
            else{
                console.log("You are not authorised to create new admins!");
                initial();
            }
        }
    })
}

async function createAdmin(adminUsername,password){
    console.log("username: "+adminUsername+" password: "+password);
    sql="insert into users values('"+adminUsername+"','"+password+"','admin');";
    connection.query(sql,function(error, results) {
        if (error) {
            console.log("Error detected");
            throw error;
        } else {
            console.log("Values inserted!");
        }
    })
    initial();
}