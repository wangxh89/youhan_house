var gm = require('gm');//.subClass({imageMagick: true});
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var untrimmedPath = './public/images/untrimmed';
var trimPath = './public/images/trim/';
var originalPath = './public/images/original/';
var destPath = './public/images/maomao';
var profile = require('./profile');
var nameMap = {};
var fileExt = '.jpg';

fs.readdir(untrimmedPath, function(err, files) {
  if (err) return;

  var promises = [];
  // change chinese name, because imagemagick dose not known
  // 遍历untrimmedPath目录所有的文件，改为临时名称 ，并转换图片
  files.forEach(function(file) {
    if (fs.statSync(path.join(untrimmedPath, file)).isFile()) {
      promises.push(new Promise(function(resolve, reject) {
        changeTempName(file, function(fileName) {
          convertImage(fileName, destPath, resolve);
        });
      }));
    }
  });
  //全部转换完毕后，刷新profile文件
  Promise.all(promises).then(function(data) {
    profile.refreshProfile(data);
  })
});

/**
 * 将untrimmed 目录中的文件 拷贝到trim 目录（文件名换为hash值）
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function changeTempName(filePath, callback) {
  var fileName = path.basename(filePath, fileExt.toUpperCase());
  var hashName = crypto.createHash('md5').update(fileName).digest('hex');
  nameMap[hashName] = fileName.substring(fileName.indexOf(' ') + 1);

  var rs = fs.createReadStream(path.join(untrimmedPath, filePath));
  rs.pipe(fs.createWriteStream(path.join(trimPath, hashName + fileExt)));
  rs.on('end', function() {
    callback(hashName);
  });
}

/**
 * 转换文件
 * @param  {[type]} fileName [description]
 * @param  {[type]} destPath [description]
 * @param  {[type]} resolve  [description]
 * @return {[type]}          [description]
 */
function convertImage(fileName, destPath, resolve) {
  var filePath = path.join(trimPath, fileName + fileExt);

  //读取trim目录中元数据信息
  gm(filePath).identify(function(err, metadata) {
    if (err) throw err;

    var originalDate = moment(metadata['Profile-EXIF']['Date Time Original'], 'YYYY:MM:DD HH:mm:ss');
    var newFileName = originalDate.format('YYYYMMDD-HHmmss') + fileExt;

    // copy original image order by dateTimeOriginal
    // 将trim 目录中的文件 拷贝到 original目录（修改文件名为 日期）
    fs.createReadStream(filePath).pipe(
        fs.createWriteStream(path.join(originalPath, newFileName)));

    // resize image  压缩图片
    gm(filePath)   //图片源路径
        .resize(750) //设置压缩后的w/h  设置压缩宽度为750px
        .write(path.join(destPath, newFileName),  function(err, stdout, stderr) {
          if (err) throw err;
          console.log('resized', filePath);
        });

    var data = {};
    data.startDate = originalDate.format('YYYY,M,D');
    data.headline = originalDate.format('M月D号');
    data.text = nameMap[fileName];
    data.asset = {
      media: 'images/maomao/' + newFileName,
      credit: '',
      caption: ''
    };

    resolve(data);
  });
}
