'use strict';

const fs = require('hexo-fs');

function lazyProcess(htmlContent) {
  const sourceImgKey = 'data-original';
  const imgRegExp = /<img(\s*?)src="(.*?)"(.*?)>/gi;
  let defaultImagePath = __dirname + '/default-image.json';
  let loadingImage = this.config.lazyload.loadingImg;

  if (!loadingImage) {
    loadingImage = JSON.parse(fs.readFileSync(defaultImagePath)).default;
  }

  return htmlContent.replace(/<img(\s*?)src="(.*?)"(.*?)>/gi, function (str, p1, p2) {
    // might be duplicate
    if (/data-original/gi.test(str)) {
      return str;
    }
    if (str.indexOf('noloading') > -1) {
      return str
    }
    let smallImg = loadingImage
    if (p2.indexOf('sinaimg') > -1) {
      smallImg = p2.replace('large', 'small')
    }
    if (p2.indexOf('static.tellyouwhat.cn') > -1) {
      smallImg = p2 + '?imageView2/2/h/220/w/300'
    }
    return str.replace(p2, smallImg + '" data-original="' + p2);
  });
}

module.exports.processPost = function (data) {
  data.content = lazyProcess.call(this, data.content);
  return data;
};
module.exports.processSite = function (htmlContent) {
  return lazyProcess.call(this, htmlContent);
};

