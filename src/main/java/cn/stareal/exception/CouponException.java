package cn.stareal.exception;

public class CouponException extends ApiExceptionTemplate {

	public static final ApiException CANNOT_BE_EMPTY = _("20601", "优惠券编码不能为空");
	public static final ApiException INVALID_COUPONID = _("20602", "无效的优惠券编码");
}
