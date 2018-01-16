package cn.stareal.exception;

public class SystemException extends ApiExceptionTemplate {

	public static final ApiException SYSTEM_ERROR = _("10001", "系统错误");
	public static final ApiException SERVICE_UNAVAILABLE = _("10002", "暂时不提供服务");
	public static final ApiException JOB_EXPIRED = _("10003", "处理超时");
	public static final ApiException ILLEGAL_REQUEST = _("10004", "非法请求");
	
	public static final ApiException NEED_TOKEN = _("10008", "用户授权不可为空");
	public static final ApiException TOKEN_VERIFY_FAILED = _("10007", "Token验证失败");
	
	public static final ApiException TOKEN_EXPIRED = _("10009", "用户授权超期");
	public static final ApiException PARAMETER_ERROR = _("10010", "请求参数错误");
	
	public static final ApiException NEED_A_METHOD = _("10016", "请标明请求方式");
	public static final ApiException REQUEST_METHOD_MISMATCH = _("10017", "请求方式有误");
}
