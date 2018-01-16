package cn.stareal.common.tool;

import com.alibaba.fastjson.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Token 帮助类
 *
 * @author L.cm          email: 596392912@qq.com         site:  http://www.dreamlu.net
 * @date Jun 24, 2013 9:58:25 PM
 */
public class TokenUtil {

    private static final String STR_S = "abcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * 参考自 qq sdk
     *
     * @param string the string
     * @return String 返回类型
     * @throws
     */
    public static String getAccessToken(String string) {
        String accessToken = "";
        try {
            JSONObject json = JSONObject.parseObject(string);
            if (null != json) {
                accessToken = json.getString("access_token");
            }
        } catch (Exception e) {
            Matcher m = Pattern.compile("^access_token=(\\w+)&expires_in=(\\w+)&refresh_token=(\\w+)$").matcher(string);
            if (m.find()) {
                accessToken = m.group(1);
            } else {
                Matcher m2 = Pattern.compile("^access_token=(\\w+)&expires_in=(\\w+)$").matcher(string);
                if (m2.find()) {
                    accessToken = m2.group(1);
                }
            }
        }
        return accessToken;
    }

    /**
     * 获取accessToken相关信息，参考自 wei sdk
     *
     * @param code the code
     * @return Map<String, String> 返回类型
     * @throws
     */
    public static Map<String, String> getAccessTokenInfo(String code) {
        Map<String, String> accessToken = new HashMap<String, String>();
        try {
            JSONObject json = JSONObject.parseObject(code);
            if (null != json) {
                accessToken.put("access_token", json.getString("access_token"));
                accessToken.put("expires_in", json.getString("expires_in"));
                accessToken.put("refresh_token", json.getString("refresh_token"));
                accessToken.put("openid", json.getString("openid"));
                accessToken.put("scope", json.getString("scope"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return accessToken;
    }

    /**
     * 获取accessToken相关信息，参考自 wei sdk
     *
     * @param stringUserinfo the code
     * @return Map<String, String> 返回类型
     * @throws
     */
    public static Map<String, String> getUserInfo(String stringUserinfo) {
        Map<String, String> userinfo = new HashMap<String, String>();
        try {
            JSONObject json = JSONObject.parseObject(stringUserinfo);
            if (null != json) {
                userinfo.put("openid", json.getString("openid"));
                userinfo.put("nickname", json.getString("nickname"));
                userinfo.put("sex", json.getString("sex"));
                userinfo.put("province", json.getString("province"));
                userinfo.put("city", json.getString("city"));
                userinfo.put("country", json.getString("country"));
                userinfo.put("headimgurl", json.getString("headimgurl"));
                userinfo.put("privilege", json.getString("privilege"));
                userinfo.put("unionid", json.getString("unionid"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userinfo;
    }

    /**
     * 匹配openid
     *
     * @param string the string
     * @return String 返回类型
     * @throws
     */
    public static String getOpenId(String string) {
        String openid = "";
        try {
            JSONObject json = JSONObject.parseObject(string);
            if (null != json) {
                openid = json.getString("openid");
            }
        } catch (Exception e) {
            Matcher m = Pattern.compile("^openid=(\\w+)&scope=(\\w+)&unionid=(\\w+)$").matcher(string);
            if (m.find()) {
                openid = m.group(1);

            }
        }
        return openid;
    }

    /**
     * 匹配unionid
     *
     * @param string the string
     * @return String 返回类型
     * @throws
     */
    public static String getUnionId(String string) {
        Matcher err = Pattern.compile("\"errcode\"\\s*:\\s*").matcher(string);
        if (err.find()) {
            System.out.println(string);
            return null;
        }
        String unionid = null;
        Matcher m = Pattern.compile("\"unionid\"\\s*:\\s*\"(\\S+)\"").matcher(string);
        if (m.find())
            unionid = m.group(1);
        return unionid;
    }

    /**
     * sina uid于qq分离
     *
     * @param string the string
     * @return String 返回类型
     * @throws
     * @Title: getUid
     */
    public static String getUid(String string) {
        JSONObject json = JSONObject.parseObject(string);
        return json.getString("uid");
    }

    private static final Random RANDOM = new Random();

    /**
     * 生成一个随机数
     *
     * @return string
     */
    public static String randomState() {
        int count = 24;
        char[] buffer = new char[count];
        for (int i = 0; i < count; i++) {
            buffer[i] = STR_S.charAt(RANDOM.nextInt(STR_S.length()));
        }
        return new String(buffer);
    }

}
