begin;
create table public.club_orders (
 order_id text primary key, user_id uuid not null references auth.users(id),
 plan_type text not null check(plan_type in ('1 Year','5 Years','Lifetime')),
 amount integer not null check(amount>0), payment_id text unique,
 created_at timestamptz not null default now(), paid_at timestamptz
);
create index club_orders_user_time on public.club_orders(user_id,created_at);
create table public.club_memberships (
 user_id uuid primary key references auth.users(id), plan_type text not null,
 order_id text not null references public.club_orders(order_id),
 starts_at timestamptz not null, expires_at timestamptz
);
alter table public.club_orders enable row level security;
alter table public.club_memberships enable row level security;
revoke all on public.club_orders,public.club_memberships from anon,authenticated;
grant select on public.club_orders,public.club_memberships to authenticated;
grant all on public.club_orders,public.club_memberships to service_role;
create policy own_orders on public.club_orders for select to authenticated using(auth.uid()=user_id);
create policy own_membership on public.club_memberships for select to authenticated using(auth.uid()=user_id);
create function public.activate_club_membership(p_order_id text,p_payment_id text)
returns void language plpgsql security definer set search_path=public as $$
declare o public.club_orders; t timestamptz:=now(); expiry timestamptz;
begin
 select * into o from public.club_orders where order_id=p_order_id for update;
 if not found then raise exception 'Unknown order'; end if;
 if o.paid_at is not null then
  if o.payment_id<>p_payment_id then raise exception 'Payment mismatch'; end if;
  return;
 end if;
 perform pg_advisory_xact_lock(hashtextextended(o.user_id::text,0));
 select case when exists(select 1 from public.club_memberships where user_id=o.user_id and expires_at is null)
 then null else greatest(t,coalesce((select expires_at from public.club_memberships where user_id=o.user_id),t)) end into expiry;
 if o.plan_type='Lifetime' then expiry:=null;
 elsif expiry is not null then expiry:=expiry+case when o.plan_type='1 Year' then interval '1 year' else interval '5 years' end; end if;
 update public.club_orders set payment_id=p_payment_id,paid_at=t where order_id=o.order_id;
 insert into public.club_memberships(user_id,plan_type,order_id,starts_at,expires_at)
 values(o.user_id,case when expiry is null then 'Lifetime' else o.plan_type end,o.order_id,t,expiry)
 on conflict(user_id) do update set plan_type=excluded.plan_type,order_id=excluded.order_id,expires_at=excluded.expires_at;
end $$;
revoke all on function public.activate_club_membership(text,text) from public,anon,authenticated;
grant execute on function public.activate_club_membership(text,text) to service_role;
commit;
