/* Rasantara API integration. Original page markup and styling are preserved. */
const RASANTARA_API = "https://rasantara-api.asybn867.workers.dev";
const RASANTARA_TOKEN_KEY = "rasantara_api_token";
const apiToken = () => sessionStorage.getItem(RASANTARA_TOKEN_KEY);
async function api(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (apiToken()) headers.Authorization = `Bearer ${apiToken()}`;
    const response = await fetch(`${RASANTARA_API}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Permintaan gagal.");
    return data;
}
const baseOpenModal = window.openModal;
const baseUpdateUserUI = window.updateUserUI;
const baseOpenProfileModal = window.openProfileModal;

function showMessage(message) { alert(message); }
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function addFeatureButton() {
    const addButton = document.querySelector('button[onclick="openAddRecipeModal()"]');
    if (!addButton || document.getElementById("complaintButton")) return;
    const button = document.createElement("button");
    button.id = "complaintButton";
    button.className = addButton.className;
    button.innerHTML = '<i class="fas fa-comment-dots"></i> Pengaduan';
    button.onclick = openComplaintModal;
    addButton.parentNode.insertBefore(button, addButton.nextSibling);
}
function createFeatureModals() {
    if (document.getElementById("complaintModal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div id="complaintModal" class="fixed inset-0 z-[70] hidden bg-black/60 backdrop-blur-sm items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
          <div class="flex justify-between items-center mb-4"><h3 class="text-xl font-bold font-serif text-gray-800">Kirim Pengaduan</h3><button onclick="closeFeatureModal('complaintModal')" class="text-gray-400"><i class="fas fa-times"></i></button></div>
          <form id="complaintForm" class="space-y-3"><input id="complaintSubject" required maxlength="120" placeholder="Judul pengaduan" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"><textarea id="complaintMessage" required minlength="10" maxlength="3000" rows="5" placeholder="Jelaskan kendala atau pengaduan Anda..." class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"></textarea><div class="flex justify-end gap-2"><button type="button" onclick="closeFeatureModal('complaintModal')" class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">Batal</button><button class="px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold">Kirim</button></div></form>
        </div>
      </div>
      <div id="adminModal" class="fixed inset-0 z-[70] hidden bg-black/60 backdrop-blur-sm items-center justify-center p-3"><div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7"><div class="flex justify-between items-center mb-5"><h3 class="text-xl font-bold font-serif">Panel Admin Rasantara</h3><button onclick="closeFeatureModal('adminModal')" class="text-gray-400"><i class="fas fa-times"></i></button></div><div class="grid sm:grid-cols-3 gap-2 mb-5"><button onclick="loadAdminRecipes()" class="bg-orange-100 text-orange-800 rounded-xl p-3 text-sm font-bold">Moderasi Resep</button><button onclick="loadAdminComplaints()" class="bg-orange-100 text-orange-800 rounded-xl p-3 text-sm font-bold">Pengaduan</button><button onclick="loadAdminHistory()" class="bg-orange-100 text-orange-800 rounded-xl p-3 text-sm font-bold">Riwayat Login</button></div><div id="adminContent" class="space-y-3 text-sm"></div></div></div>`);
    document.getElementById("complaintForm").addEventListener("submit", submitComplaint);
    const profileContent = document.querySelector("#profileModal .overflow-y-auto");
    if (profileContent && !document.getElementById("loginHistoryList")) {
        profileContent.insertAdjacentHTML("beforeend", '<div class="border-t border-gray-100 pt-4"><h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3"><i class="fas fa-shield-alt text-brand-500"></i> Riwayat Login</h4><div id="loginHistoryList" class="space-y-2 text-xs"></div></div>');
    }
}
function closeFeatureModal(id) { const el = document.getElementById(id); if (el) { el.classList.add("hidden"); el.classList.remove("flex"); } }
function openFeatureModal(id) { const el = document.getElementById(id); el.classList.remove("hidden"); el.classList.add("flex"); }
function openComplaintModal() {
    if (!currentUser) { showMessage("Silakan masuk terlebih dahulu untuk mengirim pengaduan."); openAuthModal(); return; }
    document.getElementById("complaintForm").reset(); openFeatureModal("complaintModal");
}
async function submitComplaint(event) {
    event.preventDefault();
    try {
        const result = await api("/api/complaints", { method: "POST", body: JSON.stringify({ subject: document.getElementById("complaintSubject").value, message: document.getElementById("complaintMessage").value }) });
        closeFeatureModal("complaintModal"); showMessage(result.message);
    } catch (error) { showMessage(error.message); }
}

