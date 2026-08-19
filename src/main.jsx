import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import {
  ArrowRight, BriefcaseBusiness, Building2, CalendarClock, CarFront, Check,
  ChevronDown, ChevronRight, CircleDollarSign, ClipboardList, Clock3, Copy,
  Database, DollarSign, ExternalLink, FileText, Gauge, Headphones, KeyRound,
  LayoutDashboard, LockKeyhole, LogIn, LogOut, Menu, MessageSquareText, Package,
  Phone, Plus, RefreshCw, Route, Search, Send, ShieldCheck, Sparkles, Truck,
  UserRound, UsersRound, WalletCards, X, Pencil, Trash2, MapPin, UserCheck,
  AlertTriangle, BadgeCheck, TimerReset, Boxes
} from 'lucide-react'
import './styles.css'

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null
const DEMO = !supabase

const vehicleSeeds = [
  { id:'demo-argento', name:'Argento', brand:'Obey', category:'Berline d’exception', hourly_rate:4000, deposit:10000, status:'available', active:true, sort_order:1, image_url:'https://img.gta5-mods.com/q95/images/obey-argento-add-on-sounds-lods/152cdf-2.jpg', description:'Berline premium au tempérament sportif, pensée pour les rendez-vous où l’arrivée compte autant que le trajet.' },
  { id:'demo-toros', name:'Toros', brand:'Pegassi', category:'SUV Grand Tourisme', hourly_rate:5000, deposit:12000, status:'available', active:true, sort_order:2, image_url:'https://img.gta5-mods.com/q75/images/pegassi-toros-rework-facelift-add-on-fivem/0ecdf8-1.png', description:'SUV haut de gamme, confortable et imposant, adapté aux transferts VIP comme aux longues distances.' },
  { id:'demo-schweizer', name:'Schweizer V8', brand:'Schweizer', category:'Muscle V8', hourly_rate:1000, deposit:5000, status:'available', active:true, sort_order:3, image_url:'https://i.ytimg.com/vi/w77zxaHDiL0/sddefault.jpg', description:'Une alternative plus accessible, brute et charismatique, pour se déplacer avec personnalité.' },
]

const fleetSeeds = [
  { id:'demo-pounder', name:'Pounder', brand:'MTL', category:'Poids lourd', status:'available', active:true, sort_order:1, image_url:'https://static.wikia.nocookie.net/gtawiki/images/8/85/PounderCustom-GTAO-front.png/revision/latest?cb=20190716203227', description:'Gros porteur destiné aux ravitaillements et aux cargaisons volumineuses.' },
  { id:'demo-speedo', name:'Speedo Express', brand:'Vapid', category:'Utilitaire', status:'available', active:true, sort_order:2, image_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnzWrFCD-gykInC86VszO2o5mRsMtoO8UEQX2VCyRw&s=10', description:'Utilitaire rapide pour les livraisons urgentes, discrètes ou de faible volume.' },
]

const JOBS = [
  { id:'heavy_driver', title:'Conducteur poids lourd', icon:Truck, text:'Ravitaillement d’entreprises, tournées de fret et missions logistiques spéciales.' },
  { id:'private_driver', title:'Chauffeur privé', icon:CarFront, text:'Prise en charge de clients, conduite premium et représentation de la maison.' },
  { id:'advisor', title:'Conseiller / Commercial', icon:BriefcaseBusiness, text:'Prospection, relation client, négociation et développement des partenariats Nairi.' },
]

const money = n => new Intl.NumberFormat('fr-FR').format(Number(n || 0)) + '$'
const dt = v => v ? new Date(v).toLocaleString('fr-FR', { dateStyle:'short', timeStyle:'short' }) : '—'
const shortRef = prefix => `${prefix}-${Math.random().toString(36).slice(2,6).toUpperCase()}${Date.now().toString().slice(-4)}`
const statusLabel = s => ({new:'Nouvelle',review:'À étudier',accepted:'Acceptée',deposit_pending:'Caution attendue',confirmed:'Confirmée',assigned:'Affectée',in_progress:'En cours',in_transit:'En transit',completed:'Terminée',delivered:'Livrée',contacted:'Contact établi',negotiation:'Négociation',interview:'Entretien',rejected:'Refusée',cancelled:'Annulée',available:'Disponible',reserved:'Réservé',service:'En service',unavailable:'Indisponible'}[s] || s)

function useHashRoute(){
  const [hash,setHash]=React.useState(location.hash || '#home')
  React.useEffect(()=>{ const f=()=>setHash(location.hash||'#home'); addEventListener('hashchange',f); return()=>removeEventListener('hashchange',f)},[])
  return hash
}

function useFivemBridge(){
  const [embedded,setEmbedded]=React.useState(new URLSearchParams(location.search).get('fivem')==='1')
  const [visible,setVisible]=React.useState(!embedded)
  React.useEffect(()=>{
    const fn=e=>{ if(e.data?.action==='open'){setVisible(true); setEmbedded(true)} if(e.data?.action==='close')setVisible(false) }
    addEventListener('message',fn); return()=>removeEventListener('message',fn)
  },[])
  React.useEffect(()=>{
    const fn=e=>{ if(e.key==='Escape' && embedded){ setVisible(false); const resource=window.GetParentResourceName?.(); if(resource) fetch(`https://${resource}/close`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).catch(()=>{}) }}
    addEventListener('keydown',fn); return()=>removeEventListener('keydown',fn)
  },[embedded])
  return {embedded,visible}
}

function App(){
  const route=useHashRoute()
  const {embedded,visible}=useFivemBridge()
  const [modal,setModal]=React.useState(null)
  const [vehicles,setVehicles]=React.useState(vehicleSeeds)
  const [fleet,setFleet]=React.useState(fleetSeeds)
  const [toast,setToast]=React.useState(null)
  const [session,setSession]=React.useState(null)
  const [staffProfile,setStaffProfile]=React.useState(null)
  const [loadingData,setLoadingData]=React.useState(false)

  const notify=(text,type='ok')=>{ setToast({text,type}); setTimeout(()=>setToast(null),3800) }

  async function loadPublicData(){
    if(!supabase) return
    setLoadingData(true)
    const [{data:v},{data:f}] = await Promise.all([
      supabase.from('vehicles').select('*').eq('active',true).order('sort_order'),
      supabase.from('fleet_vehicles').select('*').eq('active',true).order('sort_order'),
    ])
    if(v?.length) setVehicles(v)
    if(f?.length) setFleet(f)
    setLoadingData(false)
  }

  React.useEffect(()=>{ loadPublicData() },[])
  React.useEffect(()=>{
    if(!supabase) return
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s))
    return()=>subscription.unsubscribe()
  },[])
  React.useEffect(()=>{
    if(!supabase || !session) { setStaffProfile(null); return }
    supabase.from('staff_profiles').select('*').eq('id',session.user.id).maybeSingle().then(({data})=>setStaffProfile(data||null))
  },[session])

  if(embedded && !visible) return <div className="nui-hidden" />
  if(route.startsWith('#staff')) return <StaffApp session={session} staffProfile={staffProfile} notify={notify} vehicles={vehicles} fleet={fleet} reloadPublic={loadPublicData} demo={DEMO} />

  return <>
    <PublicSite vehicles={vehicles} fleet={fleet} modal={modal} setModal={setModal} notify={notify} loading={loadingData} embedded={embedded} />
    {modal && <Modal type={modal.type} payload={modal.payload} vehicles={vehicles} close={()=>setModal(null)} notify={notify} />}
    {toast && <Toast {...toast} />}
  </>
}

