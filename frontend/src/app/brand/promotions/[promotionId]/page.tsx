"use client"

import { useParams } from "next/navigation"
import { PromotionWorkspace } from "@/components/promotion/promotion-workspace"

export default function BrandPromotionDetailPage() {
  const params = useParams<{ promotionId: string }>()

  return (
    <PromotionWorkspace
      promotionId={params?.promotionId || ""}
      role="brand"
      backHref="/brand/campaigns"
      backLabel="Back to campaigns"
    />
  )
}
