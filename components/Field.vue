////////////////////////////////////////////////////////
////// Validation *rules* handled by vee-validate: /////
////// http://vee-validate.logaretm.com/rules.html /////
////////////////////////////////////////////////////////

<!-- 

		value: 0,
		id: 'Hello',
		autocomplete: true,
		type: 'input',
		disabled: false,
		placeholder: 'Enter'
		options: ['A'],
		rows: 4 -->


<template lang="pug">
	.field(
		:class="fieldClasses"
	)
		.field-inner
			slot
			.text-wrapper( 
				v-if="inputType"
				)
				input(
					v-debounce:400ms="onDebounce" 
					v-model="internalValue"
					:id="id"
					@change="onValueChange"
					:name="id"
					:disabled="disabled"
					:placeholder="placeholder"
					:type="inputType" 
					:autocomplete="(autocomplete) ? 'on' : 'off'"
					:tabindex="tabindex"
				)
			.text-wrapper( 
				v-if=" type == 'textarea' "
				)
				textarea(

					v-model="internalValue"
					:id="id"
					@change="onValueChange"
					:rows="rows"
					:name="id"
					:disabled="disabled"
					:placeholder="placeholder"
					:type="inputType" 
					:autocomplete="(autocomplete) ? 'true' : 'false'"
					:tabindex="tabindex"
				)
			.select-wrapper( 
				v-if=" type == 'select' "
				)
				svg(xmlns='http://www.w3.org/2000/svg' viewBox='-5 -5 15 15' )
					path.arrow(d='M 0 5 L 5 10 L 10 5' )
				select(

					v-model="internalValue"
					:id="id"
					@change="onValueChange"
					:placeholder="placeholder"
					:disabled="disabled"
				).select-input
					option(
						v-for="o, i in options()"
						:key="i"
						:id="i"
						:value="i"
					) {{ o.name }}
				.text-wrapper: span( v-if="options()[internalValue]") {{ options()[internalValue].name }}


</template>


<script>


export default {
	created() {
	},
	watch: {
		value(v) {
			this.internalValue = v;
		}
	},
    computed: {
    	inputType() {
    		switch (this.$props.type) {
			  case 'text':
			  	return 'text';
			    break;
			  case 'input':
			  	return 'text';
			    break;
			  case 'password':
			  	return 'password';
			    break;
			  case 'email':
			  	return 'email';
			    break;
			  default:
			  	return false;
			    break;
			}
    	},
    	fieldClasses() {
    		return {
    			disabled: this.$props.disabled,
    			[this.$props.type] : true
    		}
    	},
		arrowPath() {
			return `M ${this.height * 0.3} ${this.height * 0.4} L ${this.height * 0.5} ${this.height * 0.6} L ${this.height * 0.7} ${this.height * 0.4}`;
		}
    },
    data() {
    	return {
    		internalValue: null
    	}
    },
    mounted() {
    	this.internalValue = this.$props.value;
    },
	name: 'field',
	components: {
	},
	methods: {
		onDebounce(o) {

			console.log('🕹 [Field.vue] debounce:', this.$props.id);
			this.$emit('update:value', this.internalValue );
			this.$emit('onChange', this.internalValue );
		},
		onValueChange(o) {
			console.log('🕹 [Field.vue] changed:', this.$props.id);
			this.$emit('update:value', this.internalValue );
			this.$emit('onChange', this.internalValue );
		}
	},
	props: {
		value: {
			required: true
		},
		id: {
			type: String,
			required: true
		},
		autocomplete: {
			type: Boolean,
			required: false,
			default: false
		},
		type: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		rules: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		options: {
			type: Function,
			required: false,
			default: (obj) => {
				return ['Option A', 'Option B', 'Option C']
			}
		},
		rows: {
			type: Number,
			required: false,
			default: 12
		},
		tabindex: {
			type: Number,
			required: false,
			default: 0
		}
	}
}
</script>