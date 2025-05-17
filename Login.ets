import { User } from '../model/Model'
import { router } from '@kit.ArkUI'

@Entry
@Component
struct Login {
  @State username: string = ''
  @State password: string = ''

  build() {
    Column() {
      // 顶部 Logo 和标题
      Column({ space: 10 }) {
        Image($rawfile('images/健康管家.jpg'))
          .width(60)
          .height(60)
        Text('健康管家')
          .fontSize(22)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.Black)
      }
      .alignItems(HorizontalAlign.Center)
      .margin({ top: 50 })

      // 表单区域
      Column({ space: 12 }) {
        // 账号输入框
        TextInput({ placeholder: '手机号/邮件地址/账号名', text: $$this.username })
          .type(InputType.Normal)
          .width('80%')
          .height(50)
          .borderRadius(10)
          .backgroundColor('#f5f5f5')
          .padding({ left: 12 })

        // 密码输入框
        TextInput({ placeholder: '密码', text: $$this.password })
          .type(InputType.Password)
          .width('80%')
          .height(50)
          .borderRadius(10)
          .backgroundColor('#f5f5f5')
          .passwordIcon({
            onIconSrc: $rawfile('icon/lock_open.svg'),
            offIconSrc: $rawfile('icon/lock.svg')
          })
          .padding({ left: 12 })

        // 登录按钮
        Button('登录')
          .width('80%')
          .height(45)
          .type(ButtonType.Capsule)
          .fontSize(16)
          .backgroundColor('#aad3ff')
          .fontColor(Color.White)
          .onClick(() => this.login())
          .margin({ top: 25 })

        // 短信验证码登录按钮
        Button('短信验证码登录')
          .width('80%')
          .height(45)
          .type(ButtonType.Capsule)
          .backgroundColor('#eaeaea')
          .fontColor(Color.Black)

        // 扫码登录横排
        Row() {
          Text('其他设备已登录账号？')
            .fontSize(12)
            .fontColor('#999999')

          Text('扫码登录')
            .fontSize(12)
            .fontColor('#007aff')
            .margin({ left: 4 })
            .onClick(() => {
              console.log('点击扫码登录')
              // router.pushUrl({ url: 'pages/ScanLogin' }) // 可启用扫码页
            })
        }
        .margin({ top: 10 })
      }
      .alignItems(HorizontalAlign.Center)
      .margin({ top: 40 })

      // 使用 Blank() 模拟 Spacer()，撑开空间
      Blank().flexGrow(1)


      Column({ space: 6 }) {
        Row() {
          Text('注册账号')
            .fontSize(12)
            .fontColor('#007aff')

          Text('|')
            .fontSize(12)
            .fontColor('#999999')
            .margin({ left: 6, right: 6 })

          Text('忘记密码')
            .fontSize(12)
            .fontColor('#007aff')
        }
        .justifyContent(FlexAlign.Center)

        Row() {
          Text('用户协议')
            .fontSize(12)
            .fontColor('#007aff')

          Text('|')
            .fontSize(12)
            .fontColor('#999999')
            .margin({ left: 6, right: 6 })

          Text('隐私声明')
            .fontSize(12)
            .fontColor('#007aff')
        }
        .justifyContent(FlexAlign.Center)
      }
      .margin({ bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }

  login() {
    let user: User = {
      username: this.username,
      password: this.password
    }
    console.log('username:', user.username, ' password:', user.password)

    router.pushUrl({
      url: 'pages/MainPage'
    })
  }
}
