const grid=document.getElementById('listings-grid');
const soldGrid=document.getElementById('sold-grid');
const filter=document.getElementById('status-filter');
const typeFilter=document.getElementById('type-filter');
const count=document.getElementById('listing-count');
const statusClass=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-');
const statusOrder={Active:0,'Price Improvement':0,'Coming Soon':0,'Under Contract':1,Pending:1};

function card(item){
  const commercial=item.type==='Commercial';
  const facts=commercial
    ?`${item.subtype||'Commercial'} · ${item.acres||'—'} acres · ${item.bays||'Flexible space'}`
    :`${item.beds} beds · ${item.baths} baths · ${item.sqft} sq. ft.`;
  return `<article class="property-card${item.placeholder?' property-card--placeholder':''}${commercial?' property-card--commercial':''}"><div class="property-card__image" style="background-image:url('${item.image}')" role="img" aria-label="${item.address}"><span class="listing-ribbon listing-ribbon--${statusClass(item.status)}">${item.status}</span>${commercial?'<span class="asset-class">Commercial</span>':''}</div><div class="property-card__body"><strong class="property-card__price">${item.price}</strong><h3>${item.address}</h3><p>${facts}<br>${item.cityStateZip} · MLS ${item.mls}</p><a class="button button--dark" href="${item.page}">${item.placeholder?'Listing Details Coming Soon':commercial?'Explore Commercial Opportunity':'View Property'}</a></div></article>`;
}

function render(){
  const all=Array.isArray(window.LISTINGS_DATA)?window.LISTINGS_DATA:[];
  const status=filter.value;
  const type=typeFilter?.value||'all';
  let current=all.filter(x=>x.status!=='Sold');
  if(status!=='all') current=current.filter(x=>x.status===status);
  if(type!=='all') current=current.filter(x=>x.type===type);
  current.sort((a,b)=>(statusOrder[a.status]??9)-(statusOrder[b.status]??9)||(a.featuredOrder??99)-(b.featuredOrder??99));
  count.textContent=`${current.length} ${current.length===1?'property':'properties'}`;
  grid.innerHTML=current.map(card).join('')||'<p>No listings match these filters.</p>';

  const sold=all.filter(x=>x.status==='Sold'&&(type==='all'||x.type===type));
  soldGrid.innerHTML=sold.map(card).join('')||'<div class="empty-state"><strong>Recently sold properties will appear here.</strong><p>Changing a listing status to “Sold” preserves its page and moves its card here automatically.</p></div>';
}

filter.addEventListener('change',render);
typeFilter?.addEventListener('change',render);
render();
