import { next } from '@vercel/edge';

export const config = {
  // 限制所有路徑，確保整個系統都被保護
  matcher: '/:path*',
};

export default function middleware(req) {
  // 1. 獲取訪客的真實 IP
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip;

  // 2. 允許訪問的 IP 清單 (白名單)
  // 請在這裡填入所有你允許的 IP 地址
  // 你可以去 Google 搜尋 "What is my IP" 來查看你目前的地址
  const allowedIps = [
    '162.120.184.42', // 範例：你家的 IP
    '114.34.56.78',    // 範例：你公司的 IP
    '210.61.12.34',    // 你可以無限增加，記得用逗號隔開
  ];

  // 3. 檢查訪客 IP 是否在名單內
  if (allowedIps.includes(ip)) {
    return next();
  }

  // 4. 如果不在名單內，回傳 403 禁止訪問
  return new Response(`⚠️ 存取被拒絕。您的 IP (${ip}) 未經授權。`, {
    status: 403,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
