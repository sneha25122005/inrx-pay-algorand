import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import algosdk from "algosdk"
import { QRCodeSVG } from "qrcode.react"

const ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const ASSET_ID = 757319983

const SENDER = {
  address: "2UETV3VI73SOW3FWG6B4AQ4VPVDXBOJSDMTA2UPYQXS4QSZNRJPDK4EKMU",
  mnemonic: "mad viable flavor trigger village warrior file gaze arm cat cave shield quantum urban camp million gas observe chief phrase room arm broken about dynamic"
}

const RECEIVER = {
  address: "SE4HAFNSTKJVGJJQQSKHUZUMOWNYRRTAE7ULXFODFFI7DFFVZB2R2R5WZI"
}

const client = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_ADDRESS, "")

async function getBalance(address) {
  try {
    const info = await client.accountInformation(address).do()
    const algo = Number(info.amount) / 1_000_000
    let inrx = 0
    for (const asset of info.assets || []) {
      if (Number(asset["asset-id"]) === ASSET_ID) {
        inrx = Number(asset.amount) / 1_000_000
      }
    }
    return { algo: algo.toFixed(3), inrx: inrx.toFixed(2) }
  } catch {
    return { algo: "0", inrx: "0" }
  }
}

export default function App() {
  const [senderBal, setSenderBal] = useState({ algo: "—", inrx: "—" })
  const [receiverBal, setReceiverBal] = useState({ algo: "—", inrx: "—" })
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [txHistory, setTxHistory] = useState([])
  const [peraConnected, setPeraConnected] = useState(false)
  const [peraAddress, setPeraAddress] = useState(null)
  const [showQR, setShowQR] = useState(false)

  const fetchBalances = async () => {
    const s = await getBalance(SENDER.address)
    const r = await getBalance(RECEIVER.address)
    setSenderBal(s)
    setReceiverBal(r)
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `https://testnet-idx.algonode.cloud/v2/accounts/${SENDER.address}/transactions?asset-id=${ASSET_ID}&limit=5`
      )
      const data = await res.json()
      const txs = data.transactions.map(tx => ({
        amount: (tx["asset-transfer-transaction"]?.amount / 1_000_000).toFixed(2),
        to: tx["asset-transfer-transaction"]?.receiver?.slice(0, 8) + "...",
        txId: tx.id.slice(0, 12) + "...",
        fullTxId: tx.id,
        time: new Date(tx["round-time"] * 1000).toLocaleString()
      }))
      setTxHistory(txs)
    } catch (e) {
      console.log("History fetch error:", e)
    }
  }

  useEffect(() => {
    fetchBalances()
    fetchHistory()
  }, [])
  const connectPera = async () => {
    try {
      const { PeraWalletConnect } = await import("@perawallet/connect")
      const pera = new PeraWalletConnect()
      const accounts = await pera.connect()
      setPeraAddress(accounts[0])
      setPeraConnected(true)
      setStatus({ type: "success", msg: "✅ Pera Wallet connected!" })
    } catch (e) {
      setStatus({ type: "error", msg: "Pera connection failed: " + e.message })
    }
  }

  const sendPayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setStatus({ type: "error", msg: "Enter a valid amount!" })
      return
    }
    setLoading(true)
    setStatus({ type: "loading", msg: "Signing transaction..." })
    try {
      const account = algosdk.mnemonicToSecretKey(SENDER.mnemonic)
      const params = await client.getTransactionParams().do()

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: SENDER.address,
        receiver: RECEIVER.address,
        amount: Math.round(Number(amount) * 1_000_000),
        assetIndex: ASSET_ID,
        suggestedParams: params,
      })

      const signedTxn = txn.signTxn(account.sk)

      setStatus({ type: "loading", msg: "Submitting to Algorand..." })
    const result = await client.sendRawTransaction(signedTxn).do()
