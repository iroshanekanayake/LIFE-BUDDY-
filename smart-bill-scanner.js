/* LIFE-BUDDY Smart Bill Scanner v1 - OCR is a suggestion; user must confirm. */
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  var file=null,ocrBusy=false,worker=null;
  var DB_NAME='life-buddy-local-bills', STORE='photos';
  function openPhotoDB(){return new Promise(function(resolve,reject){var req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=function(){var db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
  async function putPhoto(id,blob,createdAt){var db=await openPhotoDB();return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({id:id,blob:blob,createdAt:createdAt});tx.oncomplete=function(){db.close();resolve()};tx.onerror=function(){db.close();reject(tx.error)}})}
  async function getPhoto(id){var db=await openPhotoDB();return new Promise(function(resolve,reject){var req=db.transaction(STORE,'readonly').objectStore(STORE).get(id);req.onsuccess=function(){db.close();resolve(req.result||null)};req.onerror=function(){db.close();reject(req.error)}})}
  async function deletePhoto(id){if(!id)return;var db=await openPhotoDB();return new Promise(function(resolve){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=tx.onerror=function(){db.close();resolve()}})}
  async function cleanupOldPhotos(){try{var db=await openPhotoDB(),cutoff=Date.now()-180*86400000;await new Promise(function(resolve){var tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.openCursor();req.onsuccess=function(){var c=req.result;if(c){if(c.value.createdAt<cutoff)c.delete();c.continue()}};tx.oncomplete=resolve;tx.onerror=resolve});db.close()}catch(e){console.warn('Local bill-photo cleanup skipped',e)}}
  window.LB_BillPhotos={get:getPhoto,remove:deletePhoto};
  var copy={
    en:{title:'Smart Bill Scanner',intro:'Choose a receipt photo. We will read the text and suggest transaction details.',camera:'📷 Camera',gallery:'🖼️ Gallery',read:'Read bill details',privacy:'The original photo stays on this phone only. Only transaction details sync to your LIFE-BUDDY cloud account.',type:'Transaction type',date:'Date',amount:'Total (Rs.)',category:'Category',shop:'Shop / Description',raw:'Recognized text (editable)',confirmNote:'Check the amount, date and type. Nothing is added until you confirm.',save:'Confirm & Save',cancel:'Cancel',working:'Reading bill… this may take a little while on the first scan.',noFile:'Please choose a bill photo first.',ocrDone:'Text read. Please verify every field before saving.',ocrFail:'Could not read this image. You can enter the details manually.',amountMissing:'Enter the correct total amount before saving.',login:'Sign in to your LIFE-BUDDY account before saving a bill.',storage:'Local photo storage is unavailable in this browser. Check device storage settings.',upload:'Saving photo on this phone…',saved:'Bill and transaction saved. The photo remains on this phone only.',large:'This image is too large. Please choose an image under 10 MB.',typeError:'Please choose a JPG, PNG or WebP image.',nearLimit:'Your LIFE-BUDDY cloud data is close to Firestore’s 1 MiB document limit. Create a backup and archive old records before adding more.',shopPlaceholder:'e.g. Keells, grocery shopping',noText:'No readable text found.'},
    si:{title:'ස්මාර්ට් බිල් ස්කෑනර්',intro:'බිලේ ඡායාරූපයක් තෝරන්න. එහි අකුරු කියවා ගනුදෙනු විස්තර යෝජනා කරයි.',camera:'📷 කැමරාව',gallery:'🖼️ ගැලරිය',read:'බිලේ විස්තර කියවන්න',privacy:'මුල් ඡායාරූපය මෙම දුරකථනයේ පමණක් තබයි. ගනුදෙනු විස්තර පමණක් LIFE-BUDDY Cloud ගිණුමට Sync වේ.',type:'ගනුදෙනු වර්ගය',date:'දිනය',amount:'මුළු මුදල (රු.)',category:'කාණ්ඩය',shop:'කඩය / විස්තරය',raw:'හඳුනාගත් අකුරු (වෙනස් කළ හැක)',confirmNote:'මුදල, දිනය සහ වර්ගය පරීක්ෂා කරන්න. ඔබ තහවුරු කරන තුරු සටහනක් එකතු නොවේ.',save:'තහවුරු කර සුරකින්න',cancel:'අවලංගු කරන්න',working:'බිල කියවමින්… පළමු වරට ටිකක් කල් ගත විය හැකියි.',noFile:'මුලින් බිලේ ඡායාරූපයක් තෝරන්න.',ocrDone:'අකුරු කියවා අවසන්. සුරැකීමට පෙර සියලු විස්තර පරීක්ෂා කරන්න.',ocrFail:'මෙම ඡායාරූපය කියවීමට නොහැකි වුණා. විස්තර අතින් ඇතුළත් කළ හැකියි.',amountMissing:'සුරැකීමට පෙර නිවැරදි මුළු මුදල ඇතුළත් කරන්න.',login:'බිල සුරැකීමට LIFE-BUDDY ගිණුමට Login වන්න.',storage:'මෙම Browser එකේ දුරකථන ගබඩාව භාවිත කළ නොහැක. Device storage පරීක්ෂා කරන්න.',upload:'ඡායාරූපය මෙම දුරකථනයේ සුරකිමින්…',saved:'බිල සහ ගනුදෙනුව සුරැකුණා. ඡායාරූපය මෙම දුරකථනයේ පමණයි.',large:'ඡායාරූපය විශාල වැඩියි. 10 MB ට අඩු ඡායාරූපයක් තෝරන්න.',typeError:'JPG, PNG හෝ WebP ඡායාරූපයක් තෝරන්න.',nearLimit:'ඔබගේ Cloud දත්ත Firestore 1 MiB සීමාවට ළඟයි. තවත් දත්ත එක් කිරීමට පෙර Backup එකක් සාදා පැරණි සටහන් Archive කරන්න.',shopPlaceholder:'උදා: Keells, බඩු මිලදී ගැනීම',noText:'කියවිය හැකි අකුරු හමු වුණේ නැහැ.'}
  };
  function lang(){return window.S&&S.lang==='si'?'si':'en'}
  function tx(k){return copy[lang()][k]||copy.en[k]}
  function status(s){$('scanStatus').textContent=s}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,9)}
  function fillCategories(){var cats=(window.S&&S.cats)||[];var select=$('scanCategory');select.innerHTML='';cats.forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=c.name||c[lang()]||c.en||c.si;select.appendChild(o)});var first=cats.find(function(c){return c.t==='e'});if(first)select.value=first.id}
  function labels(){
    $('scanTitle').textContent=tx('title');$('scanIntro').textContent=tx('intro');$('scanCamera').textContent=tx('camera');$('scanGallery').textContent=tx('gallery');$('runOcr').textContent=tx('read');$('scanPrivacy').textContent=tx('privacy');$('scanTypeLabel').textContent=tx('type');$('scanDateLabel').textContent=tx('date');$('scanAmountLabel').textContent=tx('amount');$('scanCategoryLabel').textContent=tx('category');$('scanShopLabel').textContent=tx('shop');$('scanTextLabel').textContent=tx('raw');$('scanConfirmNote').textContent=tx('confirmNote');$('saveScannedBill').textContent=tx('save');$('cancelScanner').textContent=tx('cancel');$('scanShop').placeholder=tx('shopPlaceholder');
    var si=lang()==='si';$('scanType').innerHTML=si?'<option value="e">වියදම</option><option value="i">ආදායම</option>':'<option value="e">Expense</option><option value="i">Income</option>';fillCategories();
  }
  function openScanner(){labels();file=null;$('scanFile').value='';$('scanPreview').style.display='none';$('scanPreview').removeAttribute('src');$('runOcr').disabled=true;$('scanAmount').value='';$('scanShop').value='';$('scanRaw').value='';$('scanDate').value=new Date().toISOString().slice(0,10);$('scanType').value='e';status('');show('scanner')}
  function parseDate(text){var m=text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);if(m)return m[1]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[3]).padStart(2,'0');m=text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b/);if(m){var a=+m[1],b=+m[2],y=m[3];if(a<=12&&b>12){var z=a;a=b;b=z}return y+'-'+String(b).padStart(2,'0')+'-'+String(a).padStart(2,'0')}return ''}
  function parseAmount(text){var lines=text.split(/\r?\n/),keys=/grand\s*total|net\s*total|amount\s*due|total\s*due|total|මුළු|එකතුව|ගෙවිය යුතු/i;var candidates=[];lines.forEach(function(line,i){var nums=line.match(/(?:Rs\.?|LKR|රු\.?|\$)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/gi);if(nums){nums.forEach(function(n){var v=parseFloat(n.replace(/[^0-9.]/g,''));if(v>0)candidates.push({v:v,score:keys.test(line)?10+i/100:i/100})})}});if(!candidates.length)return '';candidates.sort(function(a,b){return b.score-a.score||b.v-a.v});return String(candidates[0].v)}
  function parseShop(text){var lines=text.split(/\r?\n/).map(function(x){return x.trim()}).filter(Boolean);for(var i=0;i<Math.min(lines.length,5);i++){if(lines[i].length>2&&!/^(tax\s*invoice|receipt|invoice|cash\s*bill|bill\s*no)/i.test(lines[i])&&!/^[\d\s.,:/-]+$/.test(lines[i]))return lines[i].slice(0,100)}return ''}
  function loadScript(url){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function runOCR(){if(!file){status(tx('noFile'));return}if(ocrBusy)return;ocrBusy=true;$('runOcr').disabled=true;status(tx('working'));try{if(!window.Tesseract)await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');var result=await Tesseract.recognize(file,'eng',{logger:function(m){if(m.status==='recognizing text'&&m.progress)status(tx('working')+' '+Math.round(m.progress*100)+'%')}});var text=(result.data&&result.data.text)||'';$('scanRaw').value=text;$('scanAmount').value=parseAmount(text);var d=parseDate(text);if(d)$('scanDate').value=d;$('scanShop').value=parseShop(text);status(text.trim()?tx('ocrDone'):tx('noText'));}catch(e){console.error('Bill OCR error',e);status(tx('ocrFail'))}finally{ocrBusy=false;$('runOcr').disabled=!file}}
  async function saveBill(){
    var amount=Number($('scanAmount').value),type=$('scanType').value,date=$('scanDate').value||new Date().toISOString().slice(0,10),shop=$('scanShop').value.trim(),category=$('scanCategory').value;
    if(!(amount>0)){status(tx('amountMissing'));$('scanAmount').focus();return}
    var cloud=window.LB_getCloud?window.LB_getCloud():null;
    if(!cloud||!cloud.user){status(tx('login'));return}
    if(!file){status(tx('noFile'));return}
    if(file.size>10*1024*1024){status(tx('large'));return}
    if(!/^image\/(jpeg|png|webp)$/i.test(file.type)){status(tx('typeError'));return}
    var id=uid(),cat=category||((S.cats.find(function(c){return c.t===type})||{}).id)||'';
    var createdAt=new Date().toISOString();
    var entry={id:id,t:type,a:amount,c:cat,n:shop||'Scanned bill',d:date,bill:{localPhotoId:id,fileName:file.name,mimeType:file.type,size:file.size,createdAt:createdAt,deleteAfterDays:180,ocrSummary:$('scanRaw').value.trim().slice(0,500)}};
    try{if(new TextEncoder().encode(JSON.stringify(Object.assign({},S,{entries:S.entries.concat([entry])}))).length>850000){status(tx('nearLimit'));return}}catch(sizeCheckError){console.warn('Could not estimate state size',sizeCheckError)}
    $('saveScannedBill').disabled=true;status(tx('upload'));
    try{
      await putPhoto(id,file,Date.now());
      S.entries.push(entry);save();all();show('main');status(tx('saved'));
    }catch(e){console.error('Local bill photo save failed',e);status(tx('storage'))}
    finally{$('saveScannedBill').disabled=false}
  }
  document.addEventListener('DOMContentLoaded',function(){
    cleanupOldPhotos();
    $('scanBill').addEventListener('click',openScanner);
    $('scanCamera').addEventListener('click',function(){$('scanFile').setAttribute('capture','environment');$('scanFile').click()});
    $('scanGallery').addEventListener('click',function(){$('scanFile').removeAttribute('capture');$('scanFile').click()});
    $('scanFile').addEventListener('change',function(){file=this.files&&this.files[0];if(!file)return;if(file.size>10*1024*1024){status(tx('large'));file=null;return}if(!/^image\/(jpeg|png|webp)$/i.test(file.type)){status(tx('typeError'));file=null;return}var url=URL.createObjectURL(file);$('scanPreview').src=url;$('scanPreview').style.display='block';$('runOcr').disabled=false;$('scanRaw').value='';$('scanAmount').value='';status('')});
    $('runOcr').addEventListener('click',runOCR);$('saveScannedBill').addEventListener('click',saveBill);$('cancelScanner').addEventListener('click',function(){show('main')});
  });
})();
