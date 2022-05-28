// axios实现

const myaxios = (options) => {
  let xhr;
  let url = options.url;
  const p = new Promise((resolve, reject) => {
    xhr = new Ajax(url, {
      ...options,
      success(response) {
        resolve(response);
      },
      httpCodeError(status) {
        reject(`http状态码异常：${status}`);
      },
      error(xhr) {
        reject("请求失败");
      },
      timeout(timeoutTime) {
        reject(`请求超时：${timeoutTime}ms`);
      },
      abort(xhr) {
        reject("请求终止");
      },
    }).getXHR();
  });
  p.xhr = xhr;
  return p;
};

myaxios.post = (options) => {
  options.method = "POST";
  return myaxios(options);
};

myaxios.delete = (options) => {
  options.method = "DELETE";
  return myaxios(options);
};

myaxios.get = (options) => {
  options.method = "GET";
  return myaxios(options);
};

// 示例
myaxios
  .post({
    // method: "POST",
    url: url,
    param: {
      c: 3,
      d: 4,
    },
    data: { a: 1, b: 2 },
    timeoutTime: 1000,
  })
  .then((response) => {
    // console.log(JSON.parse(response));
  })
  .catch((err) => {
    console.log(err);
  });

// 原版axios
axios({
  url: url,
  method: "POST",
  data: {
    a: 1,
    b: 2,
  },
}).then((response) => {
  // console.log(response);
});
// 返回的response是一个对象

// 默认配置
axios.defaults.method = "GET";

// 创建实例对象
const sample = axios.create({
  timeout: 2000,
});
sample({
  method: "POST",
  url: "http://httpbin.org/post",
}).then((response) => {
  // console.log(response);
});

// 拦截器     每个函数都要return
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log("请求拦截器");
    config.data = { asdasd: 2 }; //可以对config修改请求
    return config;
  },
  (error) => {
    console.log("请求拦截失败");
    return Promise.reject(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log("响应拦截器");
    return response;
  },
  (error) => {
    console.log("响应拦截失败");
    return Promise.reject(error);
  }
);
// 发送请求
// axios({
//   method: "POST",
//   url: url,
// }).then((response) => {
//   console.log(response);
// });
// 多个拦截器时，请求拦截器先执行后面的，响应拦截器先执行前面的

// 取消请求
// CancelToken`👎deprecated`
const controller = new AbortController(); //全局变量接收
axios({
  method: "POST",
  url: url,
  signal: controller.signal, //设置信号
})
  .then(function (response) {
    console.log("请求成功");
  })
  .catch((err) => {
    console.log("请求已被拦截");
    console.log(err);
  });
// cancel the request
controller.abort(); //调用取消请求










