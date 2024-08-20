"use strict";
/*jshint esversion: 6 */

var doc;

window.onload = function() {
  doc = document;
  doc.getElementById('tbl1').onclick = tblClick;
  doc.getElementById('tbl2').onclick = tblClick;
  doc.getElementById('tbl3').onclick = tblClick;
  doc.getElementById('tbl4').onclick = tblClick;  
};


function tblClick(evt)
{
  let trgt = evt.target;
  if(trgt.tagName.toLowerCase() == 'td')
  {
    if (trgt.classList.contains('inp'))
    {
      let s = trgt.textContent;
      let inp = doc.createElement('input');
      inp.setAttribute('type', 'text'); inp.setAttribute('maxlength', '200');
      // inp.style.width = trgt.clientWidth + 'px';
      // inp.style.height = trgt.clientHeight + 'px';
      inp.id = 'vnos';
      inp.onblur = inpBlur;
      inp.value = s;
      trgt.innerHTML = '';
      trgt.appendChild(inp);
      inp.focus();
      if (trgt.hasAttribute('data-info')) { trgt.insertAdjacentHTML('beforeEnd', '<div class="info">' + trgt.dataset.info + '</div>'); }
    }
  }
}

function inpBlur(evt)
{
  let trgt = evt.target;
  let s = trgt.value.trim();
  let td = trgt.parentElement;
  trgt.remove();
  if (td.hasAttribute('data-tip')) 
  {
    if (td.dataset.tip == 'n')
    {
      if (/^-?\d+(\.\d{3})*(,\d+)?$/.test(s) == false) { window.alert("NAPAKA: neveljavno število"); td.innerHTML = ''; return; } else { s = (Number(s.replace(/\./g, '').replace(',', '.'))).toLocaleString('de-DE'); }
    }
    else if (td.dataset.tip == 'z')
    {
      if (/^-?\d+(\.\d{3})*(,\d+)?$/.test(s) == false) { window.alert("NAPAKA: neveljavni znesek"); td.innerHTML = ''; return; } else { s = (Number(s.replace(/\./g, '').replace(',', '.'))).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    }
    else if (td.dataset.tip == 'd')
    {
      if (/^\d{2}.\d{2}.20\d{2}$/.test(s) == false) { window.alert("NAPAKA: neveljavni datum"); td.innerHTML = ''; return; }
    }
  }
  td.innerHTML = s;
  if (td.parentElement.parentElement.id == 'bdy4') { calcTbl(); }
}


function rAdd()
{
  let n = doc.getElementById('bdy4').rows.length;
  let r = doc.getElementById('bdy4').insertRow(-1);
  r.innerHTML = '<tr><td class="inp"></td><td class="inp" data-tip="n"></td><td class="inp"></td><td class="inp" data-tip="z"></td><td class="inp" data-tip="n"></td><td></td><td></td><td></td><td><button type="button" onclick="rClr(this);">zbriši</button></td></tr>';
}

function rClr(o)
{
  let rl = doc.getElementById('bdy4').rows.length;
  if (rl > 1) 
  { 
    doc.getElementById('bdy4').deleteRow(o.parentNode.parentNode.rowIndex-1); 
  } 
  else 
  {
    doc.getElementById('bdy4').innerHTML = '<tr><td class="inp"></td><td class="inp" data-tip="n"></td><td class="inp"></td><td class="inp" data-tip="z"></td><td class="inp" data-tip="n"></td><td></td><td></td><td></td><td><button type="button" onclick="rClr(this);">zbriši</button></td></tr>';
  }
  calcTbl();
}


function calcTbl()
{
  let ri, r = doc.getElementById("tbl4").rows;
  let sum_c5 = 0, sum_c6 = 0, sum_c7 = 0;
  let arr_ddv = [], arr_ddvo = [], arr_ddvz = [];
  for (let i = 1, l = r.length; i < l; i++)
  {
    ri = r.item(i);
    if (ri.cells.item(1).textContent == '' || ri.cells.item(3).textContent == '' || ri.cells.item(4).textContent == '') 
    {
      ri.cells.item(5).textContent = '';
      ri.cells.item(6).textContent = '';
      ri.cells.item(7).textContent = '';
    }
    else
    {
      let c1 = Number(ri.cells.item(1).textContent.replace(/\./g, '').replace(',', '.'));  // količina
      let c3 = Number(ri.cells.item(3).textContent.replace(/\./g, '').replace(',', '.'));  // neto cena na enoto v €
      let c4 = Number(ri.cells.item(4).textContent.replace(',', '.'));  // ddv v %
      let c5 = c1 * c3;
      let c6 = c5 * c4 / 100;
      let c7 = c5 + c6;

      let n = arr_ddv.indexOf(c4);
      if (n == -1) { arr_ddv.push(c4); arr_ddvo.push(c5); arr_ddvz.push(c6); } else  { arr_ddvo[n] += c5; arr_ddvz[n] += c6; }

      sum_c5 += c5;
      sum_c6 += c6;
      sum_c7 += c7;

      ri.cells.item(5).textContent = c5.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      ri.cells.item(6).textContent = c6.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      ri.cells.item(7).textContent = c7.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  let s = '';
  for (let i = 0, l = arr_ddv.length; i < l; i++)
  {
    s += '<tr><td>' + arr_ddv[i].toLocaleString('de-DE') + '</td><td>' + arr_ddvo[i].toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td><td>' + arr_ddvz[i].toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td></tr>';
  }
  doc.getElementById("bdy4a").innerHTML = s;

  doc.getElementById("tbl4b").rows.item(0).cells.item(1).textContent = sum_c5.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  doc.getElementById("tbl4b").rows.item(1).cells.item(1).textContent = sum_c6.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  doc.getElementById("tbl4b").rows.item(2).cells.item(1).textContent = sum_c7.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });   
}


function date2xml(s)
{
  if (s) 
  {
    let a = s.split(".");
    return a[2] + "-" + a[1] + "-" + a[0];
  }
  else
  {
    return "";
  }  
}


function saveXml()
{
  if (doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent == '' || doc.getElementById("tbl1").rows.item(1).cells.item(0).textContent == '' || doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent == '' || doc.getElementById("tbl1").rows.item(9).cells.item(0).textContent == '' || doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent == '' || doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent == '' || doc.getElementById("tbl4b").rows.item(0).cells.item(1).textContent == '0,00') { window.alert("NAPAKA: vsi potrebni podatki niso vnešeni"); return; }

  let ss = `<?xml version="1.0" encoding="utf-8"?>
<Invoice xmlns="urn:eslog:2.00" xmlns:xs4xs="http://www.w3.org/2001/XMLSchema" xmlns:in="http://uri.etsi.org/01903/v1.1.1#" xmlns:io="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 <M_INVOIC Id="data">

  <S_UNH>
   <D_0062>` + doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent + `</D_0062>
   <C_S009>
    <D_0065>INVOIC</D_0065>
    <D_0052>ISS</D_0052>
    <D_0054>001</D_0054>
    <D_0051>ER</D_0051>
   </C_S009>
  </S_UNH>
  <S_BGM>
   <C_C002>
    <D_1001>380</D_1001>
   </C_C002>
   <C_C106>
    <D_1004>` + doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent + `</D_1004>
   </C_C106>
  </S_BGM>
  <S_DTM>
   <C_C507>
    <D_2005>137</D_2005>
    <D_2380>` + date2xml(doc.getElementById("tbl3").rows.item(1).cells.item(2).textContent) + `</D_2380>
   </C_C507>
  </S_DTM>
  <S_DTM>
   <C_C507>
    <D_2005>35</D_2005>
    <D_2380>` + date2xml(doc.getElementById("tbl3").rows.item(1).cells.item(3).textContent) + `</D_2380>
   </C_C507>
  </S_DTM>
  <S_FTX>
      <D_4451>GEN</D_4451>
      <C_C108>
          <D_4440>` + doc.getElementById("tbl3").rows.item(1).cells.item(5).textContent + `</D_4440>
      </C_C108>
  </S_FTX>
  <G_SG1>
   <S_RFF>
    <C_C506>
     <D_1153>PQ</D_1153>
     <D_1154>` + doc.getElementById("tbl3").rows.item(1).cells.item(1).textContent + `</D_1154>
    </C_C506>
   </S_RFF>
  </G_SG1>

  <G_SG2>
   <S_NAD>
    <D_3035>SE</D_3035>
    <C_C080>
     <D_3036>` + doc.getElementById("tbl1").rows.item(1).cells.item(0).textContent + `</D_3036>
    </C_C080>
    <C_C059>
     <D_3042>` + doc.getElementById("tbl1").rows.item(3).cells.item(0).textContent + `</D_3042>
    </C_C059>
    <D_3164>` + doc.getElementById("tbl1").rows.item(5).cells.item(1).textContent + `</D_3164>
    <C_C819>
     <D_3228>Slovenija</D_3228>
    </C_C819>
    <D_3251>` + doc.getElementById("tbl1").rows.item(5).cells.item(0).textContent + `</D_3251>
    <D_3207>SI</D_3207>
   </S_NAD>
   <S_FII>
    <D_3035>RB</D_3035>
    <C_C078>
     <D_3194>` + doc.getElementById("tbl1").rows.item(9).cells.item(0).textContent + `</D_3194>
     <D_3192></D_3192>
    </C_C078>
    <C_C088>
     <D_3433>` + doc.getElementById("tbl1").rows.item(9).cells.item(1).textContent + `</D_3433>
    </C_C088>
   </S_FII>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>VA</D_1153>
      <D_1154>` + doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>AHP</D_1153>
      <D_1154>` + doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>0199</D_1153>
      <D_1154>` + doc.getElementById("tbl1").rows.item(7).cells.item(1).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>   
  </G_SG2>

  <G_SG2>
   <S_NAD>
    <D_3035>BY</D_3035>
    <C_C080>
     <D_3036>` + doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent + `</D_3036>
    </C_C080>
    <C_C059>
     <D_3042>` + doc.getElementById("tbl2").rows.item(3).cells.item(0).textContent + `</D_3042>
    </C_C059>
    <D_3164>` + doc.getElementById("tbl2").rows.item(5).cells.item(1).textContent + `</D_3164>
    <C_C819>
     <D_3228>Slovenija</D_3228>
    </C_C819>
    <D_3251>` + doc.getElementById("tbl2").rows.item(5).cells.item(0).textContent + `</D_3251>
    <D_3207>SI</D_3207>
   </S_NAD>
   <S_FII>
    <D_3035>BB</D_3035>
    <C_C078>
     <D_3194></D_3194>
    </C_C078>
    <C_C088>
     <D_3433></D_3433>
    </C_C088>
   </S_FII>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>VA</D_1153>
      <D_1154>` + doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>AHP</D_1153>
      <D_1154>` + doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
  </G_SG2>

  <G_SG2>
   <S_NAD>
    <D_3035>DP</D_3035>
    <C_C080>
     <D_3036>` + doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent + `</D_3036>
    </C_C080>
    <C_C059>
     <D_3042>` + doc.getElementById("tbl2").rows.item(3).cells.item(0).textContent + `</D_3042>
    </C_C059>
    <D_3164>` + doc.getElementById("tbl2").rows.item(5).cells.item(1).textContent + `</D_3164>
    <C_C819>
     <D_3228>Slovenija</D_3228>
    </C_C819>
    <D_3251>` + doc.getElementById("tbl2").rows.item(5).cells.item(0).textContent + `</D_3251>
    <D_3207>SI</D_3207>
   </S_NAD>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>VA</D_1153>
      <D_1154>` + doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
   <G_SG3>
    <S_RFF>
     <C_C506>
      <D_1153>AHP</D_1153>
      <D_1154>` + doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent + `</D_1154>
     </C_C506>
    </S_RFF>
   </G_SG3>
  </G_SG2>

  <G_SG7>
   <S_CUX>
    <C_C504>
     <D_6347>2</D_6347>
     <D_6345>EUR</D_6345>
    </C_C504>
   </S_CUX>
  </G_SG7>

  <G_SG8>
   <S_PAT>
    <D_4279>1</D_4279>
   </S_PAT>
   <S_DTM>
    <C_C507>
     <D_2005>13</D_2005>
     <D_2380>` + date2xml(doc.getElementById("tbl3").rows.item(1).cells.item(4).textContent) + `</D_2380>
    </C_C507>
   </S_DTM>
  </G_SG8>`;

  let ri, r = doc.getElementById("tbl4").rows;
  for (let i = 1, l = r.length, ii = 1; i < l; i++)
  {
    ri = r.item(i);
    if (ri.cells.item(7).textContent == '') { continue; }
    ss +=
  `<G_SG26>
   <S_LIN>
    <D_1082>` + (ii++) + `</D_1082>
   </S_LIN>
   <S_IMD>
    <D_7077>F</D_7077>
    <C_C273>
     <D_7008>` + ri.cells.item(0).textContent + `</D_7008>
    </C_C273>
   </S_IMD>
   <S_QTY>
    <C_C186>
     <D_6063>47</D_6063>
     <D_6060>` + ri.cells.item(1).textContent.replace(',', '.') + `</D_6060>
     <D_6411>` + ri.cells.item(2).textContent + `</D_6411>
    </C_C186>
   </S_QTY>
   <G_SG27>
    <S_MOA>
     <C_C516>
      <D_5025>203</D_5025>
      <D_5004>` + ri.cells.item(5).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
     </C_C516>
    </S_MOA>
   </G_SG27>
   <G_SG27>
    <S_MOA>
     <C_C516>
      <D_5025>38</D_5025>
      <D_5004>` + ri.cells.item(7).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
     </C_C516>
    </S_MOA>
   </G_SG27>
   <G_SG29>
    <S_PRI>
     <C_C509>
      <D_5125>AAB</D_5125>
      <D_5118>` + ri.cells.item(3).textContent.replace(/\./g, '').replace(',', '.') + `</D_5118>
      <D_5284>1.00</D_5284>
      <D_6411>C62</D_6411>
     </C_C509>
    </S_PRI>
   </G_SG29>
   <G_SG29>
    <S_PRI>
     <C_C509>
      <D_5125>AAA</D_5125>
      <D_5118>` + ri.cells.item(3).textContent.replace(/\./g, '').replace(',', '.') + `</D_5118>
      <D_5284>1.00</D_5284>
      <D_6411>C62</D_6411>
     </C_C509>
    </S_PRI>
   </G_SG29>
   <G_SG34>
    <S_TAX>
     <D_5283>7</D_5283>
     <C_C241>
      <D_5153>VAT</D_5153>
     </C_C241>
     <C_C243>
      <D_5278>` + ri.cells.item(4).textContent.replace(',', '.') + `</D_5278>
     </C_C243>
     <D_5305>S</D_5305>
    </S_TAX>
    <S_MOA>
     <C_C516>
      <D_5025>124</D_5025>
      <D_5004>` + ri.cells.item(6).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
     </C_C516>
    </S_MOA>
    <S_MOA>
     <C_C516>
      <D_5025>125</D_5025>
      <D_5004>` + ri.cells.item(5).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
     </C_C516>
    </S_MOA>
   </G_SG34>
  </G_SG26>`;
  }

  ss +=
  `<G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>9</D_5025>
     <D_5004>` + doc.getElementById("tbl4b").rows.item(2).cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>
  <G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>388</D_5025>
     <D_5004>` + doc.getElementById("tbl4b").rows.item(2).cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>
  <G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>79</D_5025>
     <D_5004>` + doc.getElementById("tbl4b").rows.item(0).cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>
  <G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>204</D_5025>
     <D_5004>0.00</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>
  <G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>389</D_5025>
     <D_5004>` + doc.getElementById("tbl4b").rows.item(0).cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>
  <G_SG50>
   <S_MOA>
    <C_C516>
     <D_5025>176</D_5025>
     <D_5004>` + doc.getElementById("tbl4b").rows.item(1).cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG50>`;

  r = doc.getElementById("tbl4a").rows;
  for (let i = 1, l = r.length; i < l; i++)
  {
    ri = r.item(i);
    ss +=
  `<G_SG52>
   <S_TAX>
    <D_5283>7</D_5283>
    <C_C241>
     <D_5153>VAT</D_5153>
    </C_C241>
    <C_C243>
     <D_5278>` + ri.cells.item(0).textContent.replace(',', '.') + `</D_5278>
    </C_C243>
    <D_5305>S</D_5305>
   </S_TAX>
   <S_MOA>
    <C_C516>
     <D_5025>124</D_5025>
     <D_5004>` + ri.cells.item(2).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
   <S_MOA>
    <C_C516>
     <D_5025>125</D_5025>
     <D_5004>` + ri.cells.item(1).textContent.replace(/\./g, '').replace(',', '.') + `</D_5004>
    </C_C516>
   </S_MOA>
  </G_SG52>`;
  }

  ss +=
`</M_INVOIC>
</Invoice>`;

  // file download
  let el = doc.createElement('a');
  el.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(ss));
  el.setAttribute('download', 'eracun.xml');
  el.style.display = 'none';
  doc.body.appendChild(el);
  el.click();
  doc.body.removeChild(el);

  // save to storage
  saveJson();
}



