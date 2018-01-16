package cn.stareal.handler;

import cn.stareal.common.request.Request;
import cn.stareal.common.request.RequestMethod;
import cn.stareal.exception.SystemException;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

import java.lang.reflect.Method;

/**
 * 请求方式拦截器
 * 
 *
 * @author JiJiJi
 * @date 2016-5-12 13:20:37
 */
public class MethodHandler implements Interceptor {

	public void intercept(Invocation inv) {
		// 请求方法
		String requestMethod = inv.getController().getRequest().getMethod();

		// 方法体上标明的方法
		Method method = inv.getMethod();
		Request r = (Request) method.getAnnotation(Request.class);
		if (r == null) {
			throw SystemException.NEED_A_METHOD;
		}

		RequestMethod rm = r.method();
		if (rm.name().equals(requestMethod)) {
			inv.invoke();
		} else {
			throw SystemException.REQUEST_METHOD_MISMATCH;
		}
	}
}