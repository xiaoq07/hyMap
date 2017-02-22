## teGis 属性和方法

###属性
[geo](#geo)
[series](#series)

----
###方法
[类方法](hygis.method)
[实例方法](#instance.method)


-------
### geo组件 <a name="geo"></a>

```
geo     |   Object
gis地图中的地图配置
```

```
geo.show |  Boolean          0
[default: true]
地图的显示状态 true为显示 false 为不显示
```

```                         
geo.map |  String: world|china|重庆|山东|天津和平      2
[default: china]
当前地图显示哪个地图
```

```                         
geo.roam | Boolean| String  scale| move       0
[default: true]
地图是否开启缩放、平移功能
注: true, 两者都开启  false, 两者都关闭  scale 只开启缩放 move 只开启平移
```

```
geo.center | Array: [lon, lat]       0
[default: null]
当前视角中心: [经度, 纬度]
```

```
geo.zoom   |  Number          0
[default: null]
当前地图缩放比例
```

```
geo.scaleLimit | Array: [min, max]     0
滚轮缩放的边界
```



```
geo.itemStyle | Object: {normal, emphasis}   2
地图上每块区域的样式
```

```
geo.selectedMode | String: 'single'| 'multipe'    2
地图区域的选中模式
```


```
geo.theme | String: basic|dark ...     0
地图风格
```

```
geo.regions: |  Array: [{       4
  name: '',
  itemStyle: {normal, emphasis}
  }]
特殊区域的样式
```

```
geo.label   | Object: {normal, emphasis}     5
文本标签样式
```

### series组件 <a name="series"></a>
图表组件：包含撒点、连线、以及n个图表添加到gis中

```
series     |     Array
gis地图中业务数据参数
```
```
series[0].type        |       String: scatter|line|chart|...     0
[default: 'scatter']
gis地图中图表的类型: 点|线|图表
```

```
series[0].symbol      |       String: circle|rect|icon:public/images/icon.png|...  0
[default: 'circle']
元素形状类型: icon:public/images/icon.png表示是图片 ':' 后是图片地址
注: 当series[0].type = chart 时无效
```

```
series[0].symbolSize  |       Array:  [min, max]   0
[default: [0, 50]]
元素形状大小: min,为数据点最小值大小 max为最大值
注: 当series[0].type = chart 时无效
```

```
series[0].symbolStyle |     Object: {normal, emphasis}   5
[default: {
      normal: {},
      emphasis: {

      }
  }]
元素样式: normal,为正常状态下样式 emphasis,为强调状态下样式
注: 当series[0].type = chart, series[0].symbol = 'icon:...png' 时此参数无效
```

```
series[0].label   |     Object: {normal, emphasis}     0
[default: {
      normal: {},
      emphasis: {}
  }]
元素文本标签样式: normal, 为正常状态下样式 emphasis, 为强调状态下样式
注: 当series[0].type = chart 时无效
```

```
series[0].data  |    Array   [{name: '和平街道卡口', value: 10, geoCoord: [lon, lat], container: DOM}]  0
[default: []]
业务点数据
注: 当series[0].type = chart 时container参数有效, 其它情况该参数无效
```

### 类方法 <a name="hygis.method"></a>

```
hygis.init(DOM)  0
初始化DOM, 返回instance实例
```


### 实例方法 <a name="instance.method"></a>
```
instance.setOption  0
设置gis配置
```

```
instance.on(eventName, handler)  1
on('geoClick', fn)| on('click', (param, event) => {
    console.log(param)
  }) | on('mouseover', fn) | on('zoom', fn)
绑定对地图区域点击 地图上元素的点击
```

```
instance.off(eventName, handler) 1
解绑事件
```

```   
instance.dispatchAction({
    type: 'geoSelect', || 'geoUnSelect' || 'geoToggleSelect'
    name: '天津市和平区'
  }) 2
```

```  
instance.addPoints([{}]) 1
添加元素{}中参数和series[0]中参数一致
```

```
instance.dispose   1
实例销毁
```

```
instance.resize    1
改变地图所在div尺寸时调用地图重绘
```

```       
instance.flyTo({
  geoCoord: [],
  animateDuration: 2000,
  animateEasing: '',
  }, callback) 2
```

```  
instance.hide({
  index: 0
  })  3

```

```  
instance.show({

  }) 3

```


------
##地图命名规范
```
一、地理底图命名规则：
1、矢量切片命名： 行政区名+“_”+vector+”_”+样式+”gp”  例如：shandongsheng_ vector _dark_gp
2、卫星影像切片命名： 行政区名+“_”+satellite+”_”+”gp”  例如：shandongsheng_satellite_gp

```