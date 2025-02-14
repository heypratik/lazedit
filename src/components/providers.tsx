// In Next.js, this file would be called: app/layout.tsx
import QueryProvider from './query-provider'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <QueryProvider>{children}</QueryProvider>
  )
}