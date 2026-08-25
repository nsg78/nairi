import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Banknote, Boxes, BriefcaseBusiness,
  Building2, Check, ChevronRight, CircleDollarSign, ClipboardList, Clock3,
  Copy, FileText, Gauge, Handshake, HardHat, Headphones, Inbox, LayoutDashboard,
  LockKeyhole, LogIn, LogOut, MapPin, Menu, MessageCircle, MessageSquareText,
  PackageCheck, Pencil, Phone, Plus, RefreshCw, Route, Search, Send, ShieldCheck,
  Truck, UserRound, UsersRound, Warehouse, X, AlertTriangle, Trash2, Eye,
  CalendarDays, SlidersHorizontal, CircleDot, UserCheck, ExternalLink
} from 'lucide-react'
import './styles.css'

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const DISCORD_URL = import.meta.env.VITE_DISCORD_URL || 'https://discord.gg/uxtzfStWsF'
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null
const DEMO = !supabase

const LOGISTICS_IMAGE = 'https://static.wikia.nocookie.net/gtawiki/images/8/85/PounderCustom-GTAO-front.png/revision/latest?cb=20190716203227'
const SPEEDO_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnzWrFCD-gykInC86VszO2o5mRsMtoO8UEQX2VCyRw&s=10'

const FLEET_SEEDS = [
  { id:'demo-pounder', name:'Pounder', brand:'MTL', category:'Poids lourd', status:'available', active:true, sort_order:1, image_url:LOGISTICS_IMAGE, description:'Porteur lourd pour ravitaillements, tournées régulières et cargaisons volumineuses.' },
  { id:'demo-speedo', name:'Speedo Express', brand:'Vapid', category:'Utilitaire', status:'available', active:true, sort_order:2, image_url:SPEEDO_IMAGE, description:'Utilitaire agile pour les urgences, petits volumes et livraisons rapides en zone urbaine.' },
]

const CORP_SERVICES = [
  { id:'business_intro', n:'01', title:'Mise en relation', text:'Vous avez un besoin mais pas le bon interlocuteur. Nairi identifie, approche et qualifie le partenaire adapté.' },
  { id:'sourcing', n:'02', title:'Sourcing & recherche', text:'Recherche de biens, prestataires, fournisseurs ou opportunités selon votre cahier des charges.' },
  { id:'negotiation', n:'03', title:'Négociation & accords', text:'Nous préparons le dossier, centralisons les échanges et négocions en votre nom jusqu’à l’accord.' },
  { id:'admin_support', n:'04', title:'Gestion de dossier', text:'Suivi administratif, coordination des parties et historique clair pour ne plus perdre vos demandes dans les messages.' },
]

const LOG_SERVICES = [
  { id:'business_supply', icon:Warehouse, title:'Ravitaillement entreprise', tag:'FLUX MÉTIER', text:'Prise en charge des tournées de ravitaillement nécessaires au fonctionnement quotidien de votre établissement.' },
  { id:'dedicated_route', icon:Route, title:'Desserte dédiée', tag:'RÉCURRENT', text:'Nairi devient votre transporteur référent avec des passages planifiés et une organisation stable.' },
  { id:'urgent_resupply', icon:Gauge, title:'Réapprovisionnement urgent', tag:'PRIORITAIRE', text:'Stock critique, besoin immédiat ou imprévu : une demande prioritaire est injectée dans notre planning.' },
  { id:'special_freight', icon:Boxes, title:'Fret sur mesure', tag:'HORS SCRIPT', text:'Alcool, matériel, objets RP ou marchandise particulière : nous organisons un transport dédié hors des flux automatiques.' },
  { id:'intersite_transfer', icon:Truck, title:'Transport inter-sites', tag:'B2B', text:'Transfert de marchandises entre entrepôts, commerces, garages, points de vente ou sites partenaires.' },
  { id:'secure_convoy', icon:ShieldCheck, title:'Convoi sensible', tag:'SUR DEMANDE', text:'Pour les cargaisons qui exigent davantage de coordination, de discrétion ou de sécurisation opérationnelle.' },
]

const JOBS = [
  { id:'heavy_driver', icon:Truck, title:'Conducteur poids lourd', text:'Tournées, chargement, livraison et représentation Nairi auprès des entreprises clientes.' },
  { id:'dispatcher', icon:ClipboardList, title:'Dispatcher / Exploitant', text:'Planification des dossiers, affectation des chauffeurs et suivi opérationnel des flux.' },
  { id:'advisor', icon:BriefcaseBusiness, title:'Conseiller / Commercial', text:'Prospection, mise en relation, développement du réseau partenaires et suivi des dossiers Corporate.' },
]

const CASE_STATUS = {
  new:'Nouveau', qualified:'Qualifié', waiting_client:'Attente client', accepted:'Accepté',
  scheduled:'Planifié', in_progress:'En cours', completed:'Terminé', declined:'Refusé', cancelled:'Annulé'
}
const STATUS_FLOW = ['new','qualified','accepted','scheduled','in_progress','waiting_client','completed','declined','cancelled']
const FLEET_STATUS = {available:'Disponible', service:'En mission', maintenance:'Maintenance', unavailable:'Indisponible'}
const APP_STATUS = {new:'Nouvelle',review:'À étudier',interview:'Entretien',accepted:'Acceptée',rejected:'Refusée'}

const serviceLabel = id => [...CORP_SERVICES,...LOG_SERVICES].find(x=>x.id===id)?.title || id || 'Demande générale'
const statusLabel = s => CASE_STATUS[s] || APP_STATUS[s] || FLEET_STATUS[s] || s
const dt = v => v ? new Date(v).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}) : '—'
const d = v => v ? new Date(v).toLocaleDateString('fr-FR') : '—'
const money = n => new Intl.NumberFormat('fr-FR').format(Number(n || 0)) + ' $'
const cls = (...xs) => xs.filter(Boolean).join(' ')

const DEMO_KEYS = {
  cases:'nairi_v3_cases', messages:'nairi_v3_messages', partners:'nairi_v3_partners',
  fleet:'nairi_v3_fleet', finance:'nairi_v3_finance', applications:'nairi_v3_applications'
}
const demoGet = (key, fallback=[]) => { try { const v=JSON.parse(localStorage.getItem(DEMO_KEYS[key])); return Array.isArray(v)?v:fallback } catch { return fallback } }
const demoSet = (key, value) => localStorage.setItem(DEMO_KEYS[key], JSON.stringify(value))
const makeRef = kind => `${kind==='logistics'?'NL':'NC'}-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
const uuid = () => crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`

function ensureDemo(){
  if(!localStorage.getItem(DEMO_KEYS.fleet)) demoSet('fleet',FLEET_SEEDS)
  if(!localStorage.getItem(DEMO_KEYS.partners)) demoSet('partners',[
    {id:'demo-partner',name:'Votre partenaire',eyebrow:'RÉSEAU NAIRI',description:'Les entreprises partenaires publiées depuis le back-office apparaîtront ici avec leur image et leur présentation.',image_url:'',active:true,sort_order:1}
  ])
}
if(DEMO && typeof localStorage!=='undefined') ensureDemo()

