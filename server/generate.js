const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256")


// Generates a private key
const privateKey = toHex(secp.utils.randomPrivateKey());
// console.log('private key: ', privateKey)

// derives the public key from the private key
const publicKey = toHex(secp.getPublicKey(privateKey));
// console.log('public key: ', publicKey)
console.log(typeof (publicKey))

const accounts = [
    {
        "name": "bob",
        "privateKey": "71460de7f2add38e30298f8d9ddeddc7d39421b3f96ee5daf6b118580e492a57",
        "publicKey": "047e2f9456f9189883c59de8b8d27f6ba3f9a227d1caea0568bc66e07cdc55d367e6f04b9275e3fde9ebd62d12c14efbec48e85e30ae75601384332b598145697f",
    },
    {
        "name": "alice",
        "privateKey": "4661ed110db96931eafda1984e4afd11c57630bc9fab2b90b8e2c755f4019a9d",
        "publicKey": "044a3e75ccd7dc5797b24dbecc9d05874d749114dd2b825089b6bce25dde0c7e7491186b001b578f286c39921d57263330c709c85c695a416b02be69e361550a5f",
    },
    {
        "name": "dan",
        "privateKey": "5fee6d27d531a770af8666067c887b2542c154b0465aaed65f35b4713579f586",
        "publicKey": "04af8697fdf5e44b2d724a0d72afc393109cf4fe3353cf205a445f65f054c6d991bd835411eb59b1f5821ca384f80b74c341ca00cb764b858362ddead703aa8c76",
    }
]


const msg = "hello world";

// Hashes the value of hallo world with sha256
const msgHashSha256 = toHex(sha256(utf8ToBytes(msg)));

// Hashes the value of hallo world with keccak256
const msgHashKeccak256 = toHex(keccak256(utf8ToBytes(msg)));

console.log('Sha256 hash of', msg, 'is:', msgHashSha256)
console.log('Hash of', msg, 'is:', msgHashKeccak256)


const signature = secp.sign(msgHashSha256, accounts[2].privateKey)

console.log(signature)

const isValid = secp.verify(signature, msgHashSha256, accounts[2].publicKey)

console.log(isValid)
