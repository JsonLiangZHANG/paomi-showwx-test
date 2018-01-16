package cn.stareal.exception;

public class PayException extends ApiExceptionTemplate {
	
	public static final String WX_PAY_ERROR_CODE = "20598";
	
	public static final ApiException INVALID_ORDER = _("20501", "无效的订单");
	
	public static final ApiException WX_PAY_INVOKE_ERROR = _("20503", "微信支付接口调用失败");
}
