/***
 * 
 */
const mqtt = require('mqtt');
const config = require('./config.json');
const express = require('express');
const fs = require('fs');
require('./TTnTools.js');

// Globals
const path_latest = "./data/latest.json";

/***
 * Setup MQTT Subscription
 */
var mqtt_options={
    clientId: config.mqtt_client_id,
    username: config.mqtt_username,
    password: config.mqtt_password
};

//Connect to broker
var client  = mqtt.connect(config.mqtt_server,mqtt_options);
 
//Subscribe to topic
client.on('connect', function () {
    client.subscribe(config.mqtt_topic, function (err) {
        if (!err)
            console.log("Connected to MQTT BRoker");
    });
})

//Logg error to console
client.on('error', function(err) {
    console.log(err);
  });

//MQTT Callback on message received
client.on('message', function (topic, message) {
    console.log(topic + ": " + message.toString());
    fs.writeFileSync(path_latest,message.toString());
    storeIncomingMessage(message);
})

/***
 * Setup Express Webserver
 */
const app = express()
app.use(express.static('public'));

app.get('/api/latest', (req, res) => {
    
   try{
        let rawdata = fs.readFileSync(path_latest);
        let data = JSON.parse(rawdata);
        res.send(data);
    }catch(error){
        console.log(error);
        res.send('{}')
    } 
    
  })

app.listen(config.http_port, () => {
  console.log(`Example app listening at http://localhost:${config.http_port}`)
})