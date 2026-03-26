"use client"

import { useParams } from "next/navigation"
import { PromotionWorkspace } from "@/components/promotion/promotion-workspace"

export default function InfluencerPromotionDetailPage() {
  const params = useParams<{ promotionId: string }>()

  return (
    <PromotionWorkspace
      promotionId={params?.promotionId || ""}
      role="influencer"
      backHref="/influencer/my-collabs"
      backLabel="Back to collaborations"
    />
  )
}
