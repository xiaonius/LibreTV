const CUSTOMER_SITES = {
    heimuer: {
        api: 'https://json.heimuer.xyz',
        name: '黑木耳',
        detail: 'https://heimuer.tv',
        filterAdRule: '#EXT-X-DISCONTINUITY\\n#EXTINF:\\d+\\.\\d+,\\n.*?\\n#EXT-X-DISCONTINUITY'
    },
    tyyszy: {
        api: 'https://tyyszy.com',
        name: '天涯资源',
    },
    yutu: {
        api: 'https://yutuzy10.com',
        name: '玉兔资源',
        adult: true
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
