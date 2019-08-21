const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({  // 发起 HTTP GET 请求
        method: 'get',
        url: 'https://www.douban.com/explore',
    });

    const data = response.data;  // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = cheerio.load(data);  // 使用 cheerio 加载返回的 HTML
    const list = $('div[data-item_id]');
    let itemPicUrl;

    // 使用 cheerio 选择器，选择 class="list-item" 的所有元素，返回 cheerio node 对象数组

    // 注：每一个 cheerio node 对应一个 HTML DOM
    // 注：cheerio 选择器与 jquery 选择器几乎相同
    // 参考 cheerio 文档：https://cheerio.js.org/


    ctx.state.data = {
        title: '豆瓣-浏览发现',
        link: 'https://www.douban.com/explore',
        item:
            list &&
            list
                .map((index, item) => {  //使用 map 遍历数组，解析出每一个 item 的结果
                    item = $(item);
                    itemPicUrl = `${item.find('a.cover').attr('style')}`.replace('background-image:url(', '').replace(')', '');
                    return {
                        title: item
                            .find('.title a')
                            .first()
                            .text(),
                        description: `作者：${item
                            .find('.usr-pic a')
                            .last()
                            .text()}<br>描述：${item.find('.content p').text()}<br><img referrerpolicy="no-referrer" src="${itemPicUrl}">`,
                        link: item.find('.title a').attr('href'),
                    };
                })
                .get(),
    };
};

// 至此本路由结束