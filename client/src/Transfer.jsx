import { useState } from "react";
import server from "./server";

// Cryptography imports
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

import * as secp from '@noble/secp256k1';

function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {
    evt.preventDefault();
    
   
    // 3 functions to create a signature, with private key as input

    //1 Function to convert message to bytes
    function messageInBytes(message) {
      const msgInBytes = utf8ToBytes(message)
      console.log('In bytes msg is:', msgInBytes)
      return msgInBytes
    }
    const rawMsg = recipient;
    const msgInBytes = messageInBytes(recipient);

    //2 Function to hash value of message
    function hashKeccak(input) {
      const hash = keccak256(input);
      console.log('The hash is:', hash);
      return hash
    }
    const message = hashKeccak(msgInBytes)

    // 3 calculate a signature with the given private key
    let signature = await secp.sign(message, privateKey, { recovered: true } );
    console.log("The signature is: " + signature);
    
    
 
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        rawMsg,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>


      <input type="submit" className="button" value="Transfer" />
    </form>
  );

}

export default Transfer;