function PublicSite({vehicles,fleet,setModal,notify,loading,embedded}){
  const [menu,setMenu]=React.useState(false)
  return <div className={`site ${embedded?'embedded':''}`}>
    <header className="topbar">
      <a className="brand" href="#home" onClick={()=>setMenu(false)}>
        <img src="/assets/nairi-logo.png" alt="Nairi Corporation" />
        <span><strong>NAIRI</strong><small>CORPORATION</small></span>
      </a>
      <nav className={menu?'open':''}>
        <a href="#advisory" onClick={()=>setMenu(false)}>Advisory</a>
        <a href="#automotive" onClick={()=>setMenu(false)}>Automotive</a>
        <a href="#logistics" onClick={()=>setMenu(false)}>Logistics</a>
        <a href="#careers" onClick={()=>setMenu(false)}>Carrières</a>
        <button className="ghost small" onClick={()=>{setModal({type:'track'});setMenu(false)}}><Search size={15}/> Suivre un dossier</button>
        <a className="staff-link" href="#staff"><LockKeyhole size={14}/> Staff</a>
      </nav>
      <button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-orbit orbit-1" /><div className="hero-orbit orbit-2" />
        <div className="hero-copy">
          <div className="eyebrow"><span>LOS SANTOS</span><i/> EURASIA <i/> RÉSEAU GLOBAL <span className="live-dot">ACTIVE</span></div>
          <h1><span>NAIRI</span><br/>CORPORATION</h1>
          <p className="hero-lead">Maison de négoce, gestion privée & transport.</p>
          <p className="hero-text">Un seul interlocuteur pour structurer vos affaires, déplacer vos clients et orchestrer vos flux. Vous vous concentrez sur l’essentiel. <strong>Nous gérons le reste.</strong></p>
          <div className="hero-actions">
            <button className="primary" onClick={()=>setModal({type:'advisory'})}>Initier une consultation <ArrowRight size={17}/></button>
            <a href="#automotive" className="secondary">Explorer les services</a>
          </div>
          <div className="hero-trust"><ShieldCheck size={17}/> Rigueur institutionnelle · Discrétion absolue · Exécution terrain</div>
        </div>
        <div className="hero-emblem">
          <div className="emblem-shell"><img src="/assets/nairi-logo.png" alt=""/></div>
          <div className="coord top">43°N / 40°E</div><div className="coord bottom">NR-CORP.02</div>
        </div>
        <div className="hero-index"><b>EST.</b><span>MMXXV</span><b>INDEX</b><span>NR-CORP.02</span></div>
      </section>

      <section className="quick-actions section-tight">
        <div className="section-kicker">ACCÈS DIRECT · OPERATIONS</div>
        <div className="action-grid">
          <ActionCard num="01" icon={BriefcaseBusiness} title="Mise en relation" text="Sourcing, négociation, recherche de partenaires et gestion de dossiers." action="Déposer une demande" onClick={()=>setModal({type:'advisory'})}/>
          <ActionCard num="02" icon={CarFront} title="Réserver un véhicule" text="Flotte premium disponible à l’heure, avec ou sans chauffeur accrédité." action="Voir la flotte" href="#automotive"/>
          <ActionCard num="03" icon={Truck} title="Organiser un transport" text="Ravitaillement, urgence, fret sur-mesure ou marchandise sensible." action="Créer une mission" onClick={()=>setModal({type:'logistics'})}/>
          <ActionCard num="04" icon={UsersRound} title="Rejoindre Nairi" text="Conducteurs poids lourds, chauffeurs privés et conseillers commerciaux." action="Voir les postes" href="#careers"/>
        </div>
      </section>

      <section id="advisory" className="section split-section">
        <div>
          <div className="section-kicker">01 — ADVISORY & TRADE</div>
          <h2>Vos intérêts,<br/><em>notre réseau.</em></h2>
        </div>
        <div className="prose-card">
          <p>Nairi Corporation intervient comme relais privé entre un besoin et sa solution. Recherche de prestataires, sourcing de biens, rédaction et suivi d’accords, négociation ou gestion administrative : chaque dossier est traité avec un interlocuteur unique.</p>
          <p>Lorsqu’une demande sort de notre périmètre direct, nous activons notre réseau de partenaires et orchestrons la mise en relation dans un cadre transparent, rémunéré au succès.</p>
          <div className="mini-features"><span><Check/> Sourcing</span><span><Check/> Négociation</span><span><Check/> Intermédiation</span><span><Check/> Suivi privé</span></div>
          <button className="primary" onClick={()=>setModal({type:'advisory'})}>Soumettre une consultation <ArrowRight size={16}/></button>
        </div>
      </section>

      <section id="automotive" className="section automotive-section">
        <div className="section-head">
          <div><div className="section-kicker">02 — NAIRI AUTOMOTIVE</div><h2>Flotte <em>d’exception.</em></h2></div>
          <div className="section-note"><Gauge size={18}/><span>{loading?'Synchronisation…':`${vehicles.filter(v=>v.status==='available').length} véhicule(s) disponible(s)`}</span></div>
        </div>
        <div className="vehicle-grid">
          {vehicles.map((v,i)=><VehicleCard key={v.id} vehicle={v} index={i+1} onBook={()=>setModal({type:'booking',payload:v})}/>) }
        </div>
        <div className="chauffeur-banner">
          <div><UserCheck/><span><b>Service chauffeur privé</b>Un chauffeur accrédité peut rester à votre disposition pendant toute la durée de la prestation.</span></div>
          <button className="secondary" onClick={()=>setModal({type:'booking'})}>Réserver avec chauffeur <ArrowRight size={16}/></button>
        </div>
      </section>

      <section id="logistics" className="section logistics-section">
        <div className="section-head">
          <div><div className="section-kicker">03 — NAIRI LOGISTICS</div><h2>Le terrain comme<br/><em>chaîne de valeur.</em></h2></div>
          <p>Du ravitaillement quotidien à l’opération prioritaire, la flotte Nairi intervient sur l’ensemble de Los Santos avec une logique simple : la bonne capacité, au bon endroit, au bon moment.</p>
        </div>
        <div className="logistics-layout">
          <div className="service-stack">
            <LogService icon={Boxes} title="Ravitaillement entreprise" text="Planifiez vos réapprovisionnements et confiez vos rotations à Nairi."/>
            <LogService icon={TimerReset} title="Livraison urgente" text="Besoin critique de stock ? Une mission prioritaire peut être ouverte immédiatement."/>
            <LogService icon={Package} title="Transport spécial" text="Alcool, matériel, marchandises RP, cargaison particulière ou trajet sur-mesure."/>
            <LogService icon={ShieldCheck} title="Convoi sécurisé" text="Escorte et sécurisation pour les flux qui exigent une attention renforcée."/>
            <button className="primary wide" onClick={()=>setModal({type:'logistics'})}>Demander une opération logistique <ArrowRight size={16}/></button>
          </div>
          <div className="fleet-showcase">
            {fleet.map((f,i)=><div className="fleet-card" key={f.id}>
              <div className="fleet-image"><img src={f.image_url} alt={f.name} onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentNode.classList.add('fallback')}}/><Truck className="fallback-icon"/></div>
              <div className="fleet-body"><span>FRET / 0{i+1}</span><h3>{f.brand} {f.name}</h3><p>{f.description}</p><div className="fleet-tags"><b>{f.category}</b><i className={`status ${f.status}`}>{statusLabel(f.status)}</i></div></div>
            </div>)}
          </div>
        </div>
      </section>

      <section id="careers" className="section careers-section">
        <div className="section-head"><div><div className="section-kicker">04 — CARRIÈRES</div><h2>Rejoignez<br/><em>la maison.</em></h2></div><p>Nous recherchons des profils fiables, autonomes et capables de représenter Nairi avec professionnalisme sur le terrain comme face aux clients.</p></div>
        <div className="jobs-grid">{JOBS.map((j,i)=><div className="job-card" key={j.id}><span>0{i+1}</span><j.icon/><h3>{j.title}</h3><p>{j.text}</p><button className="link-btn" onClick={()=>setModal({type:'application',payload:j})}>Postuler <ArrowRight size={15}/></button></div>)}</div>
      </section>

      <section className="section philosophy">
        <div className="section-kicker">PHILOSOPHIE OPÉRATIONNELLE</div>
        <blockquote>« Rigueur institutionnelle.<br/><em>Efficacité absolue sur le terrain.</em> »</blockquote>
        <div className="principles"><span>FIABILITÉ INTÉGRALE</span><span>DISCRÉTION ABSOLUE</span><span>SOLUTIONS SUR-MESURE</span><span>DOUBLE PÔLE INTÉGRÉ</span></div>
      </section>

      <section className="section direction">
        <div className="section-kicker">05 — DIRECTION & EXÉCUTIF</div>
        <div className="direction-grid"><div><small>INTERNATIONAL ADVISORY</small><h3>E. Khatchadourian</h3><p>Fondateur & CEO</p></div><div><small>AUTOMOTIVE & LOGISTICS</small><h3>T. Markoussian</h3><p>Responsable Transit & Logistique</p></div></div>
      </section>

      <section className="cta-final">
        <img src="/assets/nairi-logo.png" alt=""/>
        <div><div className="section-kicker">NAIRI CORPORATION · LOS SANTOS</div><h2>Une demande.<br/><em>Un interlocuteur.</em></h2><p>Initiez votre dossier depuis l’application. Notre équipe prend ensuite le relais.</p></div>
        <div className="cta-buttons"><button className="primary" onClick={()=>setModal({type:'advisory'})}>Nouvelle demande</button><button className="secondary" onClick={()=>setModal({type:'track'})}>Suivre un dossier</button></div>
      </section>
    </main>
    <footer><span>LOS SANTOS · MOSCOU · SAINT-PÉTERSBOURG · KAZAN · CRACOVIE · BELGRADE · TIRANA · EREVAN</span><b>NAIRI CORPORATION / 08 2026</b></footer>
  </div>
}

