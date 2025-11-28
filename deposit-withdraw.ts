import { config as loadEnv } from 'dotenv'
import { base } from 'viem/chains'
import { encodeAbiParameters, keccak256, parseAbiParameters } from 'viem'
import type { Address, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { constants, createExecutorFromEnv } from '@p2p-org/safe-superform-executor'

loadEnv()

const SAFE_ADDRESS = '0x6c9f84a067D5B72834b74AFa328cd41F60C0326F' as Address
const ROLES_ADDRESS = '0x8667Bf1978740Ccbd2642D2B832582e7a5c5e0C3' as Address
const P2P_SUPERFORM_PROXY_ADDRESS = '0x08AD407BD632e14f757a3957F3ee9390D8e6aa48' as Address

const YIELD_PROTOCOL_CALLDATA = '0x42' as Hex
const SUPERFORM_CALLDATA = '0x43' as Hex

const CLIENT_BPS_OF_DEPOSIT = 0
const CLIENT_BPS_OF_PROFIT = 9700

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

const getP2pSignerPrivateKey = (): `0x${string}` => {
  const value = process.env.P2P_SIGNER_PRIVATE_KEY
  if (!value || !value.startsWith('0x')) {
    throw new Error('P2P_SIGNER_PRIVATE_KEY must be set in environment')
  }
  return value as `0x${string}`
}

const buildP2pSignerSignature = async (deadline: bigint): Promise<Hex> => {
  const signer = privateKeyToAccount(getP2pSignerPrivateKey())

  const messageHash = keccak256(
    encodeAbiParameters(parseAbiParameters('address,uint48,uint48,uint256,address,uint256'), [
      SAFE_ADDRESS,
      CLIENT_BPS_OF_DEPOSIT,
      CLIENT_BPS_OF_PROFIT,
      deadline,
      constants.P2P_SUPERFORM_PROXY_FACTORY_ADDRESS,
      BigInt(base.id)
    ])
  )

  return (await signer.signMessage({ message: { raw: messageHash } })) as Hex
}

const main = async () => {
  const executor = createExecutorFromEnv({ chain: base })

  const p2pSignerSigDeadline = BigInt(Math.floor(Date.now() / 1000) + ONE_WEEK_SECONDS)
  const p2pSignerSignature = await buildP2pSignerSignature(p2pSignerSigDeadline)

  console.info('Starting deposit...')
  const depositTx = await executor.deposit({
    safeAddress: SAFE_ADDRESS,
    rolesAddress: ROLES_ADDRESS,
    yieldProtocolCalldata: YIELD_PROTOCOL_CALLDATA,
    clientBasisPointsOfDeposit: CLIENT_BPS_OF_DEPOSIT,
    clientBasisPointsOfProfit: CLIENT_BPS_OF_PROFIT,
    p2pSignerSigDeadline,
    p2pSignerSignature
  })
  console.info('Deposit tx hash:', depositTx)

  console.info('Starting withdraw...')
  const withdrawTx = await executor.withdraw({
    safeAddress: SAFE_ADDRESS,
    rolesAddress: ROLES_ADDRESS,
    p2pSuperformProxyAddress: P2P_SUPERFORM_PROXY_ADDRESS,
    superformCalldata: SUPERFORM_CALLDATA
  })
  console.info('Withdraw tx hash:', withdrawTx)
}

main().catch((error) => {
  console.error('Demo failed:', error)
  process.exit(1)
})
