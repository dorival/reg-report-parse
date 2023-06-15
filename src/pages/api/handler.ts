import { NextApiRequest, NextApiResponse } from 'next';
import https from "https";
 
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({})
  }

  const payload = {
    "value1" : request.body.match(urlRegex)[0] ?? 'NO_FILE',
  }

  const options = {
    host: 'maker.ifttt.com',
    port: '443',
    path: `/trigger/report_url/with/key/${process.env.ITTT_WEBHOOK}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(payload).length
    },
  };

  console.log(options, payload);
  const outgoing = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log(`STATUS: ${res.statusCode} - ${body}`);
    })
  });

  outgoing.write(JSON.stringify(payload));
  outgoing.end();

  response.status(200).json({ status: 'success' });
}