function ActionCard({num,icon:Icon,title,text,action,onClick,href}){ const content=<><div className="action-top"><span>{num}</span><Icon/></div><h3>{title}</h3><p>{text}</p><div className="action-link">{action}<ChevronRight size={16}/></div></>; return href?<a className="action-card" href={href}>{content}</a>:<button className="action-card" onClick={onClick}>{content}</button> }
function VehicleCard({vehicle,index,onBook}){ return <article className="vehicle-card"><div className="vehicle-image"><img src={vehicle.image_url} alt={vehicle.name} onError={e=>{e.currentTarget.style.display='none'; e.currentTarget.parentNode.classList.add('fallback')}}/><CarFront className="fallback-icon"/><span className="vehicle-num">AUTO / 0{index}</span><span className={`status floating ${vehicle.status}`}>{statusLabel(vehicle.status)}</span></div><div className="vehicle-info"><small>{vehicle.brand} — {vehicle.category}</small><h3>{vehicle.name}</h3><p>{vehicle.description}</p><div className="price-row"><div><span>LOCATION</span><b>{money(vehicle.hourly_rate)} <small>/ H</small></b></div><div><span>CAUTION</span><b>{money(vehicle.deposit)}</b></div></div><button className="primary wide" disabled={vehicle.status!=='available'} onClick={onBook}>{vehicle.status==='available'?'Réserver ce véhicule':'Indisponible'} <ArrowRight size={16}/></button></div></article> }
function LogService({icon:Icon,title,text}){return <div className="log-service"><Icon/><div><h3>{title}</h3><p>{text}</p></div><ChevronRight/></div>}

function Modal({type,payload,vehicles,close,notify}){
  React.useEffect(()=>{document.body.style.overflow='hidden'; return()=>{document.body.style.overflow=''}},[])
  const titles={advisory:['Consultation privée','Advisory & Trade'],booking:['Réservation Automotive','Automotive'],logistics:['Mission logistique','Logistics'],application:['Candidature','Carrières'],track:['Suivre un dossier','Operations']}
  return <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><div className="modal-panel"><div className="modal-head"><div><span>{titles[type]?.[1]}</span><h2>{titles[type]?.[0]}</h2></div><button onClick={close}><X/></button></div><div className="modal-content">{type==='advisory'&&<AdvisoryForm close={close} notify={notify}/>} {type==='booking'&&<BookingForm initial={payload} vehicles={vehicles} close={close} notify={notify}/>} {type==='logistics'&&<LogisticsForm close={close} notify={notify}/>} {type==='application'&&<ApplicationForm job={payload} close={close} notify={notify}/>} {type==='track'&&<TrackForm/>}</div></div></div>
}

