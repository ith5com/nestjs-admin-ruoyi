export enum ErrorEnum {
  DEFAULT = '0:未知错误',
  SERVER_ERROR = '500:服务繁忙，请稍后再试',
  SYSTEM_IN_OTHER_LOGIN = '300:当前账号已在其他设备登录',
  ACCESS_TOKEN_EXPIRED = '401:token 已过期，请刷新 token',
  REFRESH_TOKEN_EXPIRED = '402:刷新token已过期，请重新登录',
  SYSTEM_USER_EXISTS = '1001:系统用户已存在',
  SYSTEM_USER_NOT_FOUND = '1002:用户不存在',
  SYSTEM_USER_PASSWORD_ERROR = '1003:账号名或密码错误',
  SYSTEM_USER_EMTERY = '1004:用户不存在',
  SYSTEM_USER_STATUS_ERROR = '1005:用户已禁用',
  SYSTEM_USER_ADMIN_DELETE = '1006:管理员不能删除',
  SYSTEM_USER_UNAUTHORIZED = '1000:token过期重新登录',

  SYSTEM_MENU_NOT_FOUND = '2001:菜单不存在',
  SYSTEM_MENU_EXISTS = '2002:菜单已存在',
  SYSTEM_MENU_HAS_ROLE = '2003:菜单已绑定角色，不能删除',

  SYSTEM_ROLE_NOT_FOUND = '3001:角色不存在',
  SYSTEM_ROLE_NOT_DEL = '3002:角色是超级管理员，不能删除',
  SYSTEM_ROLE_HAS_USERS = '3003:角色存在关联用户，不能删除',

  SYSTEM_DEPT_NOT_FOUND = '4001:部门不存在',
  SYSTEM_DEPT_EXISTS = '4002:部门已存在',
}
