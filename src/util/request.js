import axios from 'axios';
import { SERVER_URL, LOCALSTORAGE } from '../config';

const tokenReturn = () => {
  const local = window.localStorage.getItem(LOCALSTORAGE);
  const { token } = JSON.parse(local);
  return token;
};

export const requestAxios = async ({ method = "get", url, data, headers, isConsole = false }) => {
  try {
    const defaultToken = tokenReturn();

    const defaultHeaders = {
      "authorization": defaultToken
    };

    const { data: result } = await axios({
      url: `${SERVER_URL}${url}`,
      method,
      data,
      headers: headers || defaultHeaders,
      timeout: 10000
    });

    if(result && result.message === "expire all") {
      window.localStorage.removeItem(LOCALSTORAGE);
      window.alert("로그인이 만료되었습니다. 다시 로그인하여 주세요.");
      window.location.href = "/#/";
      return false;
    }

    if(!result || !result.result || result.err || result.status === 500) {
      throw new Error(result.message || "API 호출에 실패하였습니다.");
    }

    if(result.token) {
      const token = {
        result: true,
        token: result.token,
      };

      window.localStorage.setItem(LOCALSTORAGE, JSON.stringify(token));
    }

    return {
      response: result,
      result: true,
      status: 200
    };
  } catch(err) {
    isConsole && console.log(err);
    return {
      response: null,
      result: false,
      status: 500,
      message: err.message || err
    };
  }
};