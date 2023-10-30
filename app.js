const express = require("express");
const bodyParser = require("body-parser");
const https  = require("https");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // console.log(firstName, lastName, email);

    const data = {
            members: [
                {
                    email_address : email,
                    status : "subscribed",
                    merge_fields : {
                        FNAME : firstName,
                        LNAME : lastName
                    }
                }
            ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/86040a15bb";
    const options = {
        method : "POST",
        auth : "Kunal:9ef0f61a6235bd7a3782c98051b094c9-us21"
    };

    const request = https.request(url, options, (response)=>{

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000.");
});

// API Key
// 9ef0f61a6235bd7a3782c98051b094c9-us21

// List ID
// 86040a15bb