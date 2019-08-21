//RSSHub/lib/routes/bilibili/coin.js

const got = require('@/utils/got');
const cache = require('./cache');

module.exports = async (ctx) => {
    const uid = ctx.params.uid;

    const name = await cache.getUsernameFromUID(ctx, uid);

    // 发起 HTTP GET 请求
    const response = await got({
        method: 'get',
        url: `https://api.bilibili.com/x/space/coin/video?vmid=${uid}&jsonp=jsonp`,
        headers: {
            Referer: `https://space.bilibili.com/${uid}/`,
        },
    });
    const data = response.data.data;// response.data 为 HTTP GET 请求返回的数据对象
    // 这个对象中包含了数组名为 data，所以 response.data.data 则为需要的数据

    ctx.state.data = {
        title: `${name} 的 bilibili 投币视频`,
        link: `https://space.bilibili.com/${uid}`,
        description: `${name} 的 bilibili 投币视频`,
        item: data.map((item) => ({       //遍历此前获取的数据
            title: item.title,
            description: `${item.desc}<br><img referrerpolicy="no-referrer" src="${item.pic}">`,
            pubDate: new Date(item.time * 1000).toUTCString(),
            link: `https://www.bilibili.com/video/av${item.aid}`,
        })),
    };
};

// 至此本路由结束