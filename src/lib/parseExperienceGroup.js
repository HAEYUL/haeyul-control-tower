const PHONE_PATTERN = /01[0-9]-?\d{3,4}-?\d{4}/
const NAME_PATTERN = /^[가-힣]{2,5}$/
const NON_NAME_WORDS = new Set([
  '블로그', '클립', '인스타그램', '유튜브', '릴스', '틱톡', '쇼츠',
  '자료없음', '평가하기', '미제출', '미등록', 'URL',
  '프리미어', '고급', '중급', '초급', 'VIP', '일반', '신입',
])

// 리뷰노트 등에서 표를 복사하면 사람마다 줄 수가 다르다 (링크가 1개면 2줄,
// 2개(블로그+클립)면 3~4줄 등 — 줄 수로는 레코드 경계를 알 수 없다).
// 대신 표의 "번호"(1, 2, 3...) 바로 다음에 오는 이름을 레코드 경계로 삼고,
// 그 구간 안에서 전화번호를 찾는다.
function parseWithRowNumbers(tokens) {
  const boundaries = []
  for (let i = 0; i < tokens.length - 1; i++) {
    if (/^\d{1,3}$/.test(tokens[i]) && NAME_PATTERN.test(tokens[i + 1]) && !NON_NAME_WORDS.has(tokens[i + 1])) {
      boundaries.push(i)
    }
  }

  return boundaries.map((start, idx) => {
    const end = idx + 1 < boundaries.length ? boundaries[idx + 1] : tokens.length
    const span = tokens.slice(start, end)
    const phoneMatch = span.join(' ').match(PHONE_PATTERN)
    return { name: span[1], phone: phoneMatch?.[0] || '' }
  })
}

// 번호 컬럼 없이 붙여넣은 경우의 대안: 전화번호가 나올 때마다, 그 앞에서 가장 최근에
// 나온(아직 쓰이지 않은) 이름 후보를 그 사람의 이름으로 사용한다.
function parseWithoutRowNumbers(tokens) {
  const records = []
  let pendingName = ''

  for (const token of tokens) {
    const phoneMatch = token.match(PHONE_PATTERN)
    if (phoneMatch) {
      records.push({ name: pendingName, phone: phoneMatch[0] })
      pendingName = ''
    } else if (!pendingName && NAME_PATTERN.test(token) && !NON_NAME_WORDS.has(token)) {
      pendingName = token
    }
  }

  return records
}

export function parseExperienceGroupText(text) {
  const tokens = text.split(/\s+/).filter(Boolean)

  const withRowNumbers = parseWithRowNumbers(tokens)
  const records = withRowNumbers.length > 0 ? withRowNumbers : parseWithoutRowNumbers(tokens)

  return records.filter((r) => r.name || r.phone)
}
