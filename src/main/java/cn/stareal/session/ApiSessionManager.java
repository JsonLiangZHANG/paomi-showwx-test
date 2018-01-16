package cn.stareal.session;

import com.jfinal.plugin.IPlugin;
import com.jfinal.plugin.redis.Cache;
import com.jfinal.plugin.redis.Redis;

public class ApiSessionManager implements IPlugin {
	private static Cache sessionCache = null;
	private static final int EXPIRE_SECONDS = 60 * 60 * 24 * 30 * 6;

	public static void addSession(String token, ApiSession session) {
		sessionCache.setex(token, EXPIRE_SECONDS, session);
	}

	public static void addSession(String token, int expire, ApiSession session){
		sessionCache.setex(token, expire, session);
	}

	public static ApiSession getSession(String token) {
		return sessionCache.get(token);
	}

	public static void removeSession(String token) {
		sessionCache.del(token);
	}
	
	public static long getIncrSeq(){
		return sessionCache.incr("SEQ");
	}

	public boolean start() {
		sessionCache = Redis.use("SESSION");
		return true;
	}

	public boolean stop() {
		sessionCache = null;
		return true;
	}
}