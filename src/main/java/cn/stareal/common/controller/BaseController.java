package cn.stareal.common.controller;

import cn.stareal.common.config.Constant;
import cn.stareal.tool.ToolWeb;
import com.jfinal.aop.Duang;
import com.jfinal.core.Controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * 公共Controller
 *
 * @author JiJiJi
 */
public abstract class BaseController extends Controller {

	/**
	 * ajax 成功
	 */
	public void renderSuccessJson() {
		this.renderJson(Constant.SUCCESS_JSON_TEXT);
	}

	/**
	 * ajax 成功
	 */
	public void renderSuccessJson(String message) {
		this.renderJson(Constant.CUSTOMIZE_SUCCESS_JSON_TEXT + message
				+ Constant.CUSTOMIZE_JSON_END);
	}

	/**
	 * ajax 失败
	 */
	public void renderFailJson() {
		this.renderJson(Constant.FAIL_JSON_TEXT);
	}

	/**
	 * ajax 失败
	 */
	public void renderFailJson(String message) {
		this.renderJson(Constant.CUSTOMIZE_FAIL_JSON_TEXT + message
				+ Constant.CUSTOMIZE_JSON_END);
	}

	/**
	 * 专用于Interceptor中。
	 *
	 * @param rejectReason
	 */
	public void renderRejected(String rejectReason) {
		if (ToolWeb.isAjaxReuqest(this.getRequest())) {
			renderFailJson(rejectReason);
		} else {
			String reason = null;
			try {
				reason = URLEncoder.encode(rejectReason, "utf-8");
			} catch (UnsupportedEncodingException e) {
				// e.printStackTrace();
			}
			this.redirect(Constant.REJECTED_PAGE_URL + "?reason=" + reason);
		}
	}
}
