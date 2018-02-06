/*
  爬虫源码：全站爬取雷锋网的文章
  开发语言：原生JavaScript
  开发教程：http://docs.shenjian.io/develop/crawler/doc/concept/crawler.html
  请在神箭手云上运行代码：http://docs.shenjian.io/overview/guide/develop/crawler.html
*/
var configs = {
    domains: ["leiphone.com"],// 网站域名，设置域名后只会处理这些域名下的网页
    scanUrls: ["https://www.leiphone.com/search?s=vr&site=article"],// 入口页url，分别从这些网页开始爬取。爬虫默认会自动发现并爬取新网页
    contentUrlRegexes: [
        /https:\/\/www\.leiphone\.com\/news\/\d+\/.+\.html/
    ],// 内容页url的正则，符合这些正则的页面会被当作内容页处理
    helperUrlRegexes: [
        /https:\/\/www\.leiphone\.com\/search\?s=vr&site=article(&page=\d+)?/
    ],// 列表页url的正则，符合这些正则的页面会被当作列表页处理
    fields: [
        {
            // 抽取内容页的文章标题。默认抽取方式是xpath，也支持json和正则
            name: "article_title",
            selector: "//h1[contains(@class,'headTit')]",
            required: true  // required为true表示该项数据不能为空
        },
        {
            // 抽取内容页的文章内容
            name: "article_content",
            selector: "//div[contains(@class,'lph-article-comView')]",
            required: true
        },
        {
            // 抽取内容页的文章发布日期
            name: "article_publish_time",
            selector: "//td[contains(@class,'time')]",
            required: true
        },
        {
            // 抽取内容页的文章作者
            name: "article_author",
            selector: "//td[contains(@class,'aut')]/a",
            required: true
        }
    ]
};
 
/*
  回调函数afterExtractField：对抽取出来的数据进行处理
*/
configs.afterExtractField = function(fieldName, data, page, site) {
    if (fieldName == "article_publish_time") {
        var timestamp = Date.parse(data);
        return isNaN(timestamp) ? 0 : parseInt(timestamp/1000);// 抽取的发布日期转换成时间戳
      // 使用神箭手发布数据到CMS网站时，CMS网站默认处理的时间戳是10位。所以如非特殊，请转换成10位时间戳
    }
    return data;
};
 
// 使用以上配置创建一个爬虫对象
var crawler = new Crawler(configs);
// 启动该爬虫
crawler.start();