function Field({label,children,hint}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
function Input(props){return <input {...props}/>} function Textarea(props){return <textarea {...props}/>}

async function insertPublic(table,row){
  if(DEMO){ const all=JSON.parse(localStorage.getItem('nairi_demo_requests')||'[]'); all.push({table,...row,id:crypto.randomUUID(),created_at:new Date().toISOString()}); localStorage.setItem('nairi_demo_requests',JSON.stringify(all)); return {data:row,error:null} }
  return supabase.from(table).insert(row)
}

function FormSuccess({reference,close}){ const [copied,setCopied]=React.useState(false); return <div className="success-state"><div className="success-icon"><Check/></div><h3>Demande enregistrée.</h3><p>Conservez votre référence. Elle permet de suivre l’avancement du dossier avec votre numéro de téléphone.</p><button className="reference" onClick={()=>{navigator.clipboard?.writeText(reference);setCopied(true)}}><span>{reference}</span>{copied?<Check/>:<Copy/>}</button><button className="primary wide" onClick={close}>Terminer</button></div> }

function AdvisoryForm({close,notify}){
  const [done,setDone]=React.useState(null),[busy,setBusy]=React.useState(false)
  async function submit(e){e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget),ref=shortRef('ADV');const {error}=await insertPublic('advisory_requests',{client_ref:ref,contact_name:f.get('name'),phone:f.get('phone'),request_text:f.get('request'),status:'new'});setBusy(false); if(error)return notify(error.message,'error'); setDone(ref)}
  if(done)return <FormSuccess reference={done} close={close}/>
  return <form onSubmit={submit} className="form"><p className="form-intro">Décrivez votre besoin. Un conseiller Nairi reprendra contact pour qualifier le dossier et activer le réseau approprié.</p><Field label="Nom & prénom ou entreprise"><Input name="name" required placeholder="Ex. Bahama Mamas / Aram S."/></Field><Field label="Téléphone"><Input name="phone" required placeholder="Votre numéro IG"/></Field><Field label="Votre demande"><Textarea name="request" required rows="6" placeholder="Recherche d’un fournisseur, négociation, mise en relation, besoin administratif…"/></Field><button className="primary wide" disabled={busy}>{busy?'Transmission…':'Soumettre la consultation'} <Send size={16}/></button></form>
}

function BookingForm({initial,vehicles,close,notify}){
  const [vehicleId,setVehicleId]=React.useState(initial?.id||vehicles.find(v=>v.status==='available')?.id||''); const [hours,setHours]=React.useState(1); const [driver,setDriver]=React.useState(false); const [done,setDone]=React.useState(null),[busy,setBusy]=React.useState(false)
  const v=vehicles.find(x=>x.id===vehicleId); const estimate=(v?.hourly_rate||0)*Number(hours||0)
  async function submit(e){e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget),ref=shortRef('AUTO');const {error}=await insertPublic('automotive_bookings',{client_ref:ref,contact_name:f.get('name'),phone:f.get('phone'),vehicle_id:DEMO?null:vehicleId,vehicle_name:v?.name||f.get('vehicle'),with_driver:driver,duration_hours:Number(hours),requested_at:f.get('date')||null,pickup_location:f.get('pickup'),notes:f.get('notes'),estimated_price:estimate,deposit_amount:v?.deposit||0,status:'new'});setBusy(false);if(error)return notify(error.message,'error');setDone(ref)}
  if(done)return <FormSuccess reference={done} close={close}/>
  return <form onSubmit={submit} className="form"><div className="form-grid"><Field label="Nom & prénom ou entreprise"><Input name="name" required/></Field><Field label="Téléphone"><Input name="phone" required/></Field></div><Field label="Véhicule"><select name="vehicle" value={vehicleId} onChange={e=>setVehicleId(e.target.value)} required>{vehicles.filter(x=>x.status==='available').map(x=><option key={x.id} value={x.id}>{x.brand} {x.name} — {money(x.hourly_rate)}/h</option>)}</select></Field><div className="form-grid"><Field label="Durée (heures)"><Input type="number" min="1" max="24" name="hours" value={hours} onChange={e=>setHours(e.target.value)} required/></Field><Field label="Date & heure souhaitées"><Input type="datetime-local" name="date" required/></Field></div><Field label="Lieu de prise en charge"><Input name="pickup" placeholder="Ex. Pillbox Hill, Arcadius…"/></Field><label className="toggle-field"><input type="checkbox" checked={driver} onChange={e=>setDriver(e.target.checked)}/><span className="toggle"/><div><b>Chauffeur accrédité</b><small>Le chauffeur reste à disposition durant la prestation.</small></div></label><Field label="Informations complémentaires"><Textarea rows="3" name="notes" placeholder="Trajet prévu, nombre de passagers, contraintes…"/></Field>{v&&<div className="estimate"><div><span>Location estimée</span><b>{money(estimate)}</b></div><div><span>Caution</span><b>{money(v.deposit)}</b></div><small>Le prix du chauffeur et les prestations spécifiques peuvent être confirmés par l’équipe Nairi.</small></div>}<button className="primary wide" disabled={busy||!v}>{busy?'Transmission…':'Demander la réservation'} <ArrowRight size={16}/></button></form>
}

