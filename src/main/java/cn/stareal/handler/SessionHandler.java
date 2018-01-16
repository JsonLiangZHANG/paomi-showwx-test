package cn.stareal.handler;

import cn.stareal.common.controller.BaseController;
import cn.stareal.common.security.Security;
import cn.stareal.exception.SystemException;
import cn.stareal.session.ApiSession;
import cn.stareal.session.ApiSessionManager;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * 验证Session
 *
 * @author JiJiJi
 * @date 2016-5-13 15:52:49
 */
public class SessionHandler implements Interceptor {

	public void intercept(Invocation inv) {
		BaseController controller = (BaseController)inv.getController();
		String token = controller.getPara("accessToken");
		
		if(token == null){
			throw SystemException.NEED_TOKEN;
		}
		
		ApiSession session = ApiSessionManager.getSession(token);
		if(session == null){
			throw SystemException.TOKEN_VERIFY_FAILED;
		}
		
		String userId = session.getAttr("id").toString();
		Security.setUserId(userId);
		inv.invoke();
	}
}