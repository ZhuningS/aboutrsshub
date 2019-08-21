// 由于此方法性能较差且消耗较多资源，使用前请确保以上两种方法无法获取数据，不然将导致您的 pull requests 被拒绝！
const got = require('@/utils/got');
// 部分网站没有接口供调用，且页面有加密 样例：/lib/routes/sspai/series.js

// 使用 RSSHub 提供的 puppeteer 工具类，初始化 Chrome 进程
const browser = await require('@/utils/puppeteer')();
// 创建一个新的浏览器页面
const page = await browser.newPage();
// 访问指定的链接
const link = 'https://sspai.com/series';
await page.goto(link);
// 渲染目标网页
const html = await page.evaluate(
    () =>
        // 选取渲染后的 HTML
        document.querySelector('div.new-series-wrapper').innerHTML
);
// 关闭浏览器进程
browser.close();
// 使用 cheerio 解析返回的 HTML:

const $ = cheerio.load(html); // 使用 cheerio 加载返回的 HTML
const list = $('div.item'); // 使用 cheerio 选择器，选择所有 <div class="item"> 元素，返回 cheerio node 对象数组
// 赋值给 ctx.state.data

ctx.state.data = {
    title: '少数派 -- 最新上架付费专栏',
    link,
    description: '少数派 -- 最新上架付费专栏',
    item: list
        .map((i, item) => ({
            // 文章标题
            title: $(item)
                .find('.item-title a')
                .text()
                .trim(),
            // 文章链接
            link: url.resolve(
                link,
                $(item)
                    .find('.item-title a')
                    .attr('href')
            ),
            // 文章作者
            author: $(item)
                .find('.item-author')
                .text()
                .trim(),
        }))
        .get(), // cheerio get() 方法将 cheerio node 对象数组转换为 node 对象数组
};

// 至此本路由结束