function LogisticsForm({close,notify}){
  const [done,setDone]=React.useState(null),[busy,setBusy]=React.useState(false)
  async function submit(e){e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget),ref=shortRef('LOG');const {error}=await insertPublic('logistics_requests',{client_ref:ref,contact_name:f.get('name'),company_name:f.get('company'),phone:f.get('phone'),request_type:f.get('type'),pickup_location:f.get('pickup'),delivery_location:f.get('delivery'),cargo:f.get('cargo'),volume:f.get('volume'),requested_at:f.get('date')||null,is_urgent:f.get('urgent')==='on',needs_security:f.get('security')==='on',notes:f.get('notes'),status:'new'});setBusy(false);if(error)return notify(error.message,'error');setDone(ref)}
  if(done)return <FormSuccess reference={done} close={close}/>
  return <form onSubmit={submit} className="form"><div className="form-grid"><Field label="Nom du demandeur"><Input name="name" required/></Field><Field label="Entreprise"><Input name="company" placeholder="Optionnel"/></Field></div><div className="form-grid"><Field label="Téléphone"><Input name="phone" required/></Field><Field label="Type de mission"><select name="type" required><option value="business_supply">Ravitaillement entreprise</option><option value="urgent_delivery">Livraison urgente</option><option value="special_transport">Transport spécial</option><option value="secure_convoy">Convoi sécurisé</option></select></Field></div><div className="form-grid"><Field label="Lieu d’enlèvement"><Input name="pickup"/></Field><Field label="Lieu de livraison"><Input name="delivery" required/></Field></div><div className="form-grid"><Field label="Nature de la marchandise"><Input name="cargo" required placeholder="Alcool, matières, colis…"/></Field><Field label="Volume approximatif"><Input name="volume" placeholder="Ex. 20 cartons / palette…"/></Field></div><Field label="Date & heure souhaitées"><Input type="datetime-local" name="date"/></Field><div className="check-row"><label><input type="checkbox" name="urgent"/><AlertTriangle/> Prioritaire / urgent</label><label><input type="checkbox" name="security"/><ShieldCheck/> Sécurisation nécessaire</label></div><Field label="Informations complémentaires"><Textarea name="notes" rows="4" placeholder="Précisions de chargement, accès, contraintes, fréquence souhaitée…"/></Field><button className="primary wide" disabled={busy}>{busy?'Transmission…':'Créer la demande logistique'} <Truck size={16}/></button></form>
}

function ApplicationForm({job,close,notify}){
  const [done,setDone]=React.useState(null),[busy,setBusy]=React.useState(false)
  async function submit(e){e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget),ref=shortRef('JOB');const {error}=await insertPublic('applications',{client_ref:ref,full_name:f.get('name'),phone:f.get('phone'),position:f.get('position'),experience:f.get('experience'),availability:f.get('availability'),motivation:f.get('motivation'),notes:f.get('notes'),status:'new'});setBusy(false);if(error)return notify(error.message,'error');setDone(ref)}
  if(done)return <FormSuccess reference={done} close={close}/>
  return <form onSubmit={submit} className="form"><Field label="Nom & prénom"><Input name="name" required/></Field><div className="form-grid"><Field label="Téléphone"><Input name="phone" required/></Field><Field label="Poste"><select name="position" defaultValue={job?.id||'heavy_driver'}>{JOBS.map(x=><option value={x.id} key={x.id}>{x.title}</option>)}</select></Field></div><Field label="Expérience"><Textarea name="experience" rows="3" placeholder="Transport, conduite, relation client, commerce…"/></Field><Field label="Disponibilités"><Input name="availability" placeholder="Jours / créneaux habituels"/></Field><Field label="Motivation"><Textarea name="motivation" rows="4" required placeholder="Pourquoi souhaitez-vous rejoindre Nairi ?"/></Field><Field label="Informations complémentaires"><Textarea name="notes" rows="2"/></Field><button className="primary wide" disabled={busy}>{busy?'Transmission…':'Déposer ma candidature'} <Send size={16}/></button></form>
}

function TrackForm(){
  const [result,setResult]=React.useState(null),[error,setError]=React.useState(null),[busy,setBusy]=React.useState(false)
  async function submit(e){e.preventDefault();setBusy(true);setError(null);setResult(null);const f=new FormData(e.currentTarget),ref=f.get('ref').trim().toUpperCase(),phone=f.get('phone').trim(); if(DEMO){const all=JSON.parse(localStorage.getItem('nairi_demo_requests')||'[]'); const found=all.find(x=>x.client_ref===ref&&x.phone===phone); setResult(found?{reference:ref,category:found.table,status:found.status||'new',created_at:found.created_at,summary:found.vehicle_name||found.request_text||found.cargo||found.position}:null); if(!found)setError('Aucun dossier correspondant.'); setBusy(false);return}
    const {data,error:err}=await supabase.rpc('track_request',{p_reference:ref,p_phone:phone});setBusy(false); if(err)return setError(err.message); const found=Array.isArray(data)?data[0]:data; if(!found)return setError('Aucun dossier correspondant.');setResult(found)}
  return <div className="track-wrap"><form onSubmit={submit} className="form"><p className="form-intro">Saisissez la référence reçue lors de votre demande et le même numéro de téléphone.</p><Field label="Référence"><Input name="ref" placeholder="AUTO-XXXX0000" required/></Field><Field label="Téléphone"><Input name="phone" required/></Field><button className="primary wide" disabled={busy}>{busy?'Recherche…':'Consulter le statut'} <Search size={16}/></button></form>{error&&<div className="inline-error">{error}</div>}{result&&<div className="track-result"><BadgeCheck/><span>DOSSIER {result.reference}</span><h3>{statusLabel(result.status)}</h3><p>{result.summary||'Votre demande est bien enregistrée dans le système Nairi.'}</p><small>Ouvert le {dt(result.created_at)}</small></div>}</div>
}

function StaffApp({session,staffProfile,notify,vehicles,fleet,reloadPublic,demo}){
  const [demoLogged,setDemoLogged]=React.useState(()=>sessionStorage.getItem('nairi_demo_staff')==='1')
  if((!session&&!demoLogged) || (session && !staffProfile)) return <StaffLogin session={session} staffProfile={staffProfile} demo={demo} onDemo={()=>{sessionStorage.setItem('nairi_demo_staff','1');setDemoLogged(true)}} notify={notify}/>
  return <StaffDashboard notify={notify} vehicles={vehicles} fleet={fleet} reloadPublic={reloadPublic} profile={staffProfile||{display_name:'Mode démonstration',role:'admin'}} demo={demo} onDemoLogout={()=>{sessionStorage.removeItem('nairi_demo_staff');setDemoLogged(false)}} />
}

function StaffLogin({session,staffProfile,demo,onDemo,notify}){
  const [busy,setBusy]=React.useState(false)
  async function login(e){e.preventDefault(); if(!supabase)return onDemo(); setBusy(true);const f=new FormData(e.currentTarget);const {error}=await supabase.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});setBusy(false);if(error)notify(error.message,'error')}
  return <div className="staff-login"><a className="brand login-brand" href="#home"><img src="/assets/nairi-logo.png"/><span><strong>NAIRI</strong><small>OPERATIONS CENTER</small></span></a><div className="login-card"><div className="security-mark"><LockKeyhole/></div><span>ACCÈS INTERNE</span><h1>Operations Center</h1>{session&&!staffProfile?<div className="inline-error">Ce compte est authentifié mais ne possède pas de profil staff autorisé.</div>:<p>Gestion des opérations Automotive, Logistics, Advisory et des flux financiers.</p>} {!session&&<form onSubmit={login} className="form"><Field label="E-mail"><Input type="email" name="email" required/></Field><Field label="Mot de passe"><Input type="password" name="password" required/></Field><button className="primary wide" disabled={busy}>{busy?'Connexion…':'Accéder au centre'} <LogIn size={16}/></button></form>}{demo&&<><div className="demo-separator"><span>MODE LOCAL</span></div><button className="secondary wide" onClick={onDemo}>Ouvrir la démo staff</button><small className="demo-help">Supabase n’est pas encore configuré : les données de test seront conservées uniquement dans ce navigateur.</small></>}<a className="back-site" href="#home">← Retour au site public</a></div></div>
}

