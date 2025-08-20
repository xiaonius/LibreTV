const CUSTOMER_SITES = {
    heimuer: {
        api: 'https://json.heimuer.xyz',
        name: '黑木耳',
        detail: 'https://heimuer.tv',
        filterAdRule: '#EXT-X-DISCONTINUITY\\n#EXTINF:\\d+\\.\\d+,\\n.*?\\n#EXT-X-DISCONTINUITY'
    },
    ffzy: {
        api: 'http://ffzy5.tv',
        name: '非凡影视',
        detail: 'http://ffzy5.tv',
        filterAdRule: '#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.666667,[\\s\\S]*?#EXT-X-DISCONTINUITY'
    },
    tyyszy: {
        api: 'https://tyyszy.com',
        name: '天涯资源',
    },
    ckzy: {
        api: 'https://www.ckzy1.com',
        name: 'CK资源',
        adult: true
    },
    zy360: {
        api: 'https://360zy.com',
        name: '360资源',
    },
    wolong: {
        api: 'https://wolongzyw.com',
        name: '卧龙资源',
    },
    cjhw: {
        api: 'https://cjhwba.com',
        name: '新华为',
    },
    hwba: {
        api: 'https://cjwba.com',
        name: '华为吧资源',
    },
    jisu: {
        api: 'https://jszyapi.com',
        name: '极速资源',
        detail: 'https://jszyapi.com'
    },
    dbzy: {
        api: 'https://dbzy.com',
        name: '豆瓣资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com',
        name: '暴风资源',
    },
    mozhua: {
        api: 'https://mozhuazy.com',
        name: '魔爪资源',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com',
        name: '魔都资源',
    },
    ruyi: {
        api: 'https://cj.rycjapi.com',
        name: '如意资源',
    },
    jkun: {
        api: 'https://jkunzyapi.com',
        name: 'jkun资源',
        adult: true
    },
    bwzy: {
        api: 'https://api.bwzym3u8.com',
        name: '百万资源',
        adult: true
    },
    souav: {
        api: 'https://api.souavzy.vip',
        name: 'souav资源',
        adult: true
    },
    r155: {
        api: 'https://155api.com',
        name: '155资源',
        adult: true
    },
    lsb: {
        api: 'https://apilsbzy1.com',
        name: 'lsb资源',
        adult: true
    },
    huangcang: {
        api: 'https://hsckzy.vip',
        name: '黄色仓库',
        adult: true,
        detail: 'https://hsckzy.vip'
    },
    zuid: {
        api: 'https://api.zuidapi.com',
        name: '最大资源'
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