function saveJson()
{
  let a = [];
  a.push(doc.getElementById("tbl1").rows.item(1).cells.item(0).textContent);
  a.push(doc.getElementById("tbl1").rows.item(3).cells.item(0).textContent);
  a.push(doc.getElementById("tbl1").rows.item(5).cells.item(0).textContent);
  a.push(doc.getElementById("tbl1").rows.item(5).cells.item(1).textContent);
  a.push(doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent);
  a.push(doc.getElementById("tbl1").rows.item(7).cells.item(1).textContent);
  a.push(doc.getElementById("tbl1").rows.item(9).cells.item(0).textContent);
  a.push(doc.getElementById("tbl1").rows.item(9).cells.item(1).textContent);

  a.push(doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent);
  a.push(doc.getElementById("tbl2").rows.item(3).cells.item(0).textContent);
  a.push(doc.getElementById("tbl2").rows.item(5).cells.item(0).textContent);
  a.push(doc.getElementById("tbl2").rows.item(5).cells.item(1).textContent);
  a.push(doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent);

  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent);
  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(1).textContent);
  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(2).textContent);
  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(3).textContent);
  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(4).textContent);
  a.push(doc.getElementById("tbl3").rows.item(1).cells.item(5).textContent);

  let bb = [];
  let r = doc.getElementById("tbl4").rows;
  for (let i = 1, l = r.length, ii = 1, ri, b; i < l; i++)
  {
    b = [];
    ri = r.item(i);
    if (ri.cells.item(7).textContent == '') { continue; }
    b.push(ri.cells.item(0).textContent);
    b.push(ri.cells.item(1).textContent);
    b.push(ri.cells.item(2).textContent);
    b.push(ri.cells.item(3).textContent);
    b.push(ri.cells.item(4).textContent);
    bb.push(b);
  }

  window.localStorage.setItem("eracun", '{"a":' + JSON.stringify(a) + ',"bb":' + JSON.stringify(bb) + '}');
}

