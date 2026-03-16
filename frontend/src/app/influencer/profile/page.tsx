import { Suspense } from "react"
import { ProfileContent } from "./profile-content"

export default function InfluencerProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}

function ProfilePageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-900/70 p-6 animate-pulse h-96" />
      <div className="rounded-lg border border-slate-200 bg-white/90 p-6 animate-pulse h-64" />
    </div>
  )
}
