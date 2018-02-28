package cn.stareal.controller;

import com.jfinal.core.Controller;
import com.jfinal.ext.route.ControllerBind;

/**
 * Created by jaylee on 16/7/5.
 */
@ControllerBind(controllerKey = "/")
public class IndexController extends Controller {

    public void index() {
        this.setAttr("accessToken", getSessionAttr("accessToken"));
        this.setAttr("openid",getSessionAttr("openid"));
        this.setAttr("rs",getSessionAttr("rs"));
        this.removeSessionAttr("rs");
        render("index.html");

        if(getSessionAttr("accessToken")!=null){
            redirect("/?");
        }
    }
}