function StaffDashboard({notify,vehicles,fleet,reloadPublic,profile,demo,onDemoLogout}){
  const [tab,setTab]=React.useState('overview'); const [mobileNav,setMobileNav]=React.useState(false); const [data,setData]=React.useState({advisory:[],bookings:[],logistics:[],applications:[],finance:[]}); const [loading,setLoading]=React.useState(false)
  async function load(){ setLoading(true); if(DEMO){const all=JSON.parse(localStorage.getItem('nairi_demo_requests')||'[]'); setData({advisory:all.filter(x=>x.table==='advisory_requests'),bookings:all.filter(x=>x.table==='automotive_bookings'),logistics:all.filter(x=>x.table==='logistics_requests'),applications:all.filter(x=>x.table==='applications'),finance:JSON.parse(localStorage.getItem('nairi_demo_finance')||'[]')});setLoading(false);return}
    const [a,b,l,j,f]=await Promise.all([supabase.from('advisory_requests').select('*').order('created_at',{ascending:false}),supabase.from('automotive_bookings').select('*').order('created_at',{ascending:false}),supabase.from('logistics_requests').select('*').order('created_at',{ascending:false}),supabase.from('applications').select('*').order('created_at',{ascending:false}),supabase.from('financial_transactions').select('*').order('transaction_date',{ascending:false})]);
    setData({advisory:a.data||[],bookings:b.data||[],logistics:l.data||[],applications:j.data||[],finance:f.data||[]});setLoading(false)
  }
  React.useEffect(()=>{load()},[])
  const nav=[['overview',LayoutDashboard,'Vue générale'],['requests',ClipboardList,'Demandes'],['automotive',CarFront,'Automotive'],['logistics',Truck,'Logistics'],['finance',WalletCards,'Finance'],['careers',UsersRound,'Recrutement']]
  async function logout(){if(supabase)await supabase.auth.signOut();else onDemoLogout();location.hash='#home'}
  return <div className="staff-shell"><aside className={mobileNav?'open':''}><div className="staff-brand"><img src="/assets/nairi-logo.png"/><div><b>NAIRI</b><span>OPERATIONS</span></div></div><nav>{nav.map(([id,Icon,label])=><button className={tab===id?'active':''} key={id} onClick={()=>{setTab(id);setMobileNav(false)}}><Icon/>{label}</button>)}</nav><div className="staff-user"><div className="avatar">{(profile.display_name||'N').slice(0,1)}</div><div><b>{profile.display_name||'Staff Nairi'}</b><span>{profile.role||'staff'}</span></div><button onClick={logout}><LogOut/></button></div></aside><div className="staff-main"><header><button className="staff-menu" onClick={()=>setMobileNav(!mobileNav)}><Menu/></button><div><span>NAIRI CORPORATION / INTERNAL</span><h1>{nav.find(x=>x[0]===tab)?.[2]}</h1></div><div className="header-tools">{demo&&<span className="demo-badge"><Database/> DEMO</span>}<button className="icon-btn" onClick={()=>{load();reloadPublic()}}><RefreshCw className={loading?'spin':''}/></button><a className="icon-btn" href="#home"><ExternalLink/></a></div></header><section className="staff-content">{tab==='overview'&&<Overview data={data}/>} {tab==='requests'&&<RequestsPanel data={data} reload={load} notify={notify}/>} {tab==='automotive'&&<VehiclesPanel vehicles={vehicles} reload={reloadPublic} notify={notify}/>} {tab==='logistics'&&<LogisticsPanel fleet={fleet} requests={data.logistics} reload={()=>{reloadPublic();load()}} notify={notify}/>} {tab==='finance'&&<FinancePanel items={data.finance} reload={load} notify={notify}/>} {tab==='careers'&&<CareersPanel items={data.applications} reload={load} notify={notify}/>}</section></div></div>
}

function Overview({data}){
  const open=[...data.advisory,...data.bookings,...data.logistics].filter(x=>!['completed','delivered','cancelled','rejected'].includes(x.status)).length
  const income=data.finance.filter(x=>x.direction==='income').reduce((s,x)=>s+Number(x.amount),0), expense=data.finance.filter(x=>x.direction==='expense').reduce((s,x)=>s+Number(x.amount),0)
  const recent=[...data.advisory.map(x=>({...x,kind:'Advisory'})),...data.bookings.map(x=>({...x,kind:'Automotive'})),...data.logistics.map(x=>({...x,kind:'Logistics'}))].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,6)
  return <><div className="metric-grid"><Metric icon={ClipboardList} label="Dossiers actifs" value={open}/><Metric icon={CarFront} label="Réservations" value={data.bookings.length}/><Metric icon={Truck} label="Missions logistiques" value={data.logistics.length}/><Metric icon={CircleDollarSign} label="Solde enregistré" value={money(income-expense)}/></div><div className="staff-card"><div className="card-title"><div><span>ACTIVITÉ</span><h2>Dernières demandes</h2></div></div>{recent.length?<div className="table-wrap"><table><thead><tr><th>Référence</th><th>Branche</th><th>Client</th><th>Créée</th><th>Statut</th></tr></thead><tbody>{recent.map(x=><tr key={x.id}><td><b>{x.client_ref}</b></td><td>{x.kind}</td><td>{x.contact_name||x.company_name}</td><td>{dt(x.created_at)}</td><td><Status value={x.status}/></td></tr>)}</tbody></table></div>:<Empty icon={ClipboardList} text="Aucune demande pour le moment."/>}</div></>
}
function Metric({icon:Icon,label,value}){return <div className="metric"><div><Icon/></div><span>{label}</span><b>{value}</b></div>}
function Status({value}){return <span className={`status ${value}`}>{statusLabel(value)}</span>}
function Empty({icon:Icon,text}){return <div className="empty"><Icon/><p>{text}</p></div>}

