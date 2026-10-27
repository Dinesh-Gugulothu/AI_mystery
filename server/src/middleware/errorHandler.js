export function notFound(req,res) { res.status(404).json({success:false,message:'Route not found.'}); }
export function errorHandler(error,req,res,next) { console.error(error.message); res.status(500).json({success:false,message:'Something went wrong. Please try again.'}); }
