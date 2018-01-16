package cn.stareal.handler;

import cn.stareal.common.controller.BaseController;
import cn.stareal.exception.ApiException;
import cn.stareal.exception.SystemException;
import cn.stareal.model.Log;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * 移动端接口的统一异常拦截器
 * 
 *
 * @author JiJiJi
 * @date 2016-5-12 13:20:37
 */
public class ExceptionHandler implements Interceptor {

	public void intercept(Invocation inv) {
		BaseController controller = (BaseController) inv.getController();
		// 接口调用成功标志
		boolean successed = false;
		String errMsg = null;
		long beginTime = System.currentTimeMillis();
		try {
			inv.invoke();
			successed = true;
		} catch (Exception e) {
			e.printStackTrace();
			if (!(e instanceof ApiException)) {
				e = SystemException.SYSTEM_ERROR;
			}
			errMsg = e.getMessage();

			controller.setAttr("retCode",((ApiException) e).getRetCode());
			controller.setAttr("retMessage",((ApiException) e).getRetMessage());
			controller.render("/common/500.html");
			//controller.renderJson(((ApiException) e).render());
		} finally {
			
			// 记录接口调用日志
			long endTime = System.currentTimeMillis();
			Log.dao.log(inv.getActionKey(), controller.getParaMap().toString(),
					(successed ? 0 : 1), errMsg, new Double(
							(endTime - beginTime) / 1000D));
		}
	}
}