function RequestsPanel({data,reload,notify}){
  const [kind,setKind]=React.useState('bookings'); const [selected,setSelected]=React.useState(null); const items=data[kind]||[]
  const map={bookings:'automotive_bookings',advisory:'advisory_requests',logistics:'logistics_requests'}
  async function changeStatus(row,status){ if(DEMO){const all=JSON.parse(localStorage.getItem('nairi_demo_requests')||'[]');const i=all.findIndex(x=>x.id===row.id);if(i>=0)all[i].status=status;localStorage.setItem('nairi_demo_requests',JSON.stringify(all));notify('Statut mis à jour');reload();return} const {error}=await supabase.from(map[kind]).update({status}).eq('id',row.id);if(error)notify(error.message,'error');else{notify('Statut mis à jour');reload();setSelected(null)}}
  return <div className="staff-card"><div className="card-title"><div><span>OPERATIONS</span><h2>Gestion des demandes</h2></div><div className="segmented"><button className={kind==='bookings'?'active':''} onClick={()=>setKind('bookings')}>Automotive</button><button className={kind==='logistics'?'active':''} onClick={()=>setKind('logistics')}>Logistics</button><button className={kind==='advisory'?'active':''} onClick={()=>setKind('advisory')}>Advisory</button></div></div>{items.length?<div className="request-list">{items.map(x=><button key={x.id} className="request-row" onClick={()=>setSelected(x)}><div><span>{x.client_ref}</span><h3>{x.contact_name||x.company_name}</h3><p>{kind==='bookings'?`${x.vehicle_name||'Véhicule'} · ${x.duration_hours||'?'}h`:kind==='logistics'?`${x.cargo||'Marchandise'} · ${x.delivery_location||'Destination à définir'}`:(x.request_text||'').slice(0,90)}</p></div><div><small>{dt(x.created_at)}</small><Status value={x.status}/></div><ChevronRight/></button>)}</div>:<Empty icon={ClipboardList} text="Aucune demande dans cette catégorie."/>}{selected&&<RequestDrawer row={selected} kind={kind} close={()=>setSelected(null)} changeStatus={changeStatus}/>}</div>
}
function RequestDrawer({row,kind,close,changeStatus}){
 const opts=kind==='bookings'?['new','accepted','deposit_pending','confirmed','in_progress','completed','cancelled']:kind==='logistics'?['new','review','accepted','assigned','in_transit','delivered','cancelled']:['new','review','contacted','negotiation','completed','rejected']
 return <div className="drawer-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="request-drawer"><div className="modal-head"><div><span>DOSSIER {row.client_ref}</span><h2>{row.contact_name||row.company_name}</h2></div><button onClick={close}><X/></button></div><div className="drawer-body"><div className="detail-grid"><Detail label="Téléphone" value={row.phone}/><Detail label="Création" value={dt(row.created_at)}/>{kind==='bookings'&&<><Detail label="Véhicule" value={row.vehicle_name}/><Detail label="Durée" value={`${row.duration_hours}h`}/><Detail label="Chauffeur" value={row.with_driver?'Oui':'Non'}/><Detail label="Prise en charge" value={row.pickup_location}/><Detail label="Date souhaitée" value={dt(row.requested_at)}/><Detail label="Estimation" value={money(row.estimated_price)}/></>}{kind==='logistics'&&<><Detail label="Entreprise" value={row.company_name}/><Detail label="Type" value={row.request_type}/><Detail label="Marchandise" value={row.cargo}/><Detail label="Enlèvement" value={row.pickup_location}/><Detail label="Livraison" value={row.delivery_location}/><Detail label="Prioritaire" value={row.is_urgent?'Oui':'Non'}/></>}{kind==='advisory'&&<div className="detail-full"><span>Demande</span><p>{row.request_text}</p></div>}{row.notes&&<div className="detail-full"><span>Notes client</span><p>{row.notes}</p></div>}</div><div className="status-editor"><span>FAIRE ÉVOLUER LE DOSSIER</span><div>{opts.map(s=><button key={s} className={row.status===s?'active':''} onClick={()=>changeStatus(row,s)}>{statusLabel(s)}</button>)}</div></div></div></div></div>
}
function Detail({label,value}){return <div className="detail"><span>{label}</span><b>{value||'—'}</b></div>}

function VehiclesPanel({vehicles,reload,notify}){
  const [edit,setEdit]=React.useState(null)
  async function save(row){ if(DEMO){notify('En mode démo, le catalogue SQL reste inchangé.','error');return} const payload={name:row.name,brand:row.brand,category:row.category,hourly_rate:Number(row.hourly_rate),deposit:Number(row.deposit),status:row.status,image_url:row.image_url,description:row.description,active:row.active!==false,sort_order:Number(row.sort_order||0)}; const q=row.id?supabase.from('vehicles').update(payload).eq('id',row.id):supabase.from('vehicles').insert(payload);const {error}=await q;if(error)notify(error.message,'error');else{notify('Catalogue mis à jour');setEdit(null);reload()}}
  async function remove(id){if(!confirm('Supprimer ce véhicule du catalogue ?'))return;if(DEMO)return notify('Suppression désactivée en démo.','error');const {error}=await supabase.from('vehicles').delete().eq('id',id);if(error)notify(error.message,'error');else{notify('Véhicule supprimé');reload()}}
  return <div className="staff-card"><div className="card-title"><div><span>FLEET MANAGEMENT</span><h2>Catalogue Automotive</h2></div><button className="primary small" onClick={()=>setEdit({status:'available',active:true,sort_order:vehicles.length+1})}><Plus/> Ajouter</button></div><div className="admin-cards">{vehicles.map(v=><div className="admin-vehicle" key={v.id}><img src={v.image_url}/><div><Status value={v.status}/><h3>{v.brand} {v.name}</h3><p>{money(v.hourly_rate)}/h · Caution {money(v.deposit)}</p></div><div className="row-actions"><button onClick={()=>setEdit(v)}><Pencil/></button><button onClick={()=>remove(v.id)}><Trash2/></button></div></div>)}</div>{edit&&<VehicleEditor item={edit} close={()=>setEdit(null)} save={save}/>}</div>
}
function VehicleEditor({item,close,save}){const [v,setV]=React.useState({...item});return <div className="drawer-overlay"><div className="request-drawer"><div className="modal-head"><div><span>AUTOMOTIVE</span><h2>{v.id?'Modifier le véhicule':'Ajouter un véhicule'}</h2></div><button onClick={close}><X/></button></div><div className="drawer-body form"><div className="form-grid"><Field label="Marque"><Input value={v.brand||''} onChange={e=>setV({...v,brand:e.target.value})}/></Field><Field label="Modèle"><Input value={v.name||''} onChange={e=>setV({...v,name:e.target.value})}/></Field></div><Field label="Catégorie"><Input value={v.category||''} onChange={e=>setV({...v,category:e.target.value})}/></Field><div className="form-grid"><Field label="Prix / heure"><Input type="number" value={v.hourly_rate||0} onChange={e=>setV({...v,hourly_rate:e.target.value})}/></Field><Field label="Caution"><Input type="number" value={v.deposit||0} onChange={e=>setV({...v,deposit:e.target.value})}/></Field></div><Field label="Statut"><select value={v.status||'available'} onChange={e=>setV({...v,status:e.target.value})}><option value="available">Disponible</option><option value="reserved">Réservé</option><option value="service">En service</option><option value="unavailable">Indisponible</option></select></Field><Field label="URL de l’image"><Input value={v.image_url||''} onChange={e=>setV({...v,image_url:e.target.value})}/></Field><Field label="Description"><Textarea rows="4" value={v.description||''} onChange={e=>setV({...v,description:e.target.value})}/></Field><button className="primary wide" onClick={()=>save(v)}>Enregistrer</button></div></div></div>}

