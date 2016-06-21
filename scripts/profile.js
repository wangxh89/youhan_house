/**
 * Created by huangxinghui on 2016/1/25.
 */

var fs = require('fs');
var path = require('path');
var profilePath = path.resolve(__dirname, '../public/javascripts/profile.json');
var profile = require(profilePath);
/**
 * 刷新profile文件
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function refreshProfile(data) {
  var result = profile.timeline.date.concat(data);

  result = result.sort(function(a, b) {
    if (a.asset.media > b.asset.media) {
      return 1;
    }

    return -1;
  });

  profile.timeline.date = result;

  fs.writeFile(profilePath, JSON.stringify(profile,null,4), function(err) {
    if (err) console.error(err);

    console.log('Profile refresh success.');
  })
}

//refreshProfile();

module.exports = {
  refreshProfile: refreshProfile
};