function track_search(item_id)
{
	var tr_search 		= '';
    var user_id 		= 0;
    var exclusive_file 	= 1;


    if (typeof item_id=='undefined')
    {
        item_id = $$("#imgView").getAttribute('data-id');    
    }

    if (document.location.href.indexOf('#') != '-1') {
        var hash = document.location.href.split('#');
        if (typeof(hash[1]) !== "undefined") tr_search = hash[1] + "&";
    }
    if ((typeof gr !== 'undefined') && gr.auth.logged) user_id = gr.auth.me.id;
    
    if (tr_search!='' && typeof item_id!='undefined' )
    {
        var new_image = new Image();
        var src="https://trk.flaticon.com/search.gif?" + tr_search + "pg=detalle-english&id="+item_id+"&userid=" + user_id + "&exclusive=" + exclusive_file + "&r=" + Math.random();
        new_image.src=src;
        new_image.onload = function() {};
        new_image.onerror = function() {};
    }

    
}