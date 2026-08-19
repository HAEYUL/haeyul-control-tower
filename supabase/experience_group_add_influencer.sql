-- 체험단 중 인플루언서를 구분하기 위한 플래그
alter table experience_group add column if not exists is_influencer boolean not null default false;
