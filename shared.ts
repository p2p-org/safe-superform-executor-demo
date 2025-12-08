import { config as loadEnv } from 'dotenv'
import { base } from 'viem/chains'
import { encodeAbiParameters, keccak256, parseAbiParameters } from 'viem'
import type { Address, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { constants } from '@p2p-org/safe-superform-executor'

loadEnv()

export const SAFE_ADDRESS = '0xdB259Cf5a3aDd385dabE608C31faBcC6030df619' as Address
export const ROLES_ADDRESS = '0x7E546b9f3d2D4dBDb5cef6d6dB06AB149bF8c3C7' as Address
export const P2P_SUPERFORM_PROXY_ADDRESS = '0x8D1a5E9FE73529c4444Aa07ABD6D76C98d32394b' as Address

export const CLIENT_BPS_OF_DEPOSIT = 10_000
export const CLIENT_BPS_OF_PROFIT = 9_700

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

const getP2pSignerPrivateKey = (): `0x${string}` => {
  const value = process.env.P2P_SIGNER_PRIVATE_KEY
  if (!value || !value.startsWith('0x')) {
    throw new Error('P2P_SIGNER_PRIVATE_KEY must be set in environment')
  }
  return value as `0x${string}`
}

export const buildP2pSignerSignature = async (deadline?: bigint): Promise<Hex> => {
  const signer = privateKeyToAccount(getP2pSignerPrivateKey())
  const p2pSignerSigDeadline =
    deadline ?? BigInt(Math.floor(Date.now() / 1000) + ONE_WEEK_SECONDS)

  const messageHash = keccak256(
    encodeAbiParameters(parseAbiParameters('address,uint48,uint48,uint256,address,uint256'), [
      SAFE_ADDRESS,
      CLIENT_BPS_OF_DEPOSIT,
      CLIENT_BPS_OF_PROFIT,
      p2pSignerSigDeadline,
      constants.P2P_SUPERFORM_PROXY_FACTORY_ADDRESS,
      BigInt(base.id)
    ])
  )

  const signature = (await signer.signMessage({ message: { raw: messageHash } })) as Hex
  return signature
}

export const getP2pSignerDeadline = () =>
  BigInt(Math.floor(Date.now() / 1000) + ONE_WEEK_SECONDS)

export const CHAIN = base
