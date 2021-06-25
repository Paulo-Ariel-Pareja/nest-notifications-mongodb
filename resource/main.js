const app = new Vue({
  el: '#app',
  data: {
    title: 'NestJS Chat Real Time',
    name: '',
    text: '',
    selected: 'paulo',
    messages: [],
    socket: null,
    activeRoom: '',
    rooms: {
      general: false,
      roomA: false,
      roomB: false,
      roomC: false,
      roomD: false,
    },
    listRooms: [
      "paulo",
      "ariel",
      "roomB",
      "roomC",
      "roomD"
    ]
  },
  methods: {
    onChange(event) {
      this.socket.emit('leaveRoom', this.activeRoom);
      this.activeRoom = event.target.value;
      this.socket.emit('joinRoom', this.activeRoom);
    },

    sendMessage() {
      if(this.validateInput()) {
        const message = {
          uuid: this.activeRoom,
          messages: [{message: this.text}],
        };
        this.socket.emit('msgToServer', message);
        this.text = '';
      }
    },
    receivedMessage(message) {
      const mensajes=[];
       message.messages.forEach(element => {
        mensajes.push(element.message)
      });
      this.messages= mensajes;
      console.log('*******>');
      console.log(this.messages);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0
    },
    check() {
      if (this.isMemberOfActiveRoom) {
        this.socket.emit('leaveRoom', this.activeRoom);
      } else {
        this.socket.emit('joinRoom', this.activeRoom);
        const message = {
          uuid: this.activeRoom
        };
        this.socket.emit('msgToServer', message);
      }
    }
  },
  computed: {
    isMemberOfActiveRoom() {
      return this.rooms[this.activeRoom];
    }
  },
  created() {
    this.activeRoom = this.selected;
    this.socket = io('http://localhost:3500/realtime');
    this.socket.on('msgToClient', (message) => {
      this.receivedMessage(message)
    });

    this.socket.on('connect', () => {
      this.check();
    });

    this.socket.on('joinedRoom', (room) => {
      this.rooms[room] = true;
    });

    this.socket.on('leftRoomServer', (room) => {
      this.rooms[room] = false;
    });
  }
});
