(function () {
  const message = text => { const el = ui.$("#auth-message"); if (el) el.textContent = text; };
  const error = text => { const el=ui.$("#auth-message"); if(el){el.textContent=text;el.classList.add("error")} };
  async function register(form) {
    const data = Object.fromEntries(new FormData(form));
    if (data.password.length < 8) return error("Password must be at least 8 characters.");
    if (data.password !== data.confirm_password) return error("Passwords do not match.");
    const button = form.querySelector("button"); ui.setBusy(button,true,"Creating account…");
    if (!portfolio.configured) { message("Demo registration complete. Configure Supabase to create a real account."); ui.setBusy(button,false); return; }
    const result = await portfolio.client.auth.signUp({email:data.email,password:data.password,options:{data:{full_name:data.full_name}}});
    if (result.error) { error(result.error.message.includes("already") ? "An account with this email already exists." : "Unable to create your account. Please try again."); console.error(result.error); ui.setBusy(button,false); return; }
    if (result.data.user) await portfolio.client.from("profiles").upsert({id:result.data.user.id,full_name:data.full_name,email:data.email,role:"user"});
    message(result.data.session ? "Account created. Redirecting…" : "Registration successful. Please check your email to confirm your account.");
    ui.setBusy(button,false); setTimeout(()=>location.href=result.data.session?"admin.html":"login.html",900);
  }
  async function login(form) {
    const data=Object.fromEntries(new FormData(form)),button=form.querySelector("button"); ui.setBusy(button,true,"Signing in…");
    if (!portfolio.configured) { sessionStorage.setItem("demo-admin","true"); location.href="admin.html"; return; }
    const result=await portfolio.client.auth.signInWithPassword({email:data.email,password:data.password});
    if(result.error){error("Email or password is incorrect.");console.error(result.error);ui.setBusy(button,false);return}
    const profile=await portfolio.client.from("profiles").select("role").eq("id",result.data.user.id).maybeSingle();
    if(profile.error || profile.data?.role!=="admin"){await portfolio.client.auth.signOut();error("This account does not have admin access.");ui.setBusy(button,false);return}
    location.href="admin.html";
  }
  async function forgot(form) {
    const button=form.querySelector("button"),email=new FormData(form).get("email");ui.setBusy(button,true,"Sending…");
    if(!portfolio.configured){message("Demo mode: configure Supabase to send a real reset email.");ui.setBusy(button,false);return}
    const result=await portfolio.client.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}${location.pathname.replace(/[^/]+$/,"")}reset-password.html`});
    if(result.error) error("Unable to send the reset email. Please try again."); else message("Check your inbox for a secure reset link.");
    ui.setBusy(button,false);
  }
  async function reset(form) {
    const data=Object.fromEntries(new FormData(form)),button=form.querySelector("button"); if(data.password.length<8)return error("Password must be at least 8 characters.");if(data.password!==data.confirm_password)return error("Passwords do not match.");ui.setBusy(button,true,"Updating…");
    if(!portfolio.configured){message("Demo mode: password update is unavailable.");ui.setBusy(button,false);return}
    const result=await portfolio.client.auth.updateUser({password:data.password});if(result.error)error("Unable to update your password.");else{message("Password updated. Redirecting to sign in…");setTimeout(()=>location.href="login.html",900)}ui.setBusy(button,false);
  }
  async function requireAdmin() {
    if(!document.body.classList.contains("admin-page"))return true;
    if(!portfolio.configured) return true;
    const result=await portfolio.client.auth.getUser();
    if(result.error||!result.data.user){location.href="login.html";return false}
    const profile=await portfolio.client.from("profiles").select("*").eq("id",result.data.user.id).maybeSingle();
    if(profile.error||profile.data?.role!=="admin"){document.body.innerHTML='<main class="not-found container"><span class="brand-mark">AM</span><p class="eyebrow">Access denied</p><h1>This space is<br><em>admin only.</em></h1><a class="button button-primary" href="index.html">Back to portfolio <span>↗</span></a></main>';return false}
    window.currentUser={...result.data.user,profile:profile.data};return true;
  }
  ui.$("#register-form")?.addEventListener("submit",e=>{e.preventDefault();register(e.currentTarget)});
  ui.$("#login-form")?.addEventListener("submit",e=>{e.preventDefault();login(e.currentTarget)});
  ui.$("#forgot-form")?.addEventListener("submit",e=>{e.preventDefault();forgot(e.currentTarget)});
  ui.$("#reset-form")?.addEventListener("submit",e=>{e.preventDefault();reset(e.currentTarget)});
  window.authApi={requireAdmin};
})();