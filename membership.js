import {createClient} from '@supabase/supabase-js';
const $=id=>document.getElementById(id),status=text=>$('status').textContent=text;
const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_ANON_KEY;
const plan=new URLSearchParams(location.search).get('plan');if(['1 Year','5 Years','Lifetime'].includes(plan))$('plan').value=plan;
if(!url||!key){status('Membership checkout is being configured. Please contact info.fwins@gmail.com.');$('auth').hidden=true;}
else{
const db=createClient(url,key);let session,busy=false;
const setBusy=value=>{busy=value;for(const id of ['pay','login','signup'])$(id).disabled=value;};
async function refresh(){
 const {data,error}=await db.from('club_memberships').select('*').eq('user_id',session.user.id).maybeSingle();
 if(error)throw new Error('Unable to load membership. Please contact support.');
 const active=data&&(!data.expires_at||Date.parse(data.expires_at)>Date.now());
 $('pay').hidden=!!active; $('plan').disabled=!!active;
 if(active)status(`Active ${data.plan_type} membership.\n${data.expires_at?'Valid until '+new Date(data.expires_at).toLocaleDateString():'Lifetime access'}\nReference: ${data.order_id}`);
 return active;
}
async function render(){const {data,error}=await db.auth.getSession();if(error)throw error;session=data.session;$('auth').hidden=!!session;$('member').hidden=!session;if(session){$('identity').textContent='Signed in as '+session.user.email;await refresh();}}
$('auth-form').onsubmit=async e=>{e.preventDefault();setBusy(true);try{const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(error)throw error;status('Signed in.');await render();}catch(e){status(e.message);}finally{setBusy(false);}};
$('signup').onclick=async()=>{if(!$('auth-form').reportValidity())return;if(!$('name').value.trim()){status('Enter your full name.');return;}setBusy(true);try{const {data,error}=await db.auth.signUp({email:$('email').value,password:$('password').value,options:{data:{name:$('name').value.trim()},emailRedirectTo:location.origin+'/membership.html'}});if(error)throw error;status(data.session?'Account created. Choose your plan and continue to payment.':'Check your email to confirm your account, then sign in here.');await render();}catch(e){status(e.message);}finally{setBusy(false);}};
$('logout').onclick=async()=>{await db.auth.signOut();status('Signed out.');$('pay').hidden=false;$('plan').disabled=false;await render();};
$('refresh').onclick=()=>refresh().then(active=>{if(!active)status('No active membership yet. If you paid, wait a moment and check again. Contact support with your payment ID if it remains pending.');}).catch(e=>status(e.message));
async function call(action,body){const {data:{session:s}}=await db.auth.getSession();if(!s)throw new Error('Sign in again to continue.');const r=await fetch(url+'/functions/v1/club-payments?action='+action,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:'Bearer '+s.access_token},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(data.error||'Payment request failed');return data;}
let scriptPromise;
function loadCheckout(){if(window.Razorpay)return Promise.resolve();if(scriptPromise)return scriptPromise;scriptPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';script.onload=resolve;script.onerror=()=>{script.remove();scriptPromise=null;reject(new Error('Unable to load Razorpay. Please try again.'));};document.head.append(script);});return scriptPromise;}
$('pay').onclick=async()=>{if(busy)return;setBusy(true);try{await loadCheckout();const order=await call('create',{planType:$('plan').value});let verifying=false;const checkout=new window.Razorpay({...order,key:order.key_id,name:'Fwins Club',description:$('plan').value+' Membership',prefill:{name:session.user.user_metadata.name||'',email:session.user.email},theme:{color:'#1d4ed8'},modal:{ondismiss:()=>{if(!verifying){setBusy(false);status('Checkout closed. You can try again.');}}},handler:async response=>{verifying=true;status('Verifying payment…');try{await call('verify',response);await refresh();}catch(e){status('Payment confirmation pending. '+e.message+'\nPayment ID: '+response.razorpay_payment_id);}finally{setBusy(false);}}});checkout.on('payment.failed',()=>{setBusy(false);status('Payment failed. No membership has been activated. You can retry or check status.');});checkout.open();}catch(e){status(e.message);setBusy(false);}};
render().catch(e=>status(e.message));
}
