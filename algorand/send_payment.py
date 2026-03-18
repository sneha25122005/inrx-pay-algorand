from algosdk.v2client import algod
from algosdk import transaction, mnemonic

print("Starting payment process...")

# Sender (your original wallet)
sender_mnemonic = "mad viable flavor trigger village warrior file gaze arm cat cave shield quantum urban camp million gas observe chief phrase room arm broken about dynamic"
sender_address = "2UETV3VI73SOW3FWG6B4AQ4VPVDXBOJSDMTA2UPYQXS4QSZNRJPDK4EKMU"

# Receiver wallet
receiver_address = "SE4HAFNSTKJVGJJQQSKHUZUMOWNYRRTAE7ULXFODFFI7DFFVZB2R2R5WZI"

ASSET_ID = 757319983       # Your INRX stablecoin
AMOUNT = 100 * 1_000_000   # 100 INRX (6 decimal places)

# Connect to TestNet
algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""

print("Connecting to TestNet...")
client = algod.AlgodClient(algod_token, algod_address)

print("Getting private key...")
private_key = mnemonic.to_private_key(sender_mnemonic)

print("Getting transaction params...")
params = client.suggested_params()

print("Building payment transaction...")
txn = transaction.AssetTransferTxn(
    sender=sender_address,
    sp=params,
    receiver=receiver_address,
    amt=AMOUNT,
    index=ASSET_ID,
)

print("Signing transaction...")
signed_txn = txn.sign(private_key)

print("Submitting to TestNet...")
txid = client.send_transaction(signed_txn)

print("Waiting for confirmation...")
transaction.wait_for_confirmation(client, txid, 4)

print(f"")
print(f"💸 Payment Sent Successfully!")
print(f"Sent:    100 INRX")
print(f"From:    {sender_address[:20]}...")
print(f"To:      {receiver_address[:20]}...")
print(f"Tx ID:   {txid}")
print(f"View:    https://lora.algokit.io/testnet/transaction/{txid}")