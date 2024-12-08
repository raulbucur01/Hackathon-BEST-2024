import React, { useEffect, useRef } from "react";
import { connect, Room, RemoteParticipant, LocalParticipant } from "twilio-video";

interface VideoRoomProps {
  token: string;
  roomName: string;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ token, roomName }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);

  const attachTrack = (track: any, container: HTMLDivElement) => {
    const trackElement = track.attach();
    trackElement.className = "rounded-lg shadow-lg";
    container.appendChild(trackElement);
  };

  const attachParticipantTracks = (participant: RemoteParticipant | LocalParticipant, container: HTMLDivElement) => {
    participant.tracks.forEach((publication) => {
      if (publication.track && (publication.track.kind === "video" || publication.track.kind === "audio")) {
        attachTrack(publication.track, container);
      }
    });

    participant.on("trackSubscribed", (track) => {
      if (track.kind === "video" || track.kind === "audio") {
        attachTrack(track, container);
      }
    });

    participant.on("trackUnsubscribed", (track) => {
      if (track.kind === "video" || track.kind === "audio") {
        track.detach().forEach((element: { remove: () => any; }) => element.remove());
      }
    });
  };

  useEffect(() => {
    const setupVideoRoom = async () => {
      try {
        const room = await connect(token, { name: roomName });
        roomRef.current = room;

        // Attach local participant's tracks
        attachParticipantTracks(room.localParticipant, videoContainerRef.current!);

        // Attach remote participants' tracks when they connect
        room.participants.forEach((participant) => {
          console.log(`Existing participant connected: ${participant.identity}`);
          attachParticipantTracks(participant, videoContainerRef.current!);
        });

        room.on("participantConnected", (participant) => {
          console.log(`Participant connected: ${participant.identity}`);
          attachParticipantTracks(participant, videoContainerRef.current!);
        });

        room.on("participantDisconnected", (participant) => {
          console.log(`Participant disconnected: ${participant.identity}`);
          participant.tracks.forEach((publication) => {
            if (publication.track && (publication.track.kind === "video" || publication.track.kind === "audio")) {
              publication.track.detach().forEach((element) => element.remove());
            }
          });
        });
      } catch (error) {
        console.error("Error setting up Twilio Video Room:", error);
      }
    };

    setupVideoRoom();

    return () => {
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, [token, roomName]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 flex items-center justify-between shadow-md">
        <h1 className="text-lg font-semibold">Video Room: {roomName}</h1>
        <button
          onClick={() => roomRef.current?.disconnect()}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition"
        >
          Leave Room
        </button>
      </header>
      <main className="flex-1 flex justify-center items-center">
        <div
          ref={videoContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl p-6"
        ></div>
      </main>
    </div>
  );
};

export default VideoRoom;