async function publicOpenCase(payload){
  if(!supabase){
    const reference=makeRef(payload.kind)
    const now=new Date().toISOString()
    const row={id:uuid(),reference,status:'new',created_at:now,updated_at:now,assigned_to:null,...payload}
    const cases=demoGet('cases'); demoSet('cases',[row,...cases])
    const messages=demoGet('messages');
    demoSet('messages',[...messages,{id:uuid(),case_id:row.id,author_type:'system',author_name:'Nairi',visibility:'public',body:'Votre dossier a bien été ouvert. Notre équipe va le qualifier puis revenir vers vous ici.',created_at:now}])
    return reference
  }
  const {data,error}=await supabase.rpc('open_case',{
    p_kind:payload.kind,p_service:payload.service,p_contact_name:payload.contact_name,p_company_name:payload.company_name||null,
    p_phone:payload.phone,p_title:payload.title,p_description:payload.description,p_origin:payload.origin||null,
    p_destination:payload.destination||null,p_cargo:payload.cargo||null,p_quantity:payload.quantity||null,
    p_requested_at:payload.requested_at||null,p_frequency:payload.frequency||null,p_urgency:payload.urgency||'standard'
  })
  if(error) throw error
  return data
}

async function publicTrack(reference,phone){
  if(!supabase){
    const row=demoGet('cases').find(c=>c.reference.toUpperCase()===reference.trim().toUpperCase() && c.phone.trim()===phone.trim())
    if(!row) return null
    const messages=demoGet('messages').filter(m=>m.case_id===row.id && m.visibility==='public').sort((a,b)=>new Date(a.created_at)-new Date(b.created_at))
    return {case:row,messages}
  }
  const [{data:caseRows,error:e1},{data:messages,error:e2}] = await Promise.all([
    supabase.rpc('track_case',{p_reference:reference,p_phone:phone}),
    supabase.rpc('case_public_messages',{p_reference:reference,p_phone:phone})
  ])
  if(e1) throw e1; if(e2) throw e2
  if(!caseRows?.length) return null
  return {case:caseRows[0],messages:messages||[]}
}

async function publicReply(reference,phone,body){
  if(!supabase){
    const cases=demoGet('cases'); const row=cases.find(c=>c.reference.toUpperCase()===reference.trim().toUpperCase() && c.phone.trim()===phone.trim())
    if(!row) throw new Error('Dossier introuvable')
    const now=new Date().toISOString()
    demoSet('messages',[...demoGet('messages'),{id:uuid(),case_id:row.id,author_type:'client',author_name:row.contact_name,visibility:'public',body,created_at:now}])
    demoSet('cases',cases.map(c=>c.id===row.id?{...c,updated_at:now}:c))
    return true
  }
  const {error}=await supabase.rpc('reply_case',{p_reference:reference,p_phone:phone,p_body:body})
  if(error) throw error
  return true
}

function useHashRoute(){
  const [route,setRoute]=React.useState(location.hash || '#home')
  React.useEffect(()=>{const f=()=>setRoute(location.hash||'#home');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[])
  return route
}

function useFivemBridge(){
  const [embedded,setEmbedded]=React.useState(new URLSearchParams(location.search).get('fivem')==='1')
  const [visible,setVisible]=React.useState(!embedded)
  React.useEffect(()=>{const fn=e=>{if(e.data?.action==='open'){setVisible(true);setEmbedded(true)}if(e.data?.action==='close')setVisible(false)};addEventListener('message',fn);return()=>removeEventListener('message',fn)},[])
  React.useEffect(()=>{const fn=e=>{if(e.key==='Escape'&&embedded){setVisible(false);const r=window.GetParentResourceName?.();if(r)fetch(`https://${r}/close`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).catch(()=>{})}};addEventListener('keydown',fn);return()=>removeEventListener('keydown',fn)},[embedded])
  return {embedded,visible}
}

function App(){
  const route=useHashRoute()
  const {embedded,visible}=useFivemBridge()
  const [modal,setModal]=React.useState(null)
  const [toast,setToast]=React.useState(null)
  const [partners,setPartners]=React.useState([])
  const [fleet,setFleet]=React.useState(FLEET_SEEDS)
  const [session,setSession]=React.useState(null)
  const [profile,setProfile]=React.useState(null)

  const notify=(text,type='ok')=>{setToast({text,type});setTimeout(()=>setToast(null),3500)}
  const loadPublic=React.useCallback(async()=>{
    if(!supabase){setPartners(demoGet('partners'));setFleet(demoGet('fleet',FLEET_SEEDS));return}
    const [{data:p},{data:f}] = await Promise.all([
      supabase.from('partners').select('*').eq('active',true).order('sort_order'),
      supabase.from('fleet_vehicles').select('*').eq('active',true).order('sort_order')
    ])
    setPartners(p||[]); if(f?.length)setFleet(f)
  },[])

  React.useEffect(()=>{loadPublic()},[loadPublic])
  React.useEffect(()=>{
    if(!supabase)return
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s))
    return()=>subscription.unsubscribe()
  },[])
  React.useEffect(()=>{
    if(!supabase||!session){setProfile(null);return}
    supabase.from('staff_profiles').select('*').eq('id',session.user.id).maybeSingle().then(({data})=>setProfile(data||null))
  },[session])

  if(embedded&&!visible)return <div className="nui-hidden"/>
  if(route.startsWith('#staff')) return <StaffApp session={session} profile={profile} notify={notify} loadPublic={loadPublic} demo={DEMO}/>

  return <>
    <PublicSite partners={partners} fleet={fleet} setModal={setModal} embedded={embedded}/>
    {modal && <ModalShell close={()=>setModal(null)}><ModalContent modal={modal} close={()=>setModal(null)} notify={notify}/></ModalShell>}
    {toast&&<Toast {...toast}/>} 
  </>
}

