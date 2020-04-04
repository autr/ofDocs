const ofCoreAddons = '{ofxAccelerometer,ofxAndroid,ofxAssimpModelLoader,ofxEmscripten,ofxGPS,ofxGui,ofxKinect,ofxNetwork,ofxOpenCv,ofxOsc,ofxPoco,ofxSvg,ofxThreadedImageLoader,ofxUnitTests,ofxVectorGraphics,ofxXmlSettings,ofxiOS}';
const allAddons = '*';

module.exports = {

  test: (args, e) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(args,e);
  },
	meta: {
		baseTitle: 'ofDocs',
		baseDesc: 'openFrameworks documentation and examples browser'
	},
	directories: {
		ofDocs: {
			dir: './',
			pattern: '*.md'
		},
		documentation: {
			dir: '../ofSite/documentation/',
			pattern: '**/*.{markdown,md,png,svg,jpg,gif}'
		},
		openFrameworks: {
			dir: '../libs/openFrameworks/',
			pattern: '*/*.{h,cpp}'
		},
		guides: {
			dir: '../ofSite/content/setup/',
			pattern: '**/*.{markdown,md,png,svg,jpg,gif}',
		},
		examples: {
			dir: '../examples/',
			pattern: '*/*/{src/*.{h,cpp,mm},*.{md,png,jpg,gif}}'
		},
		addons: {
			dir: '../addons/',
			pattern: ofCoreAddons+'/{src/*.{cpp,h,mm},example*/src/*.{cpp,h,mm},**.{png,jpg,md,markdown,gif}}'
		},
		files: {
			dir: '../ofSite/files/',
			pattern: '*/*.{markdown,md,png,svg,jpg,jpeg}'
		}
	},
	navigation: [ 
		['documentation', 4], 
		['examples', 3], 
		['openFrameworks', 3], 
		['addons', 3], 
		['guides', 2]
	],
	filters: ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn' ],
	exts: {
		page: ['md','markdown','html'],
		source: ['cpp','h','mm'],
		asset: ['png','svg','jpg','jpeg','gif']
	},
	icons: {
		"application": "web",
		"app": "web",
		"addons": "extension",
		"communication": "language",
		"events": "question_answer",
		"graphics": "category",
		"math": "border_clear",
		"sound": "volume_up",
		"types": "ring_volume",
		"utils": "build",
		"video": "videocam",
		"android": "android",
		"computer_vision": "remove_red_eye",
		"gui": "tune",
		"input_output": "flash_on",
		"ios": "phone_iphone",
		"shader": "waves",
		"strings": "text_format",
		"templates": "amp_stories",
		"threads": "texture",
		"tvOS": "live_tv",
		"windowing": "border_all"
	}
}