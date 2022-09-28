import { Contract, utils, Wallet, constants, BigNumber } from 'ethers'
import assets from '@/service/assets'
import { TxExcutor } from '@unipasswallet/sdk'
import { SessionKey } from '@unipasswallet/wallet'
import { Transaction, CallType } from '@unipasswallet/transactions'
import { CallTxBuilder } from '@unipasswallet/transaction-builders'
import { generateSessionKey } from '@/utils/rbac'
import { ExecuteCallBody, RelayerTransaction } from './relayer'
import { SyncTx } from './backend'
import MultiChainContranctData from './multichain.contract.data'
import { getChain } from './chains-config'

export interface SendTransferData {
  permit: string
  feeToken: string
  feeAmount: string
  feeDecimals: number
  feeReceiver: string
  tokenDecimals: number
  accountAddress: string
  keysetJson: string
  sessionKey: Wallet
  timestamp: number
  toAddress: string
  toAmount: string
  contractAddress: string
  masterKeyAddress: string
  syncTranscation: SyncTx
  targetChainNode: string
}

const getRelayerTxByTx = (txs: Transaction[]): RelayerTransaction[] => {
  const rtxs = txs.map((tx: Transaction) => {
    return { ...tx, gasLimit: tx.gasLimit.toHexString(), value: tx.value.toHexString() }
  })
  console.log(rtxs)
  return rtxs
}

async function getExecuteCallBody(
  sendTransferData: SendTransferData,
  txs: Transaction[],
  multiChainContranctData: MultiChainContranctData,
): Promise<ExecuteCallBody | undefined> {
  const { accountAddress, permit, timestamp, keysetJson, syncTranscation, targetChainNode } =
    sendTransferData
  const nonce = await multiChainContranctData.getNonce(accountAddress)
  const { chainId } = await multiChainContranctData.getNetwork()
  const contract = await multiChainContranctData.getContract(accountAddress)
  const weight = Number(process.env.VUE_APP_Permit_Weight)
  const sessionKey = await generateSessionKey(
    sendTransferData.sessionKey,
    timestamp,
    permit,
    weight,
    keysetJson,
    chainId,
    accountAddress,
    multiChainContranctData.getProvider(),
  )
  if (targetChainNode === getChain('polygon')?.authChainNode) {
    const txExecutor = new TxExcutor(chainId, contract, nonce, txs)
    await txExecutor.generateSignature(sessionKey)
    const signature = txExecutor.signature as string
    const executeCallBody = {
      call: JSON.stringify({
        txs: getRelayerTxByTx(txs),
        nonce: utils.hexlify(nonce),
        signature,
      }),
      chainId: utils.hexlify(chainId),
      walletAddress: accountAddress,
      estimateGas: '0x0',
      txHash: txExecutor.digestMessage(),
    }
    return executeCallBody
  } else {
    const syncAccountTx = await getSyncTransaction(
      syncTranscation,
      txs,
      accountAddress,
      chainId,
      nonce,
      contract,
      sessionKey,
      multiChainContranctData,
    )
    console.log({ syncAccountTx })
    const moduleGuestContract = multiChainContranctData.getModuleGuestContract()
    // test // todo add relayer
    console.log({ moduleGuestContract })
    const optimalGasLimit = constants.Two.pow(21)
    const ret = await moduleGuestContract.execute(syncAccountTx, 1, '0x', {
      gasLimit: optimalGasLimit,
    })
    console.log(ret)
    const data = await ret.wait()
    console.log(data)
    console.log('====================')
  }
}

