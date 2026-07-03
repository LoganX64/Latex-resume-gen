import { MainLayout } from '@/layouts/MainLayout'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <>
      <MainLayout />
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
