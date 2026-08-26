(function () {
  const allowed=["image/jpeg","image/png","image/webp"], max=5*1024*1024;
  async function upload(file, folder="projects") {
    if(!allowed.includes(file.type)) throw new Error("Use a JPG, PNG, or WEBP image.");
    if(file.size>max) throw new Error("Images must be smaller than 5MB.");
    if(!portfolio.configured) return {publicUrl:URL.createObjectURL(file),demo:true};
    const path=`${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9._-]/gi,"-")}`;
    const result=await portfolio.client.storage.from("portfolio-images").upload(path,file,{cacheControl:"3600",upsert:false});
    if(result.error)throw result.error;
    return {publicUrl:portfolio.client.storage.from("portfolio-images").getPublicUrl(path).data.publicUrl,path};
  }
  async function list() {
    if(!portfolio.configured)return [];
    const folders = await Promise.all(["projects","profile"].map(folder => portfolio.client.storage.from("portfolio-images").list(folder,{limit:100,sortBy:{column:"created_at",order:"desc"}})));
    const failed = folders.find(result => result.error); if (failed) throw failed.error;
    return folders.flatMap((result,index) => result.data.filter(item=>item.id).map(item=>({name:`${["projects","profile"][index]}/${item.name}`,path:`${["projects","profile"][index]}/${item.name}`,url:portfolio.client.storage.from("portfolio-images").getPublicUrl(`${["projects","profile"][index]}/${item.name}`).data.publicUrl})));
  }
  window.mediaApi={allowed,max,upload,list};
})();