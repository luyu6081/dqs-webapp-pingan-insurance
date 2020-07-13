import defaultIconSet from './icons/index.svg'

const CommonIcon = {
  name: 'CommonIcon',

  functional: true,

  render: (h, {props, data, listeners}) => {
    const {iconSet, icon} = props
    const inherited = {
      attrs: data.attrs,
      class: [].concat(data.staticClass, data.class),
      style: {...(data.staticStyle || {}), ...(data.style || {})},
      on: listeners,
    }

    const href = `${iconSet || defaultIconSet}#${icon}`

    return (
      <svg {...inherited}>
        <use {...{attrs: {'xlink:href': href}}}/>
      </svg>
    )
  },
}

export default {
  ...CommonIcon,
  install: Vue => Vue.component('common-icon', CommonIcon),
}
