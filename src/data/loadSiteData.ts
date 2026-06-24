import type {
  AdmissionLinesData,
  BatchPayload,
  ProgramsData,
  SchoolIndexData,
  SchoolPayload,
  SiteData,
  SummaryData,
} from '../types'

export async function loadSiteData(): Promise<SiteData> {
  return loadJson<SiteData>('/data/site.json', 'site.json')
}

export async function loadSummaryData(): Promise<SummaryData> {
  return loadJson<SummaryData>('/data/summary.json', 'summary.json')
}

export async function loadProgramsData(): Promise<ProgramsData> {
  return loadJson<ProgramsData>('/data/programs.json', 'programs.json')
}

export async function loadSchoolIndexData(): Promise<SchoolIndexData> {
  return loadJson<SchoolIndexData>('/data/schools.json', 'schools.json')
}

export async function loadSchoolPayload(schoolCode: string): Promise<SchoolPayload> {
  return loadJson<SchoolPayload>(`/data/schools/${encodeURIComponent(schoolCode)}.json`, '院校数据')
}

export async function loadBatchPayload(batchSlug: string): Promise<BatchPayload> {
  return loadJson<BatchPayload>(`/data/batches/${encodeURIComponent(batchSlug)}.json`, '批次数据')
}

export async function loadAdmissionLines2025(): Promise<AdmissionLinesData> {
  return loadJson<AdmissionLinesData>(
    '/data/history/2025/guangxi-physics-admission-lines.json',
    '2025 参考线',
  )
}

async function loadJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${label} 加载失败: ${response.status}`)
  }
  return (await response.json()) as T
}
