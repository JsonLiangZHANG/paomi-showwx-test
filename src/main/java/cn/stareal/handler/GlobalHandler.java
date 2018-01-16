package cn.stareal.handler;

import cn.stareal.tool.ToolWeb;
import com.jfinal.handler.Handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 系统级拦截器，会拦截所有的请求
 * 
 * @author JiJiJi
 */
public class GlobalHandler extends Handler {

	@Override
	public void handle(String target, HttpServletRequest request,
					   HttpServletResponse response, boolean[] isHandled) {
		// 上下文路径
		request.setAttribute("cxt", request.getContextPath());
		// 封装前台传参
		request.setAttribute("paramMap", ToolWeb.getParamMap(request));

		response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
		response.setHeader("Pragma", "no-cache"); // HTTP 1.0
		response.setDateHeader("Expires", 0); // prevents caching at the proxy

		next.handle(target, request, response, isHandled);
	}
}