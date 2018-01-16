package cn.stareal.cfg;

import cn.stareal.handler.GlobalHandler;
import cn.stareal.handler.JDruidStatViewHandler;
import cn.stareal.session.ApiSessionManager;
import com.alibaba.druid.filter.logging.Log4jFilter;
import com.alibaba.druid.filter.stat.StatFilter;
import com.baidu.ueditor.UeditorConfigKit;
import com.baidu.ueditor.manager.QiniuFileManager;
import com.jfinal.config.*;
import com.jfinal.core.JFinal;
import com.jfinal.ext.plugin.tablebind.AutoTableBindPlugin;
import com.jfinal.ext.plugin.tablebind.INameStyle;
import com.jfinal.ext.plugin.tablebind.ParamNameStyles;
import com.jfinal.ext.plugin.tablebind.SimpleNameStyles;
import com.jfinal.ext.route.AutoBindRoutes;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.CaseInsensitiveContainerFactory;
import com.jfinal.plugin.activerecord.dialect.MysqlDialect;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.plugin.redis.RedisPlugin;
import com.jfinal.weixin.demo.WeixinApiController;
import com.jfinal.weixin.demo.WeixinMsgController;
import com.jfinal.weixin.demo.WeixinPayController;
import com.jfinal.weixin.sdk.api.ApiConfigKit;
import net.dreamlu.controller.UeditorApiController;
import org.beetl.ext.jfinal.BeetlRenderFactory;

/**
 * Created by tracy on 2016/4/14.
 * Copyright (c) 2016,
 * mr.lizhengjie@gmail.com All Rights Reserved.
 */
public class JFWebConfig extends JFinalConfig {

    /**
     * 配置常量
     * @param me
     */
    @Override
    public void configConstant(Constants me) {
        //SqlReporter.setLogger(true);
        me.setErrorView(401, "/common/401.html");
        me.setErrorView(403, "/common/403.html");
        me.setError404View("/common/404.html");
        me.setError500View("/common/500.html");

        // 加载数据库配置文件
        loadPropertyFile("appconfig.properties");
        PropKit.use("appconfig.properties");
        // 设定Beetl
        me.setMainRenderFactory(new BeetlRenderFactory());
        // 设定为开发者模式
        me.setDevMode(PropKit.getBoolean("devMode", false));
        // ApiConfigKit 设为开发模式可以在开发阶段输出请求交互的 xml 与 json 数据
        ApiConfigKit.setDevMode(me.getDevMode());
    }

    /**
     * 配置路由
     * @param me
     */
    @Override
    public void configRoute(Routes me) {
        AutoBindRoutes autoBindRoutes = new AutoBindRoutes();
        me.add(autoBindRoutes);
        //ueditor 文件上传插件 配置路由
        me.add("/ueditor/api", UeditorApiController.class);
        me.add("/msg", WeixinMsgController.class);
        me.add("/api", WeixinApiController.class, "/api");
        me.add("/pay", WeixinPayController.class);
    }

    private StatFilter getStatFilter() {
        StatFilter statFilter = new StatFilter();
        statFilter.setLogSlowSql(true);
        statFilter.setMergeSql(true);
        return statFilter;
    }

    private Log4jFilter getLog4jFilter() {
        Log4jFilter log4jFilter = new Log4jFilter();
        log4jFilter.setStatementExecuteUpdateAfterLogEnabled(false);
        log4jFilter.setStatementExecuteBatchAfterLogEnabled(false);
        log4jFilter.setStatementExecuteQueryAfterLogEnabled(false);
        log4jFilter.setStatementExecuteAfterLogEnabled(true);
        log4jFilter.setStatementCloseAfterLogEnabled(false);
        log4jFilter.setStatementCreateAfterLogEnabled(false);
        log4jFilter.setStatementLogEnabled(false);
        log4jFilter.setResultSetLogEnabled(false);
        log4jFilter.setConnectionLogEnabled(false);
        log4jFilter.setDataSourceLogEnabled(false);
        log4jFilter.setStatementExecutableSqlLogEnable(true);
        return log4jFilter;
    }

    /**
     * 配置插件
     * @param me
     */
    @Override
    public void configPlugin(Plugins me) {
        // mysql
        String configName = getProperty("db.configName");
        String url = getProperty("jdbcUrl");
        String username = getProperty("user");
        String password = getProperty("password");
        String driverClass = getProperty("driverClass");
        String filters = getProperty("filters");

        // 配置mysql 数据源druid
        DruidPlugin dsMysql = new DruidPlugin(url, username, password, driverClass, filters);
        dsMysql.addFilter(getStatFilter());
        dsMysql.addFilter(getLog4jFilter());
        dsMysql.setMaxActive(200);
        me.add(dsMysql);

        //配置ActiveRecord插件
        ActiveRecordPlugin arpMysql = new ActiveRecordPlugin(configName, dsMysql);
        arpMysql.setContainerFactory(new CaseInsensitiveContainerFactory(true));
        me.add(arpMysql);

        AutoTableBindPlugin atbp = new AutoTableBindPlugin(dsMysql, ParamNameStyles.lowerUnderlineModule("stareal"));
        atbp.setShowSql(true);
        atbp.setDialect(new MysqlDialect());// 配置MySql方言
        me.add(atbp);

        me.add(new RedisPlugin("SESSION", getProperty("redis.host"),getProperty("redis.password")));
        me.add(new ApiSessionManager());

    }

    /**
     * 配置全局拦截器
     * @param me
     */
    @Override
    public void configInterceptor(Interceptors me) {}

    public void afterJFinalStart() {
        super.afterJFinalStart();
        PropKit.use("appconfig.properties");
        String ak = PropKit.get("qiniu.ak");
        String sk = PropKit.get("qiniu.sk");
        String bucket = PropKit.get("qiniu.bucket");
        UeditorConfigKit.setFileManager(new QiniuFileManager(ak, sk, bucket));
    }

    /**
     * 配置处理器
     * @param me
     */
    @Override
    public void configHandler(Handlers me) {
        me.add(new JDruidStatViewHandler("/druid"));
        me.add(new GlobalHandler());
    }

    /**
     * 建议使用 JFinal 手册推荐的方式启动项目 运行此 main
     * 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
     */
    public static void main(String[] args) {
        JFinal.start("WebContent", 9090, "/weixin", 5);
    }
}
