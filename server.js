const express = require('express')
const cors = require('cors')
const fs = require("fs");

const app = express()
app.use(cors())
const port = 3000

let jsonCache = null;
try{
    jsonCache = JSON.parse(fs.readFileSync("reservations.json"));
}
catch (e) {
    console.log(e)
    jsonCache = []
}

function logJsonCache(res) {

    fs.writeFile("reservations.json", JSON.stringify(jsonCache), (error) => {
        if (error) {
            res.statusCode = 500
            res.send(`{"error": "true", "message": "Server error when logging to file: ${error}"}`)
            console.log(error);
            return;
        }
        res.send(`{"error": "false", "message": "successfully logged to file"}`)
        console.log(`Wrote to file`)

    })
}

app.put('/addUser/:user', (req, res) => {

    let user = {"user": req.params.user, "reservations": []}
    console.log(user)
    jsonCache.push(user)
    logJsonCache(res)

})

app.get('/getUser/:user', (req, res) => {
    let user = req.params.user
    let cahchedUser = jsonCache.find((userObj) => {
        return userObj.user === user
    })
    if (cahchedUser === undefined || cahchedUser === null){
        res.send(`{"error": "true", "message": "user not found"}`)
        return;
    }
    res.send(`{"error": "false", "message": "${JSON.stringify(cahchedUser)}"}`)

})

app.get('/reservations/get/:user', (req, res) => {
    let user = req.params.user
    let cahchedUser = jsonCache.find((userObj) => {
        return userObj.user === user
    })
    if (cahchedUser === undefined || cahchedUser === null){
        res.send(`{"error": "true", "message": "user not found"}`)
        return;
    }
    res.send(`{"error": "false", "message": "${JSON.stringify(cahchedUser.reservations)}"}`)

})

app.get('/reservations/getAll', (req, res) => {
    reservations = []
    jsonCache.forEach((userObj) => {
        userObj.reservations.forEach((reservation) => {
            reservations.push(reservation)
        })
    })
    res.send(`{"error": "false", "message": "${JSON.stringify(reservations)}"}`)

})
app.put('/reservations/add/:user/date/:date/time/:time/hours/:hours', (req, res) => {
    let user = req.params.user
    let date = req.params.date
    let time = req.params.time
    let hours = req.params.hours
    let cahchedUser = jsonCache.find((userObj) => {
        return userObj.user === user
    })
    if (cahchedUser === undefined || cahchedUser === null){
        res.send(`{"error": "true", "message": "user not found"}`)
        return;
    }
    let reservation = {"id": (cahchedUser.reservations.length + 1), "date": date, "time": time, "hours": hours}
    cahchedUser.reservations.push(reservation)

    for(let i = 0; i < jsonCache.length; i++){
        if (jsonCache[i].user === user){
            jsonCache[i] = cahchedUser
        }
    }

    console.log(jsonCache)

    logJsonCache(res)
})

app.put('/reservations/update/:user/id/:id/newDate/:date/newTime/:time/newHours/:hours', (req, res) => {
    let user = req.params.user
    let id = req.params.id
    let date = req.params.date
    let time = req.params.time
    let hours = req.params.hours
    let cachedUserExists = jsonCache.find((userObj) => {
        return userObj.user === user
    })
    if (cachedUserExists === undefined || cachedUserExists === null){
        res.send(`{"error": "true", "message": "user not found"}`)
        return;
    }

    jsonCache = jsonCache.map((userObj) => {
        if (userObj.user === user){
            if(userObj.reservations.id === id){
                userObj.reservations.startDate = date
                userObj.reservations.startTime = time
                userObj.reservations.hours = hours
            }
        }
        return userObj
    })

    console.log(jsonCache[0].reservations)

    logJsonCache(res)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



