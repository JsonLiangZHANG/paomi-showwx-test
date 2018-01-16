package cn.stareal.common.oauth;

import cn.stareal.common.tool.HttpKitExt;
import com.jfinal.kit.HttpKit;
import com.jfinal.kit.Prop;
import com.jfinal.kit.PropKit;

import java.util.Map;

/**
 * Oauth 授权
 *
 * @author L.cm  email: 596392912@qq.com site:  http://www.dreamlu.net
 * @date Jun 24, 2013 9:58:25 PM
 */
public abstract class Oauth {
	
	private static transient Prop prop = PropKit.use("oauth.properties");
	
	private String clientId;
	private String clientSecret;
	private String redirectUri;

	/**
	 * Instantiates a new Oauth.
	 */
	public Oauth() {
		String name = getSelf().getClass().getSimpleName();
		clientId = prop.get(name + ".openid");
		clientSecret = prop.get(name + ".openkey");
		redirectUri = prop.get(name + ".redirect");
	}

	/**
	 * Gets self.
	 *
	 * @return the self
	 */
	public abstract Oauth getSelf();

	/**
	 * Gets authorize url.
	 *
	 * @param authorize the authorize
	 * @param params    the params
	 * @return the authorize url
	 */
	protected String getAuthorizeUrl(String authorize, Map<String, String> params) {
		return HttpKitExt.initParams(authorize, params);
	}

	/**
	 * Do post string.
	 *
	 * @param url    the url
	 * @param params the params
	 * @return the string
	 */
	protected String doPost(String url, Map<String, String> params) {
		return HttpKit.post(url, HttpKitExt.map2Url(params));
	}

	/**
	 * Do get string.
	 *
	 * @param url    the url
	 * @param params the params
	 * @return the string
	 */
	protected String doGet(String url, Map<String, String> params) {
		return HttpKit.get(url, params);
	}

	/**
	 * Do get with headers string.
	 *
	 * @param url     the url
	 * @param headers the headers
	 * @return the string
	 */
	protected String doGetWithHeaders(String url, Map<String, String> headers) {
		return HttpKit.get(url, null, headers);
	}

	/**
	 * Gets client id.
	 *
	 * @return the client id
	 */
	public String getClientId() {
		return clientId;
	}

	/**
	 * Sets client id.
	 *
	 * @param clientId the client id
	 */
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	/**
	 * Gets client secret.
	 *
	 * @return the client secret
	 */
	public String getClientSecret() {
		return clientSecret;
	}

	/**
	 * Sets client secret.
	 *
	 * @param clientSecret the client secret
	 */
	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}

	/**
	 * Gets redirect uri.
	 *
	 * @return the redirect uri
	 */
	public String getRedirectUri() {
		return redirectUri;
	}

	/**
	 * Sets redirect uri.
	 *
	 * @param redirectUri the redirect uri
	 */
	public void setRedirectUri(String redirectUri) {
		this.redirectUri = redirectUri;
	}
}
