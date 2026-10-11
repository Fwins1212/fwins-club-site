import {createClient} from 'npm:@supabase/supabase-js@2.38.0';
import {PLANS,signature,equal,validPayment} from './security.mjs';
const env=(n:string)=>{const v=Deno.env.get(n);if(!v)throw new Error('Missing server configuration');return v};
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const allowed=(Deno.env.get('ALLOWED_ORIGINS')||'https://fwinsclub.online').split(',');
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':allowed.includes(origin)?origin:allowed[0],'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 try{
 const db=createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'));
 const key=env('RAZORPAY_KEY_ID'),secret=env('RAZORPAY_KEY_SECRET');
 const api=async(path:string,body?:unknown)=>{
  const r=await fetch('https://api.razorpay.com/v1/'+path,{method:body?'POST':'GET',headers:{Authorization:'Basic '+btoa(key+':'+secret),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  if(!r.ok)throw new Error('Payment provider unavailable');return await r.json();
 };
 const finish=async(paymentId:string)=>{
  if(!/^pay_[A-Za-z0-9]+$/.test(paymentId))throw new Error('Invalid payment');
  const p=await api('payments/'+paymentId);
  const {data:o,error}=await db.from('club_orders').select('*').eq('order_id',p.order_id).single();
  if(error||!o||!validPayment(p,o))throw new Error('Payment is not yet captured or does not match the order');
  const {error:e}=await db.rpc('activate_club_membership',{p_order_id:o.order_id,p_payment_id:p.id});
  if(e)throw new Error('Activation pending; contact support with your payment ID');
 };
 const action=new URL(req.url).searchParams.get('action');
 if(action==='webhook'){
  const raw=await req.text();
  if(!equal(await signature(env('RAZORPAY_WEBHOOK_SECRET'),raw),req.headers.get('x-razorpay-signature')))return reply({error:'Invalid signature'},401);
  const event=JSON.parse(raw);
  if(event.event==='payment.captured'||event.event==='order.paid')await finish(event.payload.payment.entity.id);
  return reply({received:true});
 }
 const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
 const {data:{user},error:authError}=await db.auth.getUser(token);
 if(authError||!user)return reply({error:'Sign in to continue'},401);
 const body=await req.json();
 if(action==='create'){
  const amount=PLANS[body.planType];if(!amount)return reply({error:'Invalid plan'},400);
  const {data:active,error:lookup}=await db.from('club_memberships').select('user_id').eq('user_id',user.id).or('expires_at.is.null,expires_at.gt.'+new Date().toISOString()).maybeSingle();
  if(lookup)throw new Error('Unable to check membership');
  if(active)return reply({error:'You already have an active membership'},409);
  const {count,error:rate}=await db.from('club_orders').select('*',{count:'exact',head:true}).eq('user_id',user.id).gte('created_at',new Date(Date.now()-600000).toISOString());
  if(rate)throw new Error('Unable to create order');if((count||0)>=5)return reply({error:'Too many attempts. Try again in 10 minutes.'},429);
  const order=await api('orders',{amount,currency:'INR',receipt:crypto.randomUUID(),notes:{user_id:user.id,plan_type:body.planType}});
  const {error:e}=await db.from('club_orders').insert({order_id:order.id,user_id:user.id,plan_type:body.planType,amount});
  if(e)throw new Error('Unable to save order. Please retry.');
  return reply({order_id:order.id,amount,currency:'INR',key_id:key});
 }
 if(action==='verify'){
  const {data:o,error}=await db.from('club_orders').select('*').eq('order_id',body.razorpay_order_id).eq('user_id',user.id).single();
  if(error||!o)return reply({error:'Order not found'},404);
  if(!equal(await signature(secret,o.order_id+'|'+body.razorpay_payment_id),body.razorpay_signature))return reply({error:'Invalid payment signature'},400);
  await finish(body.razorpay_payment_id);return reply({verified:true});
 }
 return reply({error:'Unknown action'},400);
 }catch(e){return reply({error:e instanceof Error?e.message:'Payment request failed'},400);}
});
