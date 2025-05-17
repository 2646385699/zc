import Index from './Index'
import My from './My'

@Entry
@Component
struct MainPage {
  @State currentIndex: number = 0

  @Builder
  barBuilder(index: number, label: string) {
    Column() {
      Image(this.currentIndex == index ? $rawfile('icon/tabs1_fill.svg') : $rawfile('icon/tabs1.svg')).width(28)
      Text(label).fontSize(12).fontColor(this.currentIndex == index ? '#ff117ed4' : Color.Black)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.SpaceAround)
  }

  build() {
    Tabs({ barPosition: BarPosition.End, index: this.currentIndex }) {
      TabContent() {
        Index()
      }
      .tabBar(this.barBuilder(0, '健康')).backgroundColor('#F2F3F5')
      .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])

      TabContent() {
      }.tabBar(this.barBuilder(1, '运动'))

      TabContent() {
      }.tabBar(this.barBuilder(2, '设备'))

      TabContent() {
      }.tabBar(this.barBuilder(3, '我的'))


    }
    .vertical(false)
    .width('100%')
    .height('100%')
    .scrollable(false)
    .animationDuration(0)
    .barBackgroundColor('#F2F3F5')
    .onChange((index: number) => {
      this.currentIndex = index
    })
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }
}