window.handleAuthSubmit = async function(event) {
    event.preventDefault();
    const email = document.getElementById("authEmail").value.trim().toLowerCase();
    const password = document.getElementById("authPassword").value;
    const endpoint = isRegisterMode ? "/api/register" : "/api/login";
    const payload = isRegisterMode ? { name: document.getElementById("authName").value.trim(), email, password } : { email, password };
    try {
        const wasRegistering = isRegisterMode;
        const result = await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
        sessionStorage.setItem(RASANTARA_TOKEN_KEY, result.token);
        currentUser = { ...result.user, favorites: [], points: result.user.points || 0 };
        localStorage.setItem("rasantara_current_user", JSON.stringify(currentUser));
        closeAuthModal(); updateUserUI(); filterRecipes();
        showMessage(wasRegistering ? "Pendaftaran berhasil. Selamat datang di Rasantara!" : "Berhasil masuk.");
    } catch (error) { showMessage(error.message); }
};
window.handleLogout = function() {
    sessionStorage.removeItem(RASANTARA_TOKEN_KEY);
    localStorage.removeItem("rasantara_current_user");
    currentUser = null; updateUserUI();
    if (currentCategory === "favorites") selectCategory("all"); else filterRecipes();
};
window.updateUserUI = function() {
    baseUpdateUserUI();
    let adminButton = document.getElementById("adminPanelButton");
    if (currentUser?.role === "admin") {
        if (!adminButton) {
            adminButton = document.createElement("button"); adminButton.id = "adminPanelButton";
            adminButton.className = "bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-full px-4 py-2 text-xs font-bold";
            adminButton.textContent = "Panel Admin"; adminButton.onclick = () => { openFeatureModal("adminModal"); loadAdminRecipes(); };
            document.getElementById("accountSection").appendChild(adminButton);
        }
    } else if (adminButton) adminButton.remove();
};

window.handleAddRecipe = async function(event) {
    event.preventDefault();
    if (!currentUser) { showMessage("Silakan masuk terlebih dahulu."); openAuthModal(); return; }
    const name = document.getElementById("newRecipeName").value.trim();
    const region = document.getElementById("newRecipeRegion").value;
    const subRegion = document.getElementById("newRecipeSubRegion").value.trim();
    const halalStatus = document.getElementById("newRecipeHalalStatus").value;
    const image = document.getElementById("newRecipeImage").value.trim() || getSmartFoodImage(name, region);
    const origin = document.getElementById("newRecipeOrigin").value.trim();
    const ingredients = document.getElementById("newRecipeIngredients").value.split("\n").map(x => x.trim()).filter(Boolean);
    const steps = document.getElementById("newRecipeSteps").value.split("\n").map(x => x.trim()).filter(Boolean);
    const tips = document.getElementById("newRecipeTips").value.trim();
    if (ingredients.length < 3 || steps.length < 3) { showMessage("Bahan dan langkah masing-masing minimal 3 baris."); return; }
    try {
        const result = await api("/api/recipes", { method: "POST", body: JSON.stringify({ name, region, subRegion, halalStatus, image, origin, ingredients, steps, tips }) });
        closeAddRecipeModal(); showMessage(result.message + " Resep belum tampil sampai disetujui admin.");
    } catch (error) { showMessage(error.message); }
};
window.handleReviewSubmit = async function(event) {
    event.preventDefault();
    if (!currentUser) { showMessage("Silakan masuk terlebih dahulu."); openAuthModal(); return; }
    const recipe = recipes.find(r => r.id === currentActiveRecipeId); if (!recipe) return;
    const rating = Number(document.getElementById("reviewRatingVal").value), comment = document.getElementById("reviewComment").value.trim();
    if (comment.length < 10) { showMessage("Ulasan minimal 10 karakter."); return; }
    try {
        await api(`/api/recipes/${encodeURIComponent(recipe.id)}/reviews`, { method: "POST", body: JSON.stringify({ rating, comment }) });
        currentUser.points = (currentUser.points || 0) + 10; updateUserUI();
        const list = await api(`/api/recipes/${encodeURIComponent(recipe.id)}/reviews`); recipe.reviews = list.reviews;
        document.getElementById("reviewComment").value = ""; setRatingInput(5);
        document.getElementById("modalRatingVal").innerText = calculateAverageRating(recipe);
        document.getElementById("modalReviewCount").innerText = recipe.reviews.length;
        renderReviewsList(recipe); filterRecipes(); showMessage("Ulasan tersimpan. Terima kasih!");
    } catch (error) { showMessage(error.message); }
};
window.calculateAverageRating = function(recipe) {
    if (!recipe.reviews?.length) return "0.0";
    return (recipe.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / recipe.reviews.length).toFixed(1);
};
window.openModal = async function(id) {
    const recipe = recipes.find(r => r.id === id); if (!recipe) return;
    try { const result = await api(`/api/recipes/${encodeURIComponent(id)}/reviews`); recipe.reviews = result.reviews; } catch (_) {}
    baseOpenModal(id);
};
window.openProfileModal = async function() {
    if (!currentUser) return;
    baseOpenProfileModal();
    const historyBox = document.getElementById("loginHistoryList"); historyBox.innerHTML = '<p class="text-gray-400">Memuat...</p>';
    try {
        const result = await api("/api/me/history");
        historyBox.innerHTML = result.history.length ? result.history.map(row => `<div class="flex justify-between gap-3 border-b border-gray-100 py-2"><span class="${row.success ? "text-emerald-700" : "text-red-600"}">${row.success ? "Login berhasil" : "Login gagal"}</span><span class="text-gray-500">${new Date(row.created_at + "Z").toLocaleString("id-ID")}</span></div>`).join("") : '<p class="text-gray-400">Belum ada riwayat.</p>';
    } catch (error) { historyBox.innerHTML = `<p class="text-red-500">${escapeHtml(error.message)}</p>`; }
};

