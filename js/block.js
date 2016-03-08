var rafID, cou = 0,
    cycle;

function load() {
    if (cou == 4) {
        cycle = setInterval(function() {
            if(animation)
            	animation();
        }, 500);
    }
    cou++;
}

window.ontouchstart=function(e){
	e.preventDefault();
}