// API站点列表 - 异步从 KV 加载（密钥验证后才能拉取）
// 原 API 明文已迁移至 CF KV，前端不再硬编码，防止爬虫直接抓取 js 文件

/**
 * 从服务端（Pages Function + KV）加载 API 站点列表
 * 请求需携带密码哈希鉴权，未验证密钥则返回 401
 */
async function loadCustomerSites() {
    try {
        // 获取密码哈希（与 password.js 存储格式一致）
        let hash = null;

        // 1. 优先从 password.js 验证后存储的 localStorage 中读取
        const stored = localStorage.getItem('passwordVerified');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                hash = parsed.passwordHash;
            } catch (e) { /* ignore */ }
        }

        // 2. 降级：读取 proxyAuthHash（proxy-auth.js 缓存的哈希）
        if (!hash) {
            hash = localStorage.getItem('proxyAuthHash');
        }

        // 3. 降级：读取环境变量注入的 PASSWORD 哈希
        if (!hash && window.__ENV__ && window.__ENV__.PASSWORD) {
            hash = window.__ENV__.PASSWORD;
        }

        // 4. 降级：调用 proxy-auth.js 的 getPasswordHash
        if (!hash && window.ProxyAuth && window.ProxyAuth.getPasswordHash) {
            hash = await window.ProxyAuth.getPasswordHash();
        }

        if (!hash) {
            console.warn('[API列表] 未获取到密码哈希，跳过加载');
            return;
        }

        // 时间戳防重放（10分钟有效，与服务端一致）
        const timestamp = Date.now();
        const url = `/api-sites?auth=${encodeURIComponent(hash)}&t=${timestamp}`;

        const res = await fetch(url);
        if (!res.ok) {
            console.error('[API列表] 加载失败，状态码:', res.status);
            if (res.status === 401) {
                console.error('[API列表] 鉴权失败，请检查密钥是否正确');
            }
            return;
        }

        const sites = await res.json();
        if (sites && window.extendAPISites) {
            window.extendAPISites(sites);
            // 派发加载完成事件，供其他模块监听
            document.dispatchEvent(new CustomEvent('apiSitesLoaded'));
            console.log('[API列表] 已从 KV 加载', Object.keys(sites).length, '个站点');
        }
    } catch (error) {
        console.error('[API列表] 加载异常:', error);
    }
}

// 暴露到全局
window.loadCustomerSites = loadCustomerSites;
