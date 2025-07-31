//Promise Method
const asyncHandler = (requestHandler) =>{
   return async(req,res,next)=>{
     Promise.resolve(requestHandler(req,res,next)).catch(
        (error)=>{
            error.next
        }
    )
    }
}
export default asyncHandler;

//Try Catch

// const asyncHandler = (requestHandler) =>async(req,res,next)=>{
//     try {
//         await requestHandler(req,res,next)
//     } catch (error) {
//         res.send(status.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }


/*Here we are using the HOF Higherr order Function

Here how its made

const ok = ()=>{}               /Normal
const ok = (func)=>{}           /Take func as param
const ok = (func)=>{()=>{}}     /Remove the brackets
const ok = (func)=>()=>{}    

*/