const txId = result.txid
await algosdk.waitForConfirmation(client, txId, 4)
      setStatus({ type: "success", msg: `✅ Sent ${amount} INRX!`, txId })
      setTxHistory(prev => [{
        amount,
        to: RECEIVER.address.slice(0, 8) + "...",
        txId: txId.slice(0, 12) + "...",
        fullTxId: txId,
        time: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)])
      setAmount("")
      fetchBalances()
    } catch (e) {
      setStatus({ type: "error", msg: "Failed: " + e.message })
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: "640px", margin: "0 auto" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg,#00ffc8,#0088ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "18px", color: "#000" }}
          >₹</motion.div>
          <div>
            <div style={{ color: "#fff", fontWeight: "700", letterSpacing: "3px", fontSize: "18px" }}>INRX PAY</div>
            <div style={{ color: "#00ffc8", fontSize: "10px", letterSpacing: "3px" }}>ALGORAND TESTNET</div>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: "11px", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(0,255,200,0.3)", background: "rgba(0,255,200,0.05)", color: "#00ffc8", letterSpacing: "2px" }}
        >● LIVE</motion.div>
      </motion.div>

      {/* Pera Wallet Connect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "24px" }}
      >
        {!peraConnected ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={connectPera}
            style={{ width: "100%", padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg,#00ffc8,#0088ff)", color: "#000", fontSize: "13px", fontWeight: "700", letterSpacing: "3px", cursor: "pointer", fontFamily: "Courier New", border: "none" }}
          >
            CONNECT PERA WALLET →
          </motion.button>
        ) : (
          <div style={{ background: "rgba(0,255,200,0.06)", border: "1px solid rgba(0,255,200,0.2)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#00ffc8", fontSize: "10px", letterSpacing: "3px", marginBottom: "4px" }}>PERA CONNECTED</div>
              <div style={{ color: "#fff", fontSize: "12px" }}>{peraAddress?.slice(0, 20)}...</div>
            </div>
            <button
              onClick={() => { setPeraConnected(false); setPeraAddress(null) }}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", color: "#ff6b6b", fontSize: "11px", cursor: "pointer", fontFamily: "Courier New" }}
            >DISCONNECT</button>
          </div>
        )}
      </motion.div>

      {/* Balance Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "YOUR BALANCE", addr: SENDER.address, bal: senderBal },
          { label: "RECEIVER BALANCE", addr: RECEIVER.address, bal: receiverBal }
        ].map((w, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.02 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}
          >
            <div style={{ color: "#555", fontSize: "10px", letterSpacing: "3px", marginBottom: "10px" }}>{w.label}</div>
            <motion.div
              key={w.bal.inrx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: "#fff", fontSize: "30px", fontWeight: "700", marginBottom: "4px" }}
            >{w.bal.inrx}</motion.div>
            <div style={{ color: "#00ffc8", fontSize: "11px", marginBottom: "12px" }}>INRX</div>
            <div style={{ color: "#333", fontSize: "10px", wordBreak: "break-all" }}>{w.addr.slice(0, 18)}...</div>
          </motion.div>
        ))}
      </div>

      {/* Send Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}
      >
        <div style={{ color: "#fff", fontSize: "12px", letterSpacing: "3px", marginBottom: "20px" }}>SEND INRX</div>

       <div style={{ marginBottom: "16px" }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
    <div style={{ color: "#555", fontSize: "10px", letterSpacing: "2px" }}>TO</div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowQR(!showQR)}
      style={{ padding: "4px 12px", borderRadius: "6px", background: showQR ? "rgba(0,255,200,0.15)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,200,0.3)", color: "#00ffc8", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "Courier New" }}
    >
      {showQR ? "HIDE QR" : "SHOW QR"}
    </motion.button>
  </div>

  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "12px 16px", color: "#666", fontSize: "11px", wordBreak: "break-all" }}>
    {RECEIVER.address}
  </div>

  <AnimatePresence>
    {showQR && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        style={{ overflow: "hidden" }}
      >
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,200,0.2)", borderRadius: "12px" }}>
          
          <div style={{ color: "#00ffc8", fontSize: "10px", letterSpacing: "3px", marginBottom: "16px" }}>SCAN TO PAY</div>
          
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px" }}>
            <QRCodeSVG
              value={`algorand://${RECEIVER.address}?asset=${ASSET_ID}`}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>

          <div style={{ marginTop: "12px", color: "#555", fontSize: "10px", letterSpacing: "2px", textAlign: "center" }}>
            INRX • ASSET ID: {ASSET_ID}
          </div>

          <div style={{ marginTop: "6px", color: "#333", fontSize: "10px", textAlign: "center", wordBreak: "break-all", maxWidth: "200px" }}>
            {RECEIVER.address.slice(0, 20)}...
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "12px 16px", color: "#666", fontSize: "11px", wordBreak: "break-all" }}>
            {RECEIVER.address}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ color: "#555", fontSize: "10px", letterSpacing: "2px", marginBottom: "8px" }}>AMOUNT (INRX)</div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,200,0.3)", borderRadius: "8px", padding: "14px 16px", color: "#fff", fontSize: "24px", fontWeight: "700", fontFamily: "Courier New", boxSizing: "border-box" }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={sendPayment}
          disabled={loading}
          style={{ width: "100%", padding: "16px", borderRadius: "8px", background: loading ? "#333" : "linear-gradient(135deg,#00ffc8,#0088ff)", color: "#000", fontSize: "13px", fontWeight: "700", letterSpacing: "3px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Courier New", border: "none" }}
        >
          {loading ? "PROCESSING..." : "SEND PAYMENT →"}
        </motion.button>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", textAlign: "center", background: status.type === "success" ? "rgba(0,255,200,0.08)" : status.type === "error" ? "rgba(255,100,100,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${status.type === "success" ? "rgba(0,255,200,0.3)" : status.type === "error" ? "rgba(255,100,100,0.3)" : "rgba(255,255,255,0.1)"}`, color: status.type === "success" ? "#00ffc8" : status.type === "error" ? "#ff6b6b" : "#888" }}
            >
              {status.msg}
              {status.txId && (
                <a href={`https://lora.algokit.io/testnet/transaction/${status.txId}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: "block", marginTop: "6px", fontSize: "11px", color: "#0088ff" }}>
                  View on Explorer →
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px" }}
      >
        <div style={{ color: "#fff", fontSize: "12px", letterSpacing: "3px", marginBottom: "16px" }}>TRANSACTION HISTORY</div>
        {txHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#333", fontSize: "11px", letterSpacing: "3px" }}>NO TRANSACTIONS YET</div>
        ) : (
          <AnimatePresence>
            {txHistory.map((tx, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < txHistory.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
              >
                <div>
                  <div style={{ color: "#fff", fontSize: "13px" }}>Sent to {tx.to}</div>
                  <a href={`https://lora.algokit.io/testnet/transaction/${tx.fullTxId}`}
                    target="_blank" rel="noreferrer"
                    style={{ color: "#0088ff", fontSize: "10px", marginTop: "4px", display: "block" }}>
                    {tx.txId} • {tx.time} →
                  </a>
                </div>
                <div style={{ color: "#ff6b6b", fontWeight: "700", fontSize: "14px" }}>-{tx.amount} INRX</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

    </div>
  )
}