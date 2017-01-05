import 'babel-polyfill';
import $ from 'jquery';

$(".percentage").each(function(){
	var  width= $(this).text();
	$(this).css("width", width).empty();
});
