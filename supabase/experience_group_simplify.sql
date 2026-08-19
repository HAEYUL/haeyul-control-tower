-- experience_group 데이터 구조 축소: 이름/연락처/URL링크/채널만 남긴다.
alter table experience_group drop column if exists grade;
alter table experience_group drop column if exists address;
alter table experience_group drop column if exists review_date;
alter table experience_group drop column if exists visited;

alter table experience_group add column if not exists channel text;
