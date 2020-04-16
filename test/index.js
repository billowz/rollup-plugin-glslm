const rollup = require('rollup'),
	nodeResolve = require('@rollup/plugin-node-resolve'),
	tape = require('tape'),
	glslm = require('../'),
	path = require('path')

const testReg = /^.*/

const shaders = {
	'glslify.js': {
		name: 'Glslify'
	},
	'basic.js': {
		name: 'Basic'
	},
	'import.js': {
		name: 'Import Module'
	}
}

Object.entries(shaders).forEach(([file, desc]) => {
	tape(desc.name, { skip: !testReg.test(file) }, (assert) => {
		rollup
			.rollup({
				input: path.resolve(__dirname, `fixtures/${file}`),
				plugins: [nodeResolve(), glslm({ inline: true, comments: false })]
			})
			.then((bundle) => bundle.generate({ format: 'es' }))
			.then((generated) => {
				console.log(generated.output[0].code)
				assert.end()
			})
			.catch((err) => {
				assert.error(err)
				assert.end()
			})
	})
})
