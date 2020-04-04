<template lang="pug">
  .editable-wrapper
    .header.inner
      h1.page-title.questrial 
        span.f7 
          i.ico.f5(v-if="page.entry.icon") {{page.entry.icon}}
          span(v-html="page.entry.name")
        span.f3(v-if="langs") 
          span.ml1(
            v-for="l, k in langs"
          )
            nuxt-link.pink( :to="l.path" ) {{k}}
      .actions( v-if="canEdit && !page.static" )
        button.button(
          @click="toggleEdit"
          v-show="editMode"
        ) 
          i.ico undo
          span Cancel
        button.button(
          @click="toggleEdit"
          v-show="!editMode"
        ) 
          i.ico edit
          span Edit
        button.button.black(
          style="margin-left: 0.5em"
          v-show="editMode"
          @click="saveEdit"
        ) 
          i.ico save_alt
          span Save
        p.error {{errorMessage}}
      .actions( v-else-if="canEdit && page.static" )
        nuxt-link.button(to="/ofdocs/contribute/")
          i.ico edit
          span Edit
    .rendered( v-show="!editMode" )
      doc-page(  v-if="page.type === 'page'" v-bind="page" )
      list-page( v-else-if="page.type === 'folder'" v-bind="page" :showDoc="true" )
      //- slot( name="actions" )
    textarea.markdown-editor(  
      v-show="editMode"
      ref="editor" 
      :rows="editorLines"
      v-model="page.raw"
      @input="editorChanged"
    )
</template>

<script>
import DocPage from '~/components/_DocPage.vue'
import ListPage from '~/components/_ListPage.vue'
export default {
  props: ['page'],
  components: {
    DocPage,
    ListPage
  },
  computed: {
    canEdit() {
      const p = this.$props.page;
      if (p.type === 'page') return true;
      if (p.type === 'folder' && p.intro.path ) return true;
      return false;
    },
    langs() {
      if (this.$props.page.intro) return this.$props.page.intro.translations;
      if (this.$props.page.entry.translations) return this.$props.page.entry.translations;
      return false;
    }
  },
  data() {
    return {
      editMode: false,
      editorLines: 0,
      errorMessage: ""
    }
  },
  methods: {
    updateLines() {

      this.$nextTick( () => {

        const l = this.$refs.editor.value.split(/\r\n|\r|\n/).length;
        if (l !== this.editorLines) this.editorLines = l;
      });
    },
    editorChanged(e) {
      this.updateLines();
    },
    toggleEdit() {
      this.errorMessage = "";
      this.editMode = !this.editMode;
    },
    saveEdit() {
      const p = this.$props.page;
      let path = p.entry.path;
      const isFolder = (p.type === 'folder' && p.intro.path);
      if (isFolder) path = p.intro.path;
      const v = this.$refs.editor.value;

      this.errorMessage = "";

      this.$axios.$post(path, v ).then( data => {
        console.log('✅  [EditWrapper.vue] success saving edit', this.$props.page.entry.absolute);
        if (isFolder) {
          console.log(p.entry.path);
          this.$axios.$get( p.entry.path + '?as=json' ).then( d => this.$emit( 'updatePage', d ));
        } else {
          this.$emit( 'updatePage', data );
        }
        this.editMode = false;
      }).catch( err => {
        console.error('❌  [EditWrapper.vue] error saving edit:', err);
        this.errorMessage = "Error saving edit";
      });
    },
  },
  created() {

  },
  mounted() {
    this.updateLines();
  }
}
</script>
