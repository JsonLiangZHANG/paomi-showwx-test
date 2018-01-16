package cn.stareal.handler;

import com.jfinal.handler.Handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by xiaowangzi on 16/7/10.
 */
public class CorsHandler extends Handler {
    public void handle(String target, HttpServletRequest request, HttpServletResponse response, boolean[] isHandled) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        this.next.handle(target, request, response, isHandled);
    }
}



