import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { StatsDashboard } from '@/pages/StatsDashboard'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin/stats" element={<StatsDashboard />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