function PublicSite({partners,fleet,setModal,embedded}){
  const [menu,setMenu]=React.useState(false)
  const openCase=(kind,service=null)=>setModal({type:'case',kind,service})
  return <div className={cls('site',embedded&&'embedded')}>
    <header className="topbar">
      <a className="brand" href="#home" onClick={()=>setMenu(false)}><img src="/assets/nairi-logo.png"/><div><strong>NAIRI</strong><span>CORPORATION</span></div></a>
      <nav className={menu?'open':''}>
        <a href="#corporation" onClick={()=>setMenu(false)}>Corporation</a>
        <a href="#logistics" onClick={()=>setMenu(false)}>Logistics</a>
        <a href="#partners" onClick={()=>setMenu(false)}>Partenaires</a>
        <a href="#careers" onClick={()=>setMenu(false)}>Recrutement</a>
        <button className="nav-track" onClick={()=>{setModal({type:'track'});setMenu(false)}}><Search size={14}/> Suivre un dossier</button>
        <a className="staff-link" href="#staff"><LockKeyhole size={13}/> Staff</a>
      </nav>
      <button className="menu-btn" onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-wordmark" aria-hidden="true">NAIRI</div>
        <div className="hero-main">
          <div className="microline"><span>LOS SANTOS</span><i/> CORPORATE SERVICES <i/> ROAD LOGISTICS</div>
          <h1>Faire avancer<br/><em>vos affaires.</em></h1>
          <p className="hero-lead">Un point d’entrée unique pour trouver le bon partenaire, structurer une demande et faire circuler ce qui compte.</p>
          <div className="hero-actions">
            <button className="btn btn-light" onClick={()=>setModal({type:'case'})}>Ouvrir un dossier <ArrowRight size={17}/></button>
            <button className="btn btn-ghost" onClick={()=>setModal({type:'track'})}>Suivre ma demande</button>
          </div>
        </div>
        <div className="hero-side">
          <div className="hero-mark"><img src="/assets/nairi-logo.png"/></div>
          <div className="hero-side-copy"><small>NAIRI CORPORATION</small><p>Maison de négoce, mise en relation & coordination.</p><a href="#corporation">Découvrir <ArrowUpRight size={15}/></a></div>
          <div className="hero-side-copy"><small>NAIRI LOGISTICS</small><p>Ravitaillement, fret routier & opérations B2B.</p><a href="#logistics">Découvrir <ArrowUpRight size={15}/></a></div>
        </div>
      </section>

      <section className="entry-strip">
        <div><span>01</span><b>Exprimez le besoin</b><p>Un formulaire court, adapté à votre demande.</p></div>
        <ChevronRight/>
        <div><span>02</span><b>Nairi qualifie le dossier</b><p>Un interlocuteur reprend votre demande.</p></div>
        <ChevronRight/>
        <div><span>03</span><b>Suivez l’exécution</b><p>Statut, réponses et historique au même endroit.</p></div>
      </section>

      <section id="corporation" className="corp-section">
        <div className="section-number">01 / CORPORATION</div>
        <div className="corp-intro">
          <div><span className="eyebrow">NAIRI CORPORATION</span><h2>Le bon interlocuteur.<br/><em>Au bon moment.</em></h2></div>
          <div className="corp-statement"><p>Nairi agit comme un relais opérationnel entre votre besoin et le marché de Los Santos. Vous nous confiez le problème ; nous cherchons, qualifions, mettons en relation et suivons l’affaire jusqu’à sa résolution.</p><button className="text-link" onClick={()=>openCase('corporate')}>Confier une demande <ArrowRight size={16}/></button></div>
        </div>
        <div className="corp-services">
          {CORP_SERVICES.map(s=><button key={s.id} className="corp-service" onClick={()=>openCase('corporate',s.id)}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div><ArrowUpRight/></button>)}
        </div>
        <div className="corp-promise"><Handshake/><div><small>NOTRE POSITION</small><h3>Ni annuaire, ni simple intermédiaire.</h3><p>Chaque dossier est suivi par Nairi : compréhension du besoin, recherche des parties, prise de contact, coordination et retour au client. Notre valeur est dans l’exécution et le réseau.</p></div></div>
      </section>

      <section id="logistics" className="logistics-section">
        <div className="section-number light">02 / LOGISTICS</div>
        <div className="logistics-head">
          <div><span className="eyebrow light">NAIRI LOGISTICS</span><h2>Le fret devient<br/><em>un vrai métier RP.</em></h2></div>
          <p>Le script camionneur fait circuler les cartons. Nairi Logistics construit tout ce qu’il y a autour : contrats de desserte, urgences, planification, relation entreprise, transports hors-script et traçabilité des missions.</p>
        </div>

        <div className="log-service-grid">
          {LOG_SERVICES.map((s,i)=>{const Icon=s.icon;return <button className="log-service-card" key={s.id} onClick={()=>openCase('logistics',s.id)}><div className="log-card-top"><span>0{i+1}</span><Icon/></div><small>{s.tag}</small><h3>{s.title}</h3><p>{s.text}</p><div>Créer une demande <ArrowRight size={15}/></div></button>})}
        </div>

        <div className="contract-feature">
          <div className="contract-copy"><small>CONTRAT DE DESSERTE</small><h3>Votre entreprise peut faire de Nairi son transporteur référent.</h3><p>Au lieu d’appeler un camionneur au hasard à chaque rupture de stock, ouvrez un dossier de desserte. Nous définissons ensemble la fréquence, les horaires privilégiés, les marchandises et les points à servir. Les missions peuvent ensuite être planifiées et suivies dans le back-office Nairi.</p><button className="btn btn-light" onClick={()=>openCase('logistics','dedicated_route')}>Demander une desserte <ArrowRight size={16}/></button></div>
          <div className="contract-flow">
            {['Entreprise cliente','Planning Nairi','Chauffeur affecté','Chargement','Livraison & clôture'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}
          </div>
        </div>

        <div className="fleet-block">
          <div className="fleet-title"><div><small>OUTILS DE TERRAIN</small><h3>Flotte Logistics</h3></div><p>La flotte est un moyen, pas le produit. Le client réserve une opération ; Nairi choisit le véhicule adapté.</p></div>
          <div className="fleet-grid">
            {fleet.map((v,i)=><article className="fleet-card" key={v.id}><div className="fleet-image"><img src={v.image_url} alt={v.name}/><span>FLEET / {String(i+1).padStart(2,'0')}</span></div><div className="fleet-copy"><div><small>{v.brand} · {v.category}</small><h4>{v.name}</h4></div><span className={cls('fleet-status',v.status)}><i/>{statusLabel(v.status)}</span><p>{v.description}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="partners" className="partners-section">
        <div className="section-number">03 / RÉSEAU</div>
        <div className="partners-head"><div><span className="eyebrow">PARTENAIRES</span><h2>Un réseau qui<br/><em>travaille vraiment.</em></h2></div><p>Les partenaires Nairi sont visibles ici parce qu’ils font partie du réseau actif : fournisseurs, commerces, prestataires et entreprises avec lesquelles nous pouvons construire une solution.</p></div>
        {partners.length ? <div className="partner-grid">{partners.map(p=><article className="partner-card" key={p.id}>
          <div className={cls('partner-visual',!p.image_url&&'empty')}>{p.image_url?<img src={p.image_url} alt={p.name}/>:<Building2/>}<span>{p.eyebrow||'PARTENAIRE NAIRI'}</span></div>
          <div className="partner-copy"><h3>{p.name}</h3><p>{p.description}</p>{p.link_url&&<a href={p.link_url} target="_blank" rel="noreferrer">Voir le partenaire <ArrowUpRight size={14}/></a>}</div>
        </article>)}</div> : <div className="empty-public"><Handshake/><h3>Le réseau est en cours de constitution.</h3><p>Les partenaires publiés depuis l’espace staff apparaîtront ici.</p></div>}
      </section>

      <section className="case-center">
        <div className="case-center-inner">
          <div><span className="eyebrow light">DOSSIERS NAIRI</span><h2>Le site garde la trace.<br/><em>Discord garde la discussion.</em></h2><p>Pour éviter le doublon : utilisez le site pour toute demande qui doit être suivie, affectée ou clôturée. Discord reste parfait pour les échanges rapides, la communauté et le vocal.</p></div>
          <div className="case-actions">
            <button className="case-action" onClick={()=>setModal({type:'case'})}><FileText/><div><b>Ouvrir un dossier</b><span>Corporate ou Logistics</span></div><ArrowRight/></button>
            <button className="case-action" onClick={()=>setModal({type:'track'})}><Search/><div><b>Suivre un dossier</b><span>Référence + téléphone</span></div><ArrowRight/></button>
            <a className="case-action" href={DISCORD_URL} target="_blank" rel="noreferrer"><MessageCircle/><div><b>Discussion rapide</b><span>Ouvrir Discord</span></div><ExternalLink/></a>
          </div>
        </div>
      </section>

      <section id="careers" className="careers-section">
        <div className="section-number">04 / RECRUTEMENT</div>
        <div className="careers-head"><div><span className="eyebrow">REJOINDRE NAIRI</span><h2>Construire l’activité.<br/><em>Pas seulement la conduire.</em></h2></div><p>La croissance de Nairi repose autant sur les conducteurs terrain que sur ceux qui organisent les flux et développent les relations entreprises.</p></div>
        <div className="jobs-grid">{JOBS.map(j=>{const Icon=j.icon;return <button key={j.id} className="job-card" onClick={()=>setModal({type:'apply',job:j.id})}><Icon/><small>POSTE OUVERT</small><h3>{j.title}</h3><p>{j.text}</p><span>Postuler <ArrowRight size={14}/></span></button>})}</div>
      </section>

      <section className="final-cta">
        <img src="/assets/nairi-logo.png"/>
        <div><small>NAIRI CORPORATION · LOS SANTOS</small><h2>Une demande.<br/>Un dossier. <em>Un suivi.</em></h2></div>
        <button className="btn btn-dark" onClick={()=>setModal({type:'case'})}>Nous contacter <ArrowRight size={17}/></button>
      </section>
    </main>
    <footer><div className="brand compact"><img src="/assets/nairi-logo.png"/><div><strong>NAIRI</strong><span>CORPORATION</span></div></div><p>Maison de Négoce, Gestion Administrative & Transport</p><div>Corporate · Logistics · Los Santos</div></footer>
  </div>
}

function ModalShell({children,close}){
  React.useEffect(()=>{const f=e=>e.key==='Escape'&&close();addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[close])
  return <div className="modal-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}>{children}</div>
}

function ModalContent({modal,close,notify}){
  if(modal.type==='track')return <TrackPortal close={close} notify={notify}/>
  if(modal.type==='apply')return <ApplicationForm job={modal.job} close={close} notify={notify}/>
  return <CaseForm initialKind={modal.kind} initialService={modal.service} close={close} notify={notify}/>
}

function ModalHeader({kicker,title,close}){return <div className="modal-head"><div><span>{kicker}</span><h2>{title}</h2></div><button onClick={close}><X/></button></div>}
function Field({label,hint,children,full=false}){return <label className={cls('field',full&&'full')}><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
const Input=props=><input {...props}/>
const Textarea=props=><textarea {...props}/>

function CaseForm({initialKind,initialService,close,notify}){
  const [kind,setKind]=React.useState(initialKind||'')
  const [form,setForm]=React.useState({service:initialService||'',contact_name:'',company_name:'',phone:'',title:'',description:'',origin:'',destination:'',cargo:'',quantity:'',requested_at:'',frequency:'',urgency:'standard'})
  const [busy,setBusy]=React.useState(false)
  const [reference,setReference]=React.useState(null)
  const services=kind==='logistics'?LOG_SERVICES:CORP_SERVICES
  React.useEffect(()=>{if(initialService)setForm(v=>({...v,service:initialService}))},[initialService])

  async function submit(e){
    e.preventDefault(); if(!kind||!form.service)return notify('Choisis le type de demande.','error')
    if(!form.contact_name||!form.phone||!form.title||!form.description)return notify('Remplis les champs obligatoires.','error')
    setBusy(true)
    try{const ref=await publicOpenCase({...form,kind});setReference(ref)}catch(err){notify(err.message||'Impossible d’ouvrir le dossier.','error')}finally{setBusy(false)}
  }
  if(reference)return <div className="modal-panel success-panel"><ModalHeader kicker="DOSSIER CRÉÉ" title="Demande enregistrée" close={close}/><div className="success-state"><div className="success-check"><Check/></div><h3>Votre dossier est ouvert.</h3><p>Gardez cette référence. Avec votre numéro de téléphone, elle permet de suivre le statut, lire les réponses Nairi et répondre directement depuis le site.</p><CopyRef value={reference}/><div className="success-actions"><button className="btn btn-dark" onClick={close}>Terminer</button></div></div></div>

  return <div className="modal-panel case-modal">
    <ModalHeader kicker="CONTACT NAIRI" title="Ouvrir un dossier" close={close}/>
    <form className="modal-body" onSubmit={submit}>
      <div className="form-intro"><span>01</span><div><b>Choisissez le pôle</b><p>Une seule porte d’entrée, deux métiers.</p></div></div>
      <div className="kind-choice">
        <button type="button" className={kind==='corporate'?'active':''} onClick={()=>{setKind('corporate');setForm(v=>({...v,service:''}))}}><BriefcaseBusiness/><div><b>Nairi Corporation</b><span>Mise en relation, sourcing, négociation, gestion.</span></div></button>
        <button type="button" className={kind==='logistics'?'active':''} onClick={()=>{setKind('logistics');setForm(v=>({...v,service:''}))}}><Truck/><div><b>Nairi Logistics</b><span>Ravitaillement, fret, tournées et urgences.</span></div></button>
      </div>
      {kind&&<>
        <div className="form-intro"><span>02</span><div><b>Précisez la demande</b><p>On affiche uniquement ce qui est utile à votre dossier.</p></div></div>
        <Field label="Type de demande" full><select required value={form.service} onChange={e=>setForm({...form,service:e.target.value})}><option value="">Sélectionner...</option>{services.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></Field>
        <div className="form-grid"><Field label="Nom & prénom"><Input required value={form.contact_name} onChange={e=>setForm({...form,contact_name:e.target.value})}/></Field><Field label="Entreprise"><Input value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} placeholder="Facultatif"/></Field></div>
        <div className="form-grid"><Field label="Téléphone"><Input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field><Field label="Objet du dossier"><Input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ex. recherche fournisseur / rupture de stock"/></Field></div>
        {kind==='logistics'&&<>
          <div className="form-grid"><Field label="Point de départ"><Input value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})}/></Field><Field label="Destination"><Input value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}/></Field></div>
          <div className="form-grid"><Field label="Marchandise / besoin"><Input value={form.cargo} onChange={e=>setForm({...form,cargo:e.target.value})} placeholder="Cartons, alcool, matériel..."/></Field><Field label="Volume / quantité"><Input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="Estimation libre"/></Field></div>
          <div className="form-grid"><Field label="Date / heure souhaitée"><Input type="datetime-local" value={form.requested_at} onChange={e=>setForm({...form,requested_at:e.target.value})}/></Field><Field label="Fréquence"><select value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}><option value="">Ponctuel</option><option value="daily">Quotidien</option><option value="several_week">Plusieurs fois / semaine</option><option value="weekly">Hebdomadaire</option><option value="on_demand">À la demande</option></select></Field></div>
          <Field label="Priorité" full><select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}><option value="standard">Standard</option><option value="urgent">Urgent / stock critique</option><option value="planned">Planifiable</option></select></Field>
        </>}
        <Field label="Décrivez votre demande" full hint="Le staff pourra vous poser des questions complémentaires dans le suivi du dossier."><Textarea required rows="5" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
        <button className="btn btn-dark wide" disabled={busy}>{busy?'Ouverture...':'Ouvrir le dossier'} <ArrowRight size={16}/></button>
      </>}
    </form>
  </div>
}

