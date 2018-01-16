package cn.stareal.common.oauth;

import cn.stareal.common.tool.TokenUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.kit.StrKit;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: jaylee
 * Date: 16-4-21
 * Time: 上午11:05
 */
public class OauthWeixin extends Oauth {

    private static final String AUTH_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";
    private static final String TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token";
    private static final String TOKEN_INFO_URL = "https://api.weixin.qq.com/sns/oauth2/access_token";
    private static final String USER_INFO_URL = "https://api.weixin.qq.com/sns/userinfo";
    private static OauthWeixin oauthWeixin = new OauthWeixin();

    /**
     * 用于链式操作
     *
     * @return oauth weixin
     */
    public static OauthWeixin me() {
        return oauthWeixin;
    }

    /**
     * 获取授权url
     * DOC：https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN
     *
     * @param state the state
     * @return String 返回类型
     * @throws
     */
    public String getAuthorizeUrl(String state) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("appid", getClientId());
        params.put("redirect_uri", getRedirectUri());
        params.put("response_type", "code");
        params.put("scope", "snsapi_userinfo");
        if (!StrKit.isBlank(state)) {
            params.put("state", state); //OAuth2.0标准协议建议，利用state参数来防止CSRF攻击。可存储于session或其他cache中
        }
        return super.getAuthorizeUrl(AUTH_URL, params);
    }

    /**
     * 通过code获取access_token
     *
     * @param code the code
     * @return String 返回类型
     * @throws
     */
    public String getTokenByCode(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        params.put("appid", getClientId());
        params.put("secret", getClientSecret());
        params.put("grant_type", "authorization_code");
        params.put("redirect_uri", getRedirectUri());
        String token = TokenUtil.getAccessToken(super.doGet(TOKEN_URL, params));
        System.out.println(token);
        return token;
    }

    /**
     * 获取TokenInfo
     *
     * @return 设定文件
     * @throws
     */
    public String getTokenInfo(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        params.put("appid", getClientId());
        params.put("secret", getClientSecret());
        params.put("grant_type", "authorization_code");
        // callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} );
        String openid = TokenUtil.getOpenId(super.doGet(TOKEN_URL, params));
        System.out.println(openid);
        return openid;
    }

    /**
     * 获取用户信息
     * DOC：http://open.weibo.com/wiki/2/users/show
     *
     * @param accessToken the access token
     * @param openid      the openid
     * @return 设定文件 user info
     * @throws
     * @paramo openid
     */
    public String getUserInfo(String accessToken, String openid) {
        System.out.println("第四步：拉取用户信息(需scope为 snsapi_userinfo):" + USER_INFO_URL + "?access_token=" + accessToken + "&openid=" + openid + "&lang=zh_CN");
        Map<String, String> params = new HashMap<String, String>();
        params.put("access_token", accessToken);
        params.put("openid", openid);
        params.put("lang", "zh_CN");
        String userInfo = super.doGet(USER_INFO_URL, params);
        System.out.println("用户信息:" + userInfo);
        return userInfo;
    }

    /**
     * 根据code一步获取用户信息
     *
     * @param @param args	设定文件
     * @return void    返回类型
     * @throws
     */
    public JSONObject getUserInfoByCode(String code) {
        String accessTokenJson = getAccessToken(code);
        System.out.println("得到accessToken:" + accessTokenJson);
        String accessToken = TokenUtil.getAccessToken(accessTokenJson);
        System.out.println("判读accessToken是否为空");
        if (StrKit.isBlank(accessToken)) {
            return null;
        }
        //String openId = getTokenInfo(code);
        String openId = TokenUtil.getOpenId(accessTokenJson);
        System.out.println("获取openid:" + openId);
        if (StrKit.isBlank(openId)) {
            return null;
        }
        JSONObject dataMap = JSON.parseObject(getUserInfo(accessToken, openId));
        System.out.println(openId);
        dataMap.put("openid", openId);
        dataMap.put("access_token", accessToken);
        return dataMap;
    }

    public String getAccessToken(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        params.put("appid", getClientId());
        params.put("secret", getClientSecret());
        params.put("grant_type", "authorization_code");
        params.put("redirect_uri", getRedirectUri());
        System.out.println("第二步：通过code换取网页授权access_token:" + TOKEN_URL + "?appid=" + getClientId() + "&secret=" + getClientSecret() + "&code=" + code + "&grant_type=authorization_code");
        return super.doGet(TOKEN_URL, params);
    }

    @Override
    public Oauth getSelf() {
        return this;
    }
}
