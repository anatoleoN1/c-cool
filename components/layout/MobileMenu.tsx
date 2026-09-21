"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  ["/", "Accueil"], ["/agenda", "Agenda"], ["/cours", "Cours"], ["/exercices", "Exercices"],
  ["/devoirs", "Devoirs"], ["/revisions", "Révisions"], ["/evaluations", "Évaluations"],
  ["/calcul-mental", "Calcul mental"], ["/classe", "Classe"], ["/messages", "Messages"],
];

export default function MobileMenu() {
  const [open,setOpen]=useState(false); const {role}=useAuth();
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  return <><button className="mobile-menu" aria-label="Ouvrir le menu" onClick={()=>setOpen(true)}>Menu</button>
    {open && <div className="mobile-overlay" onClick={()=>setOpen(false)}><aside className="mobile-drawer" onClick={e=>e.stopPropagation()}>
      <div className="mobile-drawer-header"><Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-wordmark">C-Cool</span></Link><button className="mobile-close" onClick={()=>setOpen(false)}>Fermer</button></div>
      <div className="sidebar-label">Navigation</div><nav className="navigation">{navigation.map(([href,label])=><Link key={href} href={href} className="nav-item" onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
      <div className="sidebar-label mobile-other-label">Autres</div>
      {role==="admin" && <Link href="/admin" className="nav-item" onClick={()=>setOpen(false)}>Administration</Link>}
      {(role==="moderator"||role==="admin") && <Link href="/moderation" className="nav-item" onClick={()=>setOpen(false)}>Modération</Link>}
      <Link href="/contribuer" className="nav-item" onClick={()=>setOpen(false)}>Contribuer</Link>
      <Link href="/parametres" className="nav-item" onClick={()=>setOpen(false)}>Paramètres</Link>
    </aside></div>}
  </>;
}