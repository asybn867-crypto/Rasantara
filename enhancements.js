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
      #rsAdminModal {position:fixed;inset:0;z-index:90;background:#0009;display:none;align-items:center;justify-content:center;padding:14px}
      #rsAdminModal.open {display:flex}
      #rsAdminPanel {background:white;border-radius:22px;width:min(900px,100%);max-height:90vh;overflow:auto;padding:20px}
      .rs-admin-tabs {display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
      .rs-admin-tabs button {background:#ffedd5;color:#9a3412;padding:9px 13px;border-radius:12px;font-size:12px;font-weight:700}
      .rs-admin-entry {border:1px solid #fed7aa;border-radius:14px;padding:13px;margin:9px 0;font-size:13px}
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
    modal.innerHTML = '<section id="rsAdminPanel"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2 style="font:700 22px Georgia;color:#292524">Panel Admin Rasantara</h2><p style="font-size:12px;color:#78716c">Data tersimpan di Cloudflare D1.</p></div><button id="rsAdminClose" aria-label="Tutup" style="font-size:24px;color:#78716c">×</button></div><nav class="rs-admin-tabs"><button data-view="history">Riwayat Login</button><button data-view="complaints">Komplain Masuk</button><button data-view="pending">Persetujuan Resep</button><button data-view="recipes">Kelola Resep</button><button data-view="users">Kelola Akun</button><button data-view="comments">Moderasi Komentar</button></nav><div id="rsAdminContent">Pilih menu.</div></section>';
    document.body.appendChild(modal);
    modal.addEventListener("click", e => {if(e.target===modal || e.target.id==="rsAdminClose")modal.classList.remove("open")});
    modal.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>loadAdminView(b.dataset.view)));
    modal.addEventListener("click",async e=>{
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
    box.textContent="Memuat data...";
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
        box.innerHTML=data.complaints.length?data.complaints.map(c=>'<article class="rs-admin-entry"><b>'+escapeHtml(c.subject)+'</b><div style="color:#78716c;font-size:11px;margin:4px 0">'+escapeHtml(c.name)+' · '+escapeHtml(c.email)+' · '+new Date(Number(c.created_at)).toLocaleString("id-ID")+'</div><p style="white-space:pre-wrap;margin:8px 0">'+escapeHtml(c.message)+'</p><span style="font-weight:700;color:#c2410c">Status: '+escapeHtml(c.status)+'</span></article>').join(""):'<p style="color:#78716c;font-size:13px">Belum ada komplain masuk.</p>';
      }
    } catch(e) {box.textContent=e.message}
  }
  function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function addAdminButton() {
    const user=typeof currentUser !== "undefined" ? currentUser : null;
    const account=document.getElementById("accountSection");
    if(!account || !user || user.role!=="admin" || document.getElementById("rsAdminOpen"))return;
    const b=document.createElement("button");
    b.id="rsAdminOpen";b.type="button";b.textContent="Panel Admin";
    b.className="bg-white text-orange-700 font-bold px-4 py-3 rounded-full shadow text-sm";
    b.onclick=()=>{document.getElementById("rsAdminModal").classList.add("open");loadAdminView("history")};
    account.appendChild(b);
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