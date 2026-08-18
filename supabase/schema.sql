-- stores: 매장 정보 (읽기 전용에 가까움). 로그인한 관리자만 조회.
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size_pyeong integer,
  floor text,
  address text
);

insert into stores (name, size_pyeong, floor, address) values
  ('해율만두전골', 300, '3층', '용인시 수지구'),
  ('곤드레밥집', 170, '1층', '용인시 수지구'),
  ('정담명가 남원추어탕', 180, '1층', '용인시 수지구')
on conflict do nothing;

alter table stores enable row level security;

create policy "stores are readable by authenticated admin"
  on stores for select
  using (auth.role() = 'authenticated');

-- roadmap_items: 자동화 아이디어/프로젝트 로드맵. 로그인한 관리자만 CRUD.
create table if not exists roadmap_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null, -- '매장운영' | '마케팅SNS'
  status text not null default '아이디어', -- '아이디어' | '진행중' | '완료'
  external_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table roadmap_items enable row level security;

create policy "roadmap_items are readable by authenticated admin"
  on roadmap_items for select
  using (auth.role() = 'authenticated');

create policy "roadmap_items are insertable by authenticated admin"
  on roadmap_items for insert
  with check (auth.role() = 'authenticated');

create policy "roadmap_items are updatable by authenticated admin"
  on roadmap_items for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "roadmap_items are deletable by authenticated admin"
  on roadmap_items for delete
  using (auth.role() = 'authenticated');

-- 초기 시드 데이터 (해율푸드 관제탑 제작 프롬프트 5-4 기준)
insert into roadmap_items (title, description, category, status) values
  ('매입·정산', '거래명세표 AI 프로젝트와 연결된 매입·정산 관리', '매장운영', '완료'),
  ('원가·레시피', '원가율계산기 프로젝트와 연결된 원가·레시피 관리', '매장운영', '완료'),
  ('예약·고객(CRM)', '통합 전자여권과 연결된 예약·고객 관리', '매장운영', '완료'),
  ('발주·재고', '발주 및 재고 관리 자동화', '매장운영', '아이디어'),
  ('인력·근태', '인력 스케줄 및 근태 관리', '매장운영', '아이디어'),
  ('위생·품질', '위생·품질 점검 관리', '매장운영', '아이디어'),
  ('매출 리포트', '3개 매장 통합 매출 집계', '매장운영', '아이디어'),
  ('콘텐츠 제작 자동화', '블로그/인스타/카카오채널 문구 자동생성', '마케팅SNS', '아이디어'),
  ('발행 자동화', '인스타/유튜브 예약 발행, 네이버 블로그·플레이스 반자동', '마케팅SNS', '아이디어'),
  ('리뷰 관리', '네이버 플레이스 리뷰 답글 초안 자동생성', '마케팅SNS', '아이디어'),
  ('성과 분석', '채널별 반응 리포트', '마케팅SNS', '아이디어'),
  ('리뷰 요청 자동화', '방문 후 리뷰 요청 문자', '마케팅SNS', '아이디어'),
  ('고객 세그먼트별 맞춤 콘텐츠', '전자여권 데이터 연계 맞춤 콘텐츠', '마케팅SNS', '아이디어'),
  ('트렌드·경쟁사 모니터링', '트렌드 및 경쟁사 모니터링', '마케팅SNS', '아이디어'),
  ('체험단·인플루언서 관리', '체험단·인플루언서 관리', '마케팅SNS', '아이디어'),
  ('음식·공간 사진 AI 보정', '음식·공간 사진 AI 보정', '마케팅SNS', '아이디어'),
  ('외국인 고객 다국어 콘텐츠', '외국인 고객 대상 다국어 콘텐츠', '마케팅SNS', '아이디어');