function LogisticsPanel({fleet,requests,reload,notify}){
  const active=requests.filter(x=>!['delivered','cancelled'].includes(x.status));
  return <><div className="metric-grid"><Metric icon={Truck} label="Missions actives" value={active.length}/><Metric icon={AlertTriangle} label="Urgences" value={active.filter(x=>x.is_urgent).length}/><Metric icon={ShieldCheck} label="Convois sécurisés" value={active.filter(x=>x.needs_security).length}/><Metric icon={Boxes} label="Véhicules fret" value={fleet.length}/></div><div className="staff-card"><div className="card-title"><div><span>FLEET LOGISTICS</span><h2>Parc de fret</h2></div></div><div className="admin-cards">{fleet.map(v=><div className="admin-vehicle" key={v.id}><img src={v.image_url}/><div><Status value={v.status}/><h3>{v.brand} {v.name}</h3><p>{v.category}</p></div></div>)}</div><p className="muted-block">Le CRUD complet du parc logistique utilise la même structure que l’Automotive dans Supabase. Pour la V1, les demandes sont gérées depuis l’onglet « Demandes » et la flotte sert de référentiel.</p></div></>
}

function FinancePanel({items,reload,notify}){
 const [open,setOpen]=React.useState(false); const income=items.filter(x=>x.direction==='income').reduce((a,x)=>a+Number(x.amount),0),expense=items.filter(x=>x.direction==='expense').reduce((a,x)=>a+Number(x.amount),0)
 async function add(e){e.preventDefault();const f=new FormData(e.currentTarget),row={direction:f.get('direction'),amount:Number(f.get('amount')),branch:f.get('branch'),category:f.get('category'),description:f.get('description'),transaction_date:f.get('date')||new Date().toISOString().slice(0,10)};if(DEMO){const all=JSON.parse(localStorage.getItem('nairi_demo_finance')||'[]');all.unshift({...row,id:crypto.randomUUID(),created_at:new Date().toISOString()});localStorage.setItem('nairi_demo_finance',JSON.stringify(all));notify('Transaction enregistrée');setOpen(false);reload();return}const {error}=await supabase.from('financial_transactions').insert(row);if(error)notify(error.message,'error');else{notify('Transaction enregistrée');setOpen(false);reload()}}
 return <><div className="metric-grid"><Metric icon={CircleDollarSign} label="Entrées" value={money(income)}/><Metric icon={DollarSign} label="Sorties" value={money(expense)}/><Metric icon={WalletCards} label="Solde" value={money(income-expense)}/></div><div className="staff-card"><div className="card-title"><div><span>FINANCE LEDGER</span><h2>Journal financier</h2></div><button className="primary small" onClick={()=>setOpen(true)}><Plus/> Nouvelle écriture</button></div>{items.length?<div className="table-wrap"><table><thead><tr><th>Date</th><th>Branche</th><th>Catégorie</th><th>Description</th><th>Montant</th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td>{new Date(x.transaction_date).toLocaleDateString('fr-FR')}</td><td>{x.branch}</td><td>{x.category}</td><td>{x.description}</td><td className={x.direction==='income'?'money-in':'money-out'}>{x.direction==='income'?'+':'−'} {money(x.amount)}</td></tr>)}</tbody></table></div>:<Empty icon={WalletCards} text="Aucune écriture financière."/>}</div>{open&&<div className="drawer-overlay"><form className="request-drawer" onSubmit={add}><div className="modal-head"><div><span>FINANCE</span><h2>Nouvelle écriture</h2></div><button type="button" onClick={()=>setOpen(false)}><X/></button></div><div className="drawer-body form"><div className="form-grid"><Field label="Type"><select name="direction"><option value="income">Entrée</option><option value="expense">Sortie</option></select></Field><Field label="Montant"><Input name="amount" type="number" min="0" required/></Field></div><div className="form-grid"><Field label="Branche"><select name="branch"><option>Automotive</option><option>Logistics</option><option>Advisory</option><option>Corporate</option></select></Field><Field label="Catégorie"><Input name="category" required placeholder="Location, carburant…"/></Field></div><Field label="Description"><Input name="description" required/></Field><Field label="Date"><Input name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></Field><button className="primary wide">Enregistrer</button></div></form></div>}</>
}

function CareersPanel({items,reload,notify}){
 async function setStatus(row,status){if(DEMO){const all=JSON.parse(localStorage.getItem('nairi_demo_requests')||'[]');const i=all.findIndex(x=>x.id===row.id);if(i>=0)all[i].status=status;localStorage.setItem('nairi_demo_requests',JSON.stringify(all));reload();return}const {error}=await supabase.from('applications').update({status}).eq('id',row.id);if(error)notify(error.message,'error');else reload()}
 return <div className="staff-card"><div className="card-title"><div><span>HUMAN CAPITAL</span><h2>Candidatures</h2></div></div>{items.length?<div className="candidate-grid">{items.map(x=><div className="candidate" key={x.id}><div><span>{x.client_ref}</span><Status value={x.status}/></div><h3>{x.full_name}</h3><p>{JOBS.find(j=>j.id===x.position)?.title||x.position} · {x.phone}</p><blockquote>{x.motivation}</blockquote><div className="candidate-actions"><button onClick={()=>setStatus(x,'interview')}>Entretien</button><button onClick={()=>setStatus(x,'accepted')}>Accepter</button><button onClick={()=>setStatus(x,'rejected')}>Refuser</button></div></div>)}</div>:<Empty icon={UsersRound} text="Aucune candidature reçue."/>}</div>
}

function Toast({text,type}){return <div className={`toast ${type}`}>{type==='ok'?<Check/>:<AlertTriangle/>}{text}</div>}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
