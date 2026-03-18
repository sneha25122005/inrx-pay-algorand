from algosdk.v2client import algod

algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""

client = algod.AlgodClient(algod_token, algod_address)

status = client.status()
print(f"✅ Connected to Algorand TestNet!")
print(f"Last round: {status['last-round']}")