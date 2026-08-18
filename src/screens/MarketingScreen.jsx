const items = [
  '콘텐츠 제작 자동화',
  '발행 자동화',
  '리뷰 관리',
  '성과 분석',
  '리뷰 요청 자동화',
  '고객 세그먼트별 맞춤 콘텐츠',
  '트렌드·경쟁사 모니터링',
  '체험단·인플루언서 관리',
  '음식·공간 사진 AI 보정',
  '외국인 고객 다국어 콘텐츠',
]

function MarketingScreen() {
  return (
    <div className="page">
      <h1 className="page-title">마케팅·SNS</h1>
      <p className="page-subtitle">콘텐츠 제작부터 리뷰 관리까지 마케팅 자동화 아이디어 목록입니다.</p>

      <ul className="list">
        {items.map((title) => (
          <li className="list-item" key={title}>
            <span>{title}</span>
            <span className="badge badge-planned">예정</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MarketingScreen
