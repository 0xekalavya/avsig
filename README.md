# ⚡ AVSIG

> **JWT Inspector & Security Auditor** - decode, analyze, and exploit-test JSON Web Tokens directly in your browser.
> **Zero server contact. Pure client-side. Built for hackers.**

```
         o     o              o     o__ __o     __o__       o__ __o     
        <|>   <|>            <|>   /v     v\      |        /v     v\    
        / \   < >            < >  />       <\    / \      />       <\   
      o/   \o  \o            o/  _\o____         \o/    o/              
     <|__ __|>  v\          /v        \_\__o__    |    <|       _\__o__ 
     /       \   <\        />               \    < >    \\          |   
   o/         \o   \o    o/       \         /     |       \         /   
  /v           v\   v\  /v         o       o      o        o       o    
 />             <\   <\/>          <\__ __/>    __|>_      <\__ __/>    
                                                                        
                                                                        
                                                                        
```

Named after the infamous **`alg:none` (null signature)** attack - where verification simply… doesn’t exist.

---

## 🌐 LIVE DEMO

👉 **https://avsig.vercel.app**

Paste a JWT -> get:

* decoded structure
* claim analysis
* real-time expiry
* security audit

---

## 🚀 FEATURES

### 🔍 Token Intelligence

* Decode **Header / Payload / Signature**
* Clean, color-coded structure view
* Handles malformed & edge-case tokens

### 🧠 Claims Inspector

* Type-aware rendering (`string`, `number`, `array`, etc.)
* Human-readable timestamps (`exp`, `iat`, `nbf`)
* Highlights abnormal values automatically

### ⏱️ Live Expiry Engine

* Real-time countdown timer
* Flags:

  * expired tokens
  * near-expiry (<5 min)
  * long-lived tokens

### 🛡️ Security Audit Engine

* Automated vulnerability detection
* Severity-based classification:

  * 🔴 Critical
  * 🟡 Warning
  * 🔵 Info

### 🔐 Privacy First

* 100% client-side
* No API calls
* Tokens never leave your browser

---

## 🧪 SECURITY CHECKS

| ID                 | Severity    | Description                                |
| ------------------ | ----------- | ------------------------------------------ |
| `alg-none`         | 🔴 Critical | Detects signature bypass via `alg:none`    |
| `jku-present`      | 🔴 Critical | External key fetch (JWKS injection risk)   |
| `exp-missing`      | 🟡 Warning  | No expiration -> infinite session           |
| `exp-far`          | 🟡 Warning  | Long-lived token -> higher impact if stolen |
| `sensitive-claims` | 🟡 Warning  | Exposed secrets in payload                 |
| `nbf-future`       | 🟡 Warning  | Token not yet valid                        |
| `kid-present`      | 🔵 Info     | Potential key ID injection vector          |
| `weak-secret-hint` | 🔵 Info     | Symmetric algo used (HS256/384/512)        |

---

## ⚔️ BUILT FOR REAL-WORLD ATTACKS

NullSig doesn’t just decode - it **thinks like an attacker**.

Detects patterns behind:

* `alg:none` bypass
* JKU/X5U injection
* Algorithm confusion (RS256 → HS256)
* Weak secret risks
* Privilege escalation scenarios

---

## 🧱 TECH STACK

| Layer      | Tech         |
| ---------- | ------------ |
| Framework  | Next.js 15   |
| Language   | TypeScript   |
| Styling    | Tailwind CSS |
| JWT Engine | jose         |
| UI         | shadcn/ui    |
| Deployment | Vercel       |

---

## ⚙️ GETTING STARTED

```bash
# Clone repo
git clone https://github.com/0xekalavya/avsig.git
cd avsig

# Install deps
npm install

# Run locally
npm run dev
```

Open → http://localhost:3000

---

## 🏗️ PROJECT STRUCTURE

```
nullsig/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TokenInput.tsx
│   ├── StructureView.tsx
│   ├── ClaimsTree.tsx
│   ├── ExpiryBadge.tsx
│   └── SecurityPanel.tsx
└── lib/
    └── jwt.ts
```

---

## ⚙️ HOW IT WORKS

```
JWT Input
   │
   ▼
inspectJWT()
   │
   ├── decodeProtectedHeader()
   ├── decodeJwt()
   ├── analyzeClaims()
   ├── checkExpiry()
   └── runSecurityChecks()
   │
   ▼
UI Components Render Results
```

---

## 🧠 ROADMAP

* [ ] Signature verification (secret / public key input)
* [ ] Attack simulation panel 🔥
* [ ] JWKS fetch & validation
* [ ] Token diff viewer
* [ ] Export audit report (PDF)
* [ ] Chrome extension
* [ ] Burp Suite integration 👀

---

## 🤝 CONTRIBUTING

```bash
git checkout -b feat/your-feature
git commit -m "feat: add something cool"
git push origin feat/your-feature
```

Open a PR — let’s build this into a **go-to JWT hacking tool**.

---

## 📜 LICENSE

MIT - use it, break it, improve it.

---

## 👨‍💻 AUTHOR

Built by **[@ekalavya](https://instagram.com/ekalavya.dev)**

> *“JWTs are not secure by default. They’re just encoded trust.”*

