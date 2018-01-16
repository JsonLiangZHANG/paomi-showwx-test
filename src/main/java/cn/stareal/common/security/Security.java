package cn.stareal.common.security;

/**
 * The type Security.
 */
public class Security {

	private static final ThreadLocal<String> userIdHolder = new ThreadLocal<String>();

	/**
	 * Sets userId.
	 *
	 * @param userId the user
	 */
	public static void setUserId(String userId) {
		userIdHolder.set(userId);
	}

	/**
	 * Gets userId.
	 *
	 * @return the user
	 */
	public static String getUserId() {
		return userIdHolder.get();
	}

}
