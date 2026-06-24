import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Alert, Box, Stack, Tab, Tabs, Typography } from '@mui/material'
import { ProgramGrid } from '../components/ProgramGrid'
import { SchoolSummary } from '../components/SchoolSummary'
import { LoadingScreen } from '../App'
import { loadSchoolPayload } from '../data/loadSiteData'
import type { SchoolPayload } from '../types'
import { batchNamesForPrograms } from '../data/derive'

export function SchoolPage() {
  const { schoolCode } = useParams()
  const [payload, setPayload] = useState<SchoolPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedBatch, setSelectedBatch] = useState(0)

  useEffect(() => {
    if (!schoolCode) return
    let alive = true
    setPayload(null)
    setError(null)
    setSelectedBatch(0)
    loadSchoolPayload(schoolCode)
      .then((nextPayload) => {
        if (alive) setPayload(nextPayload)
      })
      .catch((loadError: unknown) => {
        if (alive) setError(loadError instanceof Error ? loadError.message : '院校数据加载失败')
      })
    return () => {
      alive = false
    }
  }, [schoolCode])

  const programs = useMemo(() => payload?.programs ?? [], [payload])
  const batchNames = useMemo(() => batchNamesForPrograms(programs), [programs])

  if (!schoolCode) {
    return <Navigate replace to="/search" />
  }

  if (error) return <Alert severity="error">{error}</Alert>
  if (!payload) return <LoadingScreen />

  const activeBatchName = batchNames[selectedBatch] ?? batchNames[0] ?? ''
  const activePrograms = programs.filter((program) => program.batchName === activeBatchName)

  return (
    <Stack spacing={2}>
      <SchoolSummary batchNames={batchNames} school={payload.school} />
      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Tabs
          onChange={(_event, value: number) => setSelectedBatch(value)}
          scrollButtons="auto"
          value={selectedBatch}
          variant="scrollable"
        >
          {batchNames.map((batchName) => (
            <Tab key={batchName} label={batchName} />
          ))}
        </Tabs>
      </Box>
      <Stack spacing={1}>
        <Typography component="h2" variant="h2">
          {activeBatchName}
        </Typography>
        <ProgramGrid programs={activePrograms} />
      </Stack>
    </Stack>
  )
}
