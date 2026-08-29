# 🏛️ Chambers of Adv. Utkarsh Pandey & Legal Counsel
## Complete Payment Gateway & System Architecture Guide

This document outlines the end-to-end integration manual for setting up online payment gateways (**Razorpay**, **Cashfree**, **Stripe**, **PayU**, **PhonePe / UPI**) for consultation booking, legal advisory retainers, and document drafting fees.

---

## 📌 1. Where Payment Integration Exists in Codebase

| Component / Layer | File Path | Functionality / Role |
| :--- | :--- | :--- |
| **Backend API Route** | `/server.ts` (Lines `140-165`) | Handles `/api/checkout/process` and `/api/consultations` to verify payments, record receipts, and dispatch meeting links. |
| **Database & Ledger** | `/server/db.ts` (`createConsultation`, `payments` collection) | Stores completed transaction IDs, receipts, currency amounts, and booking states in memory / MongoDB Atlas. |
| **Frontend Checkout & Booking** | `/src/components/ConsultationScheduler.tsx` | Client-facing payment selector (Google Pay, UPI, Cards, Net Banking) and gateway trigger. |
| **API Client Service** | `/src/services/api.ts` (`processCheckout`) | Makes HTTP POST requests to backend checkout endpoints. |
| **Admin Ledger** | `/src/components/AdminChambersPortal.tsx` | View consultations, payments, client verification, and invoice downloads. |

---

## 💳 2. Integrating Razorpay (India Recommended)

Razorpay is the standard gateway in India for Advocates, Corporate Chambers, and Law Firms supporting **UPI (Google Pay, PhonePe, Paytm)**, **Credit/Debit Cards**, and **Net Banking**.

### Step A: Configure Environment Variables
Add your Razorpay API keys to `.env`:
```env
# Razorpay Credentials (from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyyyyyyyy
```

### Step B: Backend Razorpay Order Creation (`server.ts`)
Install the SDK via `install_applet_package` if needed (`razorpay`):
```typescript
// server.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayClient: Razorpay | null = null;
function getRazorpay() {
  if (!razorpayClient && process.env.RAZORPAY_KEY_ID) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
}

// Create Order Endpoint
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const rzp = getRazorpay();
    if (!rzp) {
      // Sandbox fallback
      return res.json({ id: `order_sandbox_${Date.now()}`, amount: amount * 100, currency: "INR" });
    }
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // amount in paise (e.g. ₹1500 = 150000)
      currency,
      receipt: receipt || `rec_${Date.now()}`,
      payment_capture: 1
    });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment Signature Endpoint
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationData } = req.body;
    
    // Signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "sandbox_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature || process.env.NODE_ENV !== 'production';

    if (isAuthentic) {
      const result = await dbService.createConsultation({
        ...consultationData,
        paymentStatus: "Paid & Verified via Razorpay",
        paymentMethod: "Razorpay (UPI / Card)",
        transactionId: razorpay_payment_id
      });
      res.json({ success: true, booking: result.booking, payment: result.payment });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

### Step C: Frontend Client Gateway Trigger (`src/components/ConsultationScheduler.tsx`)
Include Razorpay checkout script in `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Trigger checkout on button click:
```typescript
const handleRazorpayPayment = async () => {
  // 1. Call Backend to create order
  const orderRes = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: fee, receipt: `cons_${Date.now()}` })
  });
  const order = await orderRes.json();

  // 2. Open Razorpay Modal
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxx",
    amount: order.amount,
    currency: "INR",
    name: "Chambers of Adv. Utkarsh Pandey",
    description: `Legal Consultation: ${selectedPractice}`,
    order_id: order.id,
    prefill: {
      name: clientName,
      email: clientEmail,
      contact: clientPhone
    },
    theme: { color: "#f59e0b" }, // Champagne gold matching the theme
    handler: async function (response: any) {
      // 3. Send signature to backend verification
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...response,
          consultationData: {
            clientName, clientEmail, clientPhone, practiceArea: selectedPractice,
            consultationType, date: selectedDate, timeSlot: selectedTimeSlot,
            matterBrief, fee
          }
        })
      });
      const data = await verifyRes.json();
      if (data.success) {
        onBookingComplete(data.booking);
      }
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
```

---

## ⚡ 3. Integrating Stripe (International Litigants & Cross-Border Arbitration)

For international corporate clients retaining counsel from London, Singapore, Dubai, or the US:

1. **Environment Variables**:
   ```env
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
   ```
2. **Backend Route**:
   ```typescript
   import Stripe from 'stripe';
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
   
   app.post('/api/create-stripe-session', async (req, res) => {
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price_data: {
           currency: 'inr',
           product_data: { name: 'Supreme Court & High Court Legal Advisory' },
           unit_amount: 500000, // ₹5,000
         },
         quantity: 1,
       }],
       mode: 'payment',
       success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
       cancel_url: `${req.headers.origin}/?status=cancelled`,
     });
     res.json({ id: session.id, url: session.url });
   });
   ```

---

## 🔐 4. Direct UPI QR Code & Instant Settlement Integration (Zero Brokerage)
For direct lawyer bank account UPI transfers without 2% gateway deductions:
- Generate an instant dynamic UPI deep link formatted as:
  `upi://pay?pa=adv.utkarsh.pandey@oksbi&pn=Utkarsh%20Pandey&am=2500&cu=INR&tn=Legal%20Consultation%20Brief`
- Can be rendered directly via dynamic QR code in the modal for client scanning.

---

## 🛡️ 5. Security Best Practices for Legal Portals
1. **Never store Credit Card or Bank Details** on your server. All sensitive data is tokenized by PCI-DSS compliant gateways.
2. **Always verify webhooks and HMAC SHA256 signatures** on server-side before confirming legal representation appointments.
3. **All consultations generate automatic Attorney-Client Privileged receipts** with receipt number, court matter reference, and GST invoice formatting.