async function loadAdminRecipes() {
    const box = document.getElementById("adminContent"); box.innerHTML = "Memuat resep...";
    try {
        const { recipes: pending } = await api("/api/admin/recipes");
        box.innerHTML = pending.length ? pending.map(r => `<article class="border border-orange-100 rounded-xl p-4"><div class="font-bold text-gray-800">${escapeHtml(r.name)}</div><p class="text-xs text-gray-500">${escapeHtml(r.region)} • ${escapeHtml(r.sub_region)} • ${escapeHtml(r.author)} (${escapeHtml(r.email)})</p><details class="my-3 text-xs"><summary class="cursor-pointer font-bold text-brand-600">Periksa isi resep</summary><p class="my-2">${escapeHtml(r.origin)}</p><b>Bahan:</b><ul class="list-disc pl-5">${JSON.parse(r.ingredients_json).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul><b>Langkah:</b><ol class="list-decimal pl-5">${JSON.parse(r.steps_json).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ol><p class="mt-2">Tips: ${escapeHtml(r.tips)}</p></details><div class="flex gap-2 mt-3"><button data-id="${escapeHtml(r.id)}" data-status="approved" class="bg-emerald-600 text-white rounded-lg px-3 py-2 text-xs">Setujui</button><button data-id="${escapeHtml(r.id)}" data-status="rejected" class="bg-red-600 text-white rounded-lg px-3 py-2 text-xs">Tolak</button></div></article>`).join("") : '<p class="text-gray-500">Tidak ada resep yang menunggu persetujuan.</p>';
        box.querySelectorAll("button[data-id]").forEach(button => button.onclick = async () => { try { await api(`/api/admin/recipes/${encodeURIComponent(button.dataset.id)}`, { method: "PATCH", body: JSON.stringify({ status: button.dataset.status }) }); loadAdminRecipes(); if (button.dataset.status === "approved") await loadCommunityRecipes(); } catch (e) { showMessage(e.message); } });
    } catch (error) { box.textContent = error.message; }
}
async function loadAdminComplaints() {
    const box = document.getElementById("adminContent"); box.innerHTML = "Memuat pengaduan...";
    try {
        const { complaints } = await api("/api/admin/complaints");
        box.innerHTML = complaints.length ? complaints.map(c => `<article class="border border-orange-100 rounded-xl p-4"><div class="font-bold">#${c.id} ${escapeHtml(c.subject)}</div><p class="text-xs text-gray-500">${escapeHtml(c.author)} • ${escapeHtml(c.email)} • ${escapeHtml(c.created_at)}</p><p class="my-2 whitespace-pre-wrap">${escapeHtml(c.message)}</p><div class="flex flex-wrap gap-2"><select id="complaintStatus${c.id}" class="border rounded-lg p-2 text-xs"><option value="pending" ${c.status === "pending" ? "selected" : ""}>Pending</option><option value="processing" ${c.status === "processing" ? "selected" : ""}>Diproses</option><option value="resolved" ${c.status === "resolved" ? "selected" : ""}>Selesai</option></select><input id="complaintNote${c.id}" value="${escapeHtml(c.admin_note || "")}" placeholder="Catatan admin" class="border rounded-lg p-2 text-xs flex-1"><button data-save="${c.id}" class="bg-brand-500 text-white rounded-lg px-3 py-2 text-xs">Simpan</button></div></article>`).join("") : '<p class="text-gray-500">Belum ada pengaduan.</p>';
        box.querySelectorAll("button[data-save]").forEach(b => b.onclick = async () => { const id = b.dataset.save; try { await api(`/api/admin/complaints/${id}`, { method: "PATCH", body: JSON.stringify({ status: document.getElementById(`complaintStatus${id}`).value, adminNote: document.getElementById(`complaintNote${id}`).value }) }); showMessage("Status pengaduan diperbarui."); } catch(e) { showMessage(e.message); } });
    } catch (error) { box.textContent = error.message; }
}
async function loadAdminHistory() {
    const box = document.getElementById("adminContent"); box.innerHTML = "Memuat riwayat login...";
    try { const { history } = await api("/api/admin/login-history"); box.innerHTML = history.length ? history.map(r => `<div class="flex justify-between border-b py-2 gap-3"><span>${escapeHtml(r.email)} • <b class="${r.success ? "text-emerald-700" : "text-red-600"}">${r.success ? "Berhasil" : "Gagal"}</b></span><span class="text-gray-500">${escapeHtml(r.created_at)}</span></div>`).join("") : "Belum ada aktivitas login."; } catch(e) { box.textContent = e.message; }
}
async function loadCommunityRecipes() {
    try {
        const result = await api("/api/recipes");
        const safeRecipes = result.recipes.map(r => ({ ...r,
            name: escapeHtml(r.name), region: escapeHtml(r.region), subRegion: escapeHtml(r.subRegion),
            image: /^https:\/\//i.test(r.image || "") ? r.image : getSmartFoodImage(r.name, r.region),
            origin: r.origin, tips: r.tips,
            ingredients: r.ingredients.map(escapeHtml), steps: r.steps.map(escapeHtml),
            reviews: r.reviews
        }));
        recipes = [...safeRecipes, ...recipes.filter(r => !String(r.id).startsWith("community-"))];
        filterRecipes();
    } catch (error) { console.warn("Rasantara API:", error.message); }
}
async function restoreApiSession() {
    localStorage.removeItem("rasantara_current_user");
    currentUser = null;
    if (apiToken()) {
        try { const result = await api("/api/me"); currentUser = { ...result.user, favorites: [] }; }
        catch (_) { sessionStorage.removeItem(RASANTARA_TOKEN_KEY); }
    }
    updateUserUI(); filterRecipes();
}
window.renderReviewsList = function(recipe) {
    const list = document.getElementById("reviewsList"); list.replaceChildren();
    if (!recipe.reviews?.length) { list.textContent = "Belum ada ulasan untuk resep ini."; return; }
    recipe.reviews.forEach(review => {
        const card = document.createElement("div"); card.className = "bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-xs space-y-1";
        const top = document.createElement("div"); top.className = "flex items-center justify-between";
        const name = document.createElement("span"); name.className = "font-bold text-gray-800"; name.textContent = review.userName;
        const stars = document.createElement("span"); stars.className = "text-amber-400"; stars.textContent = "★".repeat(Number(review.rating)) + "☆".repeat(5 - Number(review.rating));
        const comment = document.createElement("p"); comment.className = "text-gray-600"; comment.textContent = review.comment;
        top.append(name, stars); card.append(top, comment); list.append(card);
    });
};
document.addEventListener("DOMContentLoaded", () => {
    recipes = defaultRecipes.slice();
    createFeatureModals(); addFeatureButton();
    restoreApiSession().then(loadCommunityRecipes);
});