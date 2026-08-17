(() => {
  const spriteFiles = Array.from({ length: 7 }, (_, i) =>
    `/assets/images/catalogo-2025-atlas-${String(i + 1).padStart(2,'0')}.webp`
  );
  function applySprite(node, page) {
    const p = Number(page);
    if (!node || !Number.isFinite(p) || p < 1 || p > 81) return;
    let atlas, local, row = 0;
    if (p <= 27) {
      atlas = Math.floor((p - 1) / 9);
      local = (p - 1) % 9;
      node.style.backgroundSize = '900% 100%';
    } else if (p <= 63) {
      atlas = 3 + Math.floor((p - 28) / 18);
      local = (p - 28) % 18;
      row = Math.floor(local / 9);
      node.style.backgroundSize = '900% 200%';
    } else {
      atlas = p <= 72 ? 5 : 6;
      local = p <= 72 ? p - 64 : p - 73;
      node.style.backgroundSize = '900% 100%';
    }
    const col = local % 9;
    node.style.backgroundImage = `url('${spriteFiles[atlas]}')`;
    node.style.backgroundPosition = `${col * 12.5}% ${row * 100}%`;
  }
  const catalogGrid = document.querySelector('[data-catalog-grid]');
  if (catalogGrid && Array.isArray(window.JuanLolaCatalogData)) {
    const kindLabel = (kind) => kind === 'manteleria' ? 'Mantelería' : kind === 'camino' ? 'Camino de mesa' : 'Mesa';
    catalogGrid.innerHTML = window.JuanLolaCatalogData.map((item) => {
      const count = String(item.pages.length).padStart(2,'0');
      const uniqueChairs = [...new Set(item.chairs)];
      const chairTags = uniqueChairs.slice(0,3).map((chair) => `<span>${chair}</span>`).join('');
      const more = uniqueChairs.length > 3 ? `<span>+${uniqueChairs.length - 3}</span>` : '';
      const modelText = `${uniqueChairs.length} modelo${uniqueChairs.length === 1 ? '' : 's'} de silla`;
      const description = item.kind === 'mesa'
        ? `${item.pages.length} montaje${item.pages.length === 1 ? '' : 's'} real${item.pages.length === 1 ? '' : 'es'} con ${modelText}.`
        : `${item.pages.length} montajes reales con ${modelText}.`;
      const search = `${item.name} ${kindLabel(item.kind)} ${item.chairs.join(' ')}`;
      return `<article class="catalog-v2-card" data-catalog-card data-id="${item.id}" data-name="${item.name}" data-kind="${item.kind}" data-pages="${item.pages.join(',')}" data-chairs="${item.chairs.join('|')}" data-search="${search}">
        <button type="button" class="catalog-v2-image" data-open aria-label="Ver ${item.name}">
          <span class="catalog-v2-photo" data-catalog-page="${item.pages[0]}" aria-hidden="true"></span>
          <span class="catalog-v2-count">${count} montaje${item.pages.length === 1 ? '' : 's'}</span>
          <span class="catalog-v2-view">Ver combinaciones</span>
        </button>
        <div class="catalog-v2-body"><div class="catalog-v2-meta"><span>${kindLabel(item.kind)}</span><span>${count}</span></div><h2>${item.name}</h2><p>${description}</p><div class="catalog-v2-tags" aria-label="Modelos de silla">${chairTags}${more}</div><button type="button" class="catalog-v2-add" data-add aria-pressed="false">Añadir a mi selección</button></div>
      </article>`;
    }).join('');
  }

  document.querySelectorAll('[data-catalog-page]').forEach((node) => applySprite(node, node.dataset.catalogPage));

  const cards = [...document.querySelectorAll('[data-catalog-card]')];
  if (!cards.length) return;
  const searchInput = document.querySelector('[data-catalog-search]');
  const chairFilter = document.querySelector('[data-chair-filter]');
  const kindButtons = [...document.querySelectorAll('[data-kind-filter]')];
  const chairShortcuts = [...document.querySelectorAll('[data-chair-shortcut]')];
  const resultCount = document.querySelector('[data-result-count]');
  const montageCount = document.querySelector('[data-montage-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  const selectionCounts = [...document.querySelectorAll('[data-selection-count]')];
  const quoteLinks = [...document.querySelectorAll('[data-quote-link]')];
  const dialog = document.querySelector('[data-catalog-dialog]');
  const stage = dialog?.querySelector('[data-dialog-image]');
  const title = dialog?.querySelector('[data-dialog-title]');
  const eyebrow = dialog?.querySelector('[data-dialog-eyebrow]');
  const index = dialog?.querySelector('[data-dialog-index]');
  const caption = dialog?.querySelector('[data-dialog-caption]');
  const thumbs = dialog?.querySelector('[data-dialog-thumbnails]');
  const addDialog = dialog?.querySelector('[data-dialog-add]');
  const whatsappDialog = dialog?.querySelector('[data-dialog-whatsapp]');
  const prev = dialog?.querySelector('[data-dialog-previous]');
  const next = dialog?.querySelector('[data-dialog-next]');
  const storageKey = 'juan-lola-selection-v2';
  let activeKind = 'all';
  let selected = [];
  let activeCard = null;
  let activeIndex = 0;
  let opener = null;

  function normalize(value) { return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
  function pages(card) { return card.dataset.pages.split(',').map(Number); }
  function chairs(card) { return card.dataset.chairs.split('|'); }
  function functionalAllowed() { return Boolean(window.JuanLolaConsent?.has('functional')); }
  function readSelection() {
    if (!functionalAllowed()) return [];
    try { const value=JSON.parse(localStorage.getItem(storageKey)||'[]'); return Array.isArray(value)?value:[]; } catch { return []; }
  }
  selected = readSelection().filter(id => cards.some(card => card.dataset.id === id));
  function persist() { try { if(functionalAllowed()) localStorage.setItem(storageKey,JSON.stringify(selected)); else localStorage.removeItem(storageKey); } catch {} }
  function selectionNames() { return cards.filter(c=>selected.includes(c.dataset.id)).map(c=>c.dataset.name); }
  function quoteUrl() {
    const text=['Hola, me gustaría consultar disponibilidad y presupuesto para estas colecciones del catálogo:','',...selectionNames().map(n=>`• ${n}`),'','Fecha del evento:','Localidad:','Número de invitados:'].join('\n');
    return `https://wa.me/34659455344?text=${encodeURIComponent(text)}`;
  }
  function singleUrl(card) {
    const text=[`Hola, me gustaría consultar la colección ${card.dataset.name}.`,'','Fecha del evento:','Localidad:','Número de invitados:'].join('\n');
    return `https://wa.me/34659455344?text=${encodeURIComponent(text)}`;
  }
  function syncSelection() {
    persist();
    selectionCounts.forEach(n=>n.textContent=String(selected.length));
    cards.forEach(card=>{ const b=card.querySelector('[data-add]'); const on=selected.includes(card.dataset.id); b.classList.toggle('is-selected',on); b.setAttribute('aria-pressed',String(on)); b.textContent=on?'✓ En mi selección':'Añadir a mi selección'; });
    if(activeCard && addDialog){ const on=selected.includes(activeCard.dataset.id); addDialog.classList.toggle('is-selected',on); addDialog.setAttribute('aria-pressed',String(on)); addDialog.textContent=on?'✓ En mi selección':'Añadir a mi selección'; }
    quoteLinks.forEach(link=>{ const off=selected.length===0; link.classList.toggle('is-disabled',off); link.setAttribute('aria-disabled',String(off)); link.href=off?'#':quoteUrl(); });
  }
  function toggle(card){ const id=card.dataset.id; selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]; syncSelection(); }
  function applyFilters(){
    const q=normalize(searchInput?.value);
    const chair=chairFilter?.value || '';
    let visible=0, montages=0;
    cards.forEach(card=>{
      const text=normalize(card.dataset.search);
      const okText=!q || text.includes(q);
      const okKind=activeKind==='all'||card.dataset.kind===activeKind;
      const okChair=!chair||chairs(card).includes(chair);
      const show=okText&&okKind&&okChair;
      card.hidden=!show;
      if(show){ visible++; montages+=pages(card).length; }
    });
    if(resultCount) resultCount.textContent=String(visible);
    if(montageCount) montageCount.textContent=String(montages);
    if(empty) empty.hidden=visible!==0;
  }
  function setActiveKind(value){ activeKind=value; kindButtons.forEach(b=>{const on=b.dataset.kindFilter===value;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});applyFilters(); }
  kindButtons.forEach(b=>b.addEventListener('click',()=>setActiveKind(b.dataset.kindFilter)));
  searchInput?.addEventListener('input',applyFilters);
  chairFilter?.addEventListener('change',applyFilters);
  chairShortcuts.forEach(b=>b.addEventListener('click',()=>{ if(chairFilter){ chairFilter.value=b.dataset.chairShortcut; chairFilter.dispatchEvent(new Event('change')); document.querySelector('#colecciones')?.scrollIntoView({behavior:'smooth',block:'start'}); } }));

  function imageCaption(card, i){
    const chair=chairs(card)[i] || chairs(card)[0];
    if(card.dataset.kind==='manteleria') return `Mantel ${card.dataset.name} · Silla ${chair}`;
    if(card.dataset.kind==='camino') return `Camino ${card.dataset.name} · Mesa Rústica · Silla ${chair}`;
    return `Mesa ${card.dataset.name} · Silla ${chair}`;
  }
  function renderDialog(){
    if(!activeCard||!stage) return;
    const ps=pages(activeCard); const p=ps[activeIndex];
    applySprite(stage,p);
    const label=imageCaption(activeCard,activeIndex);
    stage.setAttribute('aria-label',label);
    if(index) index.textContent=`Montaje ${activeIndex+1} de ${ps.length}`;
    if(caption) caption.textContent=label;
    [...(thumbs?.querySelectorAll('button')||[])].forEach((b,i)=>{ const on=i===activeIndex; b.classList.toggle('is-active',on); b.setAttribute('aria-pressed',String(on)); });
    if(prev) prev.hidden=ps.length<2; if(next) next.hidden=ps.length<2;
  }
  function show(i){ if(!activeCard) return; const ps=pages(activeCard); activeIndex=(i+ps.length)%ps.length; renderDialog(); }
  function open(card, trigger){
    activeCard=card; activeIndex=0; opener=trigger;
    if(title) title.textContent=card.dataset.name;
    if(eyebrow) eyebrow.textContent=card.dataset.kind==='manteleria'?'Mantelería':card.dataset.kind==='camino'?'Camino de mesa':'Mesa';
    if(whatsappDialog) whatsappDialog.href=singleUrl(card);
    if(thumbs){ thumbs.replaceChildren(...pages(card).map((p,i)=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label',`Ver montaje ${i+1}`); b.setAttribute('aria-pressed',String(i===0)); const s=document.createElement('span'); s.className='catalog-v2-photo'; applySprite(s,p); b.append(s); b.addEventListener('click',()=>show(i)); return b; })); }
    renderDialog(); syncSelection();
    if(typeof dialog?.showModal==='function') dialog.showModal(); else dialog?.setAttribute('open','');
    document.body.classList.add('catalog-dialog-open');
  }
  function close(){ if(typeof dialog?.close==='function') dialog.close(); else { dialog?.removeAttribute('open'); reset(); } }
  function reset(){ document.body.classList.remove('catalog-dialog-open'); activeCard=null; opener?.focus(); opener=null; }
  cards.forEach(card=>{ card.querySelector('[data-open]')?.addEventListener('click',e=>open(card,e.currentTarget)); card.querySelector('[data-add]')?.addEventListener('click',()=>toggle(card)); });
  dialog?.querySelector('[data-dialog-close]')?.addEventListener('click',close);
  prev?.addEventListener('click',()=>show(activeIndex-1)); next?.addEventListener('click',()=>show(activeIndex+1));
  addDialog?.addEventListener('click',()=>{if(activeCard)toggle(activeCard);});
  dialog?.addEventListener('click',e=>{if(e.target===dialog)close();}); dialog?.addEventListener('close',reset);
  document.addEventListener('keydown',e=>{if(!dialog?.open)return;if(e.key==='ArrowLeft')show(activeIndex-1);if(e.key==='ArrowRight')show(activeIndex+1);});
  quoteLinks.forEach(link=>link.addEventListener('click',e=>{if(!selected.length)e.preventDefault();}));
  window.addEventListener('juanlola:consentchange',()=>syncSelection());
  const params=new URLSearchParams(location.search); const requestedChair=params.get('chair'); if(requestedChair&&chairFilter&&[...chairFilter.options].some(o=>o.value===requestedChair)){chairFilter.value=requestedChair;}
  applyFilters(); syncSelection();
})();
