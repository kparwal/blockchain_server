//run this with node test.js

var merkle_base = require('./merkle.js');
mytree = new merkle_base();
mytree.add(1, {
	'name': 'keshav',
	'age': 19
})

// console.log(mytree);

mytree.add(2, {
	'name': 'utkarsh',
	'age': 21
})


mytree.add(3, {
	'name': 'something2',
	'age': 22
})


mytree.add(4, {
	'name': 'something3',
	'age': 23
})

var obj = {
	'name': 'something3',
	'age': 23
};

console.log(mytree);
console.log(mytree.find(4))