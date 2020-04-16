const { createFilter } = require('rollup-pluginutils')
const glslm = require('glslm')

module.exports = function (userOptions = {}) {
	const options = Object.assign(
			{
				include: ['**/*.vs', '**/*.fs', '**/*.vert', '**/*.frag', '**/*.glsl']
			},
			userOptions
		),
		filter = createFilter(options.include, options.exclude),
		loader = new glslm(options)

	return {
		name: 'glslm',
		load(id) {
			console.log('loading module:', id)
			if (!filter(id)) return
			console.log('loading glsl module:', id)
			if (loader.modules[id]) {
				console.log('clean modules:', id)
				loader.clean()
			}
			return loader.load(id).then((m) => {
				if (options.inline) {
					return `export default function(){\n\treturn \`${m.toString({}, options.comments)}\`\n}`
				}
				return options.typescript ? m.toTSM(options.comments) : m.toESM(options.comments)
			})
		}
	}
}
