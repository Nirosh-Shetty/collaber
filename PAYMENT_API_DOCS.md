# Payment System API Documentation

## Overview
The payment system handles earnings tracking for influencers and payment management for brands. It supports two payment methods: Direct Payment (immediate) and Escrow (via Vooki).

## Base URL
```
http://localhost:8000/api
```

---

## Earnings Endpoints

### Get Influencer Earnings
**GET** `/earnings/influencer/:influencerId`

Retrieve all earnings for a specific influencer with pagination.

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `ready_for_payment`, `paid`, `failed`
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "earnings_id",
      "influencerId": "user_id",
      "campaignId": "campaign_id",
      "brandId": "brand_id",
      "amount": 1500,
      "status": "pending",
      "paymentMethod": "direct",
      "currency": "USD",
      "description": "Campaign completion payment",
      "dueDate": "2026-03-18T00:00:00.000Z",
      "paidDate": null,
      "transactionId": null,
      "createdAt": "2026-03-11T00:00:00.000Z",
      "updatedAt": "2026-03-11T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "skip": 0,
    "limit": 20
  }
}
```

---

### Get Influencer Earnings Summary
**GET** `/earnings/influencer/:influencerId/summary`

Get earnings overview including totals by status and payment method.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarned": 5000,
    "pending": 1500,
    "readyForPayment": 2000,
    "paid": 1500,
    "byPaymentMethod": {
      "direct": 4500,
      "escrow": 500
    },
    "byStatus": {
      "pending": 1500,
      "ready_for_payment": 2000,
      "paid": 1500,
      "failed": 0
    }
  }
}
```

---

### Get Single Earning
**GET** `/earnings/:earningId`

Retrieve details for a specific earning record.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "earning_id",
    "influencerId": "user_id",
    "campaignId": "campaign_id",
    "brandId": "brand_id",
    "amount": 1500,
    "status": "pending",
    "paymentMethod": "direct",
    "currency": "USD",
    "dueDate": "2026-03-18T00:00:00.000Z"
  }
}
```

---

### Create Earning Record
**POST** `/earnings/`

Create a new earning record (typically when campaign is completed).

**Request Body:**
```json
{
  "influencerId": "user_id",
  "campaignId": "campaign_id",
  "brandId": "brand_id",
  "amount": 1500,
  "paymentMethod": "direct",
  "description": "Campaign completion payment",
  "dueDate": "2026-03-18T00:00:00.000Z",
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_earning_id",
    "influencerId": "user_id",
    "campaignId": "campaign_id",
    "brandId": "brand_id",
    "amount": 1500,
    "status": "pending",
    "paymentMethod": "direct",
    "currency": "USD",
    "dueDate": "2026-03-18T00:00:00.000Z",
    "createdAt": "2026-03-11T00:00:00.000Z",
    "updatedAt": "2026-03-11T00:00:00.000Z"
  }
}
```

---

### Update Earning Status
**PATCH** `/earnings/:earningId/status`

Update the status of an earning record.

**Request Body:**
```json
{
  "status": "paid",
  "transactionId": "txn_12345",
  "failureReason": null
}
```

**Valid Status Values:**
- `pending`: Initial state
- `ready_for_payment`: Ready to be paid
- `paid`: Successfully paid
- `failed`: Payment failed

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "earning_id",
    "status": "paid",
    "paidDate": "2026-03-11T00:00:00.000Z",
    "transactionId": "txn_12345"
  }
}
```

---

### Get Earnings by Campaign
**GET** `/earnings/campaign/:campaignId`

Retrieve all earnings associated with a specific campaign.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "earning_id_1",
      "influencerId": "influencer_1_id",
      "amount": 1500,
      "status": "pending",
      "paymentMethod": "direct"
    },
    {
      "_id": "earning_id_2",
      "influencerId": "influencer_2_id",
      "amount": 2000,
      "status": "paid",
      "paymentMethod": "escrow"
    }
  ]
}
```

---

## Payments Endpoints

### Get Brand Payments
**GET** `/payments/brand/:brandId`

Retrieve all payments issued by a specific brand.

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `processing`, `completed`, `failed`
- `paymentMethod` (optional): Filter by method - `direct`, `escrow`
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "payment_id",
      "brandId": "brand_id",
      "influencerId": "influencer_id",
      "campaignId": "campaign_id",
      "earningId": "earning_id",
      "amount": 1500,
      "status": "pending",
      "paymentMethod": "direct",
      "currency": "USD",
      "issuedDate": "2026-03-11T00:00:00.000Z",
      "dueDate": "2026-03-18T00:00:00.000Z",
      "processedDate": null
    }
  ],
  "pagination": {
    "total": 15,
    "skip": 0,
    "limit": 20
  }
}
```

---

### Get Brand Payments Summary
**GET** `/payments/brand/:brandId/summary`

Get payment overview including totals by status and payment method.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSpent": 7500,
    "pending": 1500,
    "processing": 2000,
    "completed": 3500,
    "failed": 500,
    "byPaymentMethod": {
      "direct": 6500,
      "escrow": 1000
    },
    "byStatus": {
      "pending": 1500,
      "processing": 2000,
      "completed": 3500,
      "failed": 500
    }
  }
}
```

---

### Get Payment Method Breakdown
**GET** `/payments/brand/:brandId/breakdown`

Get breakdown of payments by method and status.

**Response:**
```json
{
  "success": true,
  "data": {
    "direct": {
      "total": 6500,
      "count": 5,
      "pending": 1000,
      "processing": 1500,
      "completed": 3500,
      "failed": 500
    },
    "escrow": {
      "total": 1000,
      "count": 2,
      "pending": 500,
      "processing": 500,
      "completed": 0,
      "failed": 0
    }
  }
}
```

---

### Get Single Payment
**GET** `/payments/:paymentId`

Retrieve details for a specific payment record.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "payment_id",
    "brandId": "brand_id",
    "influencerId": "influencer_id",
    "campaignId": "campaign_id",
    "earningId": "earning_id",
    "amount": 1500,
    "status": "pending",
    "paymentMethod": "direct",
    "currency": "USD",
    "issuedDate": "2026-03-11T00:00:00.000Z",
    "dueDate": "2026-03-18T00:00:00.000Z"
  }
}
```

