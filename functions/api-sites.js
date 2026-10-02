// CF Pages Function: /api-sites
// 功能：校验前端传入的密码哈希后，从 KV 返回 API 站点列表
// 部署：放置在项目根目录 functions/ 目录下，CF Pages 自动识别为 /api-sites 路由
// 依赖：需在 CF Pages 项目绑定 KV Namespace，变量名为 API_CONFIG

// SHA-256 计算（CF Pages 运行时支持 Web Crypto API）
async function sha256Hex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store'
        }
    });
}

export async function onRequestGet(context) {
    const { request, env } = context;

    try {
        // 1. 读取环境变量中的密码（明文，CF Pages 环境变量 PASSWORD）
        const password = env && env.PASSWORD;
        if (!password) {
            return jsonResponse({ error: '服务器未配置 PASSWORD 环境变量' }, 500);
        }

        // 2. 从 URL 参数获取前端传入的鉴权信息
        const url = new URL(request.url);
        const authHash = url.searchParams.get('auth');
        const timestamp = url.searchParams.get('t');

        if (!authHash) {
            return jsonResponse({ error: '缺少鉴权参数' }, 401);
        }

        // 3. 计算服务端密码哈希并与传入值比对
        const serverHash = await sha256Hex(password);
        if (authHash !== serverHash) {
            return jsonResponse({ error: '鉴权失败：密钥不匹配' }, 401);
        }

        // 4. 时间戳校验（10分钟有效，与 proxy-auth.js 保持一致）
        if (timestamp && (Date.now() - parseInt(timestamp, 10)) > 10 * 60 * 1000) {
            return jsonResponse({ error: '鉴权已过期，请刷新页面' }, 401);
        }

        // 5. 从 KV 读取 API 站点列表
        //    KV Namespace 变量名需在 CF Pages 设置中绑定为 API_CONFIG
        if (!env || !env.API_CONFIG) {
            return jsonResponse({ error: '服务器未绑定 KV (API_CONFIG)' }, 500);
        }

        let sites;
        try {
            sites = await env.API_CONFIG.get('customer_sites', 'json');
        } catch (kvError) {
            return jsonResponse({ error: 'KV 读取失败: ' + kvError.message }, 500);
        }
        if (!sites) {
            return jsonResponse({ error: 'KV 中未找到 customer_sites 数据' }, 404);
        }

        // 6. 返回 API 列表
        return jsonResponse(sites);
    } catch (err) {
        return jsonResponse({ error: '服务器内部错误: ' + err.message }, 500);
    }
}
