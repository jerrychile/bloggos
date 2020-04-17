const deleteBlog = async (deleteId) =>{

    try{const res = await  axios({
        
          method: 'delete',
          url: 'http://127.0.0.1:8000/blog/'+deleteId
         
      });
      

      window.setTimeout(()=> {
          location.assign('/myblogs');
      }, 100);
  
  }catch(err){
      alert(err.response.data.message);
  }
  };
  function deleteblog(deleteId){

  
  deleteBlog(deleteId);

  };