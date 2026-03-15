#!/bin/bash
# API Testing Guide - cURL Examples

# Base URL
BASE_URL="http://localhost:8000/api"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Payment System - API Testing${NC}"
echo -e "${BLUE}================================${NC}"

# ==========================================
# EARNINGS ENDPOINTS
# ==========================================
echo -e "\n${YELLOW}📊 EARNINGS ENDPOINTS${NC}\n"

# 1. Create Earning
echo -e "${GREEN}1. Create Earning${NC}"
echo "curl -X POST http://localhost:8000/api/earnings/ \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"influencerId\": \"user_001\",
    \"campaignId\": \"campaign_001\",
    \"brandId\": \"brand_001\",
    \"amount\": 1500,
    \"paymentMethod\": \"direct\",
    \"description\": \"Campaign completion\",
    \"currency\": \"USD\"
  }'"
echo ""

# 2. Get Influencer Earnings
echo -e "${GREEN}2. Get Influencer Earnings${NC}"
echo "curl http://localhost:8000/api/earnings/influencer/user_001 \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 3. Get Earnings Summary
echo -e "${GREEN}3. Get Earnings Summary${NC}"
echo "curl http://localhost:8000/api/earnings/influencer/user_001/summary \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 4. Get Single Earning
echo -e "${GREEN}4. Get Single Earning${NC}"
echo "curl http://localhost:8000/api/earnings/EARNING_ID \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 5. Update Earning Status
echo -e "${GREEN}5. Update Earning Status${NC}"
echo "curl -X PATCH http://localhost:8000/api/earnings/EARNING_ID/status \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"status\": \"paid\",
    \"transactionId\": \"txn_12345\"
  }'"
echo ""

# 6. Get Campaign Earnings
echo -e "${GREEN}6. Get Campaign Earnings${NC}"
echo "curl http://localhost:8000/api/earnings/campaign/campaign_001 \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# ==========================================
# PAYMENTS ENDPOINTS
# ==========================================
echo -e "\n${YELLOW}💳 PAYMENTS ENDPOINTS${NC}\n"

# 1. Create Payment
echo -e "${GREEN}1. Create Payment${NC}"
echo "curl -X POST http://localhost:8000/api/payments/ \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"brandId\": \"brand_001\",
    \"influencerId\": \"user_001\",
    \"campaignId\": \"campaign_001\",
    \"earningId\": \"EARNING_ID\",
    \"amount\": 1500,
    \"paymentMethod\": \"direct\",
    \"currency\": \"USD\",
    \"notes\": \"Campaign payment\"
  }'"
echo ""

# 2. Get Brand Payments
echo -e "${GREEN}2. Get Brand Payments${NC}"
echo "curl 'http://localhost:8000/api/payments/brand/brand_001' \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 3. Get Payments with Filters
echo -e "${GREEN}3. Get Payments (Filtered by Status)${NC}"
echo "curl 'http://localhost:8000/api/payments/brand/brand_001?status=pending&limit=10' \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 4. Get Payments Summary
echo -e "${GREEN}4. Get Payments Summary${NC}"
echo "curl http://localhost:8000/api/payments/brand/brand_001/summary \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 5. Get Payment Method Breakdown
echo -e "${GREEN}5. Get Payment Method Breakdown${NC}"
echo "curl http://localhost:8000/api/payments/brand/brand_001/breakdown \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 6. Get Single Payment
echo -e "${GREEN}6. Get Single Payment${NC}"
echo "curl http://localhost:8000/api/payments/PAYMENT_ID \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# 7. Update Payment Status
echo -e "${GREEN}7. Update Payment Status${NC}"
echo "curl -X PATCH http://localhost:8000/api/payments/PAYMENT_ID/status \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"status\": \"completed\",
    \"notes\": \"Processed successfully\"
  }'"
echo ""

# 8. Process Pending Payments (Batch)
echo -e "${GREEN}8. Process Pending Payments (Batch)${NC}"
echo "curl -X POST http://localhost:8000/api/payments/brand/brand_001/process \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"paymentIds\": [\"PAYMENT_ID_1\", \"PAYMENT_ID_2\", \"PAYMENT_ID_3\"]
  }'"
echo ""

# 9. Get Campaign Payments
echo -e "${GREEN}9. Get Campaign Payments${NC}"
echo "curl http://localhost:8000/api/payments/campaign/campaign_001 \\"
echo "  -H 'Content-Type: application/json'"
echo ""

