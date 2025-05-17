import News from "../model/Model"

// 普通的自定义组件
@Component
export default struct Index {
  @State swiperImages: string[] = ['swiper1.png', 'swiper2.png', 'swiper3.png', 'swiper4.png', 'swiper5.png', 'swiper6.png', 'swiper7.png']
  @State newsList: News[] = [
    {
      id: 1,
      cover: 'swiper1.png',
      title: '开发者版本新特性，你期待哪些更新？开发者版本新特性，你期待哪些更新？',
      views: 999,
      labels: ['活动公告']
    },
    {
      id: 2,
      cover: 'swiper2.png',
      title: 'HarmonyOS极客马拉松',
      views: 666,
      labels: ['精彩活动']
    },
    {
      id: 3,
      cover: 'swiper3.png',
      title: '自动化测试效率提升30%如何达成',
      views: 333,
      labels: ['活动公告', '精彩活动']
    }
  ]

  build() {
    Scroll() {
      Column({ space: 10 }) {
        // 顶部栏
        Row() {
          // 左侧标题
          Text('健康')
            .fontSize(24)
            .fontWeight(600)
            .fontColor(Color.Black)
          // 右侧图标组
          Row({ space: 12 }) {
            Image($rawfile('images/搜索.jpg'))
              .width(26)
              .height(26)
            Image($rawfile('images/四个点.jpg'))
              .width(26)
              .height(26)
          }
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
        .alignItems(VerticalAlign.Center)
        .padding({ top: 16, left: 16, right: 16, bottom: 10 })

        // 轮播图
        Swiper() {
          ForEach(this.swiperImages, (item: string, index: number) => {
            Image($rawfile('images/' + item)).width('100%')
          })
        }
        .width('95%')
        .borderRadius(15)
        .indicator(new DotIndicator().color(Color.Black).selectedColor(Color.Red))

        // 热门资讯
        Row() {
          Text('热门资讯').fontSize(18).fontWeight(600)
          Row({ space: 3 }) {
            Text('更多').fontSize(12).fontColor('#999999')
            Image($rawfile('icon/chevron_right_3.svg')).width(10)
          }
        }
        .width('95%')
        .alignItems(VerticalAlign.Bottom)
        .justifyContent(FlexAlign.SpaceBetween)

        Grid() {
          ForEach(this.newsList, (news: News, index: number) => {
            GridItem() {
              this.gridCard(news)
            }
          })
        }
        .width('95%')
        .height(180)
        .columnsGap(15)
        .rowsTemplate('1fr')
        .scrollBar(BarState.Off)

        //技术文章
        Row() {
          Text('技术文章').fontSize(18).fontWeight(600)
        }
        .width('95%')
        .alignItems(VerticalAlign.Bottom)
        .justifyContent(FlexAlign.SpaceBetween)

        List({ space: 15 }) {
          ForEach(this.newsList, (news: News, index: number) => {
            ListItem() {
              this.listCard()
            }
          })
        }
        .width('95%')
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
    }
    .width('100%')
    .height('100%')
    .align(Alignment.Top)
  }

  @Builder
  gridCard(news: News) {
    Column() {
      Stack({ alignContent: Alignment.BottomEnd }) {
        Image($rawfile('images/' + news.cover)).width('100%').height('100%')
          .objectFit(ImageFit.Cover).borderRadius({ topLeft: 10, topRight: 10 })
        Row({ space: 2 }) {
          Image($rawfile('icon/fire.svg')).width(10)
          Text(`${news.views >= 999 ? news.views + '+' : news.views}`).fontSize(10).fontColor(Color.White)
        }
        .padding({
          left: 4,
          right: 4,
          top: 2,
          bottom: 2
        })
        .margin(6)
        .backgroundColor('#ACABB1')
        .borderRadius(25)
      }
      .width('100%')
      .height('55%')

      Column() {
        Text(news.title).width('90%').fontSize(14).maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis })
        Row({ space: 10 }) {
          ForEach(news.labels, (label: string, index: number) => {
            Text(label)
              .fontSize(10)
              .fontColor(Color.Red)
              .backgroundColor('#FFEBED')
              .padding({
                left: 8,
                right: 8,
                top: 2,
                bottom: 2
              })
              .borderRadius(5)
          })
        }
        .width('90%')
        .justifyContent(FlexAlign.Start)
      }
      .width('100%')
      .height('45%')
      .justifyContent(FlexAlign.SpaceAround)
    }
    .width('42%')
    .height('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(10)
  }

  @Builder
  listCard() {
    Row() {
      Column() {
        Column() {
          Text('自动化测试效率提升30%如何达成')
            .fontSize(14).maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis })
          Text('针对资深自动化测试开发者，提供了一系列有效措施').fontColor('#999999')
            .fontSize(12).maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
        }.width('100%').alignItems(HorizontalAlign.Start)

        Row() {
          Row({ space: 3 }) {
            Image($rawfile('icon/eye.svg')).width(14)
            Text('123').fontSize(12)
          }

          Row({ space: 3 }) {
            Image($rawfile('icon/hand_thumbsup_fill.svg')).width(14)
            Text('123').fontSize(12)
          }

          Row({ space: 3 }) {
            Image($rawfile('icon/star.svg')).width(14)
            Text('123').fontSize(12)
          }
        }
        .width('100%').justifyContent(FlexAlign.SpaceBetween)
      }
      .width('60%')
      .height('90%')
      .alignItems(HorizontalAlign.Start)
      .justifyContent(FlexAlign.SpaceBetween)

      Image($rawfile('images/swiper1.png')).width('35%').height('100%').borderRadius(5)
    }
    .width('100%')
    .height(100)
    .padding(10)
    .borderRadius(10)
    .backgroundColor('#FFFFFF')
    .justifyContent(FlexAlign.SpaceBetween)
  }
}
