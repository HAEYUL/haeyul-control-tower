import { generateContentBrief } from './_generateContentBrief.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { store, contentType, purpose, concept } = req.body ?? {}
  if (!store || !contentType) {
    res.status(400).json({ error: 'store, contentType이 필요합니다' })
    return
  }

  try {
    const result = await generateContentBrief({ store, contentType, purpose, concept })
    res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || '생성 중 오류가 발생했습니다' })
  }
}
