import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  TextField,
  Stack,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SchoolIcon from '@mui/icons-material/School'
import { useState } from 'react'
import type { BatchSummary, SummaryData } from '../types'
import { formatNumber } from '../data/derive'

type HomePageProps = {
  summary: SummaryData
}

type BatchGroup = {
  title: string
  batches: Array<{
    batchName: string
    shortName: string
  }>
}

const batchGroups: BatchGroup[] = [
  {
    title: '本科提前批',
    batches: [
      { batchName: '本科提前批空军招飞类', shortName: '空军招飞类' },
      { batchName: '本科提前批艺术类本科第一批', shortName: '艺术类本科第一批' },
      { batchName: '本科提前批艺术类本科第二批', shortName: '艺术类本科第二批' },
      { batchName: '本科提前批体育类', shortName: '体育类' },
      { batchName: '本科提前批其他一类', shortName: '其他一类' },
      { batchName: '本科提前批其他二类', shortName: '其他二类' },
      { batchName: '本科提前批其他三类', shortName: '其他三类' },
    ],
  },
  {
    title: '本科普通/预科',
    batches: [
      { batchName: '本科普通批', shortName: '本科普通批' },
      { batchName: '其他预科批', shortName: '其他预科批' },
    ],
  },
  {
    title: '高职高专提前批',
    batches: [
      { batchName: '高职高专提前批定向类', shortName: '定向类' },
      { batchName: '高职高专提前批艺术类', shortName: '艺术类' },
      { batchName: '高职高专提前批体育类', shortName: '体育类' },
      { batchName: '高职高专提前批其他类', shortName: '其他类' },
    ],
  },
  {
    title: '高职高专普通批',
    batches: [{ batchName: '高职高专普通批', shortName: '高职高专普通批' }],
  },
]

const admissionTypeKeywords = ['预科类', '免费少数民族预科班', '少数民族预科班', '民族班', '边防军人子女预科班']

export function HomePage({ summary }: HomePageProps) {
  const navigate = useNavigate()
  const [schoolKeyword, setSchoolKeyword] = useState('')
  const batchMap = new Map(summary.batches.map((batch) => [batch.batchName, batch]))
  const trimmedSchoolKeyword = schoolKeyword.trim()

  const goToSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim()
    navigate(trimmedKeyword ? `/search?keyword=${encodeURIComponent(trimmedKeyword)}` : '/search')
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography component="h1" variant="h1">
              广西 2026 物理类招生计划查询
            </Typography>
            <Typography color="text.secondary" variant="body1">
              整理自《2026年广西高考指南招生计划篇（物理类）》，支持按院校、专业、批次查询，并提供 PDF
              页码/书页码用于核对。
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} startIcon={<SearchIcon />} to="/search">
                查院校和专业
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard label="院校" value={summary.counts.schools} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard label="批次" value={summary.counts.batches} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard label="专业计划" value={summary.counts.programs} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography component="h2" variant="h2">
                  按批次浏览
                </Typography>
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                  {batchGroups.map((group) => (
                    <BatchGroupSection batchMap={batchMap} group={group} key={group.title} />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography component="h2" variant="h2">
                  快速查院校
                </Typography>
                <Stack
                  component="form"
                  direction={{ xs: 'column', sm: 'row' }}
                  onSubmit={(event) => {
                    event.preventDefault()
                    goToSearch(schoolKeyword)
                  }}
                  spacing={1.5}
                >
                  <TextField
                    label="院校名称或代码"
                    onChange={(event) => setSchoolKeyword(event.target.value)}
                    placeholder="如 广西艺术学院 / 10607"
                    value={schoolKeyword}
                  />
                  <Button
                    disabled={!trimmedSchoolKeyword}
                    startIcon={<SchoolIcon />}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                    type="submit"
                  >
                    查院校
                  </Button>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  输入院校名或院校代码后进入检索页查看相关专业计划。
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography component="h2" variant="h2">
                  招生类型提示
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  预科和民族班可能分布在不同批次，可直接用这些关键词检索。
                </Typography>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {admissionTypeKeywords.map((keyword) => (
                    <Chip
                      clickable
                      color="primary"
                      component={RouterLink}
                      key={keyword}
                      label={keyword}
                      to={`/search?keyword=${encodeURIComponent(keyword)}`}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

type BatchGroupSectionProps = {
  batchMap: Map<string, BatchSummary>
  group: BatchGroup
}

function BatchGroupSection({ batchMap, group }: BatchGroupSectionProps) {
  const batches = group.batches
    .map((item) => {
      const batch = batchMap.get(item.batchName)
      return batch ? { ...item, batch } : null
    })
    .filter((item): item is { batchName: string; shortName: string; batch: BatchSummary } => Boolean(item))
  const total = batches.reduce((sum, item) => sum + item.batch.programCount, 0)

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Typography component="h3" variant="h3">
          {group.title}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {formatNumber(total)} 条
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {batches.map(({ batch, shortName }) => (
          <Chip
            clickable
            color="primary"
            component={RouterLink}
            key={batch.batchName}
            label={`${shortName} ${formatNumber(batch.programCount)} 条`}
            to={`/batches/${batch.slug}`}
            variant="outlined"
          />
        ))}
      </Stack>
    </Stack>
  )
}

type MetricCardProps = {
  label: string
  value: number
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card>
      <CardActionArea component={RouterLink} to="/search">
        <CardContent>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography component="p" variant="h2">
            {formatNumber(value)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
