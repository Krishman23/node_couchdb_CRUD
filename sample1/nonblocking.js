var fs= require('fs');
var a=fs.readFile("text.txt",function (err,data){

    if(err){
        console.log(err);
    }
    setTimeout(()=>{
        console.log("Timeout 2 sec")
    },2000);
    console.log(data.toString());  
})
//
console.log("Hello");


