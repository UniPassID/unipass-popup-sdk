/* eslint-disable no-undef */
// usage of starkKeyInfo
const starkwareCrypto = require("@starkware-industries/starkware-crypto-utils");

function main(starkKeyInfo) {
  try {
    const { publicKey, signature } = JSON.parse(starkKeyInfo || "{}");
    const privateKey =
      starkwareCrypto.keyDerivation.getPrivateKeyFromEthSignature(signature);
    const startKey =
      starkwareCrypto.keyDerivation.privateToStarkKey(privateKey);
    console.log("publicKey:", publicKey);
    console.log("privateKey:", privateKey);
    console.log("startKey:", startKey);
  } catch (error) {
    console.log(error);
  }
}

main(
  '{"publicKey":"0x042286654d5268a267215de30a66bb998febb6516e96831eabec4d2781ffbe20db783a7992374aeb8568929e73b3dc9f13c3ea92a890bb0639a120f478590e882c","signature":"0x29a7efe2a5265eda0ed705f9fca9805db06d9c2605289de1084c06c6e2be39487e4cb041b34e1ffedb62ac99433c34fbcc98352029a627c335cea02cef52bf551c"}'
);
