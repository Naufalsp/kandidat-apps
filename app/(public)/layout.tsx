// app/(public)/layout.tsx

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-slate-100 min-h-screen w-full">
      {children}
    </div>
  )
}