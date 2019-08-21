// 使用通用配置型路由
// 很大一部分网站是可以通过一个配置范式来生成 RSS 的。
// 通用配置即通过 cherrio（CSS 选择器、jQuery 函数）读取 json 数据来简便的生成 RSS。

// 首先我们需要几个数据：

// RSS 来源链接
// 数据来源链接
// RSS 标题（非 item 标题）
const buildData = require('@/utils/common-config');
module.exports = async (ctx) => {
    ctx.state.data = await buildData({
        link: RSS来源链接,
        url: 数据来源链接,
        title: '%title%', //这里使用了变量，形如 **%xxx%** 这样的会被解析为变量，值为 **params** 下的同名值
        params: {
            title: RSS标题,
        },
    });
};
// 至此，我们的 RSS 还没有任何内容，内容需要由item完成 下面为一个实例

const buildData = require('@/utils/common-config');

module.exports = async (ctx) => {
    const link = `https://www.uraaka-joshi.com/`;
    ctx.state.data = await buildData({
        link,
        url: link,
        title: `%title%`,
        params: {
            title: '裏垢女子まとめ',
        },
        item: {
            item: '.content-main .stream .stream-item',
            title: `$('.post-account-group').text() + ' - %title%'`, //只支持$().xxx()这样的js语句，也足够使用
            link: `$('.post-account-group').attr('href')`, //.text()代表获取元素的文本，attr()表示获取指定属性
            description: `$('.post .context').html()`, // .html()代表获取元素的html代码
            pubDate: `new Date($('.post-time').attr('datetime')).toUTCString()`, // 日期的格式多种多样，可以尝试使用**/utils/date**
            guid: `new Date($('.post-time').attr('datetime')).getTime()`, // guid必须唯一，这是RSS的不同item的标志
        },
    });
};
// 至此我们完成了一个最简单的路由

