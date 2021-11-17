const sUser = require('../models/user');
const mUser = require('../models/message');
module.exports = function (io) {

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('addUser', (nameUser) => {
      let res = 0;
      var i = 0;
      sUser.find().then(data => {
        for (i; i < data.length; i++) {
          if (data[i].pseudo === nameUser) {
            res = 1;
          }
        }
        //si user existe
        if (res == 1) {
          io.emit('exist', nameUser);
          socket.nameUser = nameUser;

        } else {

          const user = new sUser({
            timestamp: new Date(),
            sessionid: socket.id,
            pseudo: nameUser
          });
          user.save().then(() => {
            sUser.count({}, function (err, count) {
              console.log("Number of users: ", count);
              io.emit('exist', nameUser);
              io.emit('nbUser', count);
              socket.nameUser = nameUser;

            });
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    });


    socket.on('addMessage', (messageUser) => {
      // console.log(socket.nameUser)
      const message = new mUser({
        timestamp: new Date(),
        sessionid: socket.id,
        pseudo: socket.nameUser,
        message: messageUser,
      });
      message.save().then(data => {
        io.emit('newMessage', data);
      })

    });

    socket.on('getAllMessage', () => {
      mUser.find().then(data => {
        io.emit('receiveAllData', data);
      })
    })
    // socket.on('getOwnMsg',()=>{
    //   mUser.aggregate()
    // })
  })
}