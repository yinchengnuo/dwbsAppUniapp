import request from '@/common/util/request'

export const _API_Reg = data => request.get('/login/register', data) // 注册
export const _API_Login = data => request.get('/login/login', data) // 登录
export const _API_LoginWX = data => request.get('/login/wechat_login', data) // 微信登录
export const _API_GetVerifyCode = data => request.get('/login/judge_login', data) // 发送验证码


