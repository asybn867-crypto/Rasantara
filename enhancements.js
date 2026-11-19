(() => {
  const API = "https://rasantara-api.asybn867.workers.dev/api";
  const token = () => localStorage.getItem("rasantara_token");
  async function request(path, options = {}) {
    const res = await fetch(API + path, {...options, headers: {"Content-Type":"application/json", Authorization: "Bearer " + (token() || ""), ...(options.headers || {})}});
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Permintaan gagal.");
    return data;
  }
  function addStyles() {
    if (document.getElementById("rasantara-enhancements-style")) return;
    const style = document.createElement("style");
    style.id = "rasantara-enhancements-style";
    style.textContent = `
      body.rs-landscape main {max-width: 100%; padding-left: clamp(12px,2vw,32px); padding-right: clamp(12px,2vw,32px)}
      body.rs-landscape #recipeGrid {grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:18px}
      body.rs-landscape header > div {max-width:100%}
      body.rs-portrait #recipeGrid {grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))}
      @media(max-width:640px) {
        body.rs-portrait #recipeGrid {grid-template-columns:1fr}
        body.rs-landscape #recipeGrid {grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        body.rs-landscape #recipeGrid img {height:135px}
        body.rs-landscape header .max-w-7xl > .flex {align-items:flex-start}
      }
      #rsAdminModal{position:fixed;inset:0;z-index:90;background:rgba(28,20,15,.58);backdrop-filter:blur(7px);display:none;align-items:center;justify-content:center;padding:clamp(8px,2vw,24px)}
      #rsAdminModal.open{display:flex}
      #rsAdminPanel{width:min(1180px,100%);height:min(820px,94dvh);min-height:520px;background:#faf8f5;border:1px solid #eadfd3;border-radius:24px;overflow:hidden;display:grid;grid-template-columns:238px minmax(0,1fr);box-shadow:0 28px 90px #1c140f55;color:#29231f}
      .rs-admin-side{background:#29231f;color:#f9f4ed;padding:24px 15px;display:flex;flex-direction:column;gap:26px}
      .rs-admin-brand{display:flex;align-items:center;gap:11px;padding:0 8px}
      .rs-admin-brandmark{width:39px;height:39px;border-radius:13px;background:#d97736;color:white;display:grid;place-items:center;font:700 20px Georgia}
      .rs-admin-brand strong{display:block;font:700 19px Georgia;letter-spacing:.2px}
      .rs-admin-brand small{display:block;color:#b9a99b;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;margin-top:3px}
      .rs-admin-navlabel{padding:0 10px;color:#9e8f82;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase}
      .rs-admin-tabs{display:grid;gap:6px;margin-top:-17px}
      .rs-admin-tabs button{width:100%;display:flex;align-items:center;gap:11px;text-align:left;background:transparent;color:#cfc2b7;padding:12px 13px;border-radius:12px;font-size:12px;font-weight:650;transition:.18s}
      .rs-admin-tabs button:before{content:attr(data-icon);width:18px;text-align:center;font-size:15px}
      .rs-admin-tabs button:hover{background:#ffffff12;color:white}
      .rs-admin-tabs button.active{background:#d97736;color:white;box-shadow:0 5px 16px #d9773638}
      .rs-admin-sidefoot{margin-top:auto;border-top:1px solid #ffffff18;padding:15px 9px 0;color:#aa9b8e;font-size:11px;line-height:1.6}
      .rs-admin-main{min-width:0;display:flex;flex-direction:column;overflow:hidden}
      .rs-admin-top{height:76px;flex:none;background:#fff;border-bottom:1px solid #eee5dc;display:flex;align-items:center;justify-content:space-between;padding:0 28px;gap:14px}
      .rs-admin-top small{display:block;color:#9b8b7c;font-size:10px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800}
      .rs-admin-top strong{display:block;font:700 19px Georgia;margin-top:3px}
      #rsAdminClose{width:36px;height:36px;border-radius:11px;background:#f5f0ea;color:#76685d;font-size:22px;display:grid;place-items:center}
      #rsAdminClose:hover{background:#eee2d6;color:#29231f}
      .rs-admin-work{overflow:auto;padding:26px 28px 34px}
      .rs-admin-welcome{margin-bottom:22px}
      .rs-admin-welcome h3{font:700 25px Georgia;color:#302820;margin:0 0 6px}
      .rs-admin-welcome p{color:#88796c;font-size:12px;margin:0}
      .rs-admin-entry{background:#fff;border:1px solid #eee3d8;border-radius:16px;padding:17px;margin:11px 0;font-size:13px;box-shadow:0 3px 12px #39241408}
      .rs-admin-entry button{transition:.15s}
      .rs-admin-entry button:hover{filter:brightness(.94);transform:translateY(-1px)}
      .rs-admin-empty{background:white;border:1px dashed #dfcfc0;border-radius:18px;padding:34px 18px;text-align:center;color:#8e7e70;font-size:13px}
      @media(max-width:700px){#rsAdminPanel{height:96dvh;min-height:0;grid-template-columns:68px minmax(0,1fr);border-radius:17px}.rs-admin-side{padding:17px 7px;gap:22px;align-items:center}.rs-admin-brand{padding:0}.rs-admin-brandmark{width:42px;height:42px}.rs-admin-brandtext,.rs-admin-navlabel,.rs-admin-sidefoot,.rs-admin-tabs button span{display:none}.rs-admin-tabs{width:100%;gap:8px}.rs-admin-tabs button{justify-content:center;padding:13px 3px;font-size:0}.rs-admin-tabs button:before{font-size:17px}.rs-admin-top{height:66px;padding:0 15px}.rs-admin-top strong{font-size:16px}.rs-admin-work{padding:20px 13px}.rs-admin-welcome h3{font-size:22px}}
      @media(max-width:380px){#rsAdminPanel{grid-template-columns:56px minmax(0,1fr)}.rs-admin-side{padding-inline:5px}.rs-admin-work{padding-inline:10px}}
    `;
    document.head.appendChild(style);
  }
  function addOrientation() {
    const ua = navigator.userAgent || "";
    const isIPad = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isPhone = !isIPad && (/iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua));
    const mode = isPhone ? "portrait" : "landscape";
    document.body.classList.toggle("rs-portrait", mode === "portrait");
    document.body.classList.toggle("rs-landscape", mode === "landscape");
    document.documentElement.dataset.rasantaraLayout = mode;
  }
  function addAdminPanel() {
    if (document.getElementById("rsAdminModal")) return;
    const modal = document.createElement("div");
    modal.id = "rsAdminModal";
    modal.innerHTML = '<section id="rsAdminPanel"><aside class="rs-admin-side"><div class="rs-admin-brand"><div class="rs-admin-brandmark">R</div><div class="rs-admin-brandtext"><strong>Rasantara</strong><small>Admin workspace</small></div></div><div class="rs-admin-navlabel">MENU UTAMA</div><nav class="rs-admin-tabs"><button data-view="history" data-icon="◷"><span>Riwayat Login</span></button><button data-view="complaints" data-icon="▤"><span>Komplain Masuk</span></button><button data-view="pending" data-icon="◈"><span>Persetujuan Resep</span></button><button data-view="recipes" data-icon="▧"><span>Kelola Resep</span></button><button data-view="users" data-icon="♙"><span>Kelola Akun</span></button><button data-view="comments" data-icon="☷"><span>Moderasi Komentar</span></button></nav><div class="rs-admin-sidefoot">RASANTARA CONTROL CENTER<br>Data dikelola melalui Cloudflare D1</div></aside><div class="rs-admin-main"><header class="rs-admin-top"><div><small>RASANTARA / ADMIN</small><strong id="rsAdminPageTitle">Ringkasan Aktivitas</strong></div><button id="rsAdminClose" aria-label="Tutup">×</button></header><main class="rs-admin-work"><div class="rs-admin-welcome"><h3 id="rsAdminHeading">Selamat datang, Admin.</h3><p>Kelola aktivitas dan konten komunitas Rasantara dari satu tempat.</p></div><div id="rsAdminContent"><div class="rs-admin-empty">Pilih menu di sebelah kiri untuk mulai mengelola.</div></div></main></div></section>';
    document.body.appendChild(modal);
    modal.addEventListener("click", e => {if(e.target===modal || e.target.id==="rsAdminClose")modal.classList.remove("open")});
    modal.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{modal.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x===b));loadAdminView(b.dataset.view)}));
    modal.addEventListener("click",async e=>{
      const delComplaint=e.target.closest("[data-delete-complaint]");
      if(delComplaint){if(!confirm("Hapus komplain ini secara permanen?"))return;delComplaint.disabled=true;try{await request("/admin/complaints/"+encodeURIComponent(delComplaint.dataset.deleteComplaint),{method:"DELETE"});await loadAdminView("complaints");}catch(err){alert(err.message);delComplaint.disabled=false;}return;}
      const delComment=e.target.closest("[data-delete-comment]");
      if(delComment){if(!confirm("Hapus komentar ini secara permanen?"))return;delComment.disabled=true;try{await request("/admin/comments/"+encodeURIComponent(delComment.dataset.deleteComment),{method:"DELETE"});await loadAdminView("comments");}catch(err){alert(err.message);delComment.disabled=false;}return;}
      const del=e.target.closest("[data-delete]"),ban=e.target.closest("[data-ban]"),unban=e.target.closest("[data-unban]");
      if(del){if(!confirm("Hapus resep ini secara permanen?"))return;del.disabled=true;try{await request("/admin/recipes/"+encodeURIComponent(del.dataset.delete),{method:"DELETE"});await loadAdminView("recipes");}catch(err){alert(err.message);del.disabled=false;}return;}
      if(ban){const reason=prompt("Alasan pemblokiran akun:");if(reason===null)return;ban.disabled=true;try{await request("/admin/users/"+encodeURIComponent(ban.dataset.ban)+"/ban",{method:"POST",body:JSON.stringify({reason})});await loadAdminView("users");}catch(err){alert(err.message);ban.disabled=false;}return;}
      if(unban){unban.disabled=true;try{await request("/admin/users/"+encodeURIComponent(unban.dataset.unban)+"/unban",{method:"POST",body:"{}"});await loadAdminView("users");}catch(err){alert(err.message);unban.disabled=false;}return;}
    });
    modal.addEventListener("click",async e=>{
      const approve=e.target.closest("[data-approve]"),reject=e.target.closest("[data-reject]"),btn=approve||reject;
      if(!btn)return;
      const id=btn.dataset.approve||btn.dataset.reject;
      if(!confirm(approve?"Publikasikan resep ini?":"Tolak kiriman resep ini?"))return;
      btn.disabled=true;
      try{await request("/admin/recipes/"+encodeURIComponent(id)+(approve?"/approve":"/reject"),{method:"POST",body:"{}"});await loadAdminView("pending");if(approve&&typeof window.loadApprovedCommunityRecipes==="function")await window.loadApprovedCommunityRecipes();}
      catch(err){alert(err.message);btn.disabled=false;}
    });
  }
  async function loadAdminView(view) {
    const box=document.getElementById("rsAdminContent");
    const titles={history:"Riwayat Login",complaints:"Komplain Masuk",pending:"Persetujuan Resep",recipes:"Kelola Resep",users:"Kelola Akun",comments:"Moderasi Komentar"};
    const title=titles[view]||"Panel Admin";
    const titleEl=document.getElementById("rsAdminPageTitle"),heading=document.getElementById("rsAdminHeading");
    if(titleEl)titleEl.textContent=title;
    if(heading)heading.textContent=title;
    box.innerHTML='<div class="rs-admin-empty">Memuat data...</div>';
    try {
      if(view==="comments") {
        const data=await request("/admin/comments");
        box.innerHTML=data.comments.length?data.comments.map(c=>'<article class="rs-admin-entry"><b>'+escapeHtml(c.name)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">'+escapeHtml(c.email)+' · '+escapeHtml(c.recipe_id)+' · '+new Date(Number(c.created_at)).toLocaleString("id-ID")+'</div><div style="color:#d97706;margin:4px 0">Rating: '+Number(c.rating)+'/5</div><p style="white-space:pre-wrap;margin:8px 0">'+escapeHtml(c.comment)+'</p><button data-delete-comment="'+escapeHtml(c.id)+'" style="background:#dc2626;color:white;padding:8px 12px;border-radius:9px;font-weight:700">Hapus komentar</button></article>').join(""):'<p>Belum ada komentar.</p>';
      } else if(view==="users") {
        const data=await request("/admin/users");
        box.innerHTML=data.users.length?data.users.map(u=>'<article class="rs-admin-entry"><b>'+escapeHtml(u.name)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">'+escapeHtml(u.email)+' · '+escapeHtml(u.role)+'</div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span style="color:'+(u.banned_at?'#dc2626':'#15803d')+'">'+(u.banned_at?'Diblokir: '+escapeHtml(u.ban_reason||'-'):'Aktif')+'</span>'+(u.role==='admin'?'':'<button '+(u.banned_at?'data-unban="'+escapeHtml(u.id)+'"':'data-ban="'+escapeHtml(u.id)+'"')+' style="background:'+(u.banned_at?'#15803d':'#dc2626')+';color:white;padding:7px 11px;border-radius:8px;font-weight:700">'+(u.banned_at?'Buka blokir':'Ban akun')+'</button>')+'</div></article>').join(""):'<p>Belum ada akun.</p>';
      } else if(view==="recipes") {
        const data=await request("/admin/recipes");
        box.innerHTML=data.recipes.length?data.recipes.map(r=>'<article class="rs-admin-entry"><b>'+escapeHtml(r.name)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">Status: '+escapeHtml(r.status)+' · '+new Date(Number(r.submittedAt)).toLocaleString("id-ID")+'</div><p>'+escapeHtml(r.origin||"")+'</p><button data-delete="'+escapeHtml(r.submissionId)+'" style="background:#dc2626;color:white;padding:8px 12px;border-radius:9px;font-weight:700">Hapus resep</button></article>').join(""):'<p>Belum ada resep komunitas.</p>';
      } else if(view==="pending") {
        const data=await request("/admin/recipes/pending");
        box.innerHTML=data.recipes.length?data.recipes.map(r=>'<article class="rs-admin-entry"><b>'+escapeHtml(r.name)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">'+escapeHtml(r.subRegion)+' · oleh '+escapeHtml(r.submittedBy)+' ('+escapeHtml(r.submittedEmail)+')</div><p style="margin:7px 0">'+escapeHtml(r.origin)+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button data-approve="'+escapeHtml(r.submissionId)+'" style="background:#15803d;color:white;padding:8px 12px;border-radius:9px;font-weight:700">Setujui & Publikasikan</button><button data-reject="'+escapeHtml(r.submissionId)+'" style="background:#dc2626;color:white;padding:8px 12px;border-radius:9px;font-weight:700">Tolak</button></div></article>').join(""):'<p style="color:#78716c;font-size:13px">Tidak ada resep yang menunggu persetujuan.</p>';
      } else if(view==="history") {
        const data=await request("/admin/login-history");
        box.innerHTML=data.history.length?data.history.map(r=>'<article class="rs-admin-entry"><b>'+escapeHtml(r.email)+'</b><div style="display:flex;justify-content:space-between;gap:12px;margin-top:5px"><span style="color:'+(r.success?'#047857':'#dc2626')+'">'+(r.success?'Login berhasil':'Login gagal')+'</span><span style="color:#78716c">'+new Date(Number(r.created_at)).toLocaleString("id-ID")+'</span></div></article>').join(""):'<p style="color:#78716c;font-size:13px">Belum ada riwayat login.</p>';
      } else {
        const data=await request("/admin/complaints");
        box.innerHTML='<p style="font-size:12px;color:#78716c;margin-bottom:12px">Komplain berumur lebih dari 7 hari dihapus otomatis setiap Senin pukul 00.00 UTC.</p>'+(data.complaints.length?data.complaints.map(c=>'<article class="rs-admin-entry"><b>'+escapeHtml(c.subject)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">'+escapeHtml(c.name)+' · '+escapeHtml(c.email)+' · '+new Date(Number(c.created_at)).toLocaleString("id-ID")+'</div><p style="white-space:pre-wrap;margin:8px 0">'+escapeHtml(c.message)+'</p><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-weight:700;color:#c2410c">Status: '+escapeHtml(c.status)+'</span><button data-delete-complaint="'+escapeHtml(c.id)+'" style="background:#dc2626;color:white;padding:8px 12px;border-radius:9px;font-weight:700">Hapus komplain</button></div></article>').join(''):'<p style="color:#78716c;font-size:13px">Belum ada komplain masuk.</p>');
      }
    } catch(e) {box.textContent=e.message}
  }
  function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function addAdminButton() {
    const user=typeof currentUser !== "undefined" ? currentUser : null;
    const account=document.getElementById("accountSection");
    if(!account)return;
    const existing=document.getElementById("rsAdminActions");
    if(!user || user.role!=="admin") {
      if(existing)existing.remove();
      const oldLogout=document.querySelector('#userProfileNav button[onclick="handleLogout()"]');
      if(oldLogout)oldLogout.style.display="";
      return;
    }
    if(existing)return;
    const actions=document.createElement("div");
    actions.id="rsAdminActions";
    actions.className="flex items-center justify-center gap-2 flex-wrap";
    const panel=document.createElement("button");
    panel.id="rsAdminOpen";panel.type="button";panel.textContent="Panel Admin";
    panel.className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-4 py-3 rounded-full shadow text-sm whitespace-nowrap";
    panel.onclick=()=>{document.getElementById("rsAdminModal").classList.add("open");loadAdminView("history")};
    const logout=document.createElement("button");
    logout.id="rsAdminLogout";logout.type="button";logout.textContent="Keluar dari Admin";
    logout.className="bg-orange-900/30 hover:bg-orange-900/50 text-white border border-white/30 font-bold px-4 py-3 rounded-full text-sm whitespace-nowrap";
    logout.onclick=()=>{if(typeof handleLogout==="function")handleLogout()};
    actions.append(panel,logout);
    account.parentNode.insertBefore(actions,account);
    const oldLogout=document.querySelector('#userProfileNav button[onclick="handleLogout()"]');
    if(oldLogout)oldLogout.style.display="none";
  }
  function watchUser() {
    const originalUpdate = window.updateUserUI;
    if (typeof originalUpdate === "function" && !originalUpdate.__rsWrapped) {
      const wrapped = function(){ originalUpdate.apply(this, arguments); addAdminButton(); };
      wrapped.__rsWrapped = true;
      window.updateUserUI = wrapped;
    }
    addAdminButton();
    const target=document.getElementById("accountSection");
    if(target)new MutationObserver(addAdminButton).observe(target,{childList:true,subtree:true});
  }
  document.addEventListener("DOMContentLoaded",()=>{addStyles();addOrientation();addAdminPanel();watchUser();});
})();