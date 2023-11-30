// <![CDATA[
$(function(){
var nav = $('#leftside'); // #sidebar is sticked to top if necessary
var navHomeY = nav.offset().top; 
var isFixed = false; 
var $w = $(window);
$w.scroll(function() {
var scrollTop = $w.scrollTop(); 
var shouldBeFixed = scrollTop > navHomeY;
if (shouldBeFixed && !isFixed) {
nav.css({
position:'fixed', top: 4, left: nav.offset().left, width: nav.width()
});
isFixed = true;
}
else if (!shouldBeFixed && isFixed)
{
nav.css({
position: 'static'
}); 
isFixed = false;
}
});
});
// ]]>
