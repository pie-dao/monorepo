// Create a REST API base query for Strapi using next routes API
import ky from 'ky-universal';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseList } from '../../types/cmsTypes';
import util from 'util';

function getStrapiURL(path = '') {
  return `${
    process.env.NEXT_PUBLIC_CMS_ENDPOINT || 'http://localhost:1337'
  }${path}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.NEXT_BEARER_TOKEN,
    },
  };
  const requestUrl = `${getStrapiURL(req.url)}`;
  // Trigger API call
  const response = await ky(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    res.status(response.status);
  }
  const parsedData = await response.json();
  if (Array.isArray(req.query.path)) {
    try {
      ResponseList[req.query.path[0]].parse(parsedData);
      return res.status(200).send(parsedData);
    } catch (e) {
      console.log(util.inspect(e, false, null, true /* enable colors */));
      return res.status(500).send(e);
    }
  } else {
    try {
      ResponseList[req.query.path].parse(parsedData);
      return res.status(200).send(parsedData);
    } catch (e) {
      console.log(util.inspect(e, false, null, true /* enable colors */));
      return res.status(500).send(e);
    }
  }
}
