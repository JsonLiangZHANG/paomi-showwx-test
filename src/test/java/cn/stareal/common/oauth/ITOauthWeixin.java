package cn.stareal.common.oauth;

import cn.stareal.common.tool.TokenUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.kit.StrKit;
import org.junit.Test;

/**
 * Created by jaylee on 16/7/14.
 */
public class ITOauthWeixin {

    @Test
    public void testGetAuthorizeUrl() {
        String state = TokenUtil.randomState();
        String authUrl = OauthWeixin.me().getAuthorizeUrl(state);
        System.out.println(authUrl);
    }

    @Test
    public void testGetUserInfoByCode() {
        String code = "031VLBvk2xEAHI0ljqxk2lKzvk2VLBv4";
        JSONObject json = OauthWxweb.me().getUserInfoByCode(code);
        String openid = json.getString("openid");
        String nickname = json.getString("nickname");
        String sex = json.getString("sex");
        String language = json.getString("language");
        String city = json.getString("city");
        String province = json.getString("province");
        String country = json.getString("country");
        String headimgurl = json.getString("headimgurl");
        String unionid = json.getString("unionid");
        System.out.println(openid);
        System.out.println(sex);
        System.out.println(headimgurl);
        System.out.println(unionid);
        System.out.println(json);
    }

    @Test
    public void testGetAccessToken() {
        String accessTokenJson = "{\"access_token\":\"0J_h_OYbtiHSViYySt8RZ-zgap_Gs4Ea_o-xCMwqZjdZjm5JZQlCzal0jlP6x4wTnNCIDmxdB2ceK55mFJdBOsfRuQ5O3Pm8pwrH2pg-KB8\",\"expires_in\":7200,\"refresh_token\":\"8GLJWGkFwtOG8ZyViUKeOghpQOl6npry22L-aXhzcjTeZKrszQIJbUZTbPBziWKMXlxxjCjoE0BhfwU6XLnKSVEwrCvkEIae-fR3I_g14Bo\",\"openid\":\"o204OxMFMr9BwQodF4pWqb0e0o8U\",\"scope\":\"snsapi_login\",\"unionid\":\"oyd3tvp6kb6PL047F57gK_lEPRm4\"}";
        System.out.println(TokenUtil.getAccessToken(accessTokenJson));
        String accessToken = TokenUtil.getAccessToken(accessTokenJson);
        System.out.println("判读accessToken是否为空");
        if (StrKit.isBlank(accessToken)) {
            System.out.println("null");
        }
        //String openId = getTokenInfo(code);
        String openId = TokenUtil.getOpenId(accessTokenJson);
        if (StrKit.isBlank(openId)) {
            System.out.println("null");
        }
        System.out.println(openId);
//        JSONObject dataMap = JSON.parseObject(getUserInfo(accessToken, openId));
//        System.out.println(openId);
//        dataMap.put("openid", openId);
//        dataMap.put("access_token", accessToken);
    }
}
