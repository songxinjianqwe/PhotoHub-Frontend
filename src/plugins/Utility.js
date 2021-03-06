exports.install = function (Vue, options) {
    Vue.prototype.removeUnchangedValue = function (raw, now, necessaryAttr) {
        for (let key in now) {
            if (now[key] === raw[key] && key !== necessaryAttr) {
                delete now[key]
            }
        }
    },
        Vue.prototype.formatDate = function (date, fmt) {
            let o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        Vue.prototype.DEFAULT_DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss',
        Vue.prototype.DEFAULT_DATE_FORMAT = 'yyyy-MM-dd',
        Vue.prototype.DEFAULE_PER_PAGE = 5,
        Vue.prototype.base64ToBinary = function (dataUrl) {
            let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        Vue.prototype.initCos = function () {
            console.log("初始化cos");
            let cos = new CosCloud({
                appid: 1252651195, // APPID 必填参数
                bucket: "photohub", //bucketName 必填参数
                region: "sh", //地域信息 必填参数 华南地区填gz 华东填sh 华北填tj,
                getAppSign: callback => {
                    console.log("getAppSign")
                    console.log("尝试获取服务器token")
                    this.axios
                        .get("/tokens/cos")
                        .then(response => {
                            console.log("cos获取服务器token 成功", response.data)
                            callback(response.data)
                        })
                        .catch(error => {
                            throw error
                        });
                }
            });
            return cos
        },
        Vue.prototype.COS_IMG_BASE_PATH = 'message_image/',
        Vue.prototype.COS_VIDEO_BASE_PATH = 'message_video/'
    Vue.prototype.getScrollTop = function (element) {
        if (element) {
            return element.scrollTop
        } else {
            return document.documentElement.scrollTop;
        }
    },
        //文档的总高度
        Vue.prototype.getScrollHeight = function (element) {
            if (element) {
                return element.scrollHeight;
            } else {
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            }
        },
        //浏览器视口的高度
        Vue.prototype.getClientHeight = function (element) {
            if (element) {
                return element.clientHeight
            } else {
                return document.documentElement.clientHeight
            }
        },
        Vue.prototype.isScrollInBottom = function (element) {
            return this.getScrollTop(element) + this.getClientHeight(element) + 10 >
                this.getScrollHeight(element)
        },
        Vue.prototype.throttle = function (fn, delay, options) {
            let wait = false;
            if (!options) options = {};
            return function () {
                let that = this, args = arguments;
                if (!wait) {
                    if (!(options.leading === false)) {
                        fn.apply(that, args);
                    }
                    wait = true;
                    setTimeout(function () {
                        if (!(options.trailing === false)) {
                            fn.apply(that, args);
                        }
                        wait = false;
                    }, delay);
                }
            }
        },
        Vue.prototype._id = function () {
            let loginResult = localStorage.getItem('loginResult')
            if (loginResult === null) {
                return null
            } else {
                return JSON.parse(loginResult).id
            }
        },
        Vue.prototype._token = function () {
            let loginResult = localStorage.getItem('loginResult')
            if (loginResult === null) {
                return null
            } else {
                return JSON.parse(loginResult).token
            }
        },
        Vue.prototype._username = function () {
            let loginResult = localStorage.getItem('loginResult')
            if (loginResult === null) {
                return null
            } else {
                return JSON.parse(loginResult).username
            }
        },
        Vue.prototype._isLogin = function () {
            return localStorage.getItem('loginResult') !== null
        },
        Vue.prototype._isAdmin = function () {
            let loginResult = localStorage.getItem('loginResult')
            if (loginResult === null) {
                return null
            } else {
                return JSON.parse(loginResult).isAdmin
            }
        },
        Vue.prototype.DEFAULE_LOAD_INTERVAL = 200
};