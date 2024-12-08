import { jwt } from "twilio";

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export const generateTwilioToken = ({
  accountSid,
  apiKey,
  apiSecret,
  roomName,
  identity,
}: {
  accountSid: string;
  apiKey: string;
  apiSecret: string;
  roomName: string;
  identity: string;
}) => {
  // Create a new Access Token with the required 'identity' field in options
  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity, // Provide the identity here
    ttl: 3600, // Optional: Set token expiration to 3600 seconds (1 hour)
  });

  // Add a Video Grant for a specific room
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  // Return the JWT token as a string
  return token.toJwt();
};
