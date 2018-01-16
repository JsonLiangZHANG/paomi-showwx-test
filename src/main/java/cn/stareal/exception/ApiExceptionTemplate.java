package cn.stareal.exception;

/**
 * 接口异常类
 * 
 * @author JiJiJi
 * @date 2016-5-12 13:38:00
 */
public abstract class ApiExceptionTemplate {

	protected static ApiException _(String retCode, String retMessage) {
		return new ApiException(retCode, retMessage);
	}
}