# ==========================================
# STATUS CODES & RESPONSES
# ==========================================
echo -e "\n${YELLOW}📋 STATUS CODES${NC}\n"
echo "200 - Success: Request completed successfully"
echo "201 - Created: New resource created"
echo "400 - Bad Request: Missing or invalid parameters"
echo "404 - Not Found: Resource not found"
echo "500 - Server Error: Internal server error"

# ==========================================
# TEST DATA EXAMPLES
# ==========================================
echo -e "\n${YELLOW}📝 TEST DATA${NC}\n"
echo "User IDs:"
echo "  - influencer_001"
echo "  - influencer_002"
echo ""
echo "Brand IDs:"
echo "  - brand_001"
echo "  - brand_002"
echo ""
echo "Campaign IDs:"
echo "  - campaign_001"
echo "  - campaign_002"
echo ""
echo "Payment Methods:"
echo "  - direct (immediate)"
echo "  - escrow (held by Vooki)"
echo ""
echo "Statuses:"
echo "  Earnings: pending, ready_for_payment, paid, failed"
echo "  Payments: pending, processing, completed, failed"

# ==========================================
# WORKFLOW EXAMPLE
# ==========================================
echo -e "\n${YELLOW}🔄 COMPLETE WORKFLOW EXAMPLE${NC}\n"
echo "1. Create Earning (when campaign completes)"
echo "   Status: pending"
echo ""
echo "2. Create Payment (linked to earning)"
echo "   Status: pending"
echo ""
echo "3. Process Pending Payments (batch move to processing)"
echo "   Payments status: pending → processing"
echo ""
echo "4. Update Payment Status (mark as completed)"
echo "   Payments status: processing → completed"
echo "   Auto-updates: Earnings status → paid"
echo ""
echo "5. Verify Earning Status Updated"
echo "   Check: Earnings status = paid"

# ==========================================
# SCRIPTED TEST
# ==========================================
echo -e "\n${YELLOW}🧪 AUTOMATED TEST SCRIPT${NC}\n"
echo "Uncomment the section below and run: bash PAYMENT_TESTING.sh"
echo ""
echo ": '
# This is a bash script section (commented out)

# Set variables
INFLUENCER_ID=\"user_001\"
CAMPAIGN_ID=\"campaign_001\"
BRAND_ID=\"brand_001\"

# 1. Create Earning
echo \"Creating earning...\"
EARNING=$(curl -s -X POST http://localhost:8000/api/earnings/ \
  -H \"Content-Type: application/json\" \
  -d \"{
    \\\"influencerId\\\": \\\"$INFLUENCER_ID\\\",
    \\\"campaignId\\\": \\\"$CAMPAIGN_ID\\\",
    \\\"brandId\\\": \\\"$BRAND_ID\\\",
    \\\"amount\\\": 1500,
    \\\"paymentMethod\\\": \\\"direct\\\"
  }\")

EARNING_ID=$(echo $EARNING | grep -o '\"_id\":\"[^\"]*' | cut -d'\"' -f4)
echo \"Earning created with ID: $EARNING_ID\"

# 2. Create Payment
echo \"Creating payment...\"
PAYMENT=$(curl -s -X POST http://localhost:8000/api/payments/ \
  -H \"Content-Type: application/json\" \
  -d \"{
    \\\"brandId\\\": \\\"$BRAND_ID\\\",
    \\\"influencerId\\\": \\\"$INFLUENCER_ID\\\",
    \\\"campaignId\\\": \\\"$CAMPAIGN_ID\\\",
    \\\"earningId\\\": \\\"$EARNING_ID\\\",
    \\\"amount\\\": 1500,
    \\\"paymentMethod\\\": \\\"direct\\\"
  }\")

PAYMENT_ID=$(echo $PAYMENT | grep -o '\"_id\":\"[^\"]*' | cut -d'\"' -f4)
echo \"Payment created with ID: $PAYMENT_ID\"

# 3. Get Earnings Summary
echo \"Getting earnings summary...\"
curl -s http://localhost:8000/api/earnings/influencer/$INFLUENCER_ID/summary | jq .

# 4. Update Payment Status
echo \"Updating payment status...\"
curl -s -X PATCH http://localhost:8000/api/payments/$PAYMENT_ID/status \
  -H \"Content-Type: application/json\" \
  -d \"{
    \\\"status\\\": \\\"completed\\\"
  }\" | jq .
'"
echo ""

echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}Testing Ready! 🚀${NC}"
echo -e "${BLUE}================================${NC}"
