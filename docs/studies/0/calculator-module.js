//	
//	calculator-module.js
//
console.log( "Loading calculator module." );
export function sum ( ...args ) {
	let result = 0;
	for ( const n of args ) result += n ;
	return result;
	}
export function product( ...args ) {
	let result = 1;
	for ( const n of args ) result *= n ;
	return result;
	}
export function arithmeticMean ( ...args ) {
	let result = 0;
	return sum ( ...args ) / args.length ;
	}
export function geometricMean ( ...args ) {
	let result = 1;
	for ( const n of args ) result *= n ** 2 ;
	return Math.pow( result, 1 / args.length );
	}

console.log( "Calculator module has been loaded." );