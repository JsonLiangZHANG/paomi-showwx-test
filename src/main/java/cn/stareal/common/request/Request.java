package cn.stareal.common.request;

import java.lang.annotation.*;

/**
 * 此注解是用来标记请求的
 *
 * @author JiJiJi
 */
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD })
public @interface Request {

	/**
	 * 请求方式
	 *
	 * @return string [ ]
	 */
	RequestMethod method();

}
