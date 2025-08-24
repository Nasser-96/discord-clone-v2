import { Injectable } from '@nestjs/common';
import { UserDataType } from '../auth/types';
import { AccessToken } from 'livekit-server-sdk';
import ReturnResponse from 'src/helper/returnResponse';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_SECRET_KEY;
const liveKitUrl = process.env.LIVEKIT_URL;

@Injectable()
export class LiveKitService {
  async create(channelId: string, user: UserDataType) {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.username,
    });
    at.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });
    const token = await at.toJwt();
    return ReturnResponse({
      is_successful: true,
      response: {
        token: token,
      },
    });
  }
}
