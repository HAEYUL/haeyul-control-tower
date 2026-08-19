-- experience_group: 체험단·인플루언서 관리. 로그인한 관리자만 CRUD.
create table if not exists experience_group (
  id uuid primary key default gen_random_uuid(),
  store text not null, -- '해율만두전골' | '곤드레밥집' | '정담명가 남원추어탕'
  name text not null,
  phone text not null,
  link_url text,
  channel text, -- '블로그' | '블로그+클립' | '인스타그램' | '유튜브' | '릴스' | '틱톡' | '쇼츠' | '클립'
  created_at timestamptz not null default now()
);

create index if not exists experience_group_store_idx on experience_group (store);

alter table experience_group enable row level security;

create policy "experience_group is readable by authenticated admin"
  on experience_group for select
  using (auth.role() = 'authenticated');

create policy "experience_group is insertable by authenticated admin"
  on experience_group for insert
  with check (auth.role() = 'authenticated');

create policy "experience_group is updatable by authenticated admin"
  on experience_group for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "experience_group is deletable by authenticated admin"
  on experience_group for delete
  using (auth.role() = 'authenticated');
