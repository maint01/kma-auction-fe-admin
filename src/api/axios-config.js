import axios from "axios";
import {
  ACCESS_TOKEN, AUTHORIZATION,
  REFRESH_TOKEN,
  SUCCESS,
} from "../configs/constant";
import {useEffect} from "react";
import {Router} from 'next/router'
import {toast} from "react-toastify";
import {showError} from "../@core/utils/message";

// import moment from "moment";

// require('dotenv').config()

let isRefreshing = false;

// const timezoneOffset = moment().utcOffset() / 60;

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers[AUTHORIZATION] = ` Bearer ${token}`;
    }

    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/authenticate" && err.response) {
      // Access Token was expired
      if ([403].includes(err.response.status)) {

        return Promise.reject(err);
      }
      if (
        [401].includes(err.response.status) &&
        !originalConfig._retry &&
        localStorage.getItem(REFRESH_TOKEN)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          })
            .then((token) => {
              originalConfig.headers[AUTHORIZATION] = token;

              return instance(originalConfig);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;
        originalConfig._retry = true;

        return new Promise((resolve, reject) => {
          instance
            .post("/refresh-token", {
              refreshToken: localStorage.getItem(REFRESH_TOKEN),
            })
            .then((res) => {
              if (res.data.code === SUCCESS) {
                const {token} = res.data.data;

                localStorage.setItem(ACCESS_TOKEN, token);
                processQueue(null, token);

                return resolve(instance(originalConfig));
              } else {
                return reject(err);
              }
            })
            .catch((_error) => {
              processQueue(_error, null);

              return reject(_error);
            })
            .then(() => (isRefreshing = false));
        });
      }
    }

    if (err.response.status === 500) {
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
)

export default instance;
