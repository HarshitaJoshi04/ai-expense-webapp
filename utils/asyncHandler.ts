export const asyncHandler=(fn:Function)=>{
 return async (req:Request)=>{
  try{
    return await fn(req);
  }catch(error:any){
            return Response.json(
              {
                success:false,
                message:error.message,
              },
              {
                status:error.statusCode||500
              }
            );
  }
 };
};