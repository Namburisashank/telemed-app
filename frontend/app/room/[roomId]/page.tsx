"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";

export default function RoomPage() {
  const { roomId } = useParams();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  
  // --- Chat State ---
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [userName, setUserName] = useState("User"); 

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" },
    ],
  };

  useEffect(() => {
    // Get user name from local storage for chat
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.full_name) setUserName(user.full_name);

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const pc = new RTCPeerConnection(iceServers);
    setPeerConnection(pc);

    // --- WEBRTC LOGIC ---
    pc.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        newSocket.emit("ice-candidate", {
          target: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      })
      .catch((err) => console.error("Camera Error:", err));

    // --- SOCKET EVENTS ---
    newSocket.emit("join-room", roomId, newSocket.id);

    newSocket.on("user-connected", async (userId) => {
      setRemoteSocketId(userId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      newSocket.emit("offer", { target: userId, caller: newSocket.id, sdp: offer });
    });

    newSocket.on("offer", async (payload) => {
      setRemoteSocketId(payload.caller);
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      newSocket.emit("answer", { target: payload.caller, caller: newSocket.id, sdp: answer });
    });

    newSocket.on("answer", async (payload) => {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    });

    newSocket.on("ice-candidate", async (candidate) => {
      try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
    });

    // --- NEW: Receive Chat Message ---
    newSocket.on("receive-message", (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
      pc.close();
    };
  }, [roomId, remoteSocketId]);

  // --- Send Message Function ---
  const sendMessage = () => {
    if (message.trim() && socket) {
      const msgData = { roomId, message, senderName: "Me" }; // Show "Me" locally
      
      // 1. Send to Server (so other person sees it)
      socket.emit("send-message", { roomId, message, senderName: userName });
      
      // 2. Add to my own screen immediately
      setChatHistory((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      
      {/* LEFT: Video Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">Room: {roomId}</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="relative">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-[400px] bg-black rounded border-2 border-blue-500 transform scale-x-[-1]" />
            <p className="absolute bottom-2 left-2 bg-black/50 px-2 rounded text-sm">You</p>
          </div>
          <div className="relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-[400px] bg-black rounded border-2 border-green-500" />
            <p className="absolute bottom-2 left-2 bg-black/50 px-2 rounded text-sm">Doctor</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 font-bold bg-gray-700">Chat 💬</div>
        
        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.senderName === "Me" ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-400">{msg.senderName}</span>
              <span className={`px-3 py-2 rounded max-w-[90%] text-sm ${msg.senderName === "Me" ? "bg-blue-600" : "bg-gray-600"}`}>
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..." 
              className="flex-1 bg-gray-700 border-none rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-sm font-bold"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}