// import wx from "nodejs-websocket";
let ws = require('nodejs-websocket');

// 不只有一个客户端连接
var clientCount = 0;

var connections = []; //进来的人

var onlines = []; // 在线人员的表

Array.prototype.contains = function (element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) {
      return true;
    }
  }
  return false;
}

Array.prototype.remove = function (val) {
  for (var i = 0; i < this.length; i++) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
};


console.log('start!');
var server = ws.createServer((conn)=>{
  var newObj;
  conn.on('text',(str)=>{
    console.log(`收到的信息是：${str}`);
    // conn.sendText(str);
    newObj = JSON.parse(str);


    // console.log(typeof newObj, newObj.user, onlines.contains(newObj.user))
    if (!onlines.contains(newObj.user)){
      onlines.push(newObj.user);
    }
    // newObj.bgc =  Math.random().toString(16).substr(3, 6)
    broadcast(JSON.stringify(newObj))

    console.log('onlines', onlines);
  })

  conn.on('close',(code,reason)=>{
    console.log(`关闭连接：${code}-${reason}`)
    console.log(newObj, typeof newObj, 'newObj--', newObj && newObj != 'undefined' && newObj.user + '离开了' || '')
    
    if(newObj && newObj != 'undefined'){

      newObj.info = newObj.user + '离开了' || '';
      newObj.type = 'leave';
      // 离开群组或者离开单聊的时候，要把状态清空
      onlines.remove(newObj.user);
      connections.remove(newObj.user);
      broadcast(JSON.stringify(newObj))
    }


  })

  conn.on('error', (code, reason) => {
    console.log(`异常关闭:${code}-${reason}`)
  })
}).listen(8088)
console.log('WebSocket建立完毕');


function broadcast(str) {
  console.log('str', str);
  // 取到server下面的所有连接
  server.connections.forEach(function (connection) {
    connection.sendText(str);
  })
}