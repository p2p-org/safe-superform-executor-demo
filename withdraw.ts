import { createExecutorFromEnv } from '@p2p-org/safe-superform-executor'

import { CHAIN, P2P_SUPERFORM_PROXY_ADDRESS, ROLES_ADDRESS, SAFE_ADDRESS } from './shared'

const SUPERFORM_ID = '53060340969225815226237768346742701413530550720430230111181046'
const VAULT_ID = '2GoghTk010_A08iZkKpgg'
const SUPERPOSITIONS_AMOUNT_IN = process.env.WITHDRAW_SUPERPOSITIONS_AMOUNT_IN ?? '4477'
const TO_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

const main = async () => {
  const executor = createExecutorFromEnv({ chain: CHAIN })

  console.info('Starting withdraw via Superform API...')
  const txHash = await executor.withdraw({
    safeAddress: SAFE_ADDRESS,
    rolesAddress: ROLES_ADDRESS,
    p2pSuperformProxyAddress: P2P_SUPERFORM_PROXY_ADDRESS,
    superformId: SUPERFORM_ID,
    vaultId: VAULT_ID,
    superpositionsAmountIn: SUPERPOSITIONS_AMOUNT_IN,
    toTokenAddress: TO_TOKEN_ADDRESS,
    bridgeSlippage: 5000,
    swapSlippage: 5000,
    positiveSlippage: 5000,
    isErc20: false,
    routeType: 'output',
    filterSwapRoutes: false,
    isPartOfMultiVault: false,
    needInsurance: true
  })

  console.info('Withdraw tx hash:', txHash)
}

main().catch((error) => {
  console.error('Withdraw failed:', error)
  process.exit(1)
})
