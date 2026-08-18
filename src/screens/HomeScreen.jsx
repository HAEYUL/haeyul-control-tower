function HomeScreen() {
  return (
    <div className="page">
      <h1 className="page-title">홈</h1>
      <p className="page-subtitle">오늘의 요약을 한눈에 확인하세요.</p>

      <div className="card-grid">
        <div className="card">
          <div className="card-label">진행 중인 자동화 프로젝트</div>
          <div className="card-value">0개</div>
        </div>
        <div className="card">
          <div className="card-label">최근 추가된 아이디어</div>
          <div className="card-value">-</div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
