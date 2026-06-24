import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Alert, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { ProgramGrid } from '../components/ProgramGrid'
import { LoadingScreen } from '../App'
import { loadBatchPayload } from '../data/loadSiteData'
import type { BatchPayload } from '../types'
import { formatNumber } from '../data/derive'

export function BatchPage() {
  const { batchSlug } = useParams()
  const [payload, setPayload] = useState<BatchPayload | null>(null)
  const [keyword, setKeyword] = useState('')
  const deferredKeyword = useDeferredValue(keyword)
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!batchSlug) return
    let alive = true
    setPayload(null)
    setKeyword('')
    setError(null)
    loadBatchPayload(batchSlug)
      .then((nextPayload) => {
        if (alive) setPayload(nextPayload)
      })
      .catch((loadError: unknown) => {
        if (alive) setError(loadError instanceof Error ? loadError.message : '批次数据加载失败')
      })
    return () => {
      alive = false
    }
  }, [batchSlug])

  const programs = useMemo(() => payload?.programs ?? [], [payload])
  const filteredPrograms = useMemo(() => {
    const normalizedKeyword = deferredKeyword.trim().toLocaleLowerCase('zh-CN')
    if (!normalizedKeyword) return programs
    return programs.filter((program) =>
      [program.schoolCode, program.schoolName, program.majorCode, program.majorName, program.remarks]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(normalizedKeyword),
    )
  }, [deferredKeyword, programs])

  if (!batchSlug) {
    return <Navigate replace to="/" />
  }

  if (error) return <Alert severity="error">{error}</Alert>
  if (!payload) return <LoadingScreen />

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h1">
          {payload.batch.batchName}
        </Typography>
        <Typography color="text.secondary">
          当前显示 {formatNumber(filteredPrograms.length)} 条，批次总量 {formatNumber(programs.length)} 条。
        </Typography>
      </Stack>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            label="在本批次内检索"
            onChange={(event) => {
              const nextKeyword = event.target.value
              startTransition(() => setKeyword(nextKeyword))
            }}
            placeholder="院校、专业、备注"
            value={keyword}
          />
        </CardContent>
      </Card>
      <ProgramGrid programs={filteredPrograms} />
    </Stack>
  )
}