function CopyRef({value}){const [done,setDone]=React.useState(false);return <button className="copy-ref" onClick={()=>{navigator.clipboard?.writeText(value);setDone(true)}}><span>{value}</span>{done?<Check/>:<Copy/>}</button>}

function TrackPortal({close,notify}){
  const [reference,setReference]=React.useState('')
  const [phone,setPhone]=React.useState('')
  const [data,setData]=React.useState(null)
  const [busy,setBusy]=React.useState(false)
  const [reply,setReply]=React.useState('')

  async function search(e){e?.preventDefault();setBusy(true);try{const r=await publicTrack(reference,phone);setData(r);if(!r)notify('Aucun dossier trouvé avec ces informations.','error')}catch(err){notify(err.message||'Erreur de suivi.','error')}finally{setBusy(false)}}
  async function send(){if(!reply.trim())return;setBusy(true);try{await publicReply(reference,phone,reply.trim());setReply('');setData(await publicTrack(reference,phone));notify('Réponse envoyée.')}catch(err){notify(err.message||'Envoi impossible.','error')}finally{setBusy(false)}}

  return <div className="modal-panel track-modal"><ModalHeader kicker="PORTAIL CLIENT" title="Suivre un dossier" close={close}/><div className="modal-body">
    {!data?<form onSubmit={search} className="track-search"><p>Pas de compte à créer. Saisissez simplement la référence remise à l’ouverture et le téléphone utilisé dans la demande.</p><Field label="Référence du dossier"><Input required value={reference} onChange={e=>setReference(e.target.value.toUpperCase())} placeholder="NL-260825-AB12"/></Field><Field label="Téléphone"><Input required value={phone} onChange={e=>setPhone(e.target.value)}/></Field><button className="btn btn-dark wide" disabled={busy}><Search size={16}/>{busy?'Recherche...':'Afficher le dossier'}</button></form>:
      <div className="client-case">
        <div className="client-case-head"><div><small>{data.case.kind==='logistics'?'NAIRI LOGISTICS':'NAIRI CORPORATION'}</small><h3>{data.case.title}</h3><span>{data.case.reference}</span></div><CaseStatus value={data.case.status}/></div>
        <div className="client-summary"><div><span>Service</span><b>{serviceLabel(data.case.service)}</b></div><div><span>Ouvert le</span><b>{dt(data.case.created_at)}</b></div>{data.case.requested_at&&<div><span>Échéance souhaitée</span><b>{dt(data.case.requested_at)}</b></div>}</div>
        <div className="conversation"><div className="conversation-title"><MessageSquareText/><div><b>Échanges du dossier</b><span>Les notes internes du staff ne sont jamais visibles ici.</span></div></div>{data.messages?.length?data.messages.map(m=><MessageBubble key={m.id} m={m}/>):<div className="empty-line">Aucun message pour le moment.</div>}</div>
        {!['completed','declined','cancelled'].includes(data.case.status)&&<div className="client-reply"><Textarea rows="3" value={reply} onChange={e=>setReply(e.target.value)} placeholder="Répondre à Nairi..."/><button className="btn btn-dark" disabled={busy||!reply.trim()} onClick={send}><Send size={15}/> Envoyer</button></div>}
        <button className="text-link back-search" onClick={()=>setData(null)}>Rechercher un autre dossier</button>
      </div>}
  </div></div>
}

