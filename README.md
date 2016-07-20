毛毛的成长记录
================

本项目提交的内容，会自动同步到keroku  https://youhan.herokuapp.com/

使用：

将原始图片保存到/public/images/untrimmed目录

npm run build

1. image.js 会读取 /public/images/untrimmed目录下文件  

2. 将untrimmed 目录中的文件 拷贝到trim 目录（文件名换为hash值）

3. 对trim目录中的文件  进行读取日期，进行文件重命名，复制到/public/images/original。

   然后进行压缩（压缩宽度为750px）以方便在网络上查看，  

   将压缩后的版本复制到/public/images/maomao目录中

4、profile.js 刷新profile文件/public/javascripts/profile.json

5、clean.js进行清理操作 将untrimmed、trim目录的文件进行清空


npm start 在本地运行   http://127.0.0.1:5000/

注意：

1. 通过 GM 压缩照片  GraphicsMagick-1.3.21-Q8-win64-dll.exe

2. 目前只是获取照片的拍摄时间  ，在资源管理中查看文件有无“拍摄日期”  没有的话需要手动填写一下

3. 计划加入新的功能  能读取照片中的备注信息  填写在profile中的 text 字段中


