import { createExecutorFromEnv } from '@p2p-org/safe-superform-executor'

import {
  CHAIN,
  CLIENT_BPS_OF_DEPOSIT,
  CLIENT_BPS_OF_PROFIT,
  ROLES_ADDRESS,
  SAFE_ADDRESS,
  buildP2pSignerSignature,
  getP2pSignerDeadline
} from './shared'

// Demo params for Base USDC → superform vault
const FROM_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const VAULT_ID = '2GoghTk010_A08iZkKpgg'
const AMOUNT_IN = process.env.DEPOSIT_AMOUNT ?? '0.005'

const main = async () => {
  const executor = createExecutorFromEnv({ chain: CHAIN })

  const p2pSignerSigDeadline = getP2pSignerDeadline()
  const p2pSignerSignature = await buildP2pSignerSignature(p2pSignerSigDeadline)

  console.info('Starting deposit via Superform API...')
  const txHash = await executor.deposit({
    safeAddress: SAFE_ADDRESS,
    rolesAddress: ROLES_ADDRESS,
    fromTokenAddress: FROM_TOKEN_ADDRESS,
    amountIn: AMOUNT_IN,
    vaultId: VAULT_ID,
    bridgeSlippage: 0,
    swapSlippage: 0,
    routeType: 'output',
    clientBasisPointsOfDeposit: CLIENT_BPS_OF_DEPOSIT,
    clientBasisPointsOfProfit: CLIENT_BPS_OF_PROFIT,
    p2pSignerSigDeadline,
    p2pSignerSignature
  })

  console.info('Deposit tx hash:', txHash)
}

main().catch((error) => {
  console.error('Deposit failed:', error)
  process.exit(1)
})
