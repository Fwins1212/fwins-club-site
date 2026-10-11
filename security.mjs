export const PLANS = {'1 Year':9900,'5 Years':34900,Lifetime:49900};
export async function signature(secret, text) {
 const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text))),x=>x.toString(16).padStart(2,'0')).join('');
}
export function equal(a,b) { if(typeof b!=='string'||a.length!==b.length)return false; let diff=0; for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i); return diff===0; }
export function validPayment(p,o) {return p.status==='captured'&&p.order_id===o.order_id&&p.amount===o.amount&&p.currency==='INR'&&PLANS[o.plan_type]===o.amount;}
