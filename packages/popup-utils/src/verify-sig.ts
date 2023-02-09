import { BytesLike, Contract, providers, utils } from 'ethers';
import { encodeTypedDataHash, TypedData } from '.';

const EIP1271_ABI = [
  'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)',
];
const EIP1271_MAGICVALUE = '0x1626ba7e';

/**
 * Verify ethereum account signature, including EOA account and Contract account.
 * 
 * @param message 
 * @param signature 
 * @param address account address
 * @param isEIP191Prefix boolean. Does the personal hash algorithm use EIP191 prefix.
 *                      There are two message prefix for personal hash algorithm: 
                                    - EIP191Prefix: `\x19Ethereum Signed Message:\n`
                                    - UniPassPrefix: `\x18UniPass Signed Message:\n`
 * @param provider optional param, for contract signature validation
 * @returns signature validation result
 */
export const verifyMessageSignature = async (
  message: BytesLike,
  signature: string,
  address: string,
  isEIP191Prefix: boolean = false,
  provider?: providers.JsonRpcProvider
): Promise<boolean> => {
  let digestHash;
  if (isEIP191Prefix) {
    digestHash = utils.hashMessage(message);
  } else {
    digestHash = UniPassHashMessage(message);
  }
  return await checkWalletSignature(digestHash, signature, address, provider);
};

/**
 *
 * @param typedData Typed Data message
 * @param signature
 * @param address account address
 * @param provider optional param, for contract signature validation
 * @returns signature validation result
 */
export const verifyTypedDataSignature = async (
  typedData: TypedData,
  signature: string,
  address: string,
  provider?: providers.JsonRpcProvider
): Promise<boolean> => {
  const typedHash = encodeTypedDataHash(typedData);

  return await checkWalletSignature(typedHash, signature, address, provider);
};

const UniPassHashMessage = (message: BytesLike): string => {
  const UniPassMessagePrefix = '\x18UniPass Signed Message:\n';
  if (typeof message === 'string') {
    message = utils.toUtf8Bytes(message);
  }
  return utils.keccak256(
    utils.concat([
      utils.toUtf8Bytes(UniPassMessagePrefix),
      utils.toUtf8Bytes(String(message.length)),
      message,
    ])
  );
};

const checkWalletSignature = async (
  digestHash: BytesLike,
  signature: string,
  address: string,
  provider?: providers.JsonRpcProvider
): Promise<boolean> => {
  let addr = '';
  try {
    addr = utils.recoverAddress(digestHash, signature);
  } catch (e) {
    // console.error(e);
  }

  if (!!addr && utils.getAddress(addr) === utils.getAddress(address.toLowerCase())) {
    return true;
  } else {
    return await checkContractWalletSignature(
      digestHash,
      signature,
      address,
      provider
    );
  }
};

export const checkContractWalletSignature = async (
  digestHash: BytesLike,
  signature: string,
  address: string,
  provider?: providers.JsonRpcProvider
): Promise<boolean> => {
  if (!provider) {
    return false;
  }

  const walletContract = new Contract(address, EIP1271_ABI, provider);
  const res = await walletContract.isValidSignature(digestHash, signature);
  return res == EIP1271_MAGICVALUE;
};
