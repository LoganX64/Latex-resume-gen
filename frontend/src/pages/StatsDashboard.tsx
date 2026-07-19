import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '@/utils/stats'
import { Eye, Download, ArrowLeft, BarChart3, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ADMIN_KEY_STORAGE = 'resume-admin-key'

export default function StatsDashboard() {
  const [adminKey, setAdminKey] = useState(() =>
    sessionStorage.getItem(ADMIN_KEY_STORAGE) || ''
  )
  const [inputKey, setInputKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem(ADMIN_KEY_STORAGE))
  const [stats, setStats] = useState<{ visits: number; downloads: number } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (adminKey) {
      fetchStats(adminKey)
    }
  }, [])

  async function fetchStats(key: string) {
    setLoading(true)
    setError('')
    const data = await getDashboardStats(key)
    if (data) {
      setStats(data)
      setIsAuthenticated(true)
      sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
      setAdminKey(key)
    } else {
      setError('Invalid key. Please try again.')
      setIsAuthenticated(false)
      sessionStorage.removeItem(ADMIN_KEY_STORAGE)
    }
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (inputKey.trim()) {
      fetchStats(inputKey.trim())
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">Admin Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the admin key to view stats
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Resume Builder
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Stats Dashboard</h1>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Builder
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Visits
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.visits.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Downloads
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.downloads.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}
