import { ANT, ArweaveSigner } from '@ar.io/sdk';
import fs from 'fs';

const id = "7z3wuIqrfWvPPj9iIndJwvoC6FMOm7t-DpnyB2LXkf0"
const pid = "9BbxfQftyV3N_rqQQ6ByQvXBd9RhNmWT7mBxr4-9vC4"

const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'));

const signer = new ArweaveSigner(jwk);
const ant = ANT.init({ processId: pid, signer });

// Update the ANT record (assumes the JWK is a controller or owner)
console.log(await ant.setRecord(
    {
        undername: "@",
        transactionId: id,
        ttlSeconds: 3600,
    },
    // {
    //     name: 'GIT-HASH',
    //     value: process.env.GITHUB_SHA,
    // }
))