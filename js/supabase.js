(function () {
  const configured = SUPABASE_URL && SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
  window.portfolio = {
    configured,
    client: configured && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
  };
  window.db = {
    async list(table, columns = "*", options = {}) {
      if (!portfolio.configured) return { data: window.demoData(table), error: null, demo: true };
      let query = portfolio.client.from(table).select(columns);
      if (options.eq) Object.entries(options.eq).forEach(([key, value]) => { query = query.eq(key, value); });
      if (options.order) query = query.order(options.order, { ascending: options.ascending ?? true });
      if (options.limit) query = query.limit(options.limit);
      return query;
    },
    async one(table, columns, options) {
      if (!portfolio.configured) { const rows = window.demoData(table); return { data: rows.find(row => Object.entries(options?.eq || {}).every(([key, val]) => String(row[key]) === String(val))) || null, error: null, demo: true }; }
      let query = portfolio.client.from(table).select(columns);
      Object.entries(options?.eq || {}).forEach(([key, value]) => { query = query.eq(key, value); });
      return query.maybeSingle();
    },
    async insert(table, payload) { return portfolio.configured ? portfolio.client.from(table).insert(payload).select().single() : { data: {...payload,id:"demo-"+Date.now()}, error: null, demo: true }; },
    async update(table, id, payload) { return portfolio.configured ? portfolio.client.from(table).update({...payload, updated_at:new Date().toISOString()}).eq("id", id).select().single() : { data: {...payload,id}, error: null, demo: true }; },
    async remove(table, id) { return portfolio.configured ? portfolio.client.from(table).delete().eq("id", id) : { data: null, error: null, demo: true }; }
  };
  window.demoData = function (table) {
    const map = { profiles:[DEMO_PROFILE], profile_public:[DEMO_PROFILE], projects:DEMO_PROJECTS, skills:DEMO_SKILLS, experiences:DEMO_EXPERIENCE, services:DEMO_SERVICES, social_links:DEMO_SOCIAL, site_settings:[{id:"settings-1",site_title:"Alex Morgan — Creative Developer",site_description:"Thoughtful digital experiences.",accent_color:"#e7f25c",favicon_url:"",contact_form_mode:"mailto"}] };
    return (map[table] || []).map(item => ({...item, technologies:Array.isArray(item.technologies)?item.technologies:[item.technologies].filter(Boolean)}));
  };
})();