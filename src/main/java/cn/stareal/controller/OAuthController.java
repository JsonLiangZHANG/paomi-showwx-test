package cn.stareal.controller;

import cn.stareal.common.controller.BaseController;
import cn.stareal.common.oauth.OauthWeixin;
import cn.stareal.common.oauth.OauthWxweb;
import cn.stareal.exception.LoginException;
import cn.stareal.handler.ExceptionHandler;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.kit.HttpKit;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by jaylee on 16/7/14.
 */
@Before(ExceptionHandler.class)
@ControllerBind(controllerKey = "/oauth")
public class OAuthController extends BaseController {

    public void index() {
        System.out.println("开始验证用户登录。。。");
        String code = this.getPara("code");
        System.out.println("第一步：用户同意授权，获取的code为:" + code);

        if (code == null || code.equals("")) {
            throw LoginException.WX_CODE_NULL_ERROR;
        }

        JSONObject json = OauthWxweb.me().getUserInfoByCode(code);
        if (null == json) {
            throw LoginException.WX_GET_CODE_ERROR;
        }

        String openid = json.getString("openid");
        String nickname = json.getString("nickname");
        String sex = json.getString("sex");
        String city = json.getString("city");
        String province = json.getString("province");
        String country = json.getString("country");
        String headimgurl = json.getString("headimgurl");
        String token = json.getString("access_token");


        if (token == null || token.equals("") || openid == null || openid.equals("")) {
            throw LoginException.WX_GET_ACCESSCODE_ERROR;
        }

        Map<String, String> params = new HashMap<String, String>();
        params.put("token", token);
        params.put("plat", "wx");
        params.put("nickname", nickname);
        params.put("sex", sex);
        params.put("province", province);
        params.put("city", city);
        params.put("country", country);
        params.put("headimgurl", headimgurl);
        params.put("openid", openid);
        this.setSessionAttr("accessToken", getUserAccessToken(params));
        this.setSessionAttr("openid", openid);
//        render("/index.html");

        // 回调url
        String rs = this.getPara("state");
        if (rs != null && !"".equals(rs)) {
            this.setSessionAttr("rs", rs);
        }

        redirect("/?");
    }

    public void weixin() {
        System.out.println("开始验证用户登录。。。");
        String code = this.getPara("code");
        System.out.println("第一步：用户同意授权，获取的code为:" + code);

        if (code == null || code.equals("")) {
            throw LoginException.WX_CODE_NULL_ERROR;
        }

        JSONObject json = OauthWxweb.me().getUserInfoByCode(code);
        if (null == json) {
            throw LoginException.WX_GET_CODE_ERROR;
        }

        String openid = json.getString("openid");
        String nickname = json.getString("nickname");
        String sex = json.getString("sex");
        String city = json.getString("city");
        String province = json.getString("province");
        String country = json.getString("country");
        String headimgurl = json.getString("headimgurl");
        String token = json.getString("access_token");


        if (token == null || token.equals("") || openid == null || openid.equals("")) {
            throw LoginException.WX_GET_ACCESSCODE_ERROR;
        }

        Map<String, String> params = new HashMap<String, String>();
        params.put("token", token);
        params.put("plat", "wx");
        params.put("nickname", nickname);
        params.put("sex", sex);
        params.put("province", province);
        params.put("city", city);
        params.put("country", country);
        params.put("headimgurl", headimgurl);
        params.put("openid", openid);
        this.setSessionAttr("accessToken", getUserAccessToken(params));
        this.setSessionAttr("openid", openid);
//        render("/index.html");

        // 回调url
        String rs = this.getPara("state");
        if (rs != null && !"".equals(rs)) {
            this.setSessionAttr("rs", rs);
        }

        redirect("/?");
    }

    public void web() {
        System.out.println("setAccessToken:" + this.getPara("accessToken"));
        this.setSessionAttr("accessToken", this.getPara("accessToken"));
        // 回调url
        String rs = this.getPara("state");
        if (rs != null && !"".equals(rs)) {
            this.setSessionAttr("rs", rs);
        }
        redirect("/?");
    }


    public void test() {
        String code = this.getPara("code");
        System.out.println("第一步：用户同意授权，获取的code为:" + code);
        this.setSessionAttr("accessToken", "079B9975BB100FF49BDFCB550D434A10");
        this.setSessionAttr("openid", "o6F7Qw8PDVDDU4l4lrOYfygrBAHw");
        redirect("/?");
    }

    public void test1() {
        this.setSessionAttr("accessToken", "3518B7D87B431E1027B4F6B1A4F0B8B3");
        this.setSessionAttr("openid", "o6F7Qw9MKfZCSL3Y9KA3S4QuoZqg");
//        this.setSessionAttr("rs", "main.detail#{\"good_id\":\"100118\"}");
        redirect("/?");
    }

    /**
     * 根据code一步获取用户信息
     *
     * @param @param args	设定文件
     * @return void    返回类型
     * @throws
     */
    public String getUserAccessToken(Map<String, String> params) {
        String loginApi = "http://api.mydeershow.com/mobile/app/login/social/retrieve";
        JSONObject dataMap = JSON.parseObject(HttpKit.get(loginApi, params));
        String accessToken = dataMap.getString("accessToken");
        return accessToken;
    }

}
