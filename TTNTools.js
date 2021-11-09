const { raw } = require('express');
const fs = require('fs');


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

/**
 * Open and parse TTN JSON object
 * @param {Path to TTN JSON File} path 
 * @returns APP JSON object
 */

function parseTTNfromFile(path){
    let rawdata = fs.readFileSync(path);
    return transform(JSON.parse(rawdata));
}

function storeIncomingMessage(message){
    fs.writeFileSync('./data/' + Date.now() + '.json', JSON.stringify(message));
}

let ttnmsg = parseTTNfromFile('./data/latest.json');
storeIncomingMessage(ttnmsg); 
//console.log(parseTTNfromFile('./data/latest.json'));
