const ALIGO_SEND_URL = 'https://apis.aligo.in/send/'

export async function sendSms({ receivers, message, testMode = false }) {
  const apiKey = process.env.ALIGO_API_KEY
  const userId = process.env.ALIGO_USER_ID
  const sender = process.env.ALIGO_SENDER

  if (!apiKey || !userId || !sender) {
    throw new Error('알리고 API 설정(ALIGO_API_KEY/ALIGO_USER_ID/ALIGO_SENDER)이 없습니다')
  }

  if (!receivers?.length) {
    throw new Error('수신자가 없습니다')
  }
  if (!message?.trim()) {
    throw new Error('메시지 내용이 없습니다')
  }

  const body = new URLSearchParams({
    key: apiKey,
    user_id: userId,
    sender: sender.replace(/\D/g, ''),
    receiver: receivers.map((r) => r.replace(/\D/g, '')).join(','),
    msg: message,
    testmode_yn: testMode ? 'Y' : 'N',
  })

  const res = await fetch(ALIGO_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await res.json()

  if (Number(data.result_code) !== 1) {
    throw new Error(data.message || '문자 발송에 실패했습니다')
  }

  return data
}
