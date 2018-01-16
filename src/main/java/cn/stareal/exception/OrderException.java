package cn.stareal.exception;

public class OrderException extends ApiExceptionTemplate {
	
	public static final ApiException PARAMETER_INCOMPLETE = _("20401", "参数不完整");
	public static final ApiException INVALID_NUM = _("20403", "无效的门票张数");
	public static final ApiException INVALID_ADDRESS = _("20404", "无效的地址");
	public static final ApiException INVALID_COUPON = _("20405", "无效的优惠券");
	
	public static final ApiException EXIST_UNPAID_ORDER = _("20406", "已有此类订单，如需取消请至【我的订单】");
	public static final ApiException EXIST_PAID_ORDER = _("20407", "该场演出已存在一张已付款的订单，不能重复下单");
	
	public static final ApiException UNVALID_GOOD = _("20408", "无效的商品");
	public static final ApiException GOOD_NOT_ENOUGH= _("20409", "库存不足");
	
	public static final ApiException INVALID_ORDER = _("20410", "订单无法修改");
	public static final ApiException FAIL_TO_UPDATE_ADDRESS = _("20411", "更新订单地址失败");
	public static final ApiException FAIL_TO_DELETE_ORDER = _("20412", "删除订单失败");
	
	public static final ApiException CREATE_ORDER_FAIL = _("20499", "下单失败");
}
