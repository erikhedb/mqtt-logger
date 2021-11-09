/***
 * 
 */
const mqtt = require('mqtt');
const config = require('./config.json');
const fs = require('fs');


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
  fs.writeFileSync(path_latest,message);
  console.log(transform(JSON.parse(message)));
})

/**
 * Transform TTN JSON object to read and storage friendly object
 * @param {TTN JSON Object} ttndata 
 * @returns APP JSON Object
 */
 function transform(ttndata){

  const deviceid      = ttndata.end_device_ids.device_id;
  const timestamp     = ttndata.received_at;
  const payload       = ttndata.uplink_message.decoded_payload;
  const package = {
      deviceid,
      timestamp,
      payload
  };
  return package;

}