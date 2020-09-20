const { exec } = require("child_process");
const fs = require('fs');
const express = require('express');
const { commands } = require("npm");

// Constants
const PORT = 7777;
const HOST = '0.0.0.0';

let results = []

const elezioni_commands = [
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0330' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430330' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed",
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0291' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430291' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed",
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniG/DE/20200920/TE/08/PR/043/CM/0110' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/comunali/scrutini/20200920/scrutiniGI090430110' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed"
]

const referendum_commands = [
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniFI/DE/20200920/TE/09/SK/01/RE/09/PR/043' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/referendum/scrutini/20200920/scrutiniFI01090430000' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed", // provincia
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniFI/DE/20200920/TE/09/SK/01/RE/09' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/referendum/scrutini/20200920/scrutiniFI01090000000' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed", //regione
    "curl 'https://eleapi.interno.gov.it/siel/PX/scrutiniFI/DE/20200920/TE/09/SK/01' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://elezioni.interno.gov.it/referendum/scrutini/20200920/scrutiniFI01' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' -H 'Content-Type: application/json' --compressed" // nazionali
]


function execCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(stdout))
            }
        })
    })
}

function fetchData(arr) {
    return arr.map((c) => {
        return execCommand(c)
    })
}

const app = express();

app.get('/', (req, res) => {
    Promise.all(fetchData(elezioni_commands)).then((result) => {
        const reducer = (accumulator, currentValue) => [...accumulator, ...currentValue.cand, currentValue.int];
        results = result.reduce(reducer, []);
        res.send(results)
    })
});

app.get('/referendum', (req, res) => {
    Promise.all(fetchData(referendum_commands)).then((result) => {
        const reducer = (accumulator, currentValue) => [...accumulator, ...currentValue.scheda, currentValue.int];
        results = result.reduce(reducer, []);
        res.send(results)
    })
});


app.listen(PORT, HOST);