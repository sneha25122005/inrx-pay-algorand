from algosdk.v2client import algod
from algosdk import transaction, mnemonic, account

# Your wallet details
my_mnemonic = "mad viable flavor trigger village warrior file gaze arm cat cave shield quantum urban camp million gas observe chief phrase room arm broken about dynamic"
my_address = "2UETV3VI73SOW3FWG6B4AQ4VPVDXBOJSDMTA2UPYQXS4QSZNRJPDK4EKMU"

# Connect to TestNet
algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""
client = algod.AlgodClient(algod_token, algod_address)

# Get private key from mnemonic
private_key = mnemonic.to_private_key(my_mnemonic)

# Get suggested transaction params
params = client.suggested_params()

# Create the stablecoin ASA
txn = transaction.AssetConfigTxn(
    sender=my_address,
    sp=params,
    total=1_000_000_000,      # 1 billion units
    decimals=6,                # Like USDC (6 decimal places)
    default_frozen=False,
    unit_name="INRX",          # Your stablecoin ticker
    asset_name="IndiaStableCoin",
    manager=my_address,
    reserve=my_address,
    freeze=my_address,
    clawback=my_address,
    url="https://algobharat.in",
    strict_empty_address_check=False,
)

# Sign the transaction
signed_txn = txn.sign(private_key)

# Submit to TestNet
txid = client.send_transaction(signed_txn)
print(f"🪙 Stablecoin creation transaction sent!")
print(f"Transaction ID: {txid}")

# Wait for confirmation
confirmed = transaction.wait_for_confirmation(client, txid, 4)
asset_id = confirmed["asset-index"]
print(f"✅ Stablecoin Created Successfully!")
print(f"Asset ID: {asset_id}")
print(f"View on explorer: https://lora.algokit.io/testnet/asset/{asset_id}")