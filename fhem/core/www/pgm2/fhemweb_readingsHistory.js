
FW_version["fhemweb_readingsHistory.js"] = "$Id: fhemweb_readingsHistory.js 15189 2017-10-03 17:53:27Z justme1968 $";

function
FW_readingsHistoryUpdateLine(d){

  var dd = d[0].split("-", 3);

  if(dd.length != 2) 
    return;

  var clear = 0;
  if( dd[1] == "clear" )
    clear = 1;
  else if( dd[1] != "history" ) 
    return;

  var name = dd[0] + "-history";

  el = document.getElementById(name);

  if( el ) {
    var rows = el.getAttribute("rows");
    var lines = el.innerHTML.split( "<br>", rows );

    el.innerHTML = d[1] + "<br>";
    for( i = 0; i <= rows-2; ++i ) 
      {
        if( !clear )
          el.innerHTML += lines[i];

        el.innerHTML += "<br>";
      }
  }


}

function FW_readingsHistoryCreate(elName, devName, vArr, currVal, set, params, cmd)
{
}

FW_widgets['readingsHistory'] = {
  createFn:FW_readingsHistoryCreate,
  updateLine:FW_readingsHistoryUpdateLine
};


/*
=pod
=cut
*/
