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
        // ���s�u�o�ͮɼW�[�H��
        onlineCount++;
        // �o�e�H�Ƶ�����
        io.emit("online", onlineCount);

        socket.on("greet", () => {
            socket.emit("greet", onlineCount);
        });

        socket.on('disconnect', () => {
            // ���H���u�F�A���H
            onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
            io.emit("online", onlineCount);
        });
        socket.on("send", (msg) => {
            io.emit("msg", msg);
        });
    });
};