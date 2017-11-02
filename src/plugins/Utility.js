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
        Vue.prototype.initCos = function (token) {
            console.log("初始化cos");
            let cos = new CosCloud({
                appid: 1252651195, // APPID 必填参数
                bucket: "photohub", //bucketName 必填参数
                region: "sh", //地域信息 必填参数 华南地区填gz 华东填sh 华北填tj,
                getAppSign: callback => {
                    console.log("getAppSign")
                    console.log("尝试获取服务器token")
                    let header = { Authentication: token }
                    this.axios
                        .get("/tokens/cos", { headers: header })
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
    //滚动条在Y轴上的滚动距离
    Vue.prototype.getScrollTop = function () {
        let scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0
        if (document.body) {
            bodyScrollTop = document.body.scrollTop
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop
        }
        scrollTop =
            bodyScrollTop - documentScrollTop > 0
                ? bodyScrollTop
                : documentScrollTop
        return scrollTop
    },
        //文档的总高度
        Vue.prototype.getScrollHeight = function () {
            let scrollHeight = 0,
                bodyScrollHeight = 0,
                documentScrollHeight = 0
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight
            }
            scrollHeight =
                bodyScrollHeight - documentScrollHeight > 0
                    ? bodyScrollHeight
                    : documentScrollHeight
            return scrollHeight
        },
        //浏览器视口的高度
        Vue.prototype.getWindowHeight = function () {
            let windowHeight = 0
            if (document.compatMode == 'CSS1Compat') {
                windowHeight = document.documentElement.clientHeight
            } else {
                windowHeight = document.body.clientHeight
            }
            return windowHeight
        },
        Vue.prototype.isScrollInBottom = function () {
            return this.getScrollTop() + this.getWindowHeight() - 10 >=
                this.getScrollHeight()
        }
};