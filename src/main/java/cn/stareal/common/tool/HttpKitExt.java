package cn.stareal.common.tool;


import com.jfinal.kit.StrKit;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Map.Entry;

/**
 * https 请求 微信为https的请求
 *
 * @author L.cm
 * @date 2013 -10-1 下午2:40:19
 */
public class HttpKitExt {
    /**
     * Init params string.
     *
     * @param url    the url
     * @param params the params
     * @return 返回类型 :
     * @description 功能描述  : 构造请求参数
     */
    public static String initParams(String url, Map<String, String> params) {
        if (null == params || params.isEmpty()) {
            return url;
        }
        StringBuilder sb = new StringBuilder(url);
        if (url.indexOf("?") == -1) {
            sb.append("?");
        }
        sb.append(map2Url(params));
        return sb.toString();
    }

    /**
     * map构造url
     *
     * @param paramToMap the param to map
     * @return 返回类型 :
     * @throws UnsupportedEncodingException
     * @description 功能描述  :
     */
    public static String map2Url(Map<String, String> paramToMap) {
        if (null == paramToMap || paramToMap.isEmpty()) {
            return null;
        }
        StringBuffer url = new StringBuffer();
        boolean isfist = true;
        for (Entry<String, String> entry : paramToMap.entrySet()) {
            if (isfist) {
                isfist = false;
            } else {
                url.append("&");
            }
            url.append(entry.getKey()).append("=");
            String value = entry.getValue();
            if (StrKit.notBlank(value))
                try {value = URLEncoder.encode(value, "UTF-8");} catch (UnsupportedEncodingException e) {throw new RuntimeException(e);}
            url.append(value);
        }
        return url.toString();
    }
    
}