import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const QUICK_LINKS = [
  { to: '/store', label: '매장 운영' },
  { to: '/marketing', label: '마케팅·SNS' },
  { to: '/roadmap', label: '로드맵' },
  { to: '/settings', label: '설정' },
]

function HomeScreen() {
  const [inProgressCount, setInProgressCount] = useState(0)
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count }, { data: recent }] = await Promise.all([
        supabase
          .from('roadmap_items')
          .select('id', { count: 'exact', head: true })
          .eq('status', '진행중'),
        supabase
          .from('roadmap_items')
          .select('id, title')
          .order('created_at', { ascending: false })
          .limit(3),
      ])
      setInProgressCount(count ?? 0)
      setRecentItems(recent ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">홈</h1>
      <p className="page-subtitle">오늘의 요약을 한눈에 확인하세요.</p>

      <div className="card-grid">
        <div className="card">
          <div className="card-label">진행 중인 자동화 프로젝트</div>
          <div className="card-value">{loading ? '-' : `${inProgressCount}개`}</div>
        </div>
        <div className="card">
          <div className="card-label">최근 추가된 아이디어</div>
          {loading || recentItems.length === 0 ? (
            <div className="card-value">-</div>
          ) : (
            recentItems.map((item) => (
              <div className="card-value-item" key={item.id}>
                {item.title}
              </div>
            ))
          )}
        </div>
      </div>

      <h2 className="section-title">바로가기</h2>
      <div className="quick-links">
        {QUICK_LINKS.map((link) => (
          <Link className="quick-link" to={link.to} key={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomeScreen
