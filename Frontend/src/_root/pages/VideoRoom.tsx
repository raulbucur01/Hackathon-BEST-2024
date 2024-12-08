import React, { useEffect, useRef } from "react";
import { connect, Room } from "twilio-video";

interface VideoRoomProps {
  token: string;
  roomName: string;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ token, roomName }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    const setupVideoRoom = async () => {
      const room = await connect(token, { name: roomName });
      roomRef.current = room;

      room.localParticipant.tracks.forEach((publication) => {
        if (publication.track.kind === "video" || publication.track.kind === "audio") {
          videoRef.current?.appendChild(publication.track.attach());
        }
      });

      room.on("participantConnected", (participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track && (publication.track.kind === "video" || publication.track.kind === "audio")) {
            videoRef.current?.appendChild(publication.track.attach());
          }
        });
      });
    };

    setupVideoRoom();

    return () => {
      roomRef.current?.disconnect();
    };
  }, [token, roomName]);

  return <div ref={videoRef} className="video-room"></div>;
};

export default VideoRoom;
