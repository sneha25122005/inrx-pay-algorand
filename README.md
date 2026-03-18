# 🪙 INRX Pay — Stablecoin Payment System on Algorand

> A digital rupee payment system built on Algorand blockchain for AlgoBharat HackSeries

![Algorand](https://img.shields.io/badge/Blockchain-Algorand-00ffc8)
![Network](https://img.shields.io/badge/Network-TestNet-0088ff)
![React](https://img.shields.io/badge/Frontend-React-61dafb)
![Python](https://img.shields.io/badge/Backend-Python-3776ab)

---

## 🌍 The Problem

India has 1.4 billion people but 40% are unbanked. Even banked users face:
- High fees (2-5% per transaction)
- Slow settlements (hours to days)
- Multiple middlemen
- No access for rural population

## 💡 Our Solution — INRX

INRX (IndiaStableCoin) is a digital rupee built on Algorand that enables:
- ⚡ Instant payments in 4 seconds
- 💸 Near-zero fees (less than 1 paisa)
- 📱 No bank account needed — just a smartphone
- 🔍 Fully transparent and auditable

---

## 🚀 Live Demo

- **Stablecoin Asset ID:** `757319983`
- **Network:** Algorand TestNet
- **Explorer:** [View INRX on LORA](https://lora.algokit.io/testnet/asset/757319983)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Algorand TestNet |
| Token Standard | ASA (Algorand Standard Asset) |
| Backend | Python + py-algorand-sdk |
| Frontend | React + Vite |
| Animations | Framer Motion |
| Wallet | Pera Wallet (WalletConnect) |
| QR Payments | qrcode.react |
| API | algonode.cloud (free, no token) |

---

## 📁 Project Structure
```
inrx-pay-algorand/
├── algorand/                 ← Python backend scripts
│   ├── wallet.py             ← Generate wallet
│   ├── test_connection.py    ← Test TestNet connection
│   ├── create_stablecoin.py  ← Create INRX token
│   ├── create_receiver.py    ← Create receiver wallet
│   ├── optin.py              ← Opt-in to INRX
│   ├── send_payment.py       ← Send INRX payment
│   └── check_balance.py      ← Check balances
│
└── inrx-payment/             ← React frontend
    ├── src/
    │   ├── App.jsx            ← Main app component
    │   └── index.css          ← Global styles
    ├── index.html
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js v22+
- Git

### Backend Setup
```bash
cd algorand
pip install py-algorand-sdk
python test_connection.py
```

### Frontend Setup
```bash
cd inrx-payment
npm install
npm run dev
```

Open **http://localhost:5173** 🚀

---

## 🔄 How It Works
```
1. User connects Pera Wallet
2. Enters recipient address or scans QR code
3. Enters INRX amount
4. Pera Wallet signs transaction
5. Transaction submitted to Algorand TestNet
6. Confirmed in 4 seconds
7. Balance updates live
```

---

## 🪙 INRX Token Details

| Property | Value |
|----------|-------|
| Name | IndiaStableCoin |
| Ticker | INRX |
| Asset ID | 757319983 |
| Total Supply | 1,000,000,000 |
| Decimals | 6 |
| Network | Algorand TestNet |

---

## 🌟 Real Life Use Cases

1. **Cross Border Remittance** — Send money home from abroad for < 1 paisa
2. **Small Business Payments** — Zero % merchant fees vs 2% UPI
3. **Farmer Direct Payments** — Instant settlement, no middlemen
4. **Insurance Claims** — Smart contract auto-settlement
5. **Government Scholarships** — Direct to student wallet, zero corruption

---

## 🔐 Security

- Private keys never leave the user's device
- All transactions signed via Pera Wallet
- Smart contract logic is fully transparent
- No centralized server stores user data

---

## 👩‍💻 Built By

**Sneha Kumari**
B.Tech CSE — Bharati Vidyapeeth (DU) College of Engineering, Pune
AlgoBharat HackSeries 2026

---

## 📄 License

MIT License — feel free to use and build on this!