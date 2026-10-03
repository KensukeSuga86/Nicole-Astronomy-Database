const KEY="nicole0_description_overrides_v1";
const PREF_KEY="nicole0_editor_preferences_v2";
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function updateNetworkStatus(){
  const el=$('#networkStatus'); if(!el)return;
  const on=navigator.onLine;
  el.textContent=on?'ONLINE':'OFFLINE';
  el.classList.toggle('ok',on);
  el.classList.toggle('warn',!on);
}
window.addEventListener('online',updateNetworkStatus);
window.addEventListener('offline',updateNetworkStatus);
updateNetworkStatus();

function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true}
function updateStorageNote(){
  const el=$('#storageNote'); if(!el)return;
  el.textContent=isStandalone()
    ?'Webアプリとして起動中です。Safari本体と保存領域が分かれる場合があります。端末間の移行には「編集バックアップを書き出し」を使用してください。'
    :'編集内容はSafariのローカル保存領域へ保持されます。正式DBへ反映するには「正式DB更新パッケージを書き出す」を使用し、GitHub上の正本へ適用してください。';
}
updateStorageNote();

const defs={
  constellation:{file:"constellations.json",label:"星座",fields:[
    ["legacy_story","従来の概要","full"],
    ["explanation.science","天文学",""],
    ["explanation.myth","神話・由来",""]
  ]},
  star:{file:"stars.json",label:"恒星",fields:[
    ["highlight","ひとこと","full"],
    ["explanation.overview","概要",""],
    ["explanation.observing","観測のポイント",""],
    ["explanation.science","天文学的な見どころ",""],
    ["explanation.history","歴史・名前",""]
  ]},
  dso:{file:"deep-sky.json",label:"深宇宙天体",fields:[
    ["highlight","ひとこと","full"],
    ["explanation.overview","概要",""],
    ["explanation.observing","観測のポイント",""],
    ["explanation.science","天文学的な見どころ",""],
    ["explanation.history","歴史・名前",""]
  ]},
  planet:{file:"planets.json",label:"惑星",fields:[
    ["highlight","ひとこと","full"],
    ["explanation.overview","概要",""],
    ["explanation.observing","観測のポイント",""],
    ["explanation.science","天文学的な見どころ",""],
    ["explanation.history","歴史・名前",""]
  ]}
};

let db={},manifest=null,currentKind="constellation",currentId=null;
let overrides=loadOverrides();
let dirty=false;
let autoSaveTimer=null;
let prefs=loadPrefs();

