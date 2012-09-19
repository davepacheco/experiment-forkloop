var mod_child = require('child_process');
var mod_contract = require('illumos_contract');

var template = {
	'type': 'process',
	'critical': {
	    'pr_empty': true,
	    'pr_hwerr': true,
	    'pr_core': true
	},
	'fatal': {
	    'pr_hwerr': true,
	    'pr_core': true
	},
	'param': {
		'noorphan': true
	}
};

var contract;
var count = 0;

function main()
{
	mod_contract.set_template(template);
	do_spawn();
}

function do_spawn()
{
	if (++count % 100 === 0)
		console.log('completed %d iterations', count);
	
	var child = mod_child.spawn('true', []);
	contract = mod_contract.latest();
	
	contract.on('pr_empty', done);
	contract.on('pr_hwerr', done);
	contract.on('pr_core', done);
}

function done(ev)
{
	console.log('critical contract event', ev);
	contract.abandon();
	contract.removeAllListeners();
	contract = undefined;

	do_spawn();
}

main();
