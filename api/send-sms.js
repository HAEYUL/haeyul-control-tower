import { sendSms } from './_sendSms.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { receivers, message, testMode } = req.body ?? {}
  if (!Array.isArray(receivers) || receivers.length === 0 || !message?.trim()) {
    res.status(400).json({ error: 'receivers, message가 필요합니다' })
    return
  }

  try {
    const result = await sendSms({ receivers, message, testMode })
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || '문자 발송 중 오류가 발생했습니다' })
  }
}
