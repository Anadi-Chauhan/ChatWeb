// pages/api/getZegoToken.js
import { NextApiRequest, NextApiResponse } from 'next';
const { ZEGOCLOUD_APP_ID, ZEGOCLOUD_APP_SIGN } = process.env;
const { ZegoToken } = require('@zegocloud/zego-uikit-prebuilt');

export default async function handler(req, res) {
  const { roomID, userID, userName } = req.query;

  if (!roomID || !userID || !userName) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const token = ZegoToken.generateTokenForTest(
      ZEGOCLOUD_APP_ID,
      ZEGOCLOUD_APP_SIGN,
      roomID,
      userID,
      userName,
      ZegoToken.ROLE.ANCHOR, // Choose role based on your requirement
      3600 // Token expiration time in seconds
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
