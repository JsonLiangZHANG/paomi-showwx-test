package cn.stareal.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * 
 * @author JiJiJi
 * @date 2016-6-14 13:14:31
 */
@SuppressWarnings({ "serial", "unused" })
public class Log extends Model<Log> {
	public static final Log dao = new Log();

	public void log(String url, String para, int status, String errMsg,
			double collapse) {

		Log log = new Log();
		log.set("url", url);
		log.set("para", para);
		log.set("status", status);
		log.set("errMsg", errMsg);
		log.set("collapse", collapse);

		try {
			log.save();
		} catch (Exception e) {
//			e.printStackTrace();
		}
	}
}
