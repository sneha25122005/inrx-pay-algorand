from algosdk.v2client import algod
from algosdk import transaction, mnemonic

print("Starting opt-in process...")

# Receiver details
receiver_mnemonic = "divorce have color similar over garbage flee school mass foil parrot vapor identify device brain return mention amateur woman tone across cheap bicycle absorb clock"
receiver_address = "PUPZGFE2IPH2ZS2S65YHGNU6YIRPGJXOUDFPSTNI74PWNZOFMYBIX6TLCQ"

ASSET_ID = 757319983

# Connect
algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""

print("Connecting to TestNet...")
client = algod.AlgodClient(algod_token, algod_address)

print("Getting private key...")
private_key = mnemonic.to_private_key(receiver_mnemonic)

print("Getting transaction params...")
params = client.suggested_params()

print("Building opt-in transaction...")
txn = transaction.AssetTransferTxn(
    sender=receiver_address,
    sp=params,
    receiver=receiver_address,
    amt=0,
    index=ASSET_ID,
)

print("Signing transaction...")
signed_txn = txn.sign(private_key)

print("Submitting to TestNet...")
txid = client.send_transaction(signed_txn)

print("Waiting for confirmation...")
transaction.wait_for_confirmation(client, txid, 4)

print(f"✅ Receiver opted in to INRX successfully!")
print(f"Transaction ID: {txid}")