# safe-superform-executor-demo

Small, real-mainnet demo that drives `@p2p-org/safe-superform-executor` on Base:

- Builds a P2P signer signature
- Uses the Superform API (via SDK) to deposit into the Safe’s P2pSuperformProxy
- Uses the Superform API to withdraw
- Optionally batch-claims rewards if available

## Prerequisites

- Node 18+
- A funded P2P module key that is allowed in the Roles module on the Safe
- Environment variables:

```bash
RPC_URL=https://mainnet.base.org        # HTTPS RPC endpoint
PRIVATE_KEY=0x...                       # P2P module wallet (matches Roles permission)
P2P_SIGNER_PRIVATE_KEY=0x...            # Key used to sign the fee config (p2p signer)
SF_API_KEY=...                          # Superform API key
DEPOSIT_AMOUNT=0.005                    # optional override
WITHDRAW_SUPERPOSITIONS_AMOUNT_IN=4477  # optional override
```

## Install

```bash
npm install
```

## Run individual steps

```bash
npm run deposit
npm run withdraw
npm run claim   # will skip if no rewards are claimable
```

Constants for Safe/Role/Proxy/Vault are in `shared.ts`. Update them if you want to target other vaults or Safes. All Superform calldata is fetched automatically via the SDK.
