import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {PLANS,signature,equal,validPayment} from '../supabase/functions/club-payments/security.mjs';
test('HMAC matches provider format and rejects forged signatures',async()=>{const expected=createHmac('sha256','secret').update('order_123|pay_123').digest('hex');assert.equal(await signature('secret','order_123|pay_123'),expected);assert.ok(equal(expected,expected));assert.ok(!equal(expected,'0'.repeat(64)));assert.ok(!equal(expected,null));});
test('activation requires captured payment matching trusted order and fixed price',()=>{const o={order_id:'order_123',plan_type:'1 Year',amount:PLANS['1 Year']};const p={status:'captured',order_id:o.order_id,amount:9900,currency:'INR'};assert.ok(validPayment(p,o));for(const patch of [{status:'authorized'},{amount:1},{currency:'USD'},{order_id:'other'}])assert.ok(!validPayment({...p,...patch},o));assert.ok(!validPayment({...p,amount:1},{...o,amount:1}));});
