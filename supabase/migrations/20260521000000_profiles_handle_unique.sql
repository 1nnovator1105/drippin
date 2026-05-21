-- 프로필 홈을 /profile/[handle]로 라우팅하기 위해 handle 유니크를 보장한다.
--
-- ⚠️ 적용 전 중복 handle 정리 필요. 아래로 확인:
--   select handle, count(*) from public.profiles
--   where handle is not null group by handle having count(*) > 1;
--   중복이 있으면 해당 사용자들의 handle을 먼저 다른 값으로 변경한 뒤 적용한다.
--
-- 참고: 아래 제약은 대소문자를 구분한다(Drippin ≠ drippin).
-- 대소문자 무시가 필요하면 unique 제약 대신 다음 인덱스를 쓰고,
-- 앱의 handle 비교도 lower 기준으로 맞춘다:
--   create unique index profiles_handle_lower_idx on public.profiles (lower(handle));

alter table public.profiles
  add constraint profiles_handle_key unique (handle);
