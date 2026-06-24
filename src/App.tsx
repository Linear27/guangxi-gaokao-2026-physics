import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Alert, Box, CircularProgress, Container } from '@mui/material'
import { loadSummaryData } from './data/loadSiteData'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import type { SummaryData } from './types'

const SearchPage = lazy(() => import('./pages/SearchPage').then((module) => ({ default: module.SearchPage })))
const SchoolPage = lazy(() => import('./pages/SchoolPage').then((module) => ({ default: module.SchoolPage })))
const BatchPage = lazy(() => import('./pages/BatchPage').then((module) => ({ default: module.BatchPage })))

export default function App() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSummaryData()
      .then(setSummary)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'summary.json 加载失败')
      })
  }, [])

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!summary) return <LoadingScreen />

  return (
    <AppShell summary={summary}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage summary={summary} />} />
          <Route path="/search" element={<SearchPage summary={summary} />} />
          <Route path="/schools/:schoolCode" element={<SchoolPage />} />
          <Route path="/batches/:batchSlug" element={<BatchPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

export function LoadingScreen() {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', minHeight: '100dvh', justifyContent: 'center' }}>
      <CircularProgress aria-label="加载数据" />
    </Box>
  )
}
