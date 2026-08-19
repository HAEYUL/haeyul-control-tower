import express from 'express'
import generateReviewReplyHandler from '../api/generate-review-reply.js'

const app = express()
app.use(express.json())

app.post('/api/generate-review-reply', generateReviewReplyHandler)

const port = process.env.API_PORT || 8787
app.listen(port, () => {
  console.log(`[dev-api] listening on http://localhost:${port}`)
})