---

### Create Payment Record
**POST** `/payments/`

Create a new payment record from an earning.

**Request Body:**
```json
{
  "brandId": "brand_id",
  "influencerId": "influencer_id",
  "campaignId": "campaign_id",
  "earningId": "earning_id",
  "amount": 1500,
  "paymentMethod": "direct",
  "dueDate": "2026-03-18T00:00:00.000Z",
  "currency": "USD",
  "notes": "Payment for campaign completion"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_payment_id",
    "brandId": "brand_id",
    "influencerId": "influencer_id",
    "campaignId": "campaign_id",
    "earningId": "earning_id",
    "amount": 1500,
    "status": "pending",
    "paymentMethod": "direct",
    "issuedDate": "2026-03-11T00:00:00.000Z",
    "dueDate": "2026-03-18T00:00:00.000Z",
    "createdAt": "2026-03-11T00:00:00.000Z"
  }
}
```

---

### Update Payment Status
**PATCH** `/payments/:paymentId/status`

Update payment status and optionally update the corresponding earning.

**Request Body:**
```json
{
  "status": "completed",
  "failureReason": null,
  "notes": "Payment processed successfully"
}
```

**Valid Status Values:**
- `pending`: Initial state
- `processing`: Payment is being processed
- `completed`: Successfully completed
- `failed`: Payment failed

**NOTE:** When payment status is updated to `completed`, the corresponding earning is automatically updated to `paid`. If set to `failed`, the earning is updated to `failed`.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "payment_id",
    "status": "completed",
    "processedDate": "2026-03-15T00:00:00.000Z",
    "notes": "Payment processed successfully"
  }
}
```

---

### Get Payments by Campaign
**GET** `/payments/campaign/:campaignId`

Retrieve all payments associated with a specific campaign.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "payment_id_1",
      "brandId": "brand_id",
      "influencerId": "influencer_1_id",
      "amount": 1500,
      "status": "pending",
      "paymentMethod": "direct"
    },
    {
      "_id": "payment_id_2",
      "brandId": "brand_id",
      "influencerId": "influencer_2_id",
      "amount": 2000,
      "status": "completed",
      "paymentMethod": "escrow"
    }
  ]
}
```

---

### Process Pending Payments (Batch)
**POST** `/payments/brand/:brandId/process`

Move multiple pending payments to processing status.

**Request Body:**
```json
{
  "paymentIds": [
    "payment_id_1",
    "payment_id_2",
    "payment_id_3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "modifiedCount": 3,
    "message": "3 payments are now processing"
  }
}
```

---

## Data Models

### Earning Status Flow
```
pending → ready_for_payment → paid
       → failed
```

### Payment Status Flow
```
pending → processing → completed
       → failed
```

### Payment Methods
- **direct**: Immediate payment transfer after content approval (instant settlement)
- **escrow**: Payment held securely via Vooki (coming soon)

---

## Frontend Usage Examples

### Using EarningsService
```typescript
import { earningsService } from "@/lib/api/earnings";

// Get influencer earnings
const earnings = await earningsService.getInfluencerEarnings(influencerId);

// Get earnings summary
const summary = await earningsService.getInfluencerEarningsSummary(influencerId);

// Create new earning
const newEarning = await earningsService.createEarning({
  influencerId: "user_123",
  campaignId: "camp_456",
  brandId: "brand_789",
  amount: 1500,
  paymentMethod: "direct",
  description: "Campaign completion"
});

// Update earning status
await earningsService.updateEarningStatus(earningId, {
  status: "paid",
  transactionId: "txn_12345"
});
```

### Using PaymentsService
```typescript
import { paymentsService } from "@/lib/api/payments";

// Get brand payments
const payments = await paymentsService.getBrandPayments(brandId);

// Get payment summary
const summary = await paymentsService.getBrandPaymentsSummary(brandId);

// Get payment breakdown
const breakdown = await paymentsService.getPaymentMethodBreakdown(brandId);

// Create payment
const newPayment = await paymentsService.createPayment({
  brandId: "brand_123",
  influencerId: "user_456",
  campaignId: "camp_789",
  earningId: "earning_000",
  amount: 1500,
  paymentMethod: "direct"
});

// Process multiple payments
await paymentsService.processPendingPayments(brandId, {
  paymentIds: ["payment_1", "payment_2", "payment_3"]
});
```

---

## Error Handling

### Common Error Responses

**Missing Required Fields (400)**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Record Not Found (404)**
```json
{
  "success": false,
  "error": "Earning not found"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "error": "Failed to fetch earnings"
}
```

---

## Integration Flow

### When Campaign is Completed:
1. Create Earning record via `/earnings/` endpoint
2. Create corresponding Payment record via `/payments/` endpoint
3. Earnings and Payments are now linked via `earningId`

### When Brand Processes Payment:
1. Call `/payments/brand/:brandId/process` to move payments to processing
2. Update payment status to `completed` via `/payments/:paymentId/status`
3. Earning is automatically updated to `paid` status
4. Optionally create settlement records for accounting

### Tracking Payment Methods:
- Use `paymentMethod` field in both Earning and Payment records
- Direct payments bypass escrow verification
- Escrow payments require additional settlement steps

---
