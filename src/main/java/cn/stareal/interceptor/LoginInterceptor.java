package cn.stareal.interceptor;

import cn.stareal.common.config.Constant;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;

/**
 * @author JiJiJi
 * @date 2016-3-2 19:55:24
 */
public class LoginInterceptor implements Interceptor {

	public void intercept(Invocation inv) {
		Controller controller = (Controller) inv.getController();
		if (controller.getSessionAttr(Constant.STAREAL_ADMIN_USER) != null) {
			inv.invoke();
		} else {
			controller.render("/login.html");
		}
	}
}