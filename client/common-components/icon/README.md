## CommonIcon

SVG Sprites 包裹器，内置一套常用图标。

需要注意：

1. 只支持 SVG Sprites，独立的 SVG 图标文件不能处理；
2. 必须提供尺寸（长和宽），否则渲染输出可能会破坏布局（尺寸通过 CSS 设定即可）；

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | String| | **必需** - 图标名，对应 SVG Sprites 的元素 ID；使用内置图标库时，对应 `icons` 目录下的文件名 |
| `icon-set` | String | 内置图标库 | SVG Sprites 文件路径 |

## Examples

### 使用内置图标库

```html
<common-icon icon="heart"/>
```

### 使用自定义图标库

```html
<common-icon :icon-set="require('@/assets/icons/index.svg')" icon="app-logo"/>
```
