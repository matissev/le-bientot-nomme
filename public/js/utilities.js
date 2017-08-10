/* Add class raw javascript */

function hasClass(ele,cls) {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function removeClass(element, className) {
    if (element && hasClass(element,className)) {
        var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
        element.className = ' ' + element.className.replace(reg,'') + ' ';
    }
}

function addClass(element, className) {
    if (element && !hasClass(element,className)) {
        element.className += '  '+ className + '  ';
    }
}