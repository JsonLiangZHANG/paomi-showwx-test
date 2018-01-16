package cn.stareal.exception;

/**
 * Created by tracy on 2016/5/25.
 * Copyright (c) 2016,
 * mr.lizhengjie@gmail.com All Rights Reserved.
 */
public class AddressException extends ApiExceptionTemplate{
    public static final ApiException ADD_ADDRESS_FAIL = _("20401", "增加地址失败");
    public static final ApiException GET_CITY_FAIL = _("20402", "获取城市失败");
    public static final ApiException DEL_ADDRESS_FAIL = _("20403", "删除地址失败");
    public static final ApiException DEFAULT_ADDRESS_FAIL = _("20404", "更新默认地址失败");
}
