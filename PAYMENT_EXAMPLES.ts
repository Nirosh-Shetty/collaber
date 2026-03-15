// Example Usage - Payment System Integration

import { earningsService } from "@/lib/api/earnings";
import { paymentsService } from "@/lib/api/payments";

/**
 * EXAMPLE 1: Complete Campaign Workflow
 * When a campaign is successfully completed and ready for payout
 */
async function handleCampaignCompletion(
  campaignId: string,
  brandId: string,
  influencerId: string,
  totalAmount: number,
  paymentMethod: "direct" | "escrow"
) {
  try {
    console.log("🚀 Processing campaign completion for:", campaignId);

    // Step 1: Create earning record for influencer
    console.log("1️⃣ Creating earning record...");
    const earning = await earningsService.createEarning({
      influencerId,
      campaignId,
      brandId,
      amount: totalAmount,
      paymentMethod,
      description: `Payment for campaign: ${campaignId}`,
      currency: "USD",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    console.log("✅ Earning created:", earning.data._id);

    // Step 2: Create payment record for brand tracking
    console.log("2️⃣ Creating payment record...");
    const payment = await paymentsService.createPayment({
      brandId,
      influencerId,
      campaignId,
      earningId: earning.data._id,
      amount: totalAmount,
      paymentMethod,
      currency: "USD",
      notes: `Campaign completion payment - ${paymentMethod} method`,
    });

    console.log("✅ Payment created:", payment.data._id);

    // Step 3: Notify both parties
    console.log(
      "3️⃣ Notifications sent to influencer and brand (implementation needed)"
    );

    return {
      earning: earning.data,
      payment: payment.data,
    };
  } catch (error) {
    console.error("❌ Error processing campaign completion:", error);
    throw error;
  }
}

/**
 * EXAMPLE 2: Brand Paying Out Influencers
 * Brand processes pending payments in bulk
 */
async function brandProcessPayments(brandId: string) {
  try {
    console.log("💳 Brand processing payments...");

    // Step 1: Get all pending payments
    console.log("1️⃣ Fetching pending payments...");
    const response = await paymentsService.getBrandPayments(brandId, {
      status: "pending",
    });

    const pendingPayments = response.data;
    const pendingIds = pendingPayments.map((p: any) => p._id);

    console.log(`Found ${pendingIds.length} pending payments`);

    if (pendingIds.length === 0) {
      console.log("No pending payments to process");
      return;
    }

    // Step 2: Move to processing state
    console.log("2️⃣ Moving payments to processing...");
    const processResult = await paymentsService.processPendingPayments(
      brandId,
      { paymentIds: pendingIds }
    );

    console.log(`✅ ${processResult.data.modifiedCount} payments now processing`);

    // Step 3: Simulate payment processing (in real scenario, call payment gateway)
    console.log("3️⃣ Processing payments through payment gateway...");

    for (const payment of pendingPayments) {
      // Simulate some payments succeeding, some failing
      const isSuccess = Math.random() > 0.1; // 90% success rate

      if (isSuccess) {
        // Mark as completed
        await paymentsService.updatePaymentStatus(payment._id, {
          status: "completed",
          notes: "Successfully processed via payment gateway",
        });

        console.log(
          `✅ Payment ${payment._id} completed - Influencer ${payment.influencerId} received $${payment.amount}`
        );
      } else {
        // Mark as failed
        await paymentsService.updatePaymentStatus(payment._id, {
          status: "failed",
          failureReason: "Insufficient funds in payment method",
        });

        console.log(
          `❌ Payment ${payment._id} failed for influencer ${payment.influencerId}`
        );
      }
    }

    console.log("🎉 Payment processing completed");
  } catch (error) {
    console.error("❌ Error processing payments:", error);
    throw error;
  }
}

/**
 * EXAMPLE 3: Influencer Dashboard
 * Show influencer their earnings overview
 */
async function getInfluencerDashboard(influencerId: string) {
  try {
    console.log("📊 Loading influencer dashboard...");

    // Get earnings summary
    const summary = await earningsService.getInfluencerEarningsSummary(
      influencerId
    );

    console.log("=== EARNINGS SUMMARY ===");
    console.log(`Total Earned: $${summary.data.totalEarned}`);
    console.log(`Pending: $${summary.data.pending}`);
    console.log(`Ready for Payment: $${summary.data.readyForPayment}`);
    console.log(`Paid: $${summary.data.paid}`);

    console.log("\nBy Payment Method:");
    console.log(
      `- Direct: $${summary.data.byPaymentMethod.direct} (instant)`
    );
    console.log(
      `- Escrow: $${summary.data.byPaymentMethod.escrow} (via Vooki)`
    );

    // Get recent earnings
    const earnings = await earningsService.getInfluencerEarnings(influencerId, {
      limit: 5,
    });

    console.log("\n=== RECENT EARNINGS ===");
    earnings.data.forEach((earning: any) => {
      console.log(
        `Campaign: ${earning.campaignId} | $${earning.amount} | Status: ${earning.status} | Method: ${earning.paymentMethod}`
      );
    });

    return {
      summary: summary.data,
      recentEarnings: earnings.data,
    };
  } catch (error) {
    console.error("❌ Error loading dashboard:", error);
    throw error;
  }
}

/**
 * EXAMPLE 4: Brand Financial Overview
 * Show brand their payment spending and breakdown
 */
async function getBrandFinancialOverview(brandId: string) {
  try {
    console.log("💰 Loading brand financial overview...");

    // Get payments summary
    const summary = await paymentsService.getBrandPaymentsSummary(brandId);

    console.log("=== PAYMENT SUMMARY ===");
    console.log(`Total Spent: $${summary.data.totalSpent}`);
    console.log(`Pending: $${summary.data.pending}`);
    console.log(`Processing: $${summary.data.processing}`);
    console.log(`Completed: $${summary.data.completed}`);
    console.log(`Failed: $${summary.data.failed}`);

    // Get payment method breakdown
    const breakdown = await paymentsService.getPaymentMethodBreakdown(brandId);

    console.log("\n=== PAYMENT METHOD BREAKDOWN ===");
    console.log(
      `Direct Payments: $${breakdown.data.direct.total} (${breakdown.data.direct.count} payments)`
    );
    console.log(
      `  - Completed: $${breakdown.data.direct.completed}`
    );
    console.log(
      `  - Pending: $${breakdown.data.direct.pending}`
    );

    console.log(
      `Escrow Payments: $${breakdown.data.escrow.total} (${breakdown.data.escrow.count} payments)`
    );
    console.log(
      `  - Held: $${breakdown.data.escrow.pending + breakdown.data.escrow.processing}`
    );

    // Get recent payments
    const payments = await paymentsService.getBrandPayments(brandId, {
      limit: 5,
    });

    console.log("\n=== RECENT PAYMENTS ===");
    payments.data.forEach((payment: any) => {
      console.log(
        `Influencer: ${payment.influencerId} | $${payment.amount} | Status: ${payment.status} | Method: ${payment.paymentMethod}`
      );
    });

    return {
      summary: summary.data,
      breakdown: breakdown.data,
      recentPayments: payments.data,
    };
  } catch (error) {
    console.error("❌ Error loading financial overview:", error);
    throw error;
  }
}

/**
 * EXAMPLE 5: Retry Failed Payment
 * If a payment fails, allow manual retry
 */
async function retryFailedPayment(paymentId: string) {
  try {
    console.log(`🔄 Retrying payment: ${paymentId}`);

    // First, get the payment details
    const payment = await paymentsService.getPaymentById(paymentId);

    if (payment.data.status !== "failed") {
      console.log(
        `⚠️ Payment is not in failed state. Current status: ${payment.data.status}`
      );
      return;
    }

    console.log(
      `Payment failed due to: ${payment.data.failureReason}`
    );

    // Move back to pending
    await paymentsService.updatePaymentStatus(paymentId, {
      status: "pending",
      notes: "Retry initiated after previous failure",
    });

    console.log(
      `✅ Payment moved back to pending for retry`
    );

    // In real scenario, would queue for reprocessing
    console.log("Payment queued for reprocessing...");
  } catch (error) {
    console.error("❌ Error retrying payment:", error);
    throw error;
  }
}

/**
 * EXAMPLE 6: Get Campaign Earnings Report
 * See all influencers paid for a specific campaign
 */
async function getCampaignEarningsReport(campaignId: string) {
  try {
    console.log(`📋 Generating earnings report for campaign: ${campaignId}`);

    const earnings = await earningsService.getEarningsByCampaign(campaignId);

    console.log("=== CAMPAIGN EARNINGS REPORT ===");

    let totalAmount = 0;
    let paidAmount = 0;
    let pendingAmount = 0;

    const byPaymentMethod: Record<string, number> = {
      direct: 0,
      escrow: 0,
    };

    earnings.data.forEach((earning: any) => {
      totalAmount += earning.amount;

      if (earning.status === "paid") {
        paidAmount += earning.amount;
      } else if (earning.status === "pending") {
        pendingAmount += earning.amount;
      }

      byPaymentMethod[earning.paymentMethod] += earning.amount;

      console.log(
        `- Influencer ${earning.influencerId}: $${earning.amount} (${earning.status}) via ${earning.paymentMethod}`
      );
    });

    console.log("\n=== SUMMARY ===");
    console.log(`Total Amount: $${totalAmount}`);
    console.log(`Paid: $${paidAmount}`);
    console.log(`Pending: $${pendingAmount}`);
    console.log(`Direct: $${byPaymentMethod.direct}`);
    console.log(`Escrow: $${byPaymentMethod.escrow}`);

    return earnings.data;
  } catch (error) {
    console.error("❌ Error generating report:", error);
    throw error;
  }
}

/**
 * EXAMPLE 7: Using in React Component
 * Typical usage in a React component
 */
import { useEffect, useState } from "react";

export function EarningsTrackerComponent({
  influencerId,
}: {
  influencerId: string;
}) {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const data =
          await earningsService.getInfluencerEarningsSummary(influencerId);
        setEarnings(data.data);
      } catch (err) {
        setError("Failed to load earnings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [influencerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Earnings</h2>
      <div>Total Earned: ${earnings?.totalEarned}</div>
      <div>Pending: ${earnings?.pending}</div>
      <div>Paid: ${earnings?.paid}</div>
    </div>
  );
}

// Export examples for testing
export {
  handleCampaignCompletion,
  brandProcessPayments,
  getInfluencerDashboard,
  getBrandFinancialOverview,
  retryFailedPayment,
  getCampaignEarningsReport,
};
