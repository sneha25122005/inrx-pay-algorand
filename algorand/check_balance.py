from algosdk.v2client import algod

algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""
client = algod.AlgodClient(algod_token, algod_address)

ASSET_ID = 757319983

def check_balance(label, address):
    info = client.account_info(address)
    algo_balance = info['amount'] / 1_000_000
    
    # Find INRX balance
    inrx_balance = 0
    for asset in info.get('assets', []):
        if asset['asset-id'] == ASSET_ID:
            inrx_balance = asset['amount'] / 1_000_000
    
    print(f"\n👛 {label}")
    print(f"   ALGO:  {algo_balance} ALGO")
    print(f"   INRX:  {inrx_balance} INRX")

# Check both wallets
check_balance("Sender Wallet", "2UETV3VI73SOW3FWG6B4AQ4VPVDXBOJSDMTA2UPYQXS4QSZNRJPDK4EKMU")
check_balance("Receiver Wallet", "PUPZGFE2IPH2ZS2S65YHGNU6YIRPGJXOUDFPSTNI74PWNZOFMYBIX6TLCQ")