function loadPrefs(){
  try{
    return Object.assign({autoSave:false,editFilter:'all',sortMode:'source'},JSON.parse(localStorage.getItem(PREF_KEY)||'{}'));
  }catch{return{autoSave:false,editFilter:'all',sortMode:'source'}}
}
function savePrefs(){localStorage.setItem(PREF_KEY,JSON.stringify(prefs))}
function loadOverrides(){
  try{
    const d=JSON.parse(localStorage.getItem(KEY)||'{}');
    return d&&typeof d==='object'
      ?{schema:"nicole0-description-overrides-v1",updatedAt:d.updatedAt||null,items:d.items&&typeof d.items==='object'?d.items:{}}
      :{schema:"nicole0-description-overrides-v1",items:{}};
  }catch{
    return{schema:"nicole0-description-overrides-v1",items:{}};
  }
}
function saveOverrides(){
  overrides.updatedAt=new Date().toISOString();
  localStorage.setItem(KEY,JSON.stringify(overrides));
  try{window.dispatchEvent(new StorageEvent('storage',{key:KEY,newValue:JSON.stringify(overrides)}))}catch{}
  updateCounts();
}
function getPath(o,path){return path.split('.').reduce((a,k)=>a?.[k],o)??""}
function setPath(o,path,val){
  const ks=path.split('.'); let q=o;
  for(let i=0;i<ks.length-1;i++)q=q[ks[i]]||(q[ks[i]]={});
  q[ks.at(-1)]=val;
}
function clone(v){return JSON.parse(JSON.stringify(v))}
function merge(t,p){
  for(const[k,v]of Object.entries(p||{})){
    if(v&&typeof v==='object'&&!Array.isArray(v)){
      if(!t[k]||typeof t[k]!=='object'||Array.isArray(t[k]))t[k]={};
      merge(t[k],v);
    }else t[k]=v;
  }
  return t;
}
function key(kind,id){return `${kind}:${id}`}
function sourceItem(kind,id){return (db[kind]||[]).find(x=>String(x.id)===String(id))}
function effectiveItem(kind,id){
  const src=sourceItem(kind,id); if(!src)return null;
  const o=clone(src),p=overrides.items[key(kind,id)];
  if(p)merge(o,p);
  return o;
}
function itemName(x){return x?.name?.ja_full||x?.name?.ja||x?.name?.en||x?.id||""}
function editedCount(kind){return Object.keys(overrides.items).filter(k=>k.startsWith(kind+':')).length}
function totalEditedCount(){return Object.keys(overrides.items).length}
function updateCounts(){
  $('#editedBadge').textContent=`編集 ${totalEditedCount()}`;
  const total=(db[currentKind]||[]).length;
  $('#kindCount').textContent=`${total}件`;
  $('#kindEditedCount').textContent=`編集 ${editedCount(currentKind)}件`;
}
function currentList(){
  const q=$('#search').value.trim().toLowerCase();
  const filter=$('#editFilter').value;
  const sort=$('#sortMode').value;
  let arr=(db[currentKind]||[]).filter(x=>{
    const hit=!q||(`${itemName(x)} ${x.id}`).toLowerCase().includes(q);
    if(!hit)return false;
    const isEdited=!!overrides.items[key(currentKind,x.id)];
    if(filter==='edited'&&!isEdited)return false;
    if(filter==='unedited'&&isEdited)return false;
    return true;
  });
  if(sort==='name')arr=[...arr].sort((a,b)=>itemName(a).localeCompare(itemName(b),'ja'));
  if(sort==='editedFirst')arr=[...arr].sort((a,b)=>(!!overrides.items[key(currentKind,b.id)])-(!!overrides.items[key(currentKind,a.id)]));
  return arr;
}
function renderList(){
  const arr=currentList();
  $('#list').innerHTML=arr.map(x=>{
    const edited=!!overrides.items[key(currentKind,x.id)];
    return `<button class="item ${String(x.id)===String(currentId)?'active':''} ${edited?'dirty':''}" data-id="${esc(x.id)}"><b>${esc(itemName(x))}</b><div class="meta">${esc(x.id)}${edited?' / 編集済み':''}</div></button>`;
  }).join('');
  $('#list').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>navigateWithGuard(()=>selectItem(b.dataset.id)));
  updateCounts();
}
function getFormPatch(){
  const patch={};
  $$('#fields [data-path]').forEach(el=>setPath(patch,el.dataset.path,el.value));
  return patch;
}
function normalizePatch(kind,id,patch){
  const src=sourceItem(kind,id);
  const cleaned={};
  defs[kind].fields.forEach(([path])=>{
    const value=getPath(patch,path);
    const original=getPath(src,path);
    if(String(value)!==String(original))setPath(cleaned,path,value);
  });
  return cleaned;
}
function hasOwnContent(obj){return obj&&typeof obj==='object'&&Object.keys(obj).length>0}
function markDirty(on=true){
  dirty=on;
  $('#dirtyBadge').textContent=dirty?'未保存':'保存済み';
  $('#dirtyBadge').classList.toggle('warn',dirty);
  $('#dirtyBadge').classList.toggle('ok',!dirty);
  $('#status').classList.toggle('warn',dirty);
  if(dirty){
    $('#status').textContent=prefs.autoSave?'未保存の変更があります。まもなく自動保存します。':'未保存の変更があります。';
    if(prefs.autoSave)scheduleAutoSave();
  }
}
function scheduleAutoSave(){
  clearTimeout(autoSaveTimer);
  autoSaveTimer=setTimeout(()=>{if(dirty)saveCurrent(true)},700);
}
function autosize(el){
  el.style.height='auto';
  el.style.height=Math.max(135,el.scrollHeight+2)+'px';
}
function buildViews(item){
  const src=sourceItem(currentKind,currentId);
  const fields=defs[currentKind].fields;
  $('#originalView').innerHTML=fields.map(([path,label])=>viewBlock(label,getPath(src,path))).join('');
  $('#currentView').innerHTML=fields.map(([path,label])=>viewBlock(label,getPath(item,path))).join('');
  $('#preview').innerHTML=fields.map(([path,label])=>{
    const v=getPath(item,path);
    return `<div class="preview-block"><h4>${esc(label)}</h4><p>${v?esc(v):'<span class="empty">（空欄）</span>'}</p></div>`;
  }).join('');
}
function viewBlock(label,value){
  return `<div class="compare-field"><b>${esc(label)}</b><p class="${value?'':'empty'}">${value?esc(value):'（空欄）'}</p></div>`;
}
function refreshLiveViews(){
  if(!currentId)return;
  const item=clone(sourceItem(currentKind,currentId));
  merge(item,getFormPatch());
  buildViews(item);
}
function selectItem(id){
  currentId=id;
  const x=effectiveItem(currentKind,id),def=defs[currentKind];
  if(!x)return;
  $('#itemTitle').textContent=itemName(x);
  $('#itemMeta').textContent=`${def.label} / ${id}`;
  $('#fields').innerHTML=def.fields.map(([path,label,cl])=>`<div class="field ${cl}"><label><span>${esc(label)}</span><span class="meta">${esc(path)}</span></label><textarea data-path="${path}">${esc(getPath(x,path))}</textarea></div>`).join('');
  $$('#fields textarea').forEach(el=>{
    autosize(el);
    el.addEventListener('input',()=>{autosize(el);markDirty(true);refreshLiveViews()});
  });
  dirty=false;
  markDirty(false);
  $('#status').textContent=overrides.items[key(currentKind,id)]?'ローカル編集あり':'DBの初期値';
  buildViews(x);
  renderList();
}
function saveCurrent(fromAuto=false){
  if(!currentId)return;
  const patch=normalizePatch(currentKind,currentId,getFormPatch());
  const k=key(currentKind,currentId);
  if(hasOwnContent(patch))overrides.items[k]=patch;
  else delete overrides.items[k];
  saveOverrides();
  dirty=false;
  markDirty(false);
  $('#status').textContent=fromAuto?'自動保存しました。':'保存しました。正式DBへの反映には更新パッケージの書き出しが必要です。';
  renderList();
  refreshLiveViews();
}
function resetCurrent(){
  if(!currentId)return;
  if(dirty&&!confirm('未保存の入力も破棄して、この天体をDB初期値へ戻しますか？'))return;
  delete overrides.items[key(currentKind,currentId)];
  saveOverrides();
  selectItem(currentId);
  $('#status').textContent='この天体をDB初期値へ戻しました。';
}
function navigateWithGuard(fn){
  if(!dirty){fn();return}
  if(prefs.autoSave){saveCurrent(true);fn();return}
  const ans=confirm('未保存の変更があります。保存してから移動しますか？\n「キャンセル」を選ぶと現在の画面に残ります。');
  if(ans){saveCurrent(false);fn()}
}
function move(delta){
  const arr=currentList();
  if(!arr.length)return;
  let idx=arr.findIndex(x=>String(x.id)===String(currentId));
  if(idx<0)idx=0;
  const next=arr[idx+delta];
  if(next)navigateWithGuard(()=>selectItem(next.id));
}
function download(name,data){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
  a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
function editedCategory(){
  return (db[currentKind]||[]).map(x=>{
    const y=clone(x),p=overrides.items[key(currentKind,x.id)];
    if(p){merge(y,p);if(p.explanation&&y.explanation)delete y.explanation.raw_html}
    return y;
  });
}

function nextPatchVersion(v){
  const m=String(v||'0.0.0').match(/^(\d+)\.(\d+)\.(\d+)$/);
  if(!m)return null;
  return [Number(m[1]),Number(m[2]),Number(m[3])+1].join('.');
}
function changedKinds(){
  const out=new Set();
  for(const k of Object.keys(overrides.items||{})){
    const kind=k.split(':')[0];
    if(defs[kind])out.add(kind);
  }
  return [...out];
}
function editedCategoryFor(kind){
  return (db[kind]||[]).map(x=>{
    const y=clone(x),p=overrides.items[key(kind,x.id)];
    if(p){merge(y,p);if(p.explanation&&y.explanation)delete y.explanation.raw_html}
    return y;
  });
}
function changedItemSummary(){
  return Object.entries(overrides.items||{}).map(([compound,patch])=>{
    const split=compound.indexOf(':');
    const kind=split>=0?compound.slice(0,split):compound;
    const id=split>=0?compound.slice(split+1):'';
    const fields=[];
    const walk=(o,prefix='')=>{
      for(const [k,v] of Object.entries(o||{})){
        const path=prefix?prefix+'.'+k:k;
        if(v&&typeof v==='object'&&!Array.isArray(v))walk(v,path);
        else fields.push(path);
      }
    };
    walk(patch);
    return {kind,id,fields};
  });
}
async function sha256Text(text){
  const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function buildFormalUpdatePackage(){
  if(dirty)saveCurrent(false);
  const kinds=changedKinds();
  if(!kinds.length)throw new Error('保存済みの編集がありません');
  if(!globalThis.crypto?.subtle)throw new Error('このブラウザではSHA-256を計算できません');

  const files={},checksums={};
  for(const kind of kinds){
    const path='data/'+defs[kind].file;
    const data=editedCategoryFor(kind);
    const text=JSON.stringify(data,null,2)+'\n';
    files[path]=data;
    checksums[path]=await sha256Text(text);
  }

  const sourceVersion=manifest?.database_version||null;
  const targetVersion=nextPatchVersion(sourceVersion);
  return {
    schema:'nicole-astronomy-database-update-package-v1',
    created_at:new Date().toISOString(),
    authority:'Nicole Astronomy Database',
    purpose:'Apply reviewed description edits to the authoritative GitHub database',
    edit_scope:'shared descriptions only',
    source_database_version:sourceVersion,
    source_schema_version:manifest?.schema_version??null,
    proposed_target_database_version:targetVersion,
    changed_item_count:Object.keys(overrides.items||{}).length,
    changed_items:changedItemSummary(),
    files,
    checksums_sha256:checksums,
    publish_plan:{
      root_targets:Object.keys(files),
      versioned_targets:targetVersion?Object.keys(files).map(p=>`versions/${targetVersion}/${p}`):[],
      update_manifest_checksums:true,
      update_latest_json:true,
      note:'This package does not modify GitHub by itself. Review and apply it to the authoritative repository.'
    }
  };
}
async function exportFormalUpdatePackage(){
  try{
    $('#exportReleasePackage').disabled=true;
    $('#status').textContent='正式DB更新パッケージを作成中…';
    const pkg=await buildFormalUpdatePackage();
    const v=pkg.proposed_target_database_version||'next';
    download(`Nicole-Astronomy-Database-update-${pkg.source_database_version}-to-${v}.json`,pkg);
    $('#status').textContent=`正式DB更新パッケージを書き出しました（${pkg.changed_item_count}件）。GitHubへ反映するまでは正本は変更されません。`;
  }catch(err){
    alert('更新パッケージの作成に失敗しました: '+err.message);
    $('#status').textContent='更新パッケージ作成失敗: '+err.message;
  }finally{
    $('#exportReleasePackage').disabled=false;
  }
}
function switchPage(page){
  $$('.page').forEach(p=>p.classList.remove('active'));
  $$('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $('#'+page+'Page').classList.add('active');
}
async function boot(){
  manifest=await fetch('./manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('manifest '+r.status);return r.json()});
  $('#dbVersion').textContent=`DB v${manifest.database_version}`;
  for(const[k,d]of Object.entries(defs)){
    db[k]=await fetch(`./data/${d.file}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(d.file+' '+r.status);return r.json()});
  }
  $('#autoSave').checked=!!prefs.autoSave;
  $('#editFilter').value=prefs.editFilter||'all';
  $('#sortMode').value=prefs.sortMode||'source';

  const params=new URLSearchParams(location.search);
  const requestedKind=params.get('kind');
  const requestedId=params.get('id');
  if(requestedKind&&defs[requestedKind]){
    currentKind=requestedKind;
    $('#kind').value=currentKind;
  }

  renderList();

  const requestedItem=requestedId?sourceItem(currentKind,requestedId):null;
  if(requestedItem){
    selectItem(requestedItem.id);
    $('#status').textContent='指定された天体を開きました';
  }else{
    selectItem(db[currentKind][0]?.id);
    $('#status').textContent=requestedId?'指定されたIDが見つからないため一覧先頭を開きました':'準備完了';
  }
}

$('#kind').onchange=e=>navigateWithGuard(()=>{
  currentKind=e.target.value;
  currentId=null;
  renderList();
  selectItem(currentList()[0]?.id||db[currentKind][0]?.id);
});
$('#search').oninput=renderList;
$('#editFilter').onchange=e=>{prefs.editFilter=e.target.value;savePrefs();renderList()};
$('#sortMode').onchange=e=>{prefs.sortMode=e.target.value;savePrefs();renderList()};
$('#autoSave').onchange=e=>{prefs.autoSave=e.target.checked;savePrefs();if(prefs.autoSave&&dirty)scheduleAutoSave()};
$('#save').onclick=()=>saveCurrent(false);
$('#resetItem').onclick=resetCurrent;
$('#prevItem').onclick=()=>move(-1);
$('#nextItem').onclick=()=>move(1);
$('#exportPatch').onclick=()=>download(`Nicole-Astronomy-Database-editor-backup-${new Date().toISOString().slice(0,10)}.json`,overrides);
$('#importPatch').onclick=()=>$('#importFile').click();
$('#importFile').onchange=async e=>{
  const f=e.target.files?.[0];if(!f)return;
  try{
    const d=JSON.parse(await f.text());
    if(!d?.items||typeof d.items!=='object')throw Error('形式が違います');
    if(d.schema&&d.schema!=='nicole0-description-overrides-v1'&&!confirm(`未知のschema「${d.schema}」です。このまま読み込みますか？`))return;
    overrides={schema:'nicole0-description-overrides-v1',updatedAt:new Date().toISOString(),items:d.items};
    saveOverrides();renderList();if(currentId)selectItem(currentId);
    $('#status').textContent='差分を読み込みました';
  }catch(err){alert('読み込み失敗: '+err.message)}
  e.target.value='';
};
$('#resetAll').onclick=()=>{
  if(!confirm('ローカルで編集した解説をすべて消去しますか？\n必要なら先に「編集差分を書き出し」でバックアップしてください。'))return;
  overrides={schema:'nicole0-description-overrides-v1',items:{}};
  saveOverrides();renderList();if(currentId)selectItem(currentId);
  $('#status').textContent='全編集を初期値へ戻しました';
};
$('#downloadData').onclick=()=>download('preview-'+defs[currentKind].file,editedCategory());
$('#exportReleasePackage').onclick=exportFormalUpdatePackage;
$$('.navbtn').forEach(b=>b.onclick=()=>switchPage(b.dataset.page));

window.addEventListener('beforeunload',e=>{if(dirty&&!prefs.autoSave){e.preventDefault();e.returnValue=''}});
window.addEventListener('storage',e=>{
  if(e.key===KEY){
    overrides=loadOverrides();renderList();if(currentId)selectItem(currentId);
  }
});

boot().catch(e=>{$('#status').textContent='読込失敗: '+e.message;$('#status').classList.add('warn');console.error(e)});
