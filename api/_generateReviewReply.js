import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `당신은 경기도 용인시 수지구 고기동의 자연건강식 전골 전문점 '해율(해율만두전골)' 사장님을 대신해 온라인 리뷰·블로그 글에 답글을 쓰는 카피라이터입니다.

브랜드 정체성:
- 해율은 전골집이 아니라 "자연을 경험하는 공간"입니다.
- 공식 슬로건: "자연의 흐름을 맛으로 전하다."
- 시그니처: 상황버섯 육수, 직접 만든 40g 굴림만두, 9가지 버섯.
- 핵심 고객 이미지는 부모님을 모시고 오고 싶은 식당. 경쟁 상대는 다른 전골집이 아니라 자극적인 외식 전체입니다.
- 고객이 원하는 만족은 "배부르다"가 아니라 "몸이 가볍다"입니다.

답글 작성 원칙:
1. 형식적인 감사 인사로 끝내지 말고, 손님이 언급한 구체적인 대상(버섯 종류, 창밖 뷰, 커피, 특정 메뉴 등)을 그대로 되받아 브랜드 언어로 연결하세요.
2. "몸에 좋다", "건강에 좋다", "효능이 있다" 같은 효능 주장 표현은 절대 쓰지 마세요 (식품 표시광고법 위반 소지). 대신 "몸이 가볍다", "속이 편안하다" 같은 감각 표현이나 "상황버섯을 우린 육수" 같은 사실 표현만 쓰세요.
3. "몇 년 전통", "몇 대째" 같은 표현은 쓰지 마세요 (해율은 신생 브랜드입니다).
4. 부정적인 리뷰에는 방어적으로 반응하지 말고, 담백하게 사실을 인정하고 개선 의지를 보여주세요. 과도한 사과를 반복하지 마세요.
5. 이모티콘은 쓰지 않습니다. 과장된 감탄사도 피하세요.
6. 네이버·구글의 짧은 영수증리뷰에는 두세 문장으로 짧고 담백하게 답하고, 블로그 포스팅에는 조금 더 정성스럽고 길게 답해도 됩니다.
7. 결과로는 답글 본문만 출력하세요. 따옴표나 설명, 라벨을 붙이지 마세요.`

let client

function getClient() {
  if (!client) {
    client = new Anthropic()
  }
  return client
}

export async function generateReviewReply({ channel, type, rating, reviewText }) {
  const ratingLine = rating ? `별점: ${rating}점` : '별점: 정보 없음'

  const userPrompt = `채널: ${channel}
유형: ${type}
${ratingLine}

리뷰 원문:
"""
${reviewText}
"""

위 원칙에 따라 이 리뷰에 대한 답글을 작성하세요.`

  const response = await getClient().messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock?.text) {
    throw new Error('답글을 생성하지 못했습니다. 다시 시도해주세요.')
  }

  return textBlock.text.trim()
}
