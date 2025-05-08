// import axios from "axios";
import fetchJsonp from "fetch-jsonp";
import CryptoJS from 'crypto-js'; // 需要安装 crypto-js 库

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      title: v.name || v.title,
      artist: v.artist || v.author,
      src: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      pic: v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      title: v.name || v.title,
      artist: v.artist || v.author,
      src: v.url,
      pic: v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};
// 获取一言数据
export const getLove = async () => {
  const params = {
    type: 'text', // 或 'json'，看接口文档写你想要的格式
  };
  const query = new URLSearchParams(params).toString();
  const url = `https://api.lolimi.cn/api/API/du/api.php?${query}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
    });
    const data = await res.text(); // 或 .json() 如果你设置的是 type=json
    console.log("❤️ getLove 成功:", data);
    return data;
  } catch (err) {
    console.error("💥 getLove 失败:", err);
    return '获取失败';
  }
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
  return await res.json();
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
  return await res.json();
};

const operator = 'api';
const method = 'GET';
const uri = '/stars-img/home-wlop-video';
const passwordMd5 = CryptoJS.MD5('BqCiu83lJupOnT68GuhRWSA3Xcsn3kAl').toString();
const date = new Date().toUTCString();
const signatureString = `${method}&${uri}&${date}`;
const signature = CryptoJS.HmacSHA1(signatureString, passwordMd5).toString(CryptoJS.enc.Base64);
const authorization = `UPYUN ${operator}:${signature}`;

export const getBgcList = async () => {
  const res = await fetch(`https://v0.api.upyun.com/stars-img/home-wlop-video`, {
    headers: {
      'Authorization': authorization,
      'x-Date': date,
      'Accept': 'application/json',
    }
  })
  console.log("向前🇨🇳 ====> res:", res)

  return await res.json();
};
