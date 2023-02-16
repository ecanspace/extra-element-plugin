module.exports = {
  // 商户平台 
  '/merchantManage': {
    // target: 'https://merchant-manage-fat-v2.gzsqcp.com',
    target: 'https://merchant-manage-fat.gzsqcp.com',
    // target: 'http://10.10.23.134:8080',
    changeOrigin: true,
    secure: false,
    // pathRewrite: {
    //   '^/merchantManage': '/'
    // }
  },

  // 汽车票基础模块接口
  '/base': {
    target: 'http://10.60.36.222:9013',
    changeOrigin: true,
    secure: false,
  },

  //汽车票业务
  '/ticketApi': {
    target: 'http://10.60.36.222:9013',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/ticketApi': '/'
    }
  },
  //城际业务
  '/carApi': {
    // target: 'https://cardev-service-manage.gzsqcp.com',
    target: 'https://carfat-service-manage.gzsqcp.com',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/carApi': '/'
    }
  },

  //清分结算
  '/accSystem': {
    target: 'http://10.60.36.222:9017',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/accSystem': '/'
    }
  },

  '/mg': {
    target: 'https://bu-hailing-innerapi-cardev.gzsqcp.com',
    changeOrigin: true,
    secure: false,
  },

  "/gateway": {
    target: "http://k8sgateway.gzsqcp.com",
    changeOrigin: true,
    secure: false,
  },
  "/designate": {
    target: "https://bu-hailing-innerapi-carfat.gzsqcp.com",
    changeOrigin: true,
    secure: false,
  },

  //easysql接口
  '/manage': {
    target: 'https://k8sztmanage.gzsqcp.com',
    changeOrigin: true,
    secure: false,
  },

  //调用geo3d数据接口
  '/outSide': {
    target: 'https://geo.datav.aliyun.com',
    changeOrigin: true,
    secure: false,
    headers: {
      Referer: '',
    },
    pathRewrite: {
      '^/outSide': '/'
    }
  },
}