export const getSendERC20Transaction = async (
  toAddress: string,
  toAmount: string,
  contractAddress: string,
  tokenDecimals: number,
  feeToken: string,
  feeDecimals: number,
  feeAmount: string,
  feeReceiver: string,
): Promise<Transaction[]> => {
  const data = assets.getTransferData(
    toAddress,
    utils.parseUnits(toAmount, tokenDecimals),
    contractAddress as string,
  )
  const feeData = assets.getTransferData(
    feeReceiver,
    utils.parseUnits(feeAmount, feeDecimals),
    contractAddress as string,
  )
  const tx = new CallTxBuilder(
    false, // todo
    constants.Zero,
    contractAddress as string,
    constants.Zero,
    data,
  ).build()

  const feeTx = new CallTxBuilder(
    true,
    constants.Zero,
    feeToken,
    utils.parseUnits(feeAmount, feeDecimals),
    feeData,
  ).build()
  return [tx, feeTx]
}
export const getSendNativeToken20Transaction = async (
  to: string,
  amount: string,
  feeAmount: string,
  feeReceiver: string,
): Promise<Transaction[]> => {
  const optimalGasLimit = constants.Zero
  const value = utils.parseEther(amount)
  const tx = new CallTxBuilder(false, optimalGasLimit, to, value, '0x').build()
  const feeTx = new CallTxBuilder(
    true,
    constants.Zero,
    feeReceiver,
    utils.parseEther(feeAmount),
    '0x',
  ).build()
  return [tx, feeTx]
}
const getSyncTransaction = async (
  syncTranscation: SyncTx,
  transcation: Transaction[],
  accountAddress: string,
  chainId: number,
  nonce: number,
  contract: Contract,
  sessionKey: SessionKey,
  multiChainContranctData: MultiChainContranctData,
): Promise<Promise<Transaction[]>> => {
  const transactionList = []
  const { isNeedDeploy, transactions } = syncTranscation
  for (const item of transactions) {
    const tx: Transaction = {
      callType: CallType.Call,
      revertOnError: item.revertOnError,
      gasLimit: BigNumber.from(item.gasLimit._hex),
      target: item.target,
      value: BigNumber.from(item.value._hex),
      data: item.data,
      _isUnipassWalletTransaction: true,
    }
    transactionList.push(tx)
  }
  let deployTx: Transaction | undefined
  let syncAccountTx: Transaction | undefined
  if (isNeedDeploy) {
    deployTx = transactionList[0]
  }
  if (transactions.length === 2) {
    deployTx = transactionList[0]
    syncAccountTx = transactionList[1]
  }
  if (!isNeedDeploy && transactionList.length > 0) {
    syncAccountTx = transactionList[0]
  }

  const transferNonce = syncAccountTx ? nonce + 1 : nonce

  const moduleMain = multiChainContranctData.getModuleMainContract()
  const txExecutor = new TxExcutor(chainId, contract, transferNonce, transcation)
  await txExecutor.generateSignature(sessionKey)

  const executeTxData = moduleMain.interface.encodeFunctionData('execute', [
    transcation,
    transferNonce,
    txExecutor.signature as string,
  ])
  const executeTx: Transaction = {
    callType: CallType.Call,
    revertOnError: false,
    gasLimit: constants.Zero,
    target: accountAddress,
    value: constants.Zero,
    data: executeTxData,
    _isUnipassWalletTransaction: true,
  }

  if (syncAccountTx) {
    const moduleMain = multiChainContranctData.getModuleMainContract()
    const executeSyncAccountTxData = moduleMain.interface.encodeFunctionData('execute', [
      [syncAccountTx],
      nonce,
      '0x',
    ])
    const executeSyncAccountTxDataTx: Transaction = {
      callType: CallType.Call,
      revertOnError: false,
      gasLimit: constants.Zero,
      target: accountAddress,
      value: constants.Zero,
      data: executeSyncAccountTxData,
      _isUnipassWalletTransaction: true,
    }
    return deployTx
      ? [deployTx, executeSyncAccountTxDataTx, executeTx]
      : [executeSyncAccountTxDataTx, executeTx]
  }

  return deployTx ? [deployTx, executeTx] : [executeTx]
}

export const getSendTransactionData = async (
  sendTransferData: SendTransferData,
): Promise<ExecuteCallBody | undefined> => {
  const {
    toAddress,
    toAmount,
    contractAddress,
    tokenDecimals,
    feeAmount,
    feeReceiver,
    feeToken,
    feeDecimals,
    targetChainNode,
    syncTranscation,
  } = sendTransferData
  if (!syncTranscation) return
  // todo local test
  const testPrivate = 'a57c044eba0e138cddfb2cdd4a395cef0eb34812936a6f5aea56b201ac62cc15'
  const multiChainContranctData = new MultiChainContranctData(targetChainNode, testPrivate)

  let tx: Transaction[]
  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    tx = await getSendNativeToken20Transaction(toAddress, toAmount, feeAmount, feeReceiver)
  } else {
    tx = await getSendERC20Transaction(
      toAddress,
      toAmount,
      contractAddress,
      tokenDecimals,
      feeToken,
      feeDecimals,
      feeAmount,
      feeReceiver,
    )
  }
  console.log({ tx })
  const executeCallBody = await getExecuteCallBody(sendTransferData, tx, multiChainContranctData)
  console.log(executeCallBody)
  return executeCallBody
}
