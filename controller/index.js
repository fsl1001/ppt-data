var views = require('co-views');
var path = require('path');

var render = views(path.join(__dirname, '../view/'), {
  ext: 'jade',
  cache: true
});
module.exports = {
    index: function*(){
        var a = 123;
        console.log('fsl-test');
        this.body = yield render('index',{"title":`koa demo${a}`});
    },
    webgl: function*(){

        this.body = yield render('webgl',{});
    }
}