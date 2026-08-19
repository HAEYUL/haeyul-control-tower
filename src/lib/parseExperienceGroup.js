const GRADE_KEYWORDS = ['프리미어', '고급', '중급', '초급', 'VIP', '일반', '신입']
const IGNORE_TOKENS = new Set(['URL', '자료없음', '평가하기'])
const PHONE_PATTERN = /01[0-9]-?\d{3,4}-?\d{4}/

// 리뷰노트 등에서 표를 복사하면 한 사람의 정보가 두 줄로 잘려서 붙여넣어지는 경우가 있다
// (이름/등급 줄, 연락처/주소/날짜 줄). 전화번호가 나올 때까지 다음 줄을 이어붙여
// 한 사람 = 한 레코드가 되도록 병합한다.
function mergeWrappedLines(rawLines) {
  const merged = []
  let buffer = ''

  for (const line of rawLines) {
    buffer = buffer ? `${buffer}\t${line}` : line
    if (PHONE_PATTERN.test(buffer)) {
      merged.push(buffer)
      buffer = ''
    }
  }
  if (buffer) merged.push(buffer)

  return merged
}

export function parseExperienceGroupText(text) {
  const rawLines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return mergeWrappedLines(rawLines)
    .map((line) => {
      const phoneMatch = line.match(PHONE_PATTERN)
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
