package cn.stareal.session;

import cn.stareal.tool.ToolMD5;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("serial")
public class ApiSession implements Serializable{

	private Map<String, Object> attrMap = null;
	private String id;
	private long createTime;
//	private long lastAcessTime;
//	private boolean isValid;

	public ApiSession() {
		attrMap = new HashMap<String, Object>();
		createTime = System.currentTimeMillis();
//		setLastAcessTime(createTime);
		id = ToolMD5.MD5(createTime + "-" + this.hashCode());
//		isValid = true;
	}
	
//	public boolean isValid(){
//		return isValid;
//	}
//	
//	public void invalidate(){
//		isValid = false;
//	}
	
	public String getId(){
		return id;
	}
	
	public long getCreateTime(){
		return createTime;
	}

//	public long getLastAcessTime() {
//		return lastAcessTime;
//	}
//
//	public void setLastAcessTime(long lastAcessTime) {
//		this.lastAcessTime = lastAcessTime;
//	}
	
	public void setAttr(String key,Object value){
		attrMap.put(key, value);
	}

	public void setAttrs(Map<String, Object> maps){
		attrMap.putAll(maps);
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getAttr(String key){
		return (T)attrMap.get(key);
	}
}