function MessageBubble({m}){const staff=m.author_type==='staff'||m.author_type==='system';return <div className={cls('message-bubble',staff?'staff':'client')}><div><b>{m.author_name|| (staff?'Nairi':'Client')}</b><span>{dt(m.created_at)}</span></div><p>{m.body}</p></div>}

function ApplicationForm({job,close,notify}){
  const [form,setForm]=React.useState({full_name:'',phone:'',position:job||'heavy_driver',experience:'',availability:'',motivation:''})
  const [busy,setBusy]=React.useState(false),[ref,setRef]=React.useState(null)
  async function submit(e){e.preventDefault();setBusy(true);try{
    const reference=`JOB-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    if(!supabase){const row={id:uuid(),client_ref:reference,status:'new',created_at:new Date().toISOString(),...form};demoSet('applications',[row,...demoGet('applications')])}
    else {const {error}=await supabase.from('applications').insert({client_ref:reference,...form,status:'new'});if(error)throw error}
    setRef(reference)
  }catch(err){notify(err.message||'Candidature impossible.','error')}finally{setBusy(false)}}
  if(ref)return <div className="modal-panel success-panel"><ModalHeader kicker="CANDIDATURE" title="Candidature transmise" close={close}/><div className="success-state"><div className="success-check"><Check/></div><h3>Bienvenue dans le processus Nairi.</h3><p>Votre candidature est enregistrée. L’équipe reviendra vers vous par téléphone.</p><CopyRef value={ref}/><button className="btn btn-dark" onClick={close}>Terminer</button></div></div>
  return <div className="modal-panel"><ModalHeader kicker="RECRUTEMENT" title="Rejoindre Nairi" close={close}/><form className="modal-body" onSubmit={submit}><div className="form-grid"><Field label="Nom & prénom"><Input required value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></Field><Field label="Téléphone"><Input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field></div><Field label="Poste" full><select value={form.position} onChange={e=>setForm({...form,position:e.target.value})}>{JOBS.map(j=><option value={j.id} key={j.id}>{j.title}</option>)}</select></Field><Field label="Expérience" full><Textarea rows="3" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})}/></Field><Field label="Disponibilités" full><Input value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})}/></Field><Field label="Motivation" full><Textarea required rows="4" value={form.motivation} onChange={e=>setForm({...form,motivation:e.target.value})}/></Field><button className="btn btn-dark wide" disabled={busy}>Envoyer ma candidature <ArrowRight size={16}/></button></form></div>
}

function StaffApp({session,profile,notify,loadPublic,demo}){
  const [demoAccess,setDemoAccess]=React.useState(false)
  if(!session&&!demoAccess)return <StaffLogin notify={notify} demo={demo} onDemo={()=>setDemoAccess(true)}/>
  if(session&&!profile)return <StaffGate session={session}/>
  return <StaffDashboard profile={profile||{display_name:'Mode Démo',role:'admin',branch:'Corporate & Logistics'}} notify={notify} loadPublic={loadPublic} demo={demo||demoAccess} onDemoExit={()=>setDemoAccess(false)}/>
}

function StaffLogin({notify,demo,onDemo}){
  const [email,setEmail]=React.useState(''),[password,setPassword]=React.useState(''),[busy,setBusy]=React.useState(false)
  async function login(e){e.preventDefault();if(!supabase)return onDemo();setBusy(true);const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error)notify(error.message,'error')}
  return <div className="staff-login"><a className="login-brand" href="#home"><img src="/assets/nairi-logo.png"/><span>Retour au site</span></a><form className="login-card" onSubmit={login}><div className="security-mark"><LockKeyhole/></div><span>NAIRI / OPERATIONS</span><h1>Espace staff</h1><p>Dossiers, réponses clients, planning Logistics, partenaires et finances.</p><Field label="E-mail"><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Mot de passe"><Input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></Field><button className="btn btn-light wide" disabled={busy}><LogIn size={16}/>{busy?'Connexion...':'Connexion'}</button>{demo&&<button type="button" className="demo-link" onClick={onDemo}>Ouvrir le back-office en mode démo</button>}</form></div>
}
function StaffGate({session}){return <div className="staff-login"><div className="login-card"><AlertTriangle/><h1>Compte non autorisé</h1><p>{session.user.email} est connecté mais n’a pas de profil dans <code>staff_profiles</code>.</p><button className="btn btn-light" onClick={()=>supabase.auth.signOut()}>Déconnexion</button></div></div>}

function StaffDashboard({profile,notify,loadPublic,demo,onDemoExit}){
  const [tab,setTab]=React.useState('overview')
  const [mobileNav,setMobileNav]=React.useState(false)
  const [data,setData]=React.useState({cases:[],messages:[],partners:[],fleet:[],finance:[],applications:[],staff:[]})
  const [busy,setBusy]=React.useState(false)

  const load=React.useCallback(async()=>{
    setBusy(true)
    if(demo){setData({cases:demoGet('cases'),messages:demoGet('messages'),partners:demoGet('partners'),fleet:demoGet('fleet',FLEET_SEEDS),finance:demoGet('finance'),applications:demoGet('applications'),staff:[{id:'demo-staff',display_name:'T. Markoussian',role:'admin'}]});setBusy(false);return}
    const [c,m,p,f,fin,a,s]=await Promise.all([
      supabase.from('cases').select('*').order('updated_at',{ascending:false}),
      supabase.from('case_messages').select('*').order('created_at',{ascending:true}),
      supabase.from('partners').select('*').order('sort_order'),
      supabase.from('fleet_vehicles').select('*').order('sort_order'),
      supabase.from('financial_transactions').select('*').order('transaction_date',{ascending:false}),
      supabase.from('applications').select('*').order('created_at',{ascending:false}),
      supabase.from('staff_profiles').select('*').order('display_name')
    ])
    const err=[c,m,p,f,fin,a,s].find(x=>x.error)?.error;if(err)notify(err.message,'error')
    setData({cases:c.data||[],messages:m.data||[],partners:p.data||[],fleet:f.data||[],finance:fin.data||[],applications:a.data||[],staff:s.data||[]});setBusy(false)
  },[demo,notify])
  React.useEffect(()=>{load()},[load])

  const nav=[
    ['overview',LayoutDashboard,'Vue d’ensemble'],['cases',Inbox,'Dossiers'],['logistics',Truck,'Logistics'],
    ['partners',Handshake,'Partenaires'],['fleet',HardHat,'Flotte'],['finance',CircleDollarSign,'Finance'],['careers',UsersRound,'Recrutement']
  ]
  const logout=async()=>{if(demo)return onDemoExit();await supabase.auth.signOut();location.hash='#home'}
  return <div className="staff-shell">
    <aside className={mobileNav?'open':''}><div className="staff-brand"><img src="/assets/nairi-logo.png"/><div><b>NAIRI</b><span>OPERATIONS</span></div></div><nav>{nav.map(([id,Icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>{setTab(id);setMobileNav(false)}}><Icon size={18}/>{label}</button>)}</nav><div className="staff-side-bottom"><a href="#home"><ExternalLink size={15}/> Site public</a><button onClick={logout}><LogOut size={15}/> Déconnexion</button></div></aside>
    <div className="staff-main"><header><button className="staff-menu" onClick={()=>setMobileNav(v=>!v)}><Menu/></button><div><small>NAIRI / OPERATIONS</small><h1>{nav.find(x=>x[0]===tab)?.[2]}</h1></div><div className="staff-user"><span>{profile.display_name}</span><b>{profile.role}</b></div><button className="icon-btn" onClick={load} title="Actualiser"><RefreshCw className={busy?'spin':''}/></button></header>
      <div className="staff-content">
        {tab==='overview'&&<Overview data={data} setTab={setTab}/>} 
        {tab==='cases'&&<CasesPanel data={data} reload={load} notify={notify} demo={demo}/>} 
        {tab==='logistics'&&<CasesPanel data={data} reload={load} notify={notify} demo={demo} forcedKind="logistics"/>}
        {tab==='partners'&&<PartnersPanel items={data.partners} reload={load} loadPublic={loadPublic} notify={notify} demo={demo}/>} 
        {tab==='fleet'&&<FleetPanel items={data.fleet} reload={load} loadPublic={loadPublic} notify={notify} demo={demo}/>} 
        {tab==='finance'&&<FinancePanel items={data.finance} cases={data.cases} reload={load} notify={notify} demo={demo}/>} 
        {tab==='careers'&&<CareersPanel items={data.applications} reload={load} notify={notify} demo={demo}/>} 
      </div>
    </div>
  </div>
}

function Overview({data,setTab}){
  const open=data.cases.filter(c=>!['completed','declined','cancelled'].includes(c.status))
  const logistics=open.filter(c=>c.kind==='logistics')
  const waiting=open.filter(c=>c.status==='waiting_client')
  const income=data.finance.filter(x=>x.direction==='income').reduce((a,b)=>a+Number(b.amount||0),0)
  const expense=data.finance.filter(x=>x.direction==='expense').reduce((a,b)=>a+Number(b.amount||0),0)
  return <>
    <div className="metric-grid"><Metric icon={Inbox} label="Dossiers ouverts" value={open.length}/><Metric icon={Truck} label="Missions Logistics" value={logistics.length}/><Metric icon={Clock3} label="En attente client" value={waiting.length}/><Metric icon={Banknote} label="Solde enregistré" value={money(income-expense)}/></div>
    <div className="staff-grid two"><section className="staff-card"><CardTitle kicker="ACTIVITÉ" title="Derniers dossiers" action={<button className="text-link" onClick={()=>setTab('cases')}>Tout voir</button>}/>{data.cases.slice(0,6).map(c=><MiniCase key={c.id} c={c}/>) }{!data.cases.length&&<Empty icon={Inbox} text="Aucun dossier pour le moment."/>}</section><section className="staff-card"><CardTitle kicker="LOGISTICS" title="À piloter" action={<button className="text-link" onClick={()=>setTab('logistics')}>Ouvrir</button>}/>{data.cases.filter(c=>c.kind==='logistics'&&!['completed','cancelled','declined'].includes(c.status)).slice(0,6).map(c=><MiniCase key={c.id} c={c}/>) }{!logistics.length&&<Empty icon={Truck} text="Aucune mission active."/>}</section></div>
  </>
}
function Metric({icon:Icon,label,value}){return <div className="metric"><div><Icon/></div><span>{label}</span><b>{value}</b></div>}
function CardTitle({kicker,title,action}){return <div className="card-title"><div><span>{kicker}</span><h2>{title}</h2></div>{action}</div>}
function MiniCase({c}){return <div className="mini-case"><div><small>{c.reference} · {c.kind==='logistics'?'LOGISTICS':'CORPORATE'}</small><b>{c.title}</b><span>{c.company_name||c.contact_name}</span></div><CaseStatus value={c.status}/></div>}
function CaseStatus({value}){return <span className={cls('case-status',value)}><i/>{statusLabel(value)}</span>}
function Empty({icon:Icon,text}){return <div className="empty-admin"><Icon/><p>{text}</p></div>}

function CasesPanel({data,reload,notify,demo,forcedKind}){
  const [filter,setFilter]=React.useState(forcedKind||'all'),[q,setQ]=React.useState(''),[selected,setSelected]=React.useState(null)
  React.useEffect(()=>{if(forcedKind)setFilter(forcedKind)},[forcedKind])
  const rows=data.cases.filter(c=>(filter==='all'||c.kind===filter)&&(!q||`${c.reference} ${c.title} ${c.contact_name} ${c.company_name||''} ${c.phone}`.toLowerCase().includes(q.toLowerCase())))
  return <section className="staff-card no-pad"><div className="panel-toolbar"><div><span>{forcedKind?'NAIRI LOGISTICS':'GESTION CENTRALISÉE'}</span><h2>{forcedKind?'Dossiers Logistics':'Tous les dossiers'}</h2></div><div className="panel-tools"><label className="searchbox"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Réf, client, entreprise..."/></label>{!forcedKind&&<div className="segmented"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Tous</button><button className={filter==='corporate'?'active':''} onClick={()=>setFilter('corporate')}>Corp</button><button className={filter==='logistics'?'active':''} onClick={()=>setFilter('logistics')}>Logistics</button></div>}</div></div>
    <div className="case-table-head"><span>Dossier</span><span>Client</span><span>Statut</span><span>Activité</span><span/></div>
    <div className="case-list">{rows.map(c=><button className="case-row" key={c.id} onClick={()=>setSelected(c)}><div><small>{c.reference}</small><b>{c.title}</b><span>{serviceLabel(c.service)}</span></div><div><b>{c.company_name||c.contact_name}</b><span>{c.phone}</span></div><CaseStatus value={c.status}/><span>{dt(c.updated_at)}</span><ChevronRight/></button>)}{!rows.length&&<Empty icon={Inbox} text="Aucun dossier ne correspond au filtre."/>}</div>
    {selected&&<CaseDrawer row={data.cases.find(c=>c.id===selected.id)||selected} messages={data.messages.filter(m=>m.case_id===selected.id)} staff={data.staff} close={()=>setSelected(null)} reload={reload} notify={notify} demo={demo}/>} 
  </section>
}

function CaseDrawer({row,messages,staff,close,reload,notify,demo}){
  const [reply,setReply]=React.useState(''),[visibility,setVisibility]=React.useState('public'),[busy,setBusy]=React.useState(false)
  async function update(patch){setBusy(true);try{
    if(demo){const rows=demoGet('cases').map(c=>c.id===row.id?{...c,...patch,updated_at:new Date().toISOString()}:c);demoSet('cases',rows)}
    else {const {error}=await supabase.from('cases').update(patch).eq('id',row.id);if(error)throw error}
    await reload();notify('Dossier mis à jour.')
  }catch(e){notify(e.message,'error')}finally{setBusy(false)}}
  async function send(){if(!reply.trim())return;setBusy(true);try{
    const name=visibility==='internal'?'Note interne':'Nairi'
    if(demo){const m={id:uuid(),case_id:row.id,author_type:'staff',author_name:name,visibility,body:reply.trim(),created_at:new Date().toISOString()};demoSet('messages',[...demoGet('messages'),m]);demoSet('cases',demoGet('cases').map(c=>c.id===row.id?{...c,updated_at:new Date().toISOString()}:c))}
    else {const {error}=await supabase.from('case_messages').insert({case_id:row.id,author_type:'staff',author_name:name,visibility,body:reply.trim()});if(error)throw error}
    setReply('');await reload();notify(visibility==='public'?'Réponse client envoyée.':'Note interne ajoutée.')
  }catch(e){notify(e.message,'error')}finally{setBusy(false)}}
  return <div className="drawer-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><aside className="drawer"><ModalHeader kicker={`${row.kind==='logistics'?'LOGISTICS':'CORPORATE'} · ${row.reference}`} title={row.title} close={close}/><div className="drawer-body">
    <div className="drawer-block"><div className="drawer-section-title"><span>ÉTAT DU DOSSIER</span><CaseStatus value={row.status}/></div><div className="status-grid">{STATUS_FLOW.map(s=><button key={s} disabled={busy} className={row.status===s?'active':''} onClick={()=>update({status:s})}>{statusLabel(s)}</button>)}</div><Field label="Responsable du dossier"><select value={row.assigned_to||''} onChange={e=>update({assigned_to:e.target.value||null})}><option value="">Non affecté</option>{staff.map(s=><option value={s.id} key={s.id}>{s.display_name}</option>)}</select></Field></div>
    <div className="drawer-block"><div className="drawer-section-title"><span>CLIENT & DEMANDE</span></div><div className="detail-grid"><Detail label="Contact" value={row.contact_name}/><Detail label="Entreprise" value={row.company_name}/><Detail label="Téléphone" value={row.phone}/><Detail label="Service" value={serviceLabel(row.service)}/><Detail label="Ouvert" value={dt(row.created_at)}/><Detail label="Souhaité" value={dt(row.requested_at)}/>{row.kind==='logistics'&&<><Detail label="Départ" value={row.origin}/><Detail label="Destination" value={row.destination}/><Detail label="Marchandise" value={row.cargo}/><Detail label="Volume" value={row.quantity}/><Detail label="Fréquence" value={row.frequency}/><Detail label="Priorité" value={row.urgency}/></>}</div><div className="description-box"><span>DEMANDE</span><p>{row.description}</p></div></div>
    <div className="drawer-block"><div className="drawer-section-title"><span>FIL DU DOSSIER</span><b>{messages.length} message{messages.length>1?'s':''}</b></div><div className="staff-conversation">{messages.map(m=><div className={cls('staff-message',m.visibility==='internal'&&'internal',m.author_type==='client'&&'from-client')} key={m.id}><div><b>{m.author_name||m.author_type}</b><span>{m.visibility==='internal'?'NOTE INTERNE':dt(m.created_at)}</span></div><p>{m.body}</p></div>)}{!messages.length&&<Empty icon={MessageSquareText} text="Aucun échange sur ce dossier."/>}</div><div className="reply-box"><div className="reply-mode"><button className={visibility==='public'?'active':''} onClick={()=>setVisibility('public')}><MessageCircle/> Réponse client</button><button className={visibility==='internal'?'active':''} onClick={()=>setVisibility('internal')}><LockKeyhole/> Note interne</button></div><Textarea rows="4" value={reply} onChange={e=>setReply(e.target.value)} placeholder={visibility==='public'?'Écrire une réponse visible par le client...':'Ajouter une note réservée au staff...'}/><button className="btn btn-dark" onClick={send} disabled={busy||!reply.trim()}><Send size={15}/> Envoyer</button></div></div>
  </div></aside></div>
}
function Detail({label,value}){return <div className="detail"><span>{label}</span><b>{value||'—'}</b></div>}

function PartnersPanel({items,reload,loadPublic,notify,demo}){
  const [edit,setEdit]=React.useState(null)
  async function save(v){try{
    const payload={name:v.name,eyebrow:v.eyebrow||'PARTENAIRE NAIRI',description:v.description,image_url:v.image_url||null,link_url:v.link_url||null,active:v.active??true,sort_order:Number(v.sort_order||0)}
    if(demo){let rows=demoGet('partners');if(v.id)rows=rows.map(x=>x.id===v.id?{...x,...payload}:x);else rows=[...rows,{id:uuid(),...payload}];demoSet('partners',rows)}else{const q=v.id?supabase.from('partners').update(payload).eq('id',v.id):supabase.from('partners').insert(payload);const {error}=await q;if(error)throw error}
    setEdit(null);await reload();await loadPublic();notify('Partenaire enregistré.')
  }catch(e){notify(e.message,'error')}}
  async function remove(id){if(!confirm('Supprimer ce partenaire ?'))return;try{if(demo)demoSet('partners',demoGet('partners').filter(x=>x.id!==id));else{const {error}=await supabase.from('partners').delete().eq('id',id);if(error)throw error}await reload();await loadPublic();notify('Partenaire supprimé.')}catch(e){notify(e.message,'error')}}
  return <section className="staff-card no-pad"><div className="panel-toolbar"><div><span>RÉSEAU PUBLIC</span><h2>Partenaires</h2></div><button className="btn btn-dark" onClick={()=>setEdit({active:true,sort_order:items.length+1})}><Plus size={15}/> Ajouter</button></div><div className="admin-grid">{items.map(p=><article className="admin-item" key={p.id}><div className="admin-thumb">{p.image_url?<img src={p.image_url}/>:<Handshake/>}</div><div><small>{p.eyebrow}</small><h3>{p.name}</h3><p>{p.description}</p></div><div className="admin-actions"><button onClick={()=>setEdit(p)}><Pencil/></button><button onClick={()=>remove(p.id)}><Trash2/></button></div></article>)}{!items.length&&<Empty icon={Handshake} text="Ajoute le premier partenaire du réseau."/>}</div>{edit&&<EntityEditor title="Partenaire" item={edit} close={()=>setEdit(null)} save={save} fields="partner"/>}</section>
}

function FleetPanel({items,reload,loadPublic,notify,demo}){
  const [edit,setEdit]=React.useState(null)
  async function save(v){try{const payload={name:v.name,brand:v.brand,category:v.category,description:v.description,image_url:v.image_url||null,status:v.status||'available',active:v.active??true,sort_order:Number(v.sort_order||0)};if(demo){let rows=demoGet('fleet',FLEET_SEEDS);if(v.id)rows=rows.map(x=>x.id===v.id?{...x,...payload}:x);else rows=[...rows,{id:uuid(),...payload}];demoSet('fleet',rows)}else{const q=v.id?supabase.from('fleet_vehicles').update(payload).eq('id',v.id):supabase.from('fleet_vehicles').insert(payload);const {error}=await q;if(error)throw error}setEdit(null);await reload();await loadPublic();notify('Flotte mise à jour.')}catch(e){notify(e.message,'error')}}
  return <section className="staff-card no-pad"><div className="panel-toolbar"><div><span>NAIRI LOGISTICS</span><h2>Flotte terrain</h2></div><button className="btn btn-dark" onClick={()=>setEdit({active:true,status:'available',sort_order:items.length+1})}><Plus size={15}/> Ajouter</button></div><div className="admin-grid">{items.map(v=><article className="admin-item" key={v.id}><div className="admin-thumb">{v.image_url?<img src={v.image_url}/>:<Truck/>}</div><div><small>{v.brand} · {v.category}</small><h3>{v.name}</h3><p>{v.description}</p><CaseStatus value={v.status}/></div><div className="admin-actions"><button onClick={()=>setEdit(v)}><Pencil/></button></div></article>)}</div>{edit&&<EntityEditor title="Véhicule Logistics" item={edit} close={()=>setEdit(null)} save={save} fields="fleet"/>}</section>
}

function EntityEditor({title,item,close,save,fields}){
  const [v,setV]=React.useState({...item})
  return <div className="drawer-overlay"><aside className="drawer editor"><ModalHeader kicker="GESTION" title={title} close={close}/><div className="drawer-body"><div className="form-grid"><Field label="Nom"><Input required value={v.name||''} onChange={e=>setV({...v,name:e.target.value})}/></Field>{fields==='fleet'?<Field label="Marque"><Input value={v.brand||''} onChange={e=>setV({...v,brand:e.target.value})}/></Field>:<Field label="Label"><Input value={v.eyebrow||''} onChange={e=>setV({...v,eyebrow:e.target.value})} placeholder="PARTENAIRE NAIRI"/></Field>}</div>{fields==='fleet'&&<Field label="Catégorie" full><Input value={v.category||''} onChange={e=>setV({...v,category:e.target.value})}/></Field>}<Field label="Image (URL)" full><Input value={v.image_url||''} onChange={e=>setV({...v,image_url:e.target.value})}/></Field>{fields==='partner'&&<Field label="Lien externe (optionnel)" full><Input value={v.link_url||''} onChange={e=>setV({...v,link_url:e.target.value})}/></Field>}<Field label="Texte" full><Textarea rows="5" value={v.description||''} onChange={e=>setV({...v,description:e.target.value})}/></Field><div className="form-grid">{fields==='fleet'&&<Field label="Statut"><select value={v.status||'available'} onChange={e=>setV({...v,status:e.target.value})}><option value="available">Disponible</option><option value="service">En mission</option><option value="maintenance">Maintenance</option><option value="unavailable">Indisponible</option></select></Field>}<Field label="Ordre"><Input type="number" value={v.sort_order||0} onChange={e=>setV({...v,sort_order:e.target.value})}/></Field></div><label className="toggle"><input type="checkbox" checked={v.active??true} onChange={e=>setV({...v,active:e.target.checked})}/><span>Visible sur le site public</span></label><button className="btn btn-dark wide" onClick={()=>save(v)}>Enregistrer</button></div></aside></div>
}

function FinancePanel({items,cases,reload,notify,demo}){
  const [show,setShow]=React.useState(false),[form,setForm]=React.useState({direction:'income',amount:'',branch:'Logistics',category:'Prestation',description:'',transaction_date:new Date().toISOString().slice(0,10),case_id:''})
  const income=items.filter(x=>x.direction==='income').reduce((a,b)=>a+Number(b.amount||0),0), expense=items.filter(x=>x.direction==='expense').reduce((a,b)=>a+Number(b.amount||0),0)
  async function save(e){e.preventDefault();try{const payload={...form,amount:Number(form.amount),case_id:form.case_id||null};if(demo)demoSet('finance',[{id:uuid(),created_at:new Date().toISOString(),...payload},...demoGet('finance')]);else{const {error}=await supabase.from('financial_transactions').insert(payload);if(error)throw error}setShow(false);await reload();notify('Opération enregistrée.')}catch(e){notify(e.message,'error')}}
  return <><div className="metric-grid finance-metrics"><Metric icon={Banknote} label="Entrées" value={money(income)}/><Metric icon={CircleDollarSign} label="Sorties" value={money(expense)}/><Metric icon={Gauge} label="Solde" value={money(income-expense)}/></div><section className="staff-card no-pad"><div className="panel-toolbar"><div><span>JOURNAL</span><h2>Finance</h2></div><button className="btn btn-dark" onClick={()=>setShow(true)}><Plus size={15}/> Opération</button></div><div className="finance-list">{items.map(x=><div className="finance-row" key={x.id}><span className={x.direction}>{x.direction==='income'?'+':'−'} {money(x.amount)}</span><div><b>{x.description}</b><small>{x.branch} · {x.category}</small></div><span>{d(x.transaction_date)}</span></div>)}{!items.length&&<Empty icon={Banknote} text="Aucune opération enregistrée."/>}</div></section>{show&&<div className="drawer-overlay"><aside className="drawer editor"><ModalHeader kicker="FINANCE" title="Nouvelle opération" close={()=>setShow(false)}/><form className="drawer-body" onSubmit={save}><div className="form-grid"><Field label="Sens"><select value={form.direction} onChange={e=>setForm({...form,direction:e.target.value})}><option value="income">Entrée</option><option value="expense">Sortie</option></select></Field><Field label="Montant"><Input type="number" min="0" required value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></Field></div><div className="form-grid"><Field label="Branche"><select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}><option>Logistics</option><option>Advisory</option><option>Corporate</option></select></Field><Field label="Catégorie"><Input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></Field></div><Field label="Dossier lié (optionnel)" full><select value={form.case_id} onChange={e=>setForm({...form,case_id:e.target.value})}><option value="">Aucun</option>{cases.map(c=><option key={c.id} value={c.id}>{c.reference} · {c.title}</option>)}</select></Field><Field label="Description" full><Input required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></Field><Field label="Date" full><Input type="date" value={form.transaction_date} onChange={e=>setForm({...form,transaction_date:e.target.value})}/></Field><button className="btn btn-dark wide">Enregistrer</button></form></aside></div>}</>
}

function CareersPanel({items,reload,notify,demo}){
  async function status(id,value){try{if(demo)demoSet('applications',demoGet('applications').map(x=>x.id===id?{...x,status:value}:x));else{const {error}=await supabase.from('applications').update({status:value}).eq('id',id);if(error)throw error}await reload();notify('Candidature mise à jour.')}catch(e){notify(e.message,'error')}}
  return <section className="staff-card no-pad"><div className="panel-toolbar"><div><span>RESSOURCES HUMAINES</span><h2>Candidatures</h2></div></div><div className="candidate-grid">{items.map(a=><article className="candidate" key={a.id}><div><small>{a.client_ref}</small><h3>{a.full_name}</h3><span>{JOBS.find(j=>j.id===a.position)?.title||a.position} · {a.phone}</span></div><blockquote>{a.motivation}</blockquote><p>{a.experience}</p><select value={a.status} onChange={e=>status(a.id,e.target.value)}><option value="new">Nouvelle</option><option value="review">À étudier</option><option value="interview">Entretien</option><option value="accepted">Acceptée</option><option value="rejected">Refusée</option></select></article>)}{!items.length&&<Empty icon={UsersRound} text="Aucune candidature."/>}</div></section>
}

function Toast({text,type}){return <div className={cls('toast',type)}>{type==='error'?<AlertTriangle/>:<Check/>}<span>{text}</span></div>}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