function loadJson()
{
  let ss = window.localStorage.getItem("eracun");
  if (ss)
  {
    const o = JSON.parse(ss);

    doc.getElementById("tbl1").rows.item(1).cells.item(0).textContent = o.a[0];
    doc.getElementById("tbl1").rows.item(3).cells.item(0).textContent = o.a[1];
    doc.getElementById("tbl1").rows.item(5).cells.item(0).textContent = o.a[2];
    doc.getElementById("tbl1").rows.item(5).cells.item(1).textContent = o.a[3];
    doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent = o.a[4];
    doc.getElementById("tbl1").rows.item(7).cells.item(1).textContent = o.a[5];
    doc.getElementById("tbl1").rows.item(9).cells.item(0).textContent = o.a[6];
    doc.getElementById("tbl1").rows.item(9).cells.item(1).textContent = o.a[7];

    doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent = o.a[8];
    doc.getElementById("tbl2").rows.item(3).cells.item(0).textContent = o.a[9];
    doc.getElementById("tbl2").rows.item(5).cells.item(0).textContent = o.a[10];
    doc.getElementById("tbl2").rows.item(5).cells.item(1).textContent = o.a[11];
    doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent = o.a[12];

    doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent = o.a[13];
    doc.getElementById("tbl3").rows.item(1).cells.item(1).textContent = o.a[14];
    doc.getElementById("tbl3").rows.item(1).cells.item(2).textContent = o.a[15];
    doc.getElementById("tbl3").rows.item(1).cells.item(3).textContent = o.a[16];
    doc.getElementById("tbl3").rows.item(1).cells.item(4).textContent = o.a[17];
    doc.getElementById("tbl3").rows.item(1).cells.item(5).textContent = o.a[18];

    let s = '';
    for(let i = 0, l = o.bb.length; i < l; i++) 
    {
      s += '<tr><td class="inp">' + o.bb[i][0] + '</td><td class="inp" data-tip="n">' + o.bb[i][1] + '</td><td class="inp">' + o.bb[i][2] + '</td><td class="inp" data-tip="z">' + o.bb[i][3] + '</td><td class="inp" data-tip="n">' + o.bb[i][4] + '</td><td></td><td></td><td></td><td><button type="button" onclick="rClr(this);">zbriši</button></td></tr>';
    }
    doc.getElementById("bdy4").innerHTML = s;
    calcTbl();
  }
}

