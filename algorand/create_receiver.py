from algosdk import account, mnemonic

private_key, address = account.generate_account()
print(f"Receiver Address: {address}")
print(f"Receiver Mnemonic: {mnemonic.from_private_key(private_key)}")