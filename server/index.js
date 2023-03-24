const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require('ethereum-cryptography/keccak');
const { utf8ToBytes } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const balances = {
  "047e2f9456f9189883c59de8b8d27f6ba3f9a227d1caea0568bc66e07cdc55d367e6f04b9275e3fde9ebd62d12c14efbec48e85e30ae75601384332b598145697f": 100, // Dans Wallet // 047e2f9456f9189883c59de8b8d27f6ba3f9a227d1caea0568bc66e07cdc55d367e6f04b9275e3fde9ebd62d12c14efbec48e85e30ae75601384332b598145697f // 71460de7f2add38e30298f8d9ddeddc7d39421b3f96ee5daf6b118580e492a57
  "044a3e75ccd7dc5797b24dbecc9d05874d749114dd2b825089b6bce25dde0c7e7491186b001b578f286c39921d57263330c709c85c695a416b02be69e361550a5f": 50, // Alice Wallet // 044a3e75ccd7dc5797b24dbecc9d05874d749114dd2b825089b6bce25dde0c7e7491186b001b578f286c39921d57263330c709c85c695a416b02be69e361550a5f // 4661ed110db96931eafda1984e4afd11c57630bc9fab2b90b8e2c755f4019a9d
  "04af8697fdf5e44b2d724a0d72afc393109cf4fe3353cf205a445f65f054c6d991bd835411eb59b1f5821ca384f80b74c341ca00cb764b858362ddead703aa8c76": 705, // Ben Wallet // 04af8697fdf5e44b2d724a0d72afc393109cf4fe3353cf205a445f65f054c6d991bd835411eb59b1f5821ca384f80b74c341ca00cb764b858362ddead703aa8c76 // 5fee6d27d531a770af8666067c887b2542c154b0465aaed65f35b4713579f586
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

/* 
    Get a signature from the client-side app,
     recover the public address from the signature
     and that is going to be the sender
     if the signature is not right, reject the transaction 
*/
app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, rawMsg } = req.body;
  //console.log("req.body=",req.body);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const messageInBytes = utf8ToBytes(rawMsg);
  const keccakHash = keccak256(messageInBytes);

  const formattedSignature = Uint8Array.from(Object.values(signature[0]));

  const recoveredPublicKey = secp.recoverPublicKey(keccakHash, formattedSignature, signature[1]);
  const verified = secp.verify(formattedSignature, keccakHash, recoveredPublicKey);

  if (!verified) {
    res.status(400).send({ message: "You are not verified for this" });
  }
  else if (balances[sender] < amount) {
    res.status(400).send({ message: "You don't have enough funds" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender], message: "Transfer succesful" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
