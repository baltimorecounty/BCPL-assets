const files = (folder) => [
	'js/apps/shared/**/*.js',
	'js/bootstrap*.js',
	`js/apps/${folder}/app.js`,
	`js/apps/${folder}/constants.js`,
	`js/apps/${folder}/events-page.config.js`,
	`js/apps/${folder}/filters/**/*.js`,
	`js/apps/${folder}/dataServices/**/*.js`,
	`js/apps/${folder}/services/**/*.js`,
	`js/apps/${folder}/models/**/*.js`,
	`js/apps/${folder}/controllers/**/*.js`,
	`js/apps/${folder}/directives/**/*.js`,
	`!js/apps/${folder}/directives/**/featuredEvents.js`
];

module.exports = files;
