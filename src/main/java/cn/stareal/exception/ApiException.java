package cn.stareal.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * 接口异常类
 * 
 * @author JiJiJi
 * @date 2016-5-12 13:38:00
 */
public class ApiException extends RuntimeException {

	private static final long serialVersionUID = -5563752964057970029L;

	private String retCode;
	private String retMessage;

	public ApiException(String retCode, String retMessage) {
		super("[" + retCode + "] " + retMessage);
		this.setRetCode(retCode);
		this.setRetMessage(retMessage);
	}

	public Map<String, String> render() {
		Map<String, String> rM = new HashMap<String, String>();
		rM.put("retCode", retCode);
		rM.put("message", retMessage);
		return rM;
	}

	public String getRetCode() {
		return retCode;
	}

	public void setRetCode(String retCode) {
		this.retCode = retCode;
	}

	public String getRetMessage() {
		return retMessage;
	}

	public void setRetMessage(String retMessage) {
		this.retMessage = retMessage;
	}
}