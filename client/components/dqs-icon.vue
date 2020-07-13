<script lang="jsx">
  import {Icon as EjIcon} from '@ej/ui'

  import iconSet from '~/assets/dqs-icons.svg'

  export default {
    name: 'DqsIcon',

    functional: true,

    render (h, {data: $data}) {
      return <EjIcon {...{...$data, props: {...$data.props, iconSet}}}/>
    },
  }
</script>
