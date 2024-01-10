//
//		calculator.js
//

export function add ( ...operands ) {
	let result = 0 ;
	for ( const operand of operands ) result += +operand ;
	return result;
	}

console.log("Calculator module loaded");