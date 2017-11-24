
FW_version["doif.js"] = "$Id: doif.js 15353 2017-10-30 12:47:07Z Ellert $";

function doifUpdateCell(doifname,attrname,attrcont,content,style) {
    $("table[uitabid='DOIF-"+doifname+"']").find("div["+attrname+"='"+attrcont+"']").each(function() {
        if(this.setValueFn) {     // change widget value
          this.setValueFn(content.replace(/\n/g, '\u2424'));
        } else {
          $(this).html(content+"");
          if(style)
            $(this).attr("style",style);
        }
    });
}