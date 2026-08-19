const GRADE_KEYWORDS = ['프리미어', '고급', '중급', '초급', 'VIP', '일반', '신입']
const IGNORE_TOKENS = new Set(['URL', '자료없음', '평가하기'])

export function parseExperienceGroupText(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const phoneMatch = line.match(/01[0-9]-?\d{3,4}-?\d{4}/)
      const dateMatch = line.match(/\d{4}-\d{1,2}-\d{1,2}/)

      const cells = line
        .split('\t')
        .map((c) => c.trim())
        .filter(Boolean)
      const tokens = cells.length > 1 ? cells : line.split(/\s+/).filter(Boolean)

      const grade = tokens.find((t) => GRADE_KEYWORDS.includes(t)) || ''

      const excluded = new Set([phoneMatch?.[0], dateMatch?.[0], grade].filter(Boolean))
      const remaining = tokens.filter(
        (t) => !excluded.has(t) && !/^\d+$/.test(t) && !IGNORE_TOKENS.has(t),
      )

      const name = remaining.find((t) => /^[가-힣]{2,5}$/.test(t)) || remaining[0] || ''
      const address = remaining.filter((t) => t !== name).join(' ')

      return {
        name,
        phone: phoneMatch?.[0] || '',
        grade,
        address,
        review_date: dateMatch?.[0] || '',
      }
    })
    .filter((row) => row.name || row.phone)
}
