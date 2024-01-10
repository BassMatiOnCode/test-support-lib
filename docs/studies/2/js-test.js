
export function initPage ( ) {
	for ( const iframe of document.querySelectorAll( "iframe.test-document" )) {
		iframe.contentWindow.addEventListener( "load", evt => {
			evt.currentTarget.frameElement.addEventListener( "resize", evt => {
				console.log( evt.target.scrollHeight );
				} ) ;
			} ) ;
	}	}
// Module init code
initPage();
