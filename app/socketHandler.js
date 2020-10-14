module.exports = function(io, streams) {
    let onlineCount = 0;
    io.on('connection', function (client) {
        console.log('-- ' + client.id + ' joined --');
        client.emit('id', client.id);

    client.on('message', function (details) {
      var otherClient = io.sockets.connected[details.to];

      if (!otherClient) {
        return;
      }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      
      streams.addStream(client.id, options.name); 
    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });

    io.on('connection', (socket) => {
        // 有連線發生時增加人數
        onlineCount++;
        // 發送人數給網頁
        io.emit("online", onlineCount);

        socket.on("greet", () => {
            socket.emit("greet", onlineCount);
        });

        socket.on('disconnect', () => {
            // 有人離線了，扣人
            onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
            io.emit("online", onlineCount);
        });
        socket.on("send", (msg) => {
            io.emit("msg", msg);
        });
    });
};