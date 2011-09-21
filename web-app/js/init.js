/*
 * ******************************************************************************
 *  ? 2011 SunGard Higher Education.  All Rights Reserved.
 *
 *  CONFIDENTIAL BUSINESS INFORMATION
 *
 *  THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 *  AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 *  NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 *  WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 *  ******************************************************************************
 */

function prepareBuffer() {
    var objNew = document.createElement( 'p' );
    var objHidden = document.createElement( 'input' );

    objHidden.setAttribute( 'type', 'hidden' );
    objHidden.setAttribute( 'value', '1' );
    objHidden.setAttribute( 'id', 'virtualbufferupdate' );
    objHidden.setAttribute( 'name', 'virtualbufferupdate' );

    objNew.appendChild( objHidden );
    document.body.appendChild( objNew );
}

function updateBuffer() {
    var objHidden = document.getElementById( 'virtualbufferupdate' );

    if ( objHidden ) {
        if ( objHidden.getAttribute( 'value' ) == '1' )
            objHidden.setAttribute( 'value', '0' );
        else
            objHidden.setAttribute( 'value', '1' );
    }
}
/**
 * @class Blocker class when activated blocks user interaction on the screen
 */
var Blocker = {

    div : $( "<div id='blocker' />" ),

    block : function() {
        if ( $( '#blocker' ).length == 0 ) {
            $( 'body' ).prepend( Blocker.div );
        }
        if ( jQuery.browser.msie ) {
            Blocker.div.addClass( 'on' );
        } else {
            // Blocker.div.animate({ opacity: 0.1, height: '100%', width: '100%'
            // }, 100);
        }

        // change cursor to 'wait' till data is retrieved
        document.body.style.cursor = 'wait';
        // provide a 15 sec window for the blocker, if the application doesn't call
        // unblock, force it.
        setTimeout( Blocker.unblock, 15000 )
    },

    unblock : function() {
        if ( $( '#blocker' ).length > 0 ) {
            Blocker.div.animate( {
                opacity : 0,
                height : '100%',
                width : '100%'
            }, 100 );
            Blocker.div.remove();
            // change cursor to 'wait' till data is retrieved
            document.body.style.cursor = 'default';
        }
    }
};


initialize = function() {
    // if page not initialized, stop
    /*if ( $( '.zk-content' ).length == 0 ) {
        intervalId = setTimeout( 'initialize()', 200 );
        return;
    }
    if ( typeof intervalId != "undefined" )
        clearTimeout( intervalId );*/

    CommonPlatform.initialize( {
        standalone : true,
        globalNav : true,
        header : true,
        footer : true,
        handler : function( data ) {
        }
    } );

    Blocker.unblock();

}

$( document ).ready( function() {
//	Blocker.block();
    initialize();
} );
