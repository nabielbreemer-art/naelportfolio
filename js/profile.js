(function () {
  window.profileApi = {
    async get(){const result=await db.list("profiles","*");if(result.error)throw result.error;return result.data[0]||DEMO_PROFILE},
    async save(id,payload){return db.update("profiles",id,payload)}
  };
})();