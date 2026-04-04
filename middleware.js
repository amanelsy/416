import { next } from '@vercel/edge';

export const config = {
  // 限制所有路徑
  matcher: '/:path*',
};

export default function middleware(req) {
  // 獲取訪客的真實 IP
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip;

  // 這裡填入你允許訪問的 IP 地址
  // 你可以去 Google 搜尋 "What is my IP" 來查看你目前的地址
  const allowedIps = ['123.123.123.123', '1.1.1.1']; 

  if (allowedIps.includes(ip)) {
    return next();
  }

  // 如果 IP 不符合，回傳「禁止訪問」的訊息
  return new Response('對不起，您的 IP 位址 (' + ip + ') 未經授權，無法訪問此系統。', {
    status: 403,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
