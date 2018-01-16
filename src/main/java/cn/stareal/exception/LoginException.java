package cn.stareal.exception;

public class LoginException extends ApiExceptionTemplate {

	public static final ApiException WX_CODE_NULL_ERROR = new ApiException("20001","请通过微信认证");
	public static final ApiException WX_GET_CODE_ERROR = new ApiException("20002","获取微信令牌出错");
	public static final ApiException WX_GET_ACCESSCODE_ERROR = new ApiException("20003","获取微信令牌出错");

}