function novRacun()
{
  doc.getElementById("tbl1").rows.item(1).cells.item(0).textContent = '';
  doc.getElementById("tbl1").rows.item(3).cells.item(0).textContent = '';
  doc.getElementById("tbl1").rows.item(5).cells.item(0).textContent = '';
  doc.getElementById("tbl1").rows.item(5).cells.item(1).textContent = '';
  doc.getElementById("tbl1").rows.item(7).cells.item(0).textContent = '';
  doc.getElementById("tbl1").rows.item(7).cells.item(1).textContent = '';
  doc.getElementById("tbl1").rows.item(9).cells.item(0).textContent = '';
  doc.getElementById("tbl1").rows.item(9).cells.item(1).textContent = '';

  doc.getElementById("tbl2").rows.item(1).cells.item(0).textContent = '';
  doc.getElementById("tbl2").rows.item(3).cells.item(0).textContent = '';
  doc.getElementById("tbl2").rows.item(5).cells.item(0).textContent = '';
  doc.getElementById("tbl2").rows.item(5).cells.item(1).textContent = '';
  doc.getElementById("tbl2").rows.item(7).cells.item(0).textContent = '';

  doc.getElementById("tbl3").rows.item(1).cells.item(0).textContent = '';
  doc.getElementById("tbl3").rows.item(1).cells.item(1).textContent = '';
  doc.getElementById("tbl3").rows.item(1).cells.item(2).textContent = '';
  doc.getElementById("tbl3").rows.item(1).cells.item(3).textContent = '';
  doc.getElementById("tbl3").rows.item(1).cells.item(4).textContent = '';
  doc.getElementById("tbl3").rows.item(1).cells.item(5).textContent = '';

  doc.getElementById('bdy4').innerHTML = '<tr><td class="inp"></td><td class="inp" data-tip="n"></td><td class="inp"></td><td class="inp" data-tip="z"></td><td class="inp" data-tip="n"></td><td></td><td></td><td></td><td><button type="button" onclick="rClr(this);">zbriši</button></td></tr>';

  calcTbl();
}

// pwa
if (navigator.serviceWorker) { navigator.serviceWorker.register("sw.js"); }

