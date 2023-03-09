<template>
  <div class="login">
    <div class="login-box">
      <div class="head-portrait">
        <img src="~assets/logo.png"
             alt="">
      </div>
      <el-form ref="loginForm"
               class="login-form"
               :model="loginFrom"
               :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username"
                    prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password"
                    prefix-icon="el-icon-lock"
                    show-password></el-input>
        </el-form-item>
        <el-form-item class="login-btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        // 登录预验证
        if (!valid) return
        // 登录验证
        const { data : res} = await this.$http.post('login', this.loginFrom)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 登录成功sessionStorage中保存token, 关闭会话窗口时清除token
        window.sessionStorage.setItem('token', res.data.token)
        // 路由跳转
        this.$router.push('/home')
      })
    },
    reset() {
      this.$refs.loginForm.resetFields()
    }
  },
}
</script>

<style scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
}

.head-portrait {
  width: 140px;
  height: 140px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px white;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.head-portrait img {
  width: 120px;
  height: 120px;
  vertical-align: middle;
  border-radius: 50%;
  background-color: #eee;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-btns {
  display: flex;
  justify-content: flex-end;
}

.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
}

</style>