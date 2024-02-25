import { io } from "socket.io-client";

const token = localStorage.getItem('token');

let opts = {};
if(token) {
  opts = {
    extraHeaders: {
      Authorization: token,
    }
  };
}
const newSocket = (namespace: string) => io("http://localhost:4001/"+namespace, opts);

export default newSocket;