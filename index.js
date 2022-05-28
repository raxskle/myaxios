// ajax封装
const url = "http://httpbin.org/post";

const DEFAULTS = {
  method: "GET",
  url: undefined,
  params: null,
  data: null,
  contentType: "application/json",
  responseType: "",
  timeoutTime: 0,
  withCredentials: false,
  success() {}, //xhr.send()之后的方法，定义在options中，可以调用时自定义
  httpCodeError() {},
  error() {},
  abort() {},
  timeout() {},
};

// 格式化url参数
const serialize = (params) => {
  const results = [];
  for (const [key, value] of Object.entries(params)) {
    results.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return results.join("&");
};

const addURLData = (url, data) => {
  if (!data) {
    return "";
  }
  const mark = url.includes("?") ? "&" : "?";
  return `${mark}${data}`;
};

class Ajax {
  constructor(url, options) {
    this.url = url;
    this.options = Object.assign({}, DEFAULTS, options);
    this.init();
  }

  init() {
    const xhr = new XMLHttpRequest();
    this.xhr = xhr;
    this.bindEvent();
    xhr.open(this.options.method, this.url + this.addParams(), true);

    this.setResponseType();
    this.setTimeout();
    this.setCookie();

    // 发送请求
    this.sendData();

    // xhr.send();
  }

  bindEvent() {
    const xhr = this.xhr;
    const { success, httpCodeError, error, timeout, abort } = this.options;
    xhr.addEventListener("load", () => {
      if (this.ok()) {
        success(xhr.response);
      } else {
        httpCodeError(xhr.status);
      }
    });
    xhr.addEventListener("error", () => {
      error(xhr);
    });
    xhr.addEventListener("abort", () => {
      abort(xhr);
    });
    xhr.addEventListener("timeout", () => {
      timeout(this.options.timeoutTime);
    });
  }

  ok() {
    const xhr = this.xhr;
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      return true;
    } else {
      return false;
    }
  }

  addParams() {
    const { params } = this.options;
    if (!params) {
      return "";
    } else {
      return addURLData(this.url, serialize(params));
    }
  }

  setResponseType() {
    this.xhr.responseType = this.options.responseType;
  }
  setTimeout() {
    const { timeoutTime } = this.options;
    if (timeoutTime > 0) {
      this.xhr.timeout = timeoutTime;
    }
  }

  setCookie() {
    if (this.options.withCredentials) {
      this.xhr.withCredentials = true;
    }
  }

  sendData() {
    const xhr = this.xhr;
    if (!this.isSendData()) {
      console.log("noData URL: " + this.url);
      return xhr.send();
    }
    let resultData = null;
    const { data } = this.options;
    // formdata不用设置请求头
    if (this.isFormData()) {
      resultData = data;
    } else if (this.isFormURLEncodedData()) {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      resultData = serialize(data);
    } else if (this.isJSONData()) {
      xhr.setRequestHeader("Content-Type", "application/json");
      resultData = JSON.stringify(data);
    }
    // console.log("data: " + resultData);
    return xhr.send(resultData);
  }

  isSendData() {
    const { data, method } = this.options;
    if (!data) {
      return false;
    }
    if (method === "GET") {
      return false;
    }
    return true;
  }

  isFormData() {
    return this.options.data instanceof FormData;
  }

  isFormURLEncodedData() {
    return this.options.contentType.includes(
      "application/x-www-form-urlencoded"
    );
  }

  isJSONData() {
    return this.options.contentType.includes("application/json");
  }

  getXHR() {
    return this.xhr;
  }
}

const ajax = (url, options) => {
  return new Ajax(url, options).getXHR();
};

// ajax(url, {
//   method: "POST",
//   param: {
//     a: 3,
//     b: 4,
//   },
//   data: { a: 1, b: 2 },
//   timeoutTime: 1000,
//   success(data, xhr) {
//     console.log(data);
//     console.log(xhr);
//   },

//   httpCodeError(status, xhr) {
//     console.log("HTTP error");
//     console.log(status);
//   },

//   error(xhr) {
//     console.log("error");
//     console.log(xhr);
//   },

//   abort(xhr) {
//     console.log("abort");
//     console.log(xhr);
//   },

//   timeout(timeoutTime) {
//     console.log("timeout");
//     console.log(timeoutTime);
//   },
// });
