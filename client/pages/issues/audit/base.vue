<script lang="jsx">
  import enumerate from '~/js/enum'

  import SolveView from './solve'
  import CreateView from './create'

  export default {
    name: 'Audit',
    functional: true,
    render: (h, {props, parent}) => {
      let auditName = props.auditName
      let issueAudit = enumerate.issueAudit
      if (auditName === issueAudit.completion.value) {
        return <CreateView auditName={auditName} on-change={() => parent.gotoList()}/>
      } else {
        return <SolveView auditName={auditName} on-change={() => parent.gotoList()}/>
      }
    },
  }
</script>

<style scoped>

</style>
