import type { AdmissionLine, PlanCount, Program, ProgramRow, Tuition } from '../types'

export type SearchFilters = {
  keyword: string
  batchName: string
  schoolCode: string
  majorGroupCode: string
  firstSubject: string
  secondSubject: string
}

export type ProgramSearchEntry = {
  program: Program
  searchText: string
}

export function programId(program: Program, index: number): string {
  return [
    program.batchName,
    program.schoolCode,
    program.majorGroupCode,
    program.majorCode,
    program.pdfPage,
    index,
  ].join('-')
}

export type AdmissionLineIndex = Map<string, AdmissionLine>

export function toRows(programs: Program[], admissionLineIndex?: AdmissionLineIndex): ProgramRow[] {
  return programs.map((program, index) => ({
    ...program,
    id: programId(program, index),
    history2025: admissionLineIndex?.get(admissionLineKey(program)) ?? null,
  }))
}

export function buildAdmissionLineIndex(admissionLines: AdmissionLine[]): AdmissionLineIndex {
  return new Map(admissionLines.map((line) => [admissionLineKey(line), line]))
}

export function batchNamesForPrograms(programs: Program[]): string[] {
  return Array.from(new Set(programs.map((program) => program.batchName)))
}

export function buildProgramSearchIndex(programs: Program[]): ProgramSearchEntry[] {
  return programs.map((program) => ({
    program,
    searchText: normalize(
      [
        program.batchName,
        program.schoolCode,
        program.schoolName,
        program.majorGroupCode,
        program.majorCode,
        program.majorName,
        program.remarks,
      ].join(' '),
    ),
  }))
}

export function applyIndexedSearchFilters(index: ProgramSearchEntry[], filters: SearchFilters): Program[] {
  const keyword = normalize(filters.keyword)
  return index
    .filter(({ program, searchText }) => {
      if (filters.batchName && program.batchName !== filters.batchName) return false
      if (filters.schoolCode && program.schoolCode !== filters.schoolCode) return false
      if (filters.majorGroupCode && program.majorGroupCode !== filters.majorGroupCode) return false
      if (filters.firstSubject && (program.firstSubject ?? '') !== filters.firstSubject) return false
      if (filters.secondSubject && (program.secondSubject ?? '') !== filters.secondSubject) return false
      if (!keyword) return true
      return searchText.includes(keyword)
    })
    .map(({ program }) => program)
}

export function applySearchFilters(programs: Program[], filters: SearchFilters): Program[] {
  const keyword = normalize(filters.keyword)
  return programs.filter((program) => {
    if (filters.batchName && program.batchName !== filters.batchName) return false
    if (filters.schoolCode && program.schoolCode !== filters.schoolCode) return false
    if (filters.majorGroupCode && program.majorGroupCode !== filters.majorGroupCode) return false
    if (filters.firstSubject && (program.firstSubject ?? '') !== filters.firstSubject) return false
    if (filters.secondSubject && (program.secondSubject ?? '') !== filters.secondSubject) return false
    if (!keyword) return true

    const haystack = normalize(
      [
        program.batchName,
        program.schoolCode,
        program.schoolName,
        program.majorGroupCode,
        program.majorCode,
        program.majorName,
        program.remarks,
      ].join(' '),
    )
    return haystack.includes(keyword)
  })
}

export function distinctStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort(
    naturalCompare,
  )
}

export function formatNumber(value: number | null | undefined): string {
  return typeof value === 'number' ? value.toLocaleString('zh-CN') : '—'
}

export function formatPlanCount(value: PlanCount | null | undefined): string {
  if (typeof value === 'number') return value.toLocaleString('zh-CN')
  return value || '—'
}

export function formatTuition(value: Tuition | null | undefined): string {
  if (typeof value === 'number') return value.toLocaleString('zh-CN')
  return value || '—'
}

export function admissionLineKey(value: Pick<Program, 'batchName' | 'schoolCode' | 'majorGroupCode'>): string {
  return [value.batchName, value.schoolCode, value.majorGroupCode].join('|')
}

export function naturalCompare(left: string, right: string): number {
  return left.localeCompare(right, 'zh-CN', { numeric: true })
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('zh-CN')
}
