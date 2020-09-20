const { exec } = require("child_process");
const fs = require('fs');
const express = require('express');

// Constants
const PORT = 7777;
const HOST = '0.0.0.0';

let results = []

const commands = [
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0330' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430330' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed",
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0291' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430291' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed",
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0110' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430110' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed"
]


function execCommand(cmd) {
    return new Promise((resolve, reject) => {
        console.log('fetching')
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(JSON.stringify(JSON.parse(stdout).cand)))
            }
        })
    })
}

function fetchData() {

    return commands.map((c) => {
        return execCommand(c)
    })
}

Promise.all(fetchData()).then((result) => {
    const reducer = (accumulator, currentValue) => [...accumulator, ...currentValue];
    results = result.reduce(reducer, []);
})

const app = express();

app.get('/', (req, res) => {
    Promise.all(fetchData()).then((result) => {
        const reducer = (accumulator, currentValue) => [...accumulator, ...currentValue];
        results = result.reduce(reducer, []);

        res.send(results)
    })
});


app.listen(PORT, HOST);