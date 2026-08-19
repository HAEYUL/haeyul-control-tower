import { generateReviewReply } from './_generateReviewReply.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { channel, type, rating, reviewText } = req.body ?? {}
  if (!channel || !type || !reviewText?.trim()) {
    res.status(400).json({ error: 'channel, type, reviewText가 필요합니다' })
    return
  }

  try {
    const reply = await generateReviewReply({ channel, type, rating, reviewText })
    res.status(200).json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || '답글 생성 중 오류가 발생했습니다' })
  }
}
