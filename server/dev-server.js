import express from 'express'
import generateReviewReplyHandler from '../api/generate-review-reply.js'
import generateContentBriefHandler from '../api/generate-content-brief.js'
import sendSmsHandler from '../api/send-sms.js'

const app = express()
app.use(express.json())

app.post('/api/generate-review-reply', generateReviewReplyHandler)
app.post('/api/generate-content-brief', generateContentBriefHandler)
app.post('/api/send-sms', sendSmsHandler)

const port = process.env.API_PORT || 8787
app.listen(port, () => {
  console.log(`[dev-api] listening on http://localhost:${port}`)
})
