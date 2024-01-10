
export function initPage ( ) {
	// Monitor iframe size changes
	function handleSizeChange( entries ) {
		// Set the iframe (=this) height 
		this.style.height = entries[0].target.parentElement.scrollHeight + 1 + "px" ;
		}
	// Add a window load event handler to all iframe content windows
	const iframes = document.querySelectorAll( "iframe.test-document");
	for ( const iframe of iframes ) {
		iframe.contentWindow.addEventListener( "load", evt => {
			const observer = new ResizeObserver( handleSizeChange.bind( evt.currentTarget.frameElement ));
			observer.observe( evt.target.body );
		} ) ;
	}	}
// Module init code
initPage();
