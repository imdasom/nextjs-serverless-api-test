import {NextApiRequest, NextApiResponse} from "next";

const TIME_LIMIT = 1000 * 60 * 2;
const tokenMap: { [key: string]: number } = {};

type CheckTokenResponse = {
  result: boolean;
  reason:
    | 'SUCCESS'
    | 'TOKEN_EXPIRED'
    | 'WRONG_TOKEN'
    | 'REQUIRED_FIELD_IS_NULL'
    | 'ERROR';
};


export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const key = req.query.key as string;
  const authToken = req.query.token as string;
  const realAuthToken = tokenMap[key];

  if (req.method === 'GET') {
    if (!key) {
      res.status(400);
      res.json('REQUIRED_FIELD_IS_NULL');
      return;
    }

    if (!tokenMap[key]) {
      const authToken = getRandomNumber(100000, 999999);
      tokenMap[key] = authToken;
      console.log('tokenMap',tokenMap);
      setTimeout(() => {
        delete tokenMap[key];
      }, TIME_LIMIT);
    }

    res.json(tokenMap[key]);
    return;
  }

  if (req.method === 'POST') {
    const result: CheckTokenResponse = {
      result: false,
      reason: 'ERROR',
    };

    if (!realAuthToken) {
      result.result = false;
      result.reason = 'TOKEN_EXPIRED';
    } else {
      if (realAuthToken && key && authToken) {
        const valid = tokenMap[key] === Number(authToken);
        result.result = valid;
        result.reason = valid ? 'SUCCESS' : 'WRONG_TOKEN';
      } else {
        result.result = false;
        result.reason = 'REQUIRED_FIELD_IS_NULL';
      }
    }

    res.json(result);
    return;
  }

  res.status(400);
  res.json('METHOD_NOT_SUPPORT');